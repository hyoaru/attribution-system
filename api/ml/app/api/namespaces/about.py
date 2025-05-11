from flask_restx import Resource, Namespace, fields
from app.controllers.logs_controller import LogsController
from app.api.open_ai.models.about.status_openai_model import (
    status_model as status_openai_model,
)

ns = Namespace("about")


@ns.route("/status")
class Status(Resource):
    @ns.response(200, "Success", status_openai_model)
    def get(self):
        status = "up"
        version = "1.1.0"

        return {"status": status, "version": version}


@ns.route("/logs")
class Logs(Resource):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._controller = LogsController()

    @ns.response(200, "Success", fields.List(fields.String()))
    def get(self):
        return self._controller.index()
