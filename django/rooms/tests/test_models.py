from django.test import TestCase
from django.contrib.auth import get_user_model

from ..models import Room, Message


class RoomModelTestCase(TestCase):
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


class MessageModelTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        User = get_user_model()
        cls.user = User.objects.create(
            username='testuser1',
            password='testpass123',
        )

        cls.room = Room.objects.create(
            name='room1',
            author=cls.user,
            youtube_link='https://www.youtube.com/watch?v=1cQh1ccqu8M',
        )

    def test_create_message(self):
        message = Message.objects.create(
            content='123',
            author=self.user,
            room=self.room,
        )

        self.assertEqual(message.content, '123')
        self.assertEqual(message.author, self.user)
        self.assertEqual(message.room, self.room)
