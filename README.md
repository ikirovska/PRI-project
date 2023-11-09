# European universities full text search

## Participants

| Name            | Email                |
| --------------- | -------------------- |
| Ilina Kirovska  | up202301450@fe.up.pt |
| Goncalo Almeida | up202308629@fe.up.pt |
| Žan Žlender     | up202302230@fe.up.pt |

## Getting started

### Milestone 1

The main file of the project is located in `/scripts/main.ipynb`.

The recommended way to open it is inside of Visual Studio Code with the Python and Jupyter extensions installed.

### Milestone 2

Position into folder `milestone_2` and execute the `startup.sh` script. With Bash installed the command is just `./startup.sh`.

This will guide you to running Solr.

Once done you can view it on [http://localhost:8983](http://localhost:8983).

## M1 Feedback

- Change search tasks so they are more suitable for a full-text search (more like questions instead of pure X in Y)
- Add more information about universities (faculties etc.)
- ~~Add n-grams~~ - DONE - Wordclouds for unigrams, bigrams, trigrams and fourgrams are available
- Do NER analysis

### Ideas for the search engine
- match 100 and hundred (research Synonym Graph Filter define our own synonyms text file)
- do we need phonetic matching? Wildcards in 05-tutorial
- Stop Filter?
