from abc import ABC, abstractmethod
from typing import List


class LogRepositoryABC(ABC):
    @abstractmethod
    def get_logs(self, count: int) -> List[str]:
        pass
