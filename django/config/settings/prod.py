from .base import *
from decouple import config


ALLOWED_HOSTS = config(
    "ALLOWED_HOSTS",
    default=[],
    cast=lambda v: [s.strip() for s in v.split(",")],
)


DEBUG = False


SECRET_KEY = config("SECRET_KEY")


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "watch-with-friends".replace("-", "_"),
        "USER": config("DB_USER", default="postgres"),
        "PASSWORD": config("DB_PASS", default="postgres"),
        "HOST": "db",
        "PORT": 5432,
    }
}


STATICFILES_STORAGE = "whitenoise.storage.CompressedStaticFilesStorage"


# Heroku
# import dj_database_url

# db_from_env = dj_database_url.config(conn_max_age=500)
# DATABASES["default"].update(db_from_env)

# SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
