from abc import ABC, abstractmethod
from typing import Any


class NLIModelABC(ABC):
    _instance = None

    def __init__(self, *args, **kwargs):
        self._model: Any = None
        self.load()

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(NLIModelABC, cls).__new__(cls)
        return cls._instance

    @abstractmethod
    def infer(self, premise: str, hypothesis: str):
        """Performs Natural Language Inference (NLI) on a premise and hypothesis."""
        pass

    @abstractmethod
    def load(self):
        """Load the model (from disk or online source)."""
        pass
