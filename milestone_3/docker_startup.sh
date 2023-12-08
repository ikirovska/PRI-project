#!/bin/bash

echo "Running solr startup script ~\n\n"

sleep 2

until $(curl --output /dev/null --silent --head --fail http://solr:8983/solr); do
    echo "\n>>> Waiting for Solr to start...\n"
    sleep 5
done

echo "\n>>> Uploading schema...\n\n"

curl -X POST -H 'Content-type:application/json' \
--data-binary "@improved_uni_schema.json" \
http://solr:8983/solr/universities/schema

echo "\n>>> Uploading documents...\n\n"

curl -X POST -H 'Content-type:application/json' \
--data-binary "@datasets/08_Vectorized_university_documents.json" \
http://solr:8983/solr/universities/update?commit=true

echo "\n\nSolr setup and data population completed.\n\n"
echo "Open http://solr:8983/solr in your browser.\n\n"
echo "This window will automatically close in 10 seconds.\n\n"

sleep 10