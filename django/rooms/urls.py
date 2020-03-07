from django.urls import path

from .views import (
    IndexView,
    RoomDetailView,
    RoomCreateView,
)


urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('create/', RoomCreateView.as_view(), name='room_create'),
    path('<uuid:pk>/', RoomDetailView.as_view(), name='room_detail'),
]
