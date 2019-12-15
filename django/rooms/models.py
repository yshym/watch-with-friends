from django.db import models
from django.contrib.auth import get_user_model
from django.urls import reverse_lazy
from autoslug import AutoSlugField


class Room(models.Model):
    name = models.SlugField(max_length=100, unique=True)
    slug = AutoSlugField(max_length=100, unique=True, populate_from='name')
    video = models.FileField(upload_to='videos/', blank=True)
    author = models.ForeignKey(
        get_user_model(),
        related_name='room',
        on_delete=models.CASCADE,
    )
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse_lazy('room_detail', kwargs={'slug': str(self.slug)})


class Message(models.Model):
    content = models.CharField(max_length=200)
    author = models.ForeignKey(
        get_user_model(),
        related_name='messages',
        on_delete=models.CASCADE,
    )
    room = models.ForeignKey(
        Room,
        related_name='messages',
        on_delete=models.CASCADE,
    )
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)

    def __str__(self):
        sliced_content = f'{self.content[:60]}...' if len(self.content) > 40 else self.content
        return sliced_content

    class Meta:
        ordering = ['timestamp',]
