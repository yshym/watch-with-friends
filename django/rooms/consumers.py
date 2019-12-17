from django.utils import timezone
from django.contrib.auth import get_user_model
from channels.generic.websocket import AsyncWebsocketConsumer
import json

from .models import (
    Room,
    Message,
)

from .tasks import (
    create_message,
)


class ChatConsumer(AsyncWebsocketConsumer):
    users = {}

    async def connect(self):
        self.room_name = self.scope.get('url_route').get('kwargs').get('room_name')
        self.room_group_name = f'room_{self.room_name}'
        self.user = self.scope.get('user')

        self.add_user(self.room_name, self.user)
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_connected',
                'connected_users': ','.join(self.users.get(self.room_name)),
            }
        )

    async def disconnect(self, close_code):
        self.remove_user(self.room_name, self.user)
        # Leave room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_disconnected',
                'connected_users': ','.join(self.users.get(self.room_name)),
            }
        )
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get('type')

        if message_type == 'message':
            room_name = text_data_json.get('room_name')
            username = text_data_json.get('username')
            message = text_data_json.get('message')

            create_message.delay(
                room_name=room_name,
                username=username,
                content=message,
            )

            timestamp = timezone.localtime(timezone.now()).strftime('%d.%m.%Y, %H:%M')

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'room_name': room_name,
                    'username': username,
                    'message': message,
                    'timestamp': timestamp,
                }
            )
        elif message_type == 'pause_video':
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'pause_video',
                }
            )
        elif message_type == 'play_video':
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'play_video',
                }
            )
        elif message_type == 'seeked_video':
            current_time = text_data_json.get('currentTime')

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'seeked_video',
                    'current_time': current_time,
                }
            )

    # Receive message from room group
    async def chat_message(self, event):
        username = event.get('username')
        message = event.get('message')
        room_name = event.get('room_name')
        timestamp = event.get('timestamp')

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'message',
            'room_name': room_name,
            'username': username,
            'message': message,
            'timestamp': timestamp,
        }))

    async def pause_video(self, event):
        await self.send(text_data=json.dumps({
            'type': 'pause_video',
        }))

    async def play_video(self, event):
        await self.send(text_data=json.dumps({
            'type': 'play_video',
        }))

    async def seeked_video(self, event):
        current_time = event.get('current_time')

        await self.send(text_data=json.dumps({
            'type': 'seeked_video',
            'current_time': current_time,
        }))

    async def user_connected(self, event):
        connected_users = event.get('connected_users')

        await self.send(text_data=json.dumps({
            'type': 'user_connected',
            'connected_users': connected_users,
        }))

    async def user_disconnected(self, event):
        connected_users = event.get('connected_users')

        await self.send(text_data=json.dumps({
            'type': 'user_disconnected',
            'connected_users': connected_users,
        }))

    def add_user(self, room_name, user):
        self.users.setdefault(room_name, []).append(user.username)

    def remove_user(self, room_name, user):
        self.users.get(room_name, []).remove(user.username)
