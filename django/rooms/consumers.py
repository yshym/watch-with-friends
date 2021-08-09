import json
from typing import Dict, Set

from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone

from .tasks import create_message
from config import redis


class RoomConsumer(AsyncWebsocketConsumer):
    r = redis.client

    @property
    def connected_users_set_name(self):
        return f"{self.room_name}_connected_users"

    @property
    def waiting_users_set_name(self):
        return f"{self.room_name}_waiting_users"

    async def connect(self):
        self.room_name = (
            self.scope.get("url_route").get("kwargs").get("room_name")
        )
        self.room_group_name = f"room_{self.room_name}"
        self.user = self.scope.get("user")

        self.is_new_user = not self.user_is_connected(self.user)

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name, self.channel_name
        )

        await self.accept()

        if self.is_new_user:
            self.add_connected_user(self.user)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "user_connected",
                    "username": self.user.username,
                    "is_new_user": self.is_new_user,
                    "connected_users": b",".join(self.connected_users).decode(),
                },
            )
        else:
            await self.send(
                text_data=json.dumps(
                    {
                        "type": "user_connected",
                        "username": self.user.username,
                        "is_new_user": self.is_new_user,
                    },
                )
            )
            await self.disconnect(200)

    async def disconnect(self, code):
        if self.user_is_connected(self.user):
            self.remove_connected_user(self.user)

            # Leave room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "user_disconnected",
                    "connected_users": b",".join(self.connected_users).decode(),
                },
            )

        await self.channel_layer.group_discard(
            self.room_group_name, self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message_type = text_data_json.get("type")

        if message_type == "message":
            room_name = text_data_json.get("room_name")
            username = text_data_json.get("username")
            message = text_data_json.get("message")

            create_message.delay(
                room_name=room_name,
                username=username,
                content=message,
            )

            timestamp = timezone.localtime(timezone.now()).strftime(
                "%d.%m.%Y, %H:%M"
            )

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "room_name": room_name,
                    "username": username,
                    "message": message,
                    "timestamp": timestamp,
                },
            )
        elif message_type == "pause_video":
            current_time = text_data_json.get("currentTime")

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "pause_video",
                    "username": self.user.username,
                    "current_time": current_time,
                },
            )
        elif message_type == "play_video":
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "play_video", "username": self.user.username},
            )
        elif message_type == "seeked_video":
            current_time = text_data_json.get("currentTime")

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "seeked_video",
                    "current_time": current_time,
                    "username": self.user.username,
                },
            )
        elif message_type == "buffering_video":
            self.add_waiting_user(self.user)

            await self.channel_layer.group_send(
                self.room_group_name,
                {"type": "buffering_video", "username": self.user.username},
            )
        elif message_type == "buffered_video":
            if self.user_is_waiting(self.user):
                self.remove_waiting_user(self.user)

                if self.number_of_waiting_users == 0:
                    await self.channel_layer.group_send(
                        self.room_group_name, {"type": "all_players_buffered"}
                    )

    # Receive message from room group
    async def chat_message(self, event):
        username = event.get("username")
        message = event.get("message")
        room_name = event.get("room_name")
        timestamp = event.get("timestamp")

        # Send message to WebSocket
        await self.send(
            text_data=json.dumps(
                {
                    "type": "message",
                    "room_name": room_name,
                    "username": username,
                    "message": message,
                    "timestamp": timestamp,
                }
            )
        )

    async def pause_video(self, event):
        current_time = event.get("current_time")
        username = event.get("username")

        await self.send(
            text_data=json.dumps(
                {
                    "type": "pause_video",
                    "current_time": current_time,
                    "username": username,
                }
            )
        )

    async def play_video(self, event):
        username = event.get("username")

        await self.send(
            text_data=json.dumps({"type": "play_video", "username": username})
        )

    async def seeked_video(self, event):
        current_time = event.get("current_time")
        username = event.get("username")

        await self.send(
            text_data=json.dumps(
                {
                    "type": "seeked_video",
                    "current_time": current_time,
                    "username": username,
                }
            )
        )

    async def user_connected(self, event):
        username = event.get("username")
        is_new_user = event.get("is_new_user")
        connected_users = event.get("connected_users")

        await self.send(
            text_data=json.dumps(
                {
                    "type": "user_connected",
                    "username": username,
                    "is_new_user": is_new_user,
                    "connected_users": connected_users,
                }
            )
        )

    async def user_disconnected(self, event):
        connected_users = event.get("connected_users")

        await self.send(
            text_data=json.dumps(
                {
                    "type": "user_disconnected",
                    "connected_users": connected_users,
                }
            )
        )

    async def buffering_video(self, event):
        username = event.get("username")

        await self.send(
            text_data=json.dumps(
                {"type": "buffering_video", "username": username}
            )
        )

    async def all_players_buffered(self, _event):
        await self.send(text_data=json.dumps({"type": "all_players_buffered"}))

    @property
    def connected_users(self) -> Set:
        return self.r.smembers(self.connected_users_set_name)

    def add_connected_user(self, user):
        self.r.sadd(self.connected_users_set_name, user.username)

    def remove_connected_user(self, user):
        self.r.srem(self.connected_users_set_name, user.username)

    def user_is_connected(self, user) -> bool:
        return self.r.sismember(self.connected_users_set_name, user.username)

    @property
    def waiting_users(self) -> Set:
        return self.r.smembers(self.waiting_users_set_name)

    def add_waiting_user(self, user):
        self.r.sadd(self.waiting_users_set_name, user.username)

    def remove_waiting_user(self, user):
        self.r.srem(self.waiting_users_set_name, user.username)

    def user_is_waiting(self, user) -> bool:
        return self.r.sismember(self.waiting_users_set_name, user.username)

    @property
    def number_of_waiting_users(self) -> int:
        return self.r.scard(self.waiting_users_set_name)
