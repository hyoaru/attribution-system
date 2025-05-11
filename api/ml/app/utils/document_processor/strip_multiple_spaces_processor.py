import re

from spacy.tokens import Doc

from .interfaces import DocumentProcessorABC


class StripMultipleSpacesProcessor(DocumentProcessorABC):
    def process(self, document: Doc):
        processed_text = re.sub(r"\s+", " ", document.text).strip()
        document = self._spacy_nlp(processed_text)
        return self.process_next(document)
