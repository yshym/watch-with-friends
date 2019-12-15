from .base import *


ALLOWED_HOSTS = config(
    'ALLOWED_HOSTS',
    default = [],
    cast=lambda v: [s.strip() for s in v.split(',')]
)


DEBUG = False


SECRET_KEY = config('SECRET_KEY')


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'watch-with-friends',
        'USER': config('DB_USER', default='postres'),
        'PASSWORD': config('DB_PASS', default='postres'),
        'HOST': 'localhost',
    }
}
