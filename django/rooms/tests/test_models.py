from django.test import TestCase
from django.contrib.auth import get_user_model

from ..models import Room


class RoomModelsTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        User = get_user_model()
        cls.user = User.objects.create(
            username='testuser1',
            password='testpass123',
        )

    def test_create_room_with_youtube_video(self):
        room_name = 'room1'
        youtube_link = 'https://www.youtube.com/watch?v=1cQh1ccqu8M'

        room = Room.objects.create(
            name=room_name,
            author=self.user,
            youtube_link=youtube_link,
        )

        self.assertEqual(room.name, room_name)
        self.assertEqual(room.author, self.user)
        self.assertEqual(room.youtube_link, youtube_link)
        self.assertEqual(room.video, None)
