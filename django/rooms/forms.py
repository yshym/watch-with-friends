from django import forms
from django_select2.forms import Select2Widget

from .models import (
    Room,
    Message,
)
from .widgets import CustomFileUpload


class MessageCreateForm(forms.ModelForm):
    class Meta:
        model = Message
        fields = ('content',)


class RoomCreateForm(forms.ModelForm):
    VIDEO_TYPES = (
        ('local', 'Local'),
        ('yt', 'YouTube'),
    )
    video_type = forms.ChoiceField(choices=VIDEO_TYPES)

    class Meta:
        model = Room
        fields = (
            'name',
            'video_type',
            'video',
            'youtube_link',
        )
        widgets = {
            'video': CustomFileUpload,
            'youtube_link': forms.TextInput(
                attrs={'placeholder': 'YouTube link'}
            ),
        }
        error_messages = {
            'name': {
                'invalid': 'Enter a valid chat room name consisting of letters, \
                    numbers, underscores or hyphens.',
            }
        }
        labels = {
            'video': 'Video*',
            'youtube_link': 'Youtube link*',
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        attrs = {}
        if self.errors.get('video') is not None:
            attrs.update({'class': 'is-invalid'})
        self.fields.get('video').widget = CustomFileUpload(attrs=attrs)

    def clean(self):
        super().clean()
        if self.cleaned_data.get(
            'video_type'
        ) == 'local' and not self.cleaned_data.get('video'):
            self.add_error('video', 'This field is required.')
        elif self.cleaned_data.get(
            'video_type'
        ) == 'yt' and not self.cleaned_data.get('youtube_link'):
            self.add_error('youtube_link', 'This field is required.')
        return self.cleaned_data


class RoomVideoUpdateForm(forms.ModelForm):
    VIDEO_TYPES = (
        ('local', 'Local'),
        ('yt', 'YouTube'),
    )
    video_type = forms.ChoiceField(choices=VIDEO_TYPES, label='')

    class Meta:
        model = Room
        fields = (
            'video_type',
            'video',
            'youtube_link',
        )
        widgets = {
            'video': CustomFileUpload,
            'youtube_link': forms.TextInput(
                attrs={'placeholder': 'YouTube link'}
            ),
        }
        labels = {
            'video': '',
            'youtube_link': '',
        }


class RoomEnterForm(forms.Form):
    name = forms.ModelChoiceField(
        queryset=Room.objects.all(),
        empty_label=' ',
        widget=Select2Widget,
        label='',
    )
