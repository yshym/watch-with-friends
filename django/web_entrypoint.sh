#!/usr/bin/env bash

# Migrate DB
python manage.py migrate

# Run server
python manage.py runserver 0.0.0.0:8000
gunicorn -b 0.0.0.0 config.wsgi
