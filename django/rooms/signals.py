from django.db.models.signals import post_save

from .models import Room
from .tasks import convert_for_hls


def post_save_file_receiver(sender, instance, *args, **kwargs):
    convert_for_hls.delay(video_path=instance.video.path)

post_save.connect(post_save_file_receiver, sender=Room)
