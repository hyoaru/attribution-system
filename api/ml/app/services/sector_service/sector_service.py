from .interfaces import SectorServiceABC
from app.repositories.sector_repository.interfaces import SectorRepositoryABC


class SectorService(SectorServiceABC):
    def __init__(self, sector_repository: SectorRepositoryABC):
        self._sector_repository = sector_repository

    def get_all(self):
        return self._sector_repository.get_all()
