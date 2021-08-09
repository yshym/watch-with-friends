import os

from celery import Celery


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

redis_url = "redis://redis/0"
app = Celery("config", broker=redis_url, backend=redis_url)

app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
