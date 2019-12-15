from django.contrib.auth.forms import UserCreationForm
from django.views.generic.edit import CreateView


class SignUpView(CreateView):
    template_name = 'signup.djhtml'
    form_class = UserCreationForm
