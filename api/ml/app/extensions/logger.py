import logging
from logging.handlers import RotatingFileHandler


class Logger:
    def init_app(self, app):
        # Create a rotating file handler
        file_handler = RotatingFileHandler("app.log", maxBytes=100000, backupCount=3)
        file_handler.setLevel(logging.INFO)

        file_formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] - %(message)s"
        )

        file_handler.setFormatter(file_formatter)

        # Create a console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)

        console_formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] - %(message)s"
        )

        console_handler.setFormatter(console_formatter)

        # Attach handlers to the app logger and the root logger
        logging.getLogger().addHandler(file_handler)
        logging.getLogger().addHandler(console_handler)

        # Set the root logger level to INFO to capture all INFO logs
        logging.getLogger().setLevel(logging.INFO)

        app.logger.info("Logging has been configured.")
