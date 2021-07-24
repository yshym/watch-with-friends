FROM python:3.8

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY . /code/

RUN apt-get update -y
RUN apt-get upgrade -y

# Install nodejs and npm
RUN apt-get install -y nodejs libpq-dev
RUN curl -L https://www.npmjs.com/install.sh | sh

# Install nodejs dependencies
RUN npm --prefix ./static install
# Build Webpack bundles
RUN npm --prefix ./static run build

# Install poetry and its dependencies
RUN pip install poetry \
    && poetry config virtualenvs.create false \
    && poetry install --no-dev
