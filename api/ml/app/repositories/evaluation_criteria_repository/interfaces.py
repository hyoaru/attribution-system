from abc import ABC, abstractmethod


class EvaluationCriteriaRepositoryABC(ABC):
    @abstractmethod
    def get_json(self, sector: str):
        pass
