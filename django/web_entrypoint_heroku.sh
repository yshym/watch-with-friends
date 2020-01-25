#!/usr/bin/env bash

# Migrate DB
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input

# Install webpack dependencies
cd webpack
npm install
cd ..

# Make webpack bundles
make bundles

# Run gunicorn
gunicorn config.wsgi
