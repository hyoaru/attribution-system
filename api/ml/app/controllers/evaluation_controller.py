import logging
from typing import Any

import spacy
from app.factories.embedding_model_factory import EmbeddingModelFactory
from app.repositories.evaluation_criteria_repository.evaluation_criteria_repository import (
    EvaluationCriteriaRepository,
)
from app.services.evaluation_criteria_service.evaluation_criteria_service import (
    EvaluationCriteriaService,
)
from app.services.evaluation_service.evaluation_service import EvaluationService
from app.services.gender_mapper_service.gender_mapper import GenderMapper
from app.services.pdf_text_extractor_service.pdf_plumber_text_extractor import (
    PdfPlumberPdfTextExtractorService,
)
from app.utils.pdf_handler import PDFHandler
from flask import abort

spacy_nlp = spacy.load("en_core_web_sm")


class EvaluationController:
    def __init__(self):
        self._embedding_model = EmbeddingModelFactory.create_glove_model()

    def post(self, pdf_file: Any, sector: str):
        try:
            document_content = PDFHandler(
                pdf_file, PdfPlumberPdfTextExtractorService()
            ).extract_text()
        except Exception:
            abort(400, description="Failed to extract text from PDF")

        doc = spacy_nlp(document_content)
        gender_mapped_doc = GenderMapper(document=doc).map()

        evaluation_criteria_repository = EvaluationCriteriaRepository()
        evaluation_criteria_service = EvaluationCriteriaService(
            evaluation_criteria_repository=evaluation_criteria_repository
        )

        self._evaluation_service_glove = EvaluationService(
            document=gender_mapped_doc,
            embedding_model=self._embedding_model,
        )

        evaluation_criteria = evaluation_criteria_service.get_json(sector)

        logging.info(f"Document evaluating: {pdf_file.filename}")
        evaluation_result = self._evaluation_service_glove.batch_evaluate(
            evaluation_criteria=evaluation_criteria
        )

        logging.info(f"Document evaluation completed: {pdf_file.filename}")

        return evaluation_result
