from abc import ABC, abstractmethod
from typing import Union, Any

import numpy as np
import torch


class CosineSimilarityStrategyABC(ABC):
    @abstractmethod
    def compute(
        self,
        sentences_embeddings: Union[np.ndarray, torch.Tensor],
        question_embeddings: Union[np.ndarray, torch.Tensor],
    ) -> Any:
        """Compute cosine similarity between a question and sentences from a document."""
        pass
