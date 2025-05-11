from sentence_transformers import SentenceTransformer
from .interfaces import EmbeddingModelABC
import logging
from typing import Any


class SBERTEmbeddingModel(EmbeddingModelABC):
    def __init__(self):
        self._model: Any = None
        self._model_name = "all-MiniLM-L6-v2"
        super().__init__()

    def load(self):
        """Load the SBERT model."""
        if self._model is None:
            logging.info(f"Loading SBERT model: {self._model_name}...")
            self._model = SentenceTransformer(self._model_name)

    def transform(self, sentence: str):
        """Transform a given sentence to SBERT embeddings."""
        return self._model.encode(sentence)
