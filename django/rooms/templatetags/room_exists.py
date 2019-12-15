from django.template.defaulttags import register


from ..models import Room


@register.filter
def room_exists(room_name):
    return Room.objects.filter(name=room_name).exists()
