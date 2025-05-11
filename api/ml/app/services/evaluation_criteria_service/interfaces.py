from abc import ABC, abstractmethod


class EvaluationCriteriaServiceABC(ABC):
    @abstractmethod
    def get_json(self, sector: str):
        pass
