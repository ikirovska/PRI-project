'''
This script reads the english university names and fetches data for them 
from the Wikidata API. The most important thing we get with it is the ID 
of the actual Wikipedia page as well as confirmation that the Wikipedia page
for that university exists.

REQUIREMENTS
--> have the Universities_without_wikipedia_page.csv file located in /datasets folder

RESULTS 
Only 2 universities were not found. 1 because it had the character & in it's name 
(Wageningen University & Research), and 1 doesn't have an english Wikipedia page 
(Fundación Universitaria San Pablo CEU).
'''

import requests
from pandas import *
import json

base_url = "https://wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&props=descriptions&languages=en&format=json"
csv_file_path = "datasets/Universities_without_wikipedia_page.csv"

# Prepare dataset
data = read_csv(csv_file_path)
institution_name = data['Correct Name'].tolist()

# Results
results = []
university_data = []

for index, i in enumerate(institution_name):
    # fetch data for University
    try:
        print("Starting API call for: ", index, " ", i)
        url = base_url + "&titles=" + institution_name[index].replace(" ", "_")
        r = requests.get(url)
        request_payload = json.loads(r.content.decode())
        print(index, i)
        print(r)
        print(request_payload)

        # check if university data is found and update the field
        if ("-1" not in request_payload["entities"].keys()):
            data.loc[index, 'Wikidata'] = (json.dumps(request_payload))
            print("Finished API call for: ", index, " ", i, " - OK")
        else:
            results.append(False)
            data.loc[index, 'Wikidata'] = "NOT FOUND"
            print("Finished API call for: ", index, " ", i, " - NOT FOUND")
    except requests.exceptions.RequestException as ex:
        print("Failed API call for: ", index, " ", i, " with exception: ", ex)
        data.loc[index, "Wikidata"] = "ERROR"

# writing into the file
data.to_csv(csv_file_path, index=False)

print("Url don't exist count: " + str(results.count(False)))
