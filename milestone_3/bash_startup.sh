#!/bin/bash
printf "Running solr startup script ~\n\n"
printf ">>> Checking if docker daemon is running...\n\n"
if (! docker stats --no-stream &> /dev/null); then
    printf "Docker daemon is not running, please start the Docker daemon.\n\n"
    #Wait until Docker daemon is running and has completed initialisation
while (! docker stats --no-stream &> /dev/null); do
    # Docker takes a few seconds to initialize
    echo "Waiting for Docker to launch..."
    sleep 1 && echo "." && sleep 1 && echo "." && sleep 1 && echo "." && sleep 2
done
fi
sleep 2
# check if solr image exists if not pull it
if [[ "$(docker images -q solr:9.3)" == "" ]]; then
  printf ">>> Image solr:9.3 doesn't exist, pulling image...\n"
  docker pull solr:9.3
fi
# check if solr container already exists, if yet delete it
if [[ "$(docker ps --all -q --filter name=solr)" != "" ]]; then
    sleep 1
    printf "\n>>> Deleting existing solr container and volume...\n"
    docker rm -v -f solr 
fi
sleep 2
printf "\n>>> Starting docker container...\n"
sleep 2
docker run -p 8983:8983 -v /data --name solr -d solr:9.3 solr-precreate universities
until $(curl --output /dev/null --silent --head --fail http://localhost:8983/solr); do
    printf "\n>>> Waiting for Solr to start...\n"
    sleep 5
done
printf "\n>>> Uploading schema...\n\n"
curl -X POST -H 'Content-type:application/json' \
--data-binary "@improved_uni_schema.json" \
http://localhost:8983/solr/universities/schema
printf "\n>>> Uploading documents...\n\n"
curl -X POST -H 'Content-type:application/json' \
--data-binary "@datasets/09_Vectorized_university_documents.json" \
http://localhost:8983/solr/universities/update?commit=true
printf "\n\nSolr setup and data population completed.\n\n"
printf "Open http://localhost:8983/solr in your browser.\n\n"
printf "This window will automatically close in 10 seconds.\n\n"
sleep 10