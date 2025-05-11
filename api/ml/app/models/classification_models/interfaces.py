from abc import ABC, abstractmethod
from app.configurations.configurations import Configurations


class ClassificationModelABC(ABC):
    _instance = None
    _configurations = Configurations.MachineLearningModels

    def __init__(self, *args, **kwargs):
        self.load()

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(ClassificationModelABC, cls).__new__(cls)
        return cls._instance

    @abstractmethod
    def load(self):
        pass

    @abstractmethod
    def predict(self, text) -> str:
        pass
