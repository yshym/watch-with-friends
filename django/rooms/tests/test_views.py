from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile

from ..models import Room

import os


class RoomViewTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.username = 'testuser1'
        cls.password = 'testpass123'

        User = get_user_model()
        cls.user = User(username=cls.username, password=cls.password,)
        cls.user.set_password(cls.password)
        cls.user.save()

    def setUp(self):
        self.client.login(username=self.username, password=self.password)

    def test_index_view(self):
        response = self.client.get(reverse('index'))

        self.assertEqual(response.status_code, 200)

    def test_room_create_view(self):
        response = self.client.get(reverse('room_create'))

        self.assertEqual(response.status_code, 200)

    def test_room_detail_view(self):
        room = Room.objects.create(
            name='room1',
            author=self.user,
            youtube_link='https://www.youtube.com/watch?v=1cQh1ccqu8M',
        )

        response = self.client.get(room.get_absolute_url())
        self.assertEqual(response.status_code, 200)

        new_room_name = 'room2'
        response = self.client.post(
            room.get_absolute_url(), {'name': new_room_name}
        )
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Room.objects.filter(name='room2').exists())

        upload_video_file = open('media/testfiles/video.mp4', 'rb')
        video = SimpleUploadedFile(
            upload_video_file.name, upload_video_file.read()
        )
        video_ext = os.path.splitext(video.name)[1]
        response = self.client.post(room.get_absolute_url(), {'video': video})
        self.assertEqual(response.status_code, 302)
        new_room = Room.objects.get(name=new_room_name)
        self.assertEqual(
            new_room.video.name,
            f'videos/{new_room_name}/{new_room_name}{video_ext}',
        )

        response = self.client.post(
            room.get_absolute_url(),
            {'youtube_link': 'https://www.youtube.com/watch?v=DmeUuoxyt_E'},
        )
        self.assertEqual(response.status_code, 302)
        self.assertTrue(
            Room.objects.filter(
                youtube_link='https://www.youtube.com/watch?v=DmeUuoxyt_E'
            ).exists()
        )
