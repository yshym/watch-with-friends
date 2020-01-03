from django.db.models.signals import post_save, pre_delete

from .models import Room
from .tasks import convert_for_hls


def post_save_room_receiver(sender, instance, *args, **kwargs):
    # convert video file to m3u8 format
    convert_for_hls.delay(video_path=instance.video.path)

def pre_delete_room_receiver(sender, instance, *args, **kwargs):
    # remove room video files
    instance.remove_video_files()


post_save.connect(post_save_room_receiver, sender=Room)
pre_delete.connect(pre_delete_room_receiver, sender=Room)
