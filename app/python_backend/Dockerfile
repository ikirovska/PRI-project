# Use the official Python image as the base image
FROM python:3.11.7-slim-bullseye as base

ARG SOLR_DOCKER_PORT
ARG SOLR_DOCKER_URL
ARG BACKEND_DOCKER_PORT

ENV SOLR_DOCKER_PORT $SOLR_DOCKER_PORT
ENV SOLR_DOCKER_URL $SOLR_DOCKER_URL
ENV BACKEND_DOCKER_PORT $BACKEND_DOCKER_PORT

# Set the working directory in the container
WORKDIR /app

# Copy the poetry configuration files and install dependencies
COPY pyproject.toml app/ /app/
RUN pip install poetry && poetry install --no-root

FROM base as build
WORKDIR /app

# Copy the application code into the container
COPY . /app/

RUN pwd

RUN ls -la

# Expose port 5000
EXPOSE $BACKEND_DOCKER_PORT

# Command to run the application
CMD ["poetry", "run", "python", "app/__init__.py"]