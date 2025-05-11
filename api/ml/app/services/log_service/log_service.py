from app.repositories.log_repository.interfaces import LogRepositoryABC
from .interfaces import LogServiceABC
from typing import Optional


class LogService(LogServiceABC):
    def __init__(self, log_repository: LogRepositoryABC):
        self._log_repository = log_repository

    def get_logs(self, count: Optional[int] = None):
        count = 50 if count is None else count
        return self._log_repository.get_logs(count)
