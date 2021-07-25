#!/usr/bin/env bash

# Migrate database
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input

# Run server
# python manage.py runserver 0.0.0.0:8000
daphne -b 0.0.0.0 -p 8000 config.routing:application
