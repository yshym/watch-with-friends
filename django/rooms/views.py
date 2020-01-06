from django.shortcuts import redirect
from django.views import generic
from django.utils.safestring import mark_safe
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin

from .models import (
    Room,
    Message,
)
from .forms import (
    MessageCreateForm,
    RoomCreateForm,
    RoomVideoUpdateForm,
    RoomEnterForm,
)

import json


class IndexView(generic.TemplateView):
    template_name = 'index.djhtml'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(room_names=self.room_names())
        context.update(form=RoomEnterForm())
        return context

    def room_names(self):
        return mark_safe({
            room.get('name'): str(room.get('id'))
            for room in Room.objects.all().values('name', 'id')
        })


class RoomDetailView(LoginRequiredMixin, generic.DetailView):
    model = Room
    template_name = 'room.djhtml'
    login_url = 'account_login'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(room_video_update_form=RoomVideoUpdateForm())
        return context

    def post(self, request, *args, **kwargs):
        obj = super().get_object()

        if request.user == obj.author:
            name = request.POST.get('name')
            video = request.FILES.get('video')
            youtube_link = request.POST.get('youtube_link')

            print(video, request.FILES)

            if name:
                obj.name = name
            elif video:
                obj.youtube_link = None
                obj.video = video

                obj.remove_video_files()
            elif youtube_link:
                obj.video = None
                obj.youtube_link = youtube_link

                obj.remove_video_files()

            obj.save()

        return redirect(request.build_absolute_uri())


class RoomCreateView(SuccessMessageMixin, LoginRequiredMixin, generic.edit.CreateView):
    template_name = 'room_create.djhtml'
    form_class = RoomCreateForm
    login_url = 'account_login'
    success_message = 'Room was successfully created!'

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super().form_valid(form)

    def get_success_url(self):
        return self.object.get_absolute_url()
