from .interfaces import EvaluationCriteriaServiceABC
from app.repositories.evaluation_criteria_repository.interfaces import (
    EvaluationCriteriaRepositoryABC,
)


class EvaluationCriteriaService(EvaluationCriteriaServiceABC):
    def __init__(self, evaluation_criteria_repository: EvaluationCriteriaRepositoryABC):
        self._evaluation_criteria_repository = evaluation_criteria_repository

    def get_json(self, sector: str):
        return self._evaluation_criteria_repository.get_json(sector)
