def validate_video_extension(value):
    import os
    from django.core.exceptions import ValidationError
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.mp4', '.webm', '.ogg']
    if not ext.lower() in valid_extensions:
        raise ValidationError('Unsupported file extension.')
