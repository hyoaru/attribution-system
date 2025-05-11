from abc import ABC, abstractmethod
from typing import List


class SectorRepositoryABC(ABC):
    @abstractmethod
    def get_all(self) -> List[str]:
        pass
