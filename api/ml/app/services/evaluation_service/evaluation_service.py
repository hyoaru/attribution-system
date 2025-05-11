from concurrent.futures import ThreadPoolExecutor
import numpy as np
from spacy.tokens import Doc
from app.models.embedding_models.interfaces import EmbeddingModelABC
from app.models.nli_models.distilbart_nli_model import DistilBartNLIModel
from app.utils.cosine_similarity_strategy.pytorch_cosine_similarity_strategy import (
    PytorchCosineSimilarityStrategy,
)
from .evaluator import Evaluator


class EvaluationService:
    def __init__(self, document: Doc, embedding_model: EmbeddingModelABC):
        self._evaluator = Evaluator(
            document=document,
            embedding_model=embedding_model,
            nli_model=DistilBartNLIModel(),
            cosine_similarity_strategy=PytorchCosineSimilarityStrategy(),
        )

    def _evaluate_criterion(self, criterion):
        """Evaluates a single criterion by computing its evaluation result and score."""
        evaluation_result = self._evaluator.evaluate(question=criterion["question"])
        evaluation_score = self._compute_standardized_evaluation_score(
            evaluation_result, criterion["possible_scores"]
        )
        return evaluation_result, evaluation_score

    def _compute_standardized_evaluation_score(
        self, evaluation_result, possible_scores
    ):
        """Converts the evaluation result into a standardized score based on possible scores."""
        nli_evaluation_labels = ["contradiction", "neutral", "entailment"]

        # Adjust possible scores length to match the number of NLI labels
        scoring_offset_length = len(nli_evaluation_labels) - len(possible_scores)
        possible_scores_reshaped = np.concatenate(
            [np.full(scoring_offset_length, None), possible_scores]
        )

        # Map each NLI label to a corresponding score
        nli_evaluation_score_map = dict(
            zip(nli_evaluation_labels, possible_scores_reshaped)
        )

        # Get the NLI label from the evaluation result
        nli_evaluation_label = evaluation_result["nli_evaluation"]["label"]
        return nli_evaluation_score_map[nli_evaluation_label]

    def _compute_standardized_evaluation_score_sum(
        self, possible_scores, evaluation_score_sum
    ):
        """Computes the closest possible score to the sum of evaluation scores."""
        possible_scores = np.array(possible_scores)
        standardized_evaluation_score = possible_scores[
            np.abs(possible_scores - evaluation_score_sum).argmin()
        ].item()
        return standardized_evaluation_score

    def _evaluate_nested_criteria(self, criteria, executor):
        """Evaluates nested criteria and handles mid-level and end-level criteria."""
        total_score = 0

        def evaluate_criterion_and_update(criterion):
            # If the criterion has sub_criteria, process them recursively
            if sub_criteria := criterion.get("sub_criteria"):
                sub_criteria_score_sum = self._evaluate_nested_criteria(
                    sub_criteria, executor
                )
                # Assign the raw sum to mid-level criteria (no standardization)
                criterion["evaluation_score"] = sub_criteria_score_sum
                return criterion["evaluation_score"]

            # Otherwise, evaluate and standardize only for end-level criteria
            evaluation_result, evaluation_score = self._evaluate_criterion(criterion)
            criterion["evaluation_result"] = evaluation_result
            criterion["evaluation_score"] = evaluation_score
            return evaluation_score

        # Evaluate criteria in parallel
        scores = list(executor.map(evaluate_criterion_and_update, criteria))
        total_score += sum(scores)
        return total_score

    def batch_evaluate(self, evaluation_criteria):
        """Evaluates a set of criteria (and sub-criteria) across multiple sections using threads."""
        evaluation_score_total = 0

        for section in evaluation_criteria:
            section_evaluation_score = 0

            with ThreadPoolExecutor() as executor:
                # Process all criteria in the section (including sub-criteria) in parallel
                section_evaluation_score = self._evaluate_nested_criteria(
                    section["criteria"], executor
                )

            # Assign the total score to the section
            section["evaluation_score"] = section_evaluation_score
            evaluation_score_total += section_evaluation_score

        # Construct the response
        response = {
            "evaluation": evaluation_criteria,
            "evaluation_score": evaluation_score_total,
        }
        return response
