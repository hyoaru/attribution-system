from app.repositories.log_repository.log_repository import LogRepository
from app.services.log_service.log_service import LogService
from app.repositories.log_repository.interfaces import LogRepositoryABC
from app.services.log_service.interfaces import LogServiceABC


class LogsController:
    def __init__(self):
        self._log_repository: LogRepositoryABC = LogRepository()
        self._log_service: LogServiceABC = LogService(self._log_repository)

    def index(self):
        return self._log_service.get_logs()
