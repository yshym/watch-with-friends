from .base import *


ALLOWED_HOSTS = ["*"]


DEBUG = True


# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "<SECRET KEY>"


DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join(
            BASE_DIR, "watch-with-friends.sqlite3".replace("-", "_")
        ),
        "TEST": {
            "NAME": os.path.join(
                BASE_DIR,
                f"{'watch-with-friends.sqlite3'.replace('-', '_')}_test.sqlite3",
            )
        },
    }
}
