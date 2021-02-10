from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile

from ..models import Room
from ..tasks import create_message, convert_for_hls

import os


class RoomTasksTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.username = "testuser1"
        cls.password = "testpass123"

        User = get_user_model()
        cls.user = User.objects.create(
            username=cls.username,
            password=cls.password,
        )

        upload_video_file = open("media/testfiles/video.mp4", "rb")
        video = SimpleUploadedFile(
            upload_video_file.name, upload_video_file.read()
        )
        cls.room = Room.objects.create(
            name="room1",
            author=cls.user,
            video=video,
        )

    @classmethod
    def tearDownClass(cls):
        cls.room.delete()
        super().tearDownClass()

    def test_create_message_task(self):
        content = "123"

        result = create_message.apply(
            kwargs={
                "room_name": self.room.name,
                "username": self.user.username,
                "content": content,
            }
        )

        self.assertTrue(result.successful())

    def test_convert_for_hls_task(self):
        video_path = self.room.video.path
        file_name, ext = os.path.splitext(video_path)

        result = convert_for_hls.apply(args=[video_path])

        self.assertTrue(result.successful())
        self.assertTrue(os.path.isfile(f"{file_name}.m3u8"))
        self.assertTrue(os.path.isfile(f"{file_name}0.ts"))
