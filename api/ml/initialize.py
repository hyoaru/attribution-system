import logging

from app.models.embedding_models.glove_embedding_model import GloveEmbeddingModel

# from app.models.embedding_models.sbert_embedding_model import SBERTEmbeddingModel
from app.models.nli_models.distilbart_nli_model import DistilBartNLIModel

logging.basicConfig(
    level=logging.INFO, format="[%(asctime)s] - [%(levelname)s] - %(message)s"
)

logging.info("Initializing models...")
# GloVe model
glove_model = GloveEmbeddingModel()
glove_model.load()

# SBERT model
# sbert_model = SBERTEmbeddingModel()
# sbert_model.load()

# DistilBartNLIModel
distil_bart_nli_model = DistilBartNLIModel()
distil_bart_nli_model.load()

logging.info("Models initialized.")
