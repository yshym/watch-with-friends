FROM debian:stable

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY . /code/

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install -y python3 python3-pip ffmpeg

RUN pip3 install poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-dev
