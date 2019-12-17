from django.views import generic
from django.utils.safestring import mark_safe
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin

import json

from .models import (
    Room,
    Message,
)
from .forms import (
    MessageCreateForm,
    RoomCreateForm,
)


class IndexView(generic.TemplateView):
    template_name = 'index.djhtml'

    def get_context_data(self, **kwargs):
        context = super(IndexView, self).get_context_data(**kwargs)
        context.update(room_names=self.room_names())
        return context

    def room_names(self):
        return mark_safe([
            room.get('name')
            for room in Room.objects.all().values('name')
        ])


class RoomDetailView(LoginRequiredMixin, generic.DetailView):
    model = Room
    template_name = 'room.djhtml'
    login_url = 'users:login'


class RoomCreateView(SuccessMessageMixin, LoginRequiredMixin, generic.edit.CreateView):
    template_name = 'room_create.djhtml'
    form_class = RoomCreateForm
    login_url = 'users:login'
    success_message = 'Room was successfully created!'

    def form_valid(self, form):
        form.instance.author = self.request.user
        return super(RoomCreateView, self).form_valid(form)

    def get_success_url(self):
        return self.object.get_absolute_url()
