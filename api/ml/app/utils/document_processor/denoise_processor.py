from spacy.tokens import Doc

from .interfaces import DocumentProcessorABC


class DenoiseProcessor(DocumentProcessorABC):
    def process(self, document: Doc):
        filtered_tokens = [token.text for token in document if token.is_alpha]
        processed_text = " ".join(filtered_tokens).strip()
        document = self._spacy_nlp(processed_text)
        return self.process_next(document)
