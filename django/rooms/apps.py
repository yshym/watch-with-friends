from django.apps import AppConfig


class RoomsConfig(AppConfig):
    name = 'rooms'

    def ready(self):
        from . import signals
