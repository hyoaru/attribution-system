from abc import ABC, abstractmethod
from typing import List


class SectorServiceABC(ABC):
    @abstractmethod
    def get_all(self) -> List[str]:
        pass
