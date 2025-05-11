import numpy as np
from .interfaces import CosineSimilarityStrategyABC
import torch
from sentence_transformers import util
from typing import Union


class PytorchCosineSimilarityStrategy(CosineSimilarityStrategyABC):
    def compute(
        self,
        sentences_embeddings: Union[np.ndarray, torch.Tensor],
        question_embeddings: Union[np.ndarray, torch.Tensor],
    ):
        """Compute cosine similarity between a question and sentences from a document using PyTorch."""

        # Check if the embeddings are already tensors and if not convert them with the same data type (float32)
        if not isinstance(question_embeddings, torch.Tensor):
            question_embeddings = torch.tensor(question_embeddings, dtype=torch.float32)
        else:
            question_embeddings = question_embeddings.float()

        # Check if the embeddings are already tensors and if not convert them with the same data type (float32)
        if not isinstance(sentences_embeddings, torch.Tensor):
            sentences_embeddings = torch.tensor(
                sentences_embeddings, dtype=torch.float32
            )
        else:
            sentences_embeddings = sentences_embeddings.float()

        cosine_scores = util.pytorch_cos_sim(question_embeddings, sentences_embeddings)[
            0
        ]
        return cosine_scores
