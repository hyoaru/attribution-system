from app.configurations.configurations import Configurations

from .interfaces import SectorRepositoryABC


class SectorRepository(SectorRepositoryABC):
    _configurations = Configurations.SectorEvaluationCriterias

    def get_all(self):
        return list(self._configurations.sector_evaluation_criteria_map.keys())
