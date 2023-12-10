# Flask backend

> This module uses Python to transform the user's query into vectors so that it can be used to query Solr's Dense vector fields. In other words, we use it for semantic searching.

## How to run

From the root of the project just run `docker compose up -d --build`.

## API

### /semantic-query

This backend onky has 1 API endpoint for querying Solr.

| method | url             | params                | returns       |
| ------ | --------------- | --------------------- | ------------- |
| POST   | /semantic-query | search, limit, offset | FlaskResponse |

- **search** - string that will transformed into a semantic search vector and a query
- **limit** - number of documents returned
- **offset** - number of documents skipped

Return type

```ts
type FlaskResponse = {
  results: Array<{
    institution_name: string;
    url: string;
    wikipedia_text: string;
    country: string;
    highlights: string[];
    city_name: string;
  }>;
  status: "OK" | "ERROR";
};
```
