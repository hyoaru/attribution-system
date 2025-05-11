from .embedding_model_configurations import EmbeddingModelConfigurations
from .feature_selector_configurations import FeatureSelectorConfigurations
from .interfaces import ConfigurationsABC
from .log_configurations import LogConfigurations
from .machine_learning_model_configurations import MachineLearningModelConfigurations
from .sector_evaluation_criteria_configurations import (
    SectorEvaluationCriteriaConfigurations,
)
from .text_vectorizer_configurations import TextVectorizerConfigurations


class Configurations(ConfigurationsABC):
    # App Configurations
    uploads_directory_path = "uploads"

    Logs = LogConfigurations
    SectorEvaluationCriterias = SectorEvaluationCriteriaConfigurations
    EmbeddingModels = EmbeddingModelConfigurations
    TextVectorizers = TextVectorizerConfigurations
    FeatureSelectors = FeatureSelectorConfigurations
    MachineLearningModels = MachineLearningModelConfigurations
