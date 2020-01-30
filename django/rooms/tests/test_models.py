from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.exceptions import ValidationError

from ..models import Room, Message
from ..validators import validate_video_extension

import os


class RoomModelTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        User = get_user_model()
        cls.user = User.objects.create(
            username='testuser1', password='testpass123',
        )

    def test_create_room_with_youtube_video(self):
        room_name = 'room1'
        youtube_link = 'https://www.youtube.com/watch?v=1cQh1ccqu8M'

        room = Room.objects.create(
            name=room_name, author=self.user, youtube_link=youtube_link,
        )

        self.assertEqual(room.name, room_name)
        self.assertEqual(room.author, self.user)
        self.assertEqual(room.youtube_link, youtube_link)
        self.assertEqual(room.video, None)
        self.assertEqual(room.__str__(), room_name)
        self.assertEqual(room.get_absolute_url(), f'/{room.id}/')

    def test_create_room_with_local_video(self):
        room_name = 'room1'
        upload_video_file = open('media/testfiles/video.mp4', 'rb')
        upload_audio_file = open('media/testfiles/audio.mp3', 'rb')
        video = SimpleUploadedFile(
            upload_video_file.name, upload_video_file.read()
        )
        audio = SimpleUploadedFile(
            upload_audio_file.name, upload_audio_file.read()
        )
        video_ext = os.path.splitext(video.name)[1]

        room = Room.objects.create(
            name=room_name, author=self.user, video=video,
        )

        self.assertEqual(room.name, room_name)
        self.assertEqual(room.author, self.user)
        self.assertEqual(room.youtube_link, None)
        self.assertEqual(
            room.video.name, f'videos/{room_name}/{room_name}{video_ext}'
        )
        self.assertEqual(room.__str__(), room_name)
        self.assertEqual(room.get_absolute_url(), f'/{room.id}/')
        validate_video_extension(video)
        with self.assertRaises(ValidationError):
            validate_video_extension(audio)

        room.remove_video_files()


class MessageModelTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        User = get_user_model()
        cls.user = User.objects.create(
            username='testuser1', password='testpass123',
        )

        cls.room = Room.objects.create(
            name='room1',
            author=cls.user,
            youtube_link='https://www.youtube.com/watch?v=1cQh1ccqu8M',
        )

    def test_create_message(self):
        message = Message.objects.create(
            content='123', author=self.user, room=self.room,
        )

        self.assertEqual(message.content, '123')
        self.assertEqual(message.author, self.user)
        self.assertEqual(message.room, self.room)
        self.assertEqual(message.__str__(), '123')
