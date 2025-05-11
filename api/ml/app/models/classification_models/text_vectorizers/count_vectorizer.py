from .interfaces import TextVectorizerABC
import joblib
from typing import Any


class CountVectorizer(TextVectorizerABC):
    def __init__(self):
        self._vectorizer: Any = None
        super().__init__()

    def transform(self, text: str):
        return self._vectorizer.transform([text])

    def load(self):
        if self._vectorizer is None:
            self._vectorizer = joblib.load(
                f"{self._configurations.bin_path}/count_vectorizer.pkl"
            )
