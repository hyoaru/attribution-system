import logging

from flask import Flask

from app.api.namespaces.about import ns as ns_about
from app.api.namespaces.evaluation import ns as ns_evaluation

# Import instances
from app.instances import api, logger, cors

from app.models.embedding_models.glove_embedding_model import GloveEmbeddingModel

# from app.models.embedding_models.sbert_embedding_model import SBERTEmbeddingModel
from app.models.nli_models.distilbart_nli_model import DistilBartNLIModel


def create_app():
    app = Flask(__name__)
    logger.init_app(app)

    # Load Models
    GloveEmbeddingModel().load()
    # SBERTEmbeddingModel().load()
    DistilBartNLIModel().load()
    logging.info("Models loaded.")

    # Namespaces
    api.add_namespace(ns_about, path="/api/v1")
    api.add_namespace(ns_evaluation, path="/api/v1/evaluation")

    # Instances lazy loading
    api.init_app(app, version="1.1", title="Attribution System API")
    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": "*",
                "methods": ["GET", "POST"],
                "allow_headers": ["Content-Type"],
                "supports_credentials": True,
            }
        },
    )

    return app
