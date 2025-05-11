from flask_restx import fields
from app.instances import api

status_model = api.model(
    "Status",
    {
        "status": fields.String(required=True, description="Status of the API"),
        "version": fields.String(required=True, description="Version of the API"),
    },
)
