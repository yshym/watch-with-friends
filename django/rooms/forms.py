from django import forms
from django.contrib.auth import get_user_model


from .models import (
    Room,
    Message,
)


class MessageCreateForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = (
            'content',
        )


class RoomCreateForm(forms.ModelForm):
    class Meta:
        model = Room
        fields = (
            'name',
            'video',
        )
        error_messages = {
            'name': {
                'invalid': 'Enter a valid chat room name consisting of letters, \
                    numbers, underscores or hyphens.',
            }
        }
