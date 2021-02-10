import subprocess
import os

from django.contrib.auth import get_user_model
from celery import shared_task
from celery.utils.log import get_task_logger

from .models import (
    Room,
    Message,
)


logger = get_task_logger(__name__)


def cut_content(content):
    return content if len(content) <= 10 else f"{content[:6]}..."


@shared_task
def create_message(room_name, username, content):
    logger.info(
        "Creating Message(room_name='%s', author_username='%s', content='%s')",
        room_name,
        username,
        cut_content(content),
    )
    Message.objects.create(
        room=Room.objects.get(name=room_name),
        author=get_user_model().objects.get(username=username),
        content=content,
    )


@shared_task
def convert_for_hls(video_path):
    file_name, ext = os.path.splitext(video_path)
    video_output_path = f"{file_name}_out{ext}"

    # Change audio codec to AAC
    subprocess.check_call(
        [
            "ffmpeg",
            "-i",
            video_path,
            "-vcodec",
            "copy",
            "-acodec",
            "aac",
            "-sn",
            video_output_path,
        ]
    )
    # Convert to m3u8 format
    subprocess.check_call(
        [
            "ffmpeg",
            "-i",
            video_output_path,
            "-hls_time",
            "10",
            "-hls_list_size",
            "0",
            f"{file_name}.m3u8",
        ]
    )
    # remove outputed video
    os.remove(video_output_path)
