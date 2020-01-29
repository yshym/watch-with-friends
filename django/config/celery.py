from celery import Celery
from django.conf import settings

import os


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery(
    'config',
    broker='redis://localhost' if settings.TESTING else 'redis://redis',
    backend='rpc://',
)

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request}')
