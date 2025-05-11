from spacy.tokens import Doc

from .interfaces import DocumentProcessorABC


class LemmatizeProcessor(DocumentProcessorABC):
    def process(self, document: Doc):
        lemmatized_tokens = [token.lemma_ for token in document]
        processed_text = " ".join(lemmatized_tokens).strip()
        document = self._spacy_nlp(processed_text)
        return self.process_next(document)
