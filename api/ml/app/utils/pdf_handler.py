import logging
import os
from typing import Any

from app.configurations.configurations import Configurations
from app.services.pdf_text_extractor_service.interfaces import (
    PdfTextExtractorServiceABC,
)


class PDFHandler:
    _configurations = Configurations
    _uploads_directory_path = _configurations.uploads_directory_path

    def __init__(
        self, pdf_file: Any, pdf_text_extractor_service: PdfTextExtractorServiceABC
    ):
        self._pdf_text_extractor_service = pdf_text_extractor_service
        self.pdf_file = pdf_file
        logging.info(f"Loaded PDF file: {self.pdf_file.filename}")

    def _save_pdf(self):
        if not os.path.exists(PDFHandler._uploads_directory_path):
            os.makedirs(PDFHandler._uploads_directory_path)
            logging.info(f"Created directory: {PDFHandler._uploads_directory_path}")

        filename = self.pdf_file.filename
        temp_path = os.path.join(PDFHandler._uploads_directory_path, filename)
        self.pdf_file.save(temp_path)
        logging.info(f"PDF saved: {temp_path}")

    def _delete_pdf(self):
        filename = self.pdf_file.filename
        temp_path = os.path.join(PDFHandler._uploads_directory_path, filename)
        if os.path.exists(temp_path):
            os.remove(temp_path)
            logging.info(f"PDF deleted: {temp_path}")

    def _get_path(self):
        filename = self.pdf_file.filename
        return os.path.join(PDFHandler._uploads_directory_path, filename)

    def extract_text(self):
        document_filepath = self._get_path()

        try:
            self._save_pdf()
            return self._pdf_text_extractor_service.extract_text(document_filepath)

        except Exception:
            logging.error(
                f"Failed to extracted PDF plain text content: {document_filepath}"
            )
            raise
        finally:
            self._delete_pdf()
