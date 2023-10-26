# How to run SOLR

## 1st time

Download docker image

Run docker image, expose port 9893 and create the universities core.

```bash
docker run -p 8983:8983 --name solr -v ${PWD}:/data -d solr:9.3 solr-precreate universities
```

Position into `milestone_2/` folder and add the schema to the SOLR core.

```bash
curl -X POST -H 'Content-type:application/json' \
--data-binary "@uni_schema.json" \
http://localhost:8983/solr/universities/schema
```

Position into `milestone_1` folder and upload the universities JSON to the SOLR core.

```bash
curl -X POST -H 'Content-type:application/json' \
--data-binary "@datasets/05_University_documents.json" \
http://localhost:8983/solr/universities/update\?commit\=true
```

## From finished template

Run docker file..... TBD
