from flask_restx import Api
from app.extensions.logger import Logger
from flask_cors import CORS

api = Api()
logger = Logger()
cors = CORS()
