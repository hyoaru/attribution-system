from typing import Union

import numpy as np
import torch
from sklearn.metrics.pairwise import cosine_similarity

from .interfaces import CosineSimilarityStrategyABC


class SklearnCosineSimilarity(CosineSimilarityStrategyABC):
    def compute(
        self,
        sentences_embeddings: Union[np.ndarray, torch.Tensor],
        question_embeddings: Union[np.ndarray, torch.Tensor],
    ):
        """Compute cosine similarity between a question and sentences from a document using scikit-learn."""

        cosine_scores = cosine_similarity(
            question_embeddings.reshape(1, -1), sentences_embeddings
        )

        return cosine_scores
