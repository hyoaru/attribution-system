import re

import spacy
from app.models.classification_models.feature_selectors.chi_squared import Chi2Selector
from app.models.classification_models.gender_classification import (
    GenderClassificationModel,
)
from app.models.classification_models.text_vectorizers.count_vectorizer import (
    CountVectorizer,
)
from app.utils.document_processor.strip_line_spaces_processor import (
    StripLineSpacesProcessor,
)
from app.utils.document_processor.to_lower_case_processor import (
    ToLowerCaseProcessor,
)
from nameparser import HumanName
from spacy.tokens import Doc

spacy_nlp = spacy.load("en_core_web_sm")


class GenderMapper:
    def __init__(self, document: Doc):
        self._gender_classification_model = GenderClassificationModel(
            vectorizer=CountVectorizer(), selector=Chi2Selector()
        )
        self._original_document = document
        self._document = document
        self._person_entity_list = []
        self._gender_recognized_entity_map = {"male": set(), "female": set()}

    def _process_document(self):
        """Process document to remove spaces and convert to lowercase."""
        document_processor = StripLineSpacesProcessor().set_next_processor(
            ToLowerCaseProcessor()
        )
        self._document = document_processor.process(self._document)

    def _process_person_entity_recognition(self):
        """Recognize 'PERSON' entities and stCreating a static class for theore them."""
        self._person_entity_list = [
            entity.text for entity in self._document.ents if entity.label_ == "PERSON"
        ]

    def _process_gender_prediction(self):
        """Predict the gender for each person entity and map it."""
        for person in self._person_entity_list:
            self._map_gender_to_entity(person)

    def _map_gender_to_entity(self, person: str):
        """Map the predicted gender to the person entity."""
        human = HumanName(person)
        predicted_gender = self._gender_classification_model.predict(human.first)
        if predicted_gender in self._gender_recognized_entity_map:
            self._gender_recognized_entity_map[predicted_gender].add(person)

    @staticmethod
    def _generate_word_boundary_pattern(words):
        """Generate regex pattern for matching exact words with word boundaries."""
        return r"|".join([rf"\b{word}\b" for word in words])

    def _apply_gender_mapping(self, text: str):
        """Apply gender mapping based on identified gender clusters."""
        male_words_pattern = self._generate_word_boundary_pattern(
            self._gender_recognized_entity_map["male"]
        )
        female_words_pattern = self._generate_word_boundary_pattern(
            self._gender_recognized_entity_map["female"]
        )

        male_gender_cluster_matcher = re.compile(male_words_pattern, re.IGNORECASE)
        female_gender_cluster_matcher = re.compile(female_words_pattern, re.IGNORECASE)

        if male_words_pattern:
            text = " ".join(male_gender_cluster_matcher.sub("man", text).split())
        if female_words_pattern:
            text = " ".join(female_gender_cluster_matcher.sub("woman", text).split())

        return text

    def map(self):
        """Perform gender mapping on the document."""
        self._process_document()
        self._process_person_entity_recognition()
        self._process_gender_prediction()

        # Apply gender mapping after processing
        gender_mapped_text = self._apply_gender_mapping(self._document.text)

        # Process the mapped document and return it
        gender_mapped_doc = StripLineSpacesProcessor().process(
            spacy_nlp(gender_mapped_text)
        )
        return gender_mapped_doc
