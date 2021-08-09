#!/usr/bin/env bash

# Migrate database
python manage.py migrate

# Run server
python manage.py runserver 0.0.0.0:8000
