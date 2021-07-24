#!/usr/bin/env bash

# Migrate database
python manage.py migrate

# Collect static files
RUN python manage.py collectstatic --no-input

# Run server
# python manage.py runserver 0.0.0.0:8000
gunicorn config.wsgi -b 0.0.0.0:8000
