'''
This script reads the names of each university and calls the Wikipedia API
to get the plain text of that university's wikipeadia page.

Example query: https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&explaintext&format=json&titles=University_of_Porto

REQUIREMENTS
--> have the Universities_without_wikipedia_page.csv file located in /datasets folder

RESULTS 
All universities were found, and all the retrieved data was stored.

'''

import requests
from pandas import *
import json

base_url = "https://en.wikipedia.org/w/api.php"
csv_file_path = "datasets/Universities_without_wikipedia_page.csv"

# Prepare dataset
data = read_csv(csv_file_path)
university_wikidata = data['Correct Name'].tolist()

# Results
results = []
university_data = []

for index, i in enumerate(university_wikidata):
    # fetch data for University
    try:
        print("Starting API call for: ", index, " ", i)

        response_body = requests.get(
            base_url,
            params={
                "action": "query",
                "origin": "*",
                "prop": "extracts",
                "explaintext": True,
                "format": "json",
                "titles": i.replace(" ", "_")
            }
        ).json()

        # check if university data is found and update the field
        if ("-1" not in response_body["query"]["pages"].keys()):
            data.loc[index, 'Wikipedia text'] = (json.dumps(response_body))
            print("Finished API call for: ", index, " ", i, " - OK")
        else:
            results.append(False)
            data.loc[index, 'Wikipedia text'] = "NOT FOUND"
            print("Finished API call for: ", index, " ", i, " - NOT FOUND")
    except requests.exceptions.RequestException as ex:
        print("Failed API call for: ", index, " ", i, " with exception: ", ex)
        data.loc[index, "Wikipedia text"] = "ERROR"

# writing into the file
data.to_csv(csv_file_path, index=False)

print("Url don't exist count: " + str(results.count(False)))
