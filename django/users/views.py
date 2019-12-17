from django.contrib.auth.forms import UserCreationForm
from django.contrib.messages.views import SuccessMessageMixin
from django.views.generic.edit import CreateView
from django.urls import reverse_lazy


class SignUpView(CreateView):
    template_name = 'signup.djhtml'
    form_class = UserCreationForm
    success_url = reverse_lazy('index')
    success_message = 'Account was successfully created!'
