from gensim.models import KeyedVectors
from .interfaces import EmbeddingModelABC
import os
import numpy as np
import gensim.downloader as api
import logging
from typing import Any


class GloveEmbeddingModel(EmbeddingModelABC):
    def __init__(self):
        self._model: Any = None
        self._model_name = "glove-twitter-50"
        self._model_bin_file = os.path.join(
            self._model_bin_path,
            f"{self._model_name}.bin",
        )

        super().__init__()

    def load(self):
        """Load the GloVe model, downloading and saving if necessary."""
        if not os.path.exists(self._model_bin_path):
            os.makedirs(self._model_bin_path, exist_ok=True)

        if not os.path.exists(self._model_bin_file):
            logging.info(
                f"Downloading, saving, and loading GloVe model: {self._model_name}..."
            )
            self._model = api.load(self._model_name)
            self._model.save(self._model_bin_file)
        else:
            if self._model is None:
                logging.info(
                    f"Loading GloVe model from file: {self._model_bin_file}..."
                )
                self._model = KeyedVectors.load(self._model_bin_file)

    def transform(self, sentence: str):
        """Transform a given sentence to GloVe embeddings."""
        tokens = sentence.lower().split()

        # If the sentence is empty, return a zero vector of the same dimension as the GloVe embeddings.
        if not tokens:
            return np.zeros(self._model.vector_size)

        embeddings = []
        for token in tokens:
            # If the token is not found in the GloVe vocabulary (e.g., a rare or misspelled word), a zero vector is appended.
            if token not in self._model:
                embeddings.append(np.zeros(self._model.vector_size))
            else:
                embeddings.append(self._model[token])

        # If no valid embeddings were found for the tokens (e.g., all words were out-of-vocabulary), a zero vector is returned.
        if not embeddings:
            return np.zeros(self._model.vector_size)

        # The embeddings for individual tokens are averaged produce a single vector that represents the entire sentence.
        # This averaging aggregates the semantic meaning of the tokens into a unified vector while preserving its fixed dimensionality
        return np.mean(embeddings, axis=0)
