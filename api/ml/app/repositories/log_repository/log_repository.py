import logging
import os

from app.configurations.configurations import Configurations

from .interfaces import LogRepositoryABC


class LogRepository(LogRepositoryABC):
    _configurations = Configurations.Logs

    def get_logs(self, count: int):
        if not os.path.exists(self._configurations.file_path):
            return []
        try:
            with open(self._configurations.file_path, "r") as log_file:
                logs = log_file.readlines()[-count:]

            logs = [log.strip() for log in logs]
            return logs
        except Exception as e:
            logging.error(f"Error reading log file: {str(e)}")
            raise e
