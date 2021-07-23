from django.urls import path

from .consumers import RoomConsumer


websocket_urlpatterns = [path("ws/chat/<slug:room_name>/", RoomConsumer.as_asgi())]
