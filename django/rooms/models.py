import uuid
import os
import shutil

from django.db import models
from django.contrib.auth import get_user_model
from django.urls import reverse_lazy
from django.conf import settings

from .validators import validate_video_extension


def video_location(instance, _filename):
    ext = os.path.splitext(instance.video.path)[1]
    return f"videos/{instance.name}/{instance.name + ext}"


class Room(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    video = models.FileField(
        upload_to=video_location,
        validators=[validate_video_extension],
        blank=True,
        null=True,
    )
    youtube_link = models.URLField(blank=True, null=True)
    author = models.ForeignKey(
        get_user_model(),
        related_name="room",
        on_delete=models.CASCADE,
    )
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)

    # pylint: disable=invalid-str-returned
    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse_lazy("room_detail", kwargs={"pk": str(self.id)})

    def remove_video_files(self):
        if self.video:
            shutil.rmtree(
                os.path.join(settings.MEDIA_ROOT, "videos", self.name)
            )


class Message(models.Model):
    content = models.CharField(max_length=200)
    author = models.ForeignKey(
        get_user_model(),
        related_name="messages",
        on_delete=models.CASCADE,
    )
    room = models.ForeignKey(
        Room,
        related_name="messages",
        on_delete=models.CASCADE,
    )
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)

    # pylint: disable=unsubscriptable-object
    def __str__(self):
        sliced_content = (
            f"{self.content[:60]}..."
            if len(self.content) > 40
            else self.content
        )
        return sliced_content

    class Meta:
        ordering = [
            "timestamp",
        ]
