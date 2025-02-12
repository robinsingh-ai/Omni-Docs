from typing import Dict, Any

class Singleton(type):
    """
    Singleton metaclass for ensuring only one instance of a class exists.
    """
    _instances: Dict[Any, Any] = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

    @classmethod
    def clear_instance(cls, target_class):
        """Clear the instance of a specific class"""
        if target_class in cls._instances:
            del cls._instances[target_class]