from django.contrib.auth import get_user_model
from celery import shared_task
from celery.utils.log import get_task_logger

from .models import (
    Room,
    Message,
)


logger = get_task_logger(__name__)

def cut_content(content):
    return content if len(content) <= 10 else f'{content[:6]}...'

@shared_task
def create_message(room_name, username, content):
    logger.info(
        'Creating Message('
        f'room_name="{room_name}", '
        f'author_username="{username}", '
        f'content="{cut_content(content)}"'
        ')'
    )
    Message.objects.create(
        room=Room.objects.get(name=room_name),
        author=get_user_model().objects.get(username=username),
        content=content,
    )
