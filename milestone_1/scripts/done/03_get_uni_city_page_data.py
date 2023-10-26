'''
This script reads from the WikiData data and searches for references
for the city in which the university is based.

It searches for one of the following relationships:
- located in the administrative territorial entity P131

REQUIREMENTS
--> have the Universities_with_wikipedia_page.csv file located in /datasets folder

RESULTS 
TBD....

'''

import requests
from pandas import *
import json

base_url = "https://en.wikipedia.org/w/api.php"
wikidata_base_url = "https://www.wikidata.org/w/rest.php/wikibase/v0/entities/items/"
csv_file_path = "datasets/Universities_with_wikipedia_page.csv"

# Prepare dataset
data = read_csv(csv_file_path)
university_wikidata = data['Wikidata'].tolist()

# Results
results = []

for index, i in enumerate(university_wikidata):

    """ if index == 5:
        break """

    try:
        print("Starting API call for: ", index)

        # get University wikidata from file
        wikidata_json = json.loads(i)
        wikidata_json = wikidata_json["entities"]
        university_id = list(wikidata_json.keys())[0]

        # Get the whole wikidata page for university
        response_body = requests.get(
            wikidata_base_url + university_id,
        ).json()

        university_relations = response_body["statements"]
        university_relations_keys = list(university_relations.keys())

        # Get the city wikidata if the relationship to the city exists
        # TODO check what other relations there are because some dont have this one, but have like location
        if ("P131" in university_relations_keys):
            city_id = university_relations["P131"][0]["value"]["content"]
            print("Found city - Starting API call for: ", city_id)

            city_response_body = requests.get(
                wikidata_base_url + city_id,
            ).json()

            city_name = city_response_body["labels"]["en"]
            print("Found city wikidata - Starting API call for: ", city_name)

            # Get the actual city wikipedia page data
            response_body = requests.get(
                base_url,
                params={
                    "action": "query",
                    "origin": "*",
                    "prop": "extracts",
                    "explaintext": True,
                    "format": "json",
                    "titles": city_name
                }
            ).json()

            # check if city data is found and update the field
            if ("-1" not in response_body["query"]["pages"].keys()):
                query = response_body["query"]["pages"]
                wikipedia_text = query[list(query.keys())[0]]["extract"]

                data.loc[index, 'City wikipedia text'] = (
                    json.dumps(wikipedia_text))
                print("Finished API call for: ", city_name, " - OK")
            else:
                results.append(False)
                data.loc[index, 'City wikipedia text'] = "NOT FOUND"
                print("Finished API call for: ", city_name, " - NOT FOUND")
        else:
            results.append(False)
            data.loc[index, 'City wikipedia text'] = "NOT FOUND"
            print("Finished API call for: ", index, " - NOT FOUND")
    except requests.exceptions.RequestException as ex:
        print("Failed API call for: ", index, " with exception: ", ex)
        data.loc[index, "City wikipedia text"] = "ERROR"
    except ex:
        print("Unexpected error for: ", index, " with exception: ", ex)
        data.loc[index, "City wikipedia text"] = "ERROR"

# writing into the file
data.to_csv(csv_file_path, index=False)

print("Url don't exist count: " + str(results.count(False)))
