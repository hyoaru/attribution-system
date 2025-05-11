import logging

from app.models.nli_models.interfaces import NLIModelABC
from transformers import pipeline


class DistilBartNLIModel(NLIModelABC):
    """A class for performing Natural Language Inference (NLI) using the DistilBART model."""

    def __init__(self):
        self._model = None
        self._model_name = "valhalla/distilbart-mnli-12-3"
        super().__init__()

    def load(self):
        """Loads the DistilBART MNLI model."""
        if self._model is None:
            logging.info(f"Loading DistilBART model: {self._model_name}...")
            self._model = pipeline("text-classification", model=self._model_name)

    def infer(self, premise: str, hypothesis: str):
        """Performs Natural Language Inference (NLI) on a premise and hypothesis."""

        # Format the input for NLI
        nli_input = f"{premise} [SEP] {hypothesis}"

        # Run inference and return the result
        result = self._model(nli_input)[0]
        return result
