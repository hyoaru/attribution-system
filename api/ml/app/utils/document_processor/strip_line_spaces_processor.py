from spacy.tokens import Doc

from .interfaces import DocumentProcessorABC
from .strip_multiple_spaces_processor import StripMultipleSpacesProcessor
from .strip_new_lines_processor import StripNewLinesProcessor


class StripLineSpacesProcessor(DocumentProcessorABC):
    def process(self, document: Doc):
        processor = StripNewLinesProcessor().set_next_processor(
            StripMultipleSpacesProcessor()
        )
        document = processor.process(document)
        return self.process_next(document)
