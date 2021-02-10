from django.apps import AppConfig


class RoomsConfig(AppConfig):
    name = "rooms"

    # pylint: disable=unused-import
    def ready(self):
        from . import signals
