from spacy.tokens import Doc

from .interfaces import DocumentProcessorABC


class ToLowerCaseProcessor(DocumentProcessorABC):
    def process(self, document: Doc):
        processed_text = document.text.lower()
        document = self._spacy_nlp(processed_text)
        return self.process_next(document)
