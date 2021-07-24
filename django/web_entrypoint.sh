#!/usr/bin/env bash

# Migrate DB
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input

# Run server
gunicorn config.wsgi -b 0.0.0.0:8000
