from typing import Any

import joblib

from .feature_selectors.interfaces import FeatureSelectorABC
from .interfaces import ClassificationModelABC
from .text_vectorizers.interfaces import TextVectorizerABC


class GenderClassificationModel(ClassificationModelABC):
    _gender_label_map = {
        0: "female",
        1: "male",
    }

    def __init__(self, vectorizer: TextVectorizerABC, selector: FeatureSelectorABC):
        self._vectorizer = vectorizer
        self._selector = selector
        self._model: Any = None
        super().__init__()

    def load(self):
        if self._model is None:
            self._model = joblib.load(
                f"{self._configurations.bin_path}/gender_classification_model.pkl"
            )

    def predict(self, text):
        vector = self._vectorizer.transform(text)
        vector = self._selector.transform(vector)
        predicted_gender = self._model.predict(vector)[0]
        predicted_gender_label = self._gender_label_map[predicted_gender]
        return predicted_gender_label
