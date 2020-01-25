#!/usr/bin/env bash

# Migrate DB
python manage.py migrate

# Install webpack dependencies
cd webpack
npm install
cd ..

# Make webpack bundles
make bundles

# Collect static files
python manage.py collectstatic --no-input

# Run server
gunicorn config.wsgi
