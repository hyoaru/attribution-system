from app.models.embedding_models.glove_embedding_model import GloveEmbeddingModel
from app.models.embedding_models.sbert_embedding_model import SBERTEmbeddingModel


class EmbeddingModelFactory:
    @staticmethod
    def create_glove_model():
        return GloveEmbeddingModel()

    @staticmethod
    def create_sbert_model():
        return SBERTEmbeddingModel()
