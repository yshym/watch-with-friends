#!/usr/bin/env bash

# Migrate database
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input

# Run server
daphne -b 0.0.0.0 -p 8000 config.routing:application
