FROM python:3.6

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY pyproject.toml poetry.lock /code/

RUN apt -y update
RUN apt -y upgrade
RUN apt install nodejs -y
# Install npm
RUN curl -L https://www.npmjs.com/install.sh | sh
# Install poetry and its dependencies
RUN pip install poetry \
    && poetry config virtualenvs.create false \
    && poetry install

# Heroku
# COPY . /code/
