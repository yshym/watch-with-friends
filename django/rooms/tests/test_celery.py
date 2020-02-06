from django.test import TestCase
from django.contrib.auth import get_user_model

from ..models import Room, Message
from ..tasks import create_message


class RoomTasksTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.username = 'testuser1'
        cls.password = 'testpass123'

        User = get_user_model()
        cls.user = User.objects.create(
            username=cls.username, password=cls.password,
        )

        cls.room = Room.objects.create(
            name='room1',
            author=cls.user,
            youtube_link='https://www.youtube.com/watch?v=1cQh1ccqu8M',
        )

    def test_create_message_task(self):
        content = '123'

        result = create_message.apply(
            kwargs={
                'room_name': self.room.name,
                'username': self.user.username,
                'content': content,
            }
        )

        self.assertTrue(result.successful())
