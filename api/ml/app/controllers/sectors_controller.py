from app.services.sector_service.sector_service import SectorService
from app.repositories.sector_repository.sector_repository import SectorRepository


class SectorsController:
    def __init__(self):
        self._sector_repository = SectorRepository()
        self._sector_service = SectorService(sector_repository=self._sector_repository)

    def index(self):
        return self._sector_service.get_all()
