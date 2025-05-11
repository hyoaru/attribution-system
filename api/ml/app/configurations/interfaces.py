from abc import ABC


class ConfigurationsABC(ABC):
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super(ConfigurationsABC, cls).__new__(cls)
        return cls._instance
