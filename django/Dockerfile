FROM python:3.6

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY pyproject.toml poetry.lock /code/

RUN apt-get -y update
RUN apt-get -y upgrade
RUN apt-get install -y ffmpeg coffeescript npm
RUN pip install poetry \
    && poetry config virtualenvs.create false \
    && poetry install

# Heroku
# COPY . /code/
