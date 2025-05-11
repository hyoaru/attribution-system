import pdfplumber
from .interfaces import PdfTextExtractorServiceABC
import logging


class PdfPlumberPdfTextExtractorService(PdfTextExtractorServiceABC):
    def extract_text(self, document_filepath: str):
        text = ""
        table_groups = []

        with pdfplumber.open(document_filepath) as pdf:
            for page in pdf.pages:
                if page.extract_text():
                    text += page.extract_text()

                if page.extract_tables():
                    table_groups.append(page.extract_tables())

            for tables in table_groups:
                for table in tables:
                    rows = table[1:]
                    if not rows:
                        continue
                    flattened_row_data = [
                        col for row in rows for col in row if col is not None
                    ]
                    row_data_parsed_sentences = ".".join(flattened_row_data).replace(
                        "\n", " "
                    )
                    text += f"{row_data_parsed_sentences}\n"

        logging.info(f"Extracted PDF plain text content: {document_filepath}")

        return text
