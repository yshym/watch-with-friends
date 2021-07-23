FROM ubuntu:20.04

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY . /code/

RUN apt-get update -y
RUN apt-get install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get update -y
RUN DEBIAN_FRONTEND="noninteractive" apt-get install -y tzdata
RUN apt-get install -y python3.8 python3-pip ffmpeg libpq-dev

RUN pip3 install poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-dev
