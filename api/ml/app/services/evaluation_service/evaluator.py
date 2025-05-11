import numpy as np
import spacy
from app.models.embedding_models.interfaces import (
    EmbeddingModelABC,
)
from app.models.nli_models.interfaces import NLIModelABC
from app.utils.cosine_similarity_strategy.interfaces import CosineSimilarityStrategyABC
from app.utils.document_processor.denoise_processor import DenoiseProcessor
from app.utils.document_processor.strip_new_lines_processor import (
    StripNewLinesProcessor,
)
from app.utils.document_processor.to_lower_case_processor import ToLowerCaseProcessor
from spacy.tokens import Doc

spacy_nlp = spacy.load("en_core_web_sm")


class Evaluator:
    def __init__(
        self,
        document: Doc,
        embedding_model: EmbeddingModelABC,
        nli_model: NLIModelABC,
        cosine_similarity_strategy: CosineSimilarityStrategyABC,
    ):
        self._embedding_model = embedding_model
        self._nli_model = nli_model
        self._cosine_similarity_strategy = cosine_similarity_strategy

        # Refactored
        sentence_processor = StripNewLinesProcessor().set_next_processor(
            DenoiseProcessor()
        )
        self._sentences = [sentence.text for sentence in document.sents]
        sentences_processed = [
            sentence_processor.process(spacy_nlp(sentence)).text
            for sentence in self._sentences
        ]
        self._embedded_sentences = np.array(
            [
                self._embedding_model.transform(sentence)
                for sentence in sentences_processed
            ]
        )

    def _compute_cosine_similarity(
        self, sentences_embeddings: np.ndarray, question_embeddings: np.ndarray
    ):
        """Computes cosine similarity between a question and a sentence."""
        cosine_scores = self._cosine_similarity_strategy.compute(
            sentences_embeddings, question_embeddings
        )
        return cosine_scores

    def _compute_nli(self, premise: str, hypothesis: str):
        """Performs Natural Language Inference (NLI) on a premise and hypothesis."""
        nli = self._nli_model.infer(premise, hypothesis)
        return nli

    def evaluate(self, question: str):
        question_processor = (
            StripNewLinesProcessor()
            .set_next_processor(ToLowerCaseProcessor())
            .set_next_processor(DenoiseProcessor())
        )

        question_processed = question_processor.process(spacy_nlp(question)).text

        embeddings = {
            "sentences": self._embedded_sentences,
            "question": self._embedding_model.transform(question_processed),
        }

        cosine_scores = self._compute_cosine_similarity(
            embeddings["sentences"],
            embeddings["question"],
        )

        highest_score_idx = cosine_scores.argmax()
        highest_similarity_score = cosine_scores[highest_score_idx].item()
        highest_similarity_sentence = self._sentences[highest_score_idx]

        nli_results = self._compute_nli(
            premise=highest_similarity_sentence,
            hypothesis=question,
        )

        evaluation = {
            "evaluation_question": question,
            "highest_cosine_similarity_score": highest_similarity_score,
            "highest_cosine_similarity_sentence": highest_similarity_sentence,
            "nli_evaluation": nli_results,
        }

        return evaluation
