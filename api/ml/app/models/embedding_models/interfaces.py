from abc import ABC, abstractmethod
import numpy as np
from app.configurations.configurations import Configurations


class EmbeddingModelABC(ABC):
    _instance = None
    _configurations = Configurations.EmbeddingModels
    _model_bin_path = _configurations.models_bin_path

    def __init__(self, *args, **kwargs):
        self.load()

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(EmbeddingModelABC, cls).__new__(cls)
        return cls._instance

    @abstractmethod
    def transform(self, sentence: str) -> np.ndarray:
        """Transform a given sentence to an embedding in the form of a numpy array."""
        pass

    @abstractmethod
    def load(self):
        """Load the model (from disk or online source)."""
        pass
