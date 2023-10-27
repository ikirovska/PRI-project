#!/bin/bash

open -a Docker

docker pull solr

docker run -p 8983:8983 --name solr -d solr solr-precreate universities

until $(curl --output /dev/null --silent --head --fail http://localhost:8983/solr); do
    echo "Waiting for Solr to start..."
    sleep 5
done

check_field_type() {
    field_type_name="$1"
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8983/solr/universities/schema/fieldtypes/$field_type_name)
    if [ "$response" = "200" ]; then
        echo "Field type '$field_type_name' already exists."
        return 0  # Field type exists
    else
        return 1  # Field type does not exist
    fi
}

check_field_name() {
    field_name="$1"
    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8983/solr/universities/schema/fields/$field_name)
    if [ "$response" = "200" ]; then
        echo "Field '$field_name' already exists."
        return 0  # Field name exists
    else
        return 1  # Field name does not exist
    fi
}

cd milestone_2

# We need to change this field_type for the final submission
if check_field_type "courseTitle"; then
    echo "Skipping adding field type 'courseTitle'."
else
    curl -X POST -H 'Content-type:application/json' --data-binary "@uni_schema.json" http://localhost:8983/solr/universities/schema
fi

cd ../milestone_1
curl -X POST -H 'Content-type:application/json' --data-binary "@datasets/05_University_documents.json" http://localhost:8983/solr/universities/update?commit=true

echo "Solr setup and data population completed."
