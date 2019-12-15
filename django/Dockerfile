FROM python:3.6

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY pyproject.toml poetry.lock /code/

RUN pip install poetry \
    && poetry config virtualenvs.create false \
    && poetry install

COPY . /code/
