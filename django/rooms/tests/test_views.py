from django.test import TestCase, SimpleTestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse

from ..models import Room


class RoomViewTestCase(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()

        cls.username = 'testuser1'
        cls.password = 'testpass123'
        User = get_user_model()
        cls.user = User.objects.create(
            username=cls.username, password=cls.password,
        )

        cls.client = Client()
        # FIXME: Logging in in setUpClass
        cls.client.login(username=cls.username, password=cls.password)

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
