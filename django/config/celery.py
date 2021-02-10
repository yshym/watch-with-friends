import os

from django.conf import settings
from celery import Celery


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

app = Celery(
    "config",
    broker="redis://localhost" if settings.TESTING else "redis://redis",
    backend="rpc://",
)

app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
