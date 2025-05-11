import os
import json

from app.configurations.configurations import Configurations
from .interfaces import EvaluationCriteriaRepositoryABC
import logging


class EvaluationCriteriaRepository(EvaluationCriteriaRepositoryABC):
    _configurations = Configurations.SectorEvaluationCriterias

    def _get_filename(self, sector: str) -> str:
        return self._configurations.sector_evaluation_criteria_map[sector]

    def _get_filepath(self, filename: str) -> str:
        return os.path.join(self._configurations.json_directory_path, filename)

    def get_json(self, sector: str):
        filename = self._get_filename(sector)
        filepath = self._get_filepath(filename)

        logging.info(f"Loading sector evaluation criteria json: {filename}")

        if not os.path.exists(filepath):
            logging.error(f"File not found: {filepath}")
            raise FileNotFoundError(f"File not found: {filepath}")

        with open(filepath, "r") as json_file:
            evaluation_criteria = json.load(json_file)
            logging.info("Sector evaluation criteria file loaded successfully")

        return evaluation_criteria
