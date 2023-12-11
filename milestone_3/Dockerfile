# Use the official Python image as the base image
FROM solr:9.3

ARG SOLR_DOCKER_PORT
ENV SOLR_DOCKER_PORT $SOLR_DOCKER_PORT

# Set the working directory in the container
WORKDIR /app
# Copy the application code into the container
COPY improved_uni_schema.json docker_startup.sh /app/
COPY datasets/ /app/datasets/

# Expose port 8983
EXPOSE $SOLR_DOCKER_PORT

# Command to run the application
CMD ["/bin/bash", "docker_startup.sh"]

