FROM ubuntu:20.04

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY . /code/

RUN apt-get update -y
RUN DEBIAN_FRONTEND="noninteractive" \
    apt-get install -y python3 python3-pip ffmpeg libpq-dev

RUN pip3 install poetry==1.1.7 \
    && poetry config virtualenvs.create false \
    && poetry install --no-dev
