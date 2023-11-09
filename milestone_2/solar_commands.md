# How to run SOLR

## Running by yourself

> **NOTICE** - the following commands work for Linux, Ubuntu 20.04 (WSL)

Download docker image

```bash
docker pull solr:9.3
```

Run docker image, expose port 9893 and create the universities core.

```bash
docker run -p 8983:8983 --name solr -v /data -d solr:9.3 solr-precreate universities
```

Position into `milestone_2/` folder and add the schema to the SOLR core.

```bash
curl -X POST -H 'Content-type:application/json' \
--data-binary "@uni_schema.json" \
http://localhost:8983/solr/universities/schema
```

Position into `milestone_1/` folder and upload the universities JSON to the SOLR core.

```bash
curl -X POST -H 'Content-type:application/json' \
--data-binary "@datasets/06_University_documents.json" \
http://localhost:8983/solr/universities/update\?commit\=true
```

## From finished template

> **NOTICE** - this script was tested on Windows 10 and WSL (Ubuntu 20.04)

Position into folder `milestone_2` and execute the `startup.sh` script. With Bash installed the command is just `./startup.sh`.

This will guide you to running Solr.

Once done you can view it on [http://localhost:8983](http://localhost:8983).
