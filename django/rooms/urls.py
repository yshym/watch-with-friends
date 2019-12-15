from django.contrib import admin
from django.urls import path

from .views import (
    IndexView,
    RoomDetailView,
    RoomCreateView,
)


urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('create/', RoomCreateView.as_view(), name='room_create'),
    path('<slug:slug>/', RoomDetailView.as_view(), name='room_detail'),
]
