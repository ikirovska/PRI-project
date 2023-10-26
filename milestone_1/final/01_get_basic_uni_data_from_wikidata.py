"""
This script reads the english university names and fetches data for them
from the Wikidata API. The most important thing we get with it is the ID
of the actual Wikipedia page as well as confirmation that the Wikipedia page
for that university exists.

REQUIREMENTS
--> have the 01_Universities_ranking_filtered_renamed.csv file located in /datasets folder

RESULTS
Only 1 universities were not found. 1 because it had the character '&' in its name
(Wageningen University & Research).
"""

import requests
from pandas import *
import json

base_url = ("https://wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&props=descriptions&languages=en&format"
            "=json")
csv_file_path = "../datasets/01_Universities_ranking_filtered_renamed.csv"
new_csv_file_path = "../datasets/02_Universities_with_wikidata.csv"

# Prepare dataset
data = read_csv(csv_file_path)
institution_name = data['Institution Name'].tolist()

# Results
results = []

data['Wikidata'] = None

for index, i in enumerate(institution_name):
    # Fetch data for University
    try:
        print("Starting API call for: ", index, " ", i)
        url = base_url + "&titles=" + institution_name[index].replace(" ", "_")
        r = requests.get(url)
        request_payload = json.loads(r.content.decode())

        # Check if university data is found and update the field
        if "-1" not in request_payload["entities"].keys():
            data.at[index, 'Wikidata'] = (json.dumps(request_payload))
            print("Finished API call for: ", index, " ", i, " - OK")
        else:
            results.append(False)
            data.at[index, 'Wikidata'] = "NOT FOUND"
            print("Finished API call for: ", index, " ", i, " - NOT FOUND")
    except Exception as ex:
        print("Failed API call for: ", index, " ", i, " with exception: ", ex)
        data.at[index, "Wikidata"] = "ERROR"

# Writing into the file
data.to_csv(new_csv_file_path, index=False)

print("Url don't exist count: " + str(results.count(False)))