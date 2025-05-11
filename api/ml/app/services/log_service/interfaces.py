from abc import ABC, abstractmethod
from typing import List, Optional


class LogServiceABC(ABC):
    @abstractmethod
    def get_logs(self, count: Optional[int] = None) -> List[str]:
        pass
