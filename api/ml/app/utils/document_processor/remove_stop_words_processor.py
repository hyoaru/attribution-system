from spacy.tokens import Doc

from .interfaces import DocumentProcessorABC


class RemoveStopWordsProcessor(DocumentProcessorABC):
    def process(self, document: Doc):
        filtered_tokens = [token.text for token in document if not token.is_stop]
        processed_text = " ".join(filtered_tokens).strip()
        document = self._spacy_nlp(processed_text)
        return self.process_next(document)
