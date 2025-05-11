import joblib

from .interfaces import FeatureSelectorABC
from typing import Any


class Chi2Selector(FeatureSelectorABC):
    def __init__(self):
        self._selector: Any = None
        super().__init__()

    def load(self):
        if self._selector is None:
            self._selector = joblib.load(
                f"{self._configurations.bin_path}/chi_selector.pkl"
            )

    def transform(self, vector):
        return self._selector.transform(vector)
