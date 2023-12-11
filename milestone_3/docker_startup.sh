#!/bin/bash

echo "Running solr startup script ~\n\n"

sleep 2

status_code=""

while [ "$status_code" != "200" ] && [ "$status_code" != "302" ] && [ "$status_code" != "503" ]; do
    response=$(curl -s -w "%{http_code}" http://solr:8983/solr)
    status_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')  # Extract the response body (excluding the status code)

    if [ "$status_code" != "200" ] && [ "$status_code" != "302" ] && [ "$status_code" != "503" ]; then
        echo "\n>>> Waiting for Solr to start...\n"
        echo "Retrying... Status code: $status_code"
        echo "Response body: $body"
        sleep 2  # You can adjust the sleep duration as needed
    else
        echo "Success! Status code: $status_code"
        echo "Response body: $body"
    fi
done

echo "\n>>> Uploading schema...\n\n"

until $(curl --output /dev/null --fail -X POST -H 'Content-type:application/json' --data-binary "@improved_uni_schema.json" http://solr:8983/solr/universities/schema); do
    printf "\n>>> Waiting for Solr to start...\n"
    sleep 5
done

echo "\n>>> Uploading documents...\n\n"

curl -X POST -H 'Content-type:application/json' \
--data-binary "@datasets/09_Vectorized_university_documents.json" \
http://solr:8983/solr/universities/update?commit=true

echo "\n\nSolr setup and data population completed.\n\n"
echo "Open http://solr:8983/solr in your browser.\n\n"
echo "This window will automatically close in 10 seconds.\n\n"

sleep 10