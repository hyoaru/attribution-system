from abc import ABC, abstractmethod


class PdfTextExtractorServiceABC(ABC):
    @abstractmethod
    def extract_text(self, document_filepath: str) -> str:
        pass
