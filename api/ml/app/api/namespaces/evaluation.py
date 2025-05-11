import logging

from app.api.open_ai.models.evaluation.evaluation_response_openai_model import (
    evaluation_response_model as evaluation_response_openai_model,
)
from app.controllers.evaluation_controller import EvaluationController
from app.controllers.sectors_controller import SectorsController
from flask_restx import Namespace, Resource, fields, reqparse
from werkzeug.datastructures import FileStorage

ns = Namespace("evaluation")

evaluate_parser = (
    reqparse.RequestParser()
    .add_argument(
        "file",
        type=FileStorage,
        location="files",
        required=True,
        help="PDF file required",
    )
    .add_argument(
        "sector",
        type=str,
        location="form",
        required=True,
        choices=tuple(SectorsController().index()),
    )
)


@ns.route("/evaluate")
class Evaluate(Resource):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._controller = EvaluationController()

    @ns.expect(evaluate_parser)
    @ns.response(200, "Success", evaluation_response_openai_model)
    def post(self):
        data = evaluate_parser.parse_args()

        logging.info(f"Evaluation request received. {data}")
        evaluation_result = self._controller.post(
            pdf_file=data["file"], sector=data["sector"]
        )
        logging.info(f"Evaluation request completed. {data}")

        return evaluation_result, 200


@ns.route("/sectors")
class Sectors(Resource):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._controller = SectorsController()

    @ns.response(200, "Success", fields.List(fields.String()))
    def get(self):
        return self._controller.index()
