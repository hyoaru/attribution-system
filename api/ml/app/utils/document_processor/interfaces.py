from abc import ABC, abstractmethod

from spacy.tokens import Doc

import spacy


class DocumentProcessorABC(ABC):
    _spacy_nlp = spacy.load("en_core_web_sm")

    def __init__(self, next_processor=None):
        self.next_processor = next_processor

    def set_next_processor(self, next_processor):
        self.next_processor = next_processor
        return self

    @abstractmethod
    def process(self, document: Doc) -> Doc:
        pass

    def process_next(self, document: Doc):
        if self.next_processor:
            return self.next_processor.process(document)
        return document
