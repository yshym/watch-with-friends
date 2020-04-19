from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile

from ..forms import RoomCreateForm


class RoomCreateFormTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.username = 'testuser1'
        cls.password = 'testpass123'

        User = get_user_model()
        cls.user = User(username=cls.username, password=cls.password,)
        cls.user.set_password(cls.password)
        cls.user.save()

    def test_valid_form_with_youtube_video(self):
        form = RoomCreateForm(
            data={
                'name': 'room1',
                'video_type': 'yt',
                'youtube_link': 'https://www.youtube.com/watch?v=1cQh1ccqu8M',
            }
        )

        self.assertTrue(form.is_valid())

    def test_valid_form_with_local_video(self):
        upload_video_file = open('media/testfiles/video.mp4', 'rb')
        video = SimpleUploadedFile(
            upload_video_file.name, upload_video_file.read()
        )

        form = RoomCreateForm(
            data={'name': 'room1', 'video_type': 'local',},
            files={'video': video,},
        )

        self.assertTrue(form.is_valid())

    def test_form_without_local_video(self):
        form = RoomCreateForm(data={'name': 'room1', 'video_type': 'local',},)

        self.assertFalse(form.is_valid())

    def test_form_without_youtube_video(self):
        form = RoomCreateForm(data={'name': 'room1', 'video_type': 'yt',},)

        self.assertFalse(form.is_valid())
