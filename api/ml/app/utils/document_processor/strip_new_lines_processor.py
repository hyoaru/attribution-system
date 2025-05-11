from spacy.tokens import Doc

from .interfaces import DocumentProcessorABC


class StripNewLinesProcessor(DocumentProcessorABC):
    def process(self, document: Doc):
        processed_text = document.text.replace("\n", " ")
        document = self._spacy_nlp(processed_text)
        return self.process_next(document)
