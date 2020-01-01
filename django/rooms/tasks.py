from django.contrib.auth import get_user_model
from celery import shared_task
from celery.utils.log import get_task_logger

from .models import (
    Room,
    Message,
)

import subprocess
import os


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

@shared_task
def convert_for_hls(video_path):
    file_name, ext = os.path.splitext(video_path)
    subprocess.check_call([
        'ffmpeg',
        '-i', video_path,
        '-g', '60',
        '-hls_time', '10',
        '-hls_list_size', '0',
        '-hls_segment_size', '500000',
        f'{file_name}.m3u8',
    ])
