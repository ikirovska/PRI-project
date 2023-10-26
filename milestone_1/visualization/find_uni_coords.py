import requests
import pandas as pd
import json

base_url = "https://en.wikipedia.org/w/api.php"
wikidata_base_url = "https://www.wikidata.org/w/rest.php/wikibase/v0/entities/items/"
csv_file_path = "../datasets/02_Universities_with_wikidata.csv"
csv_final_file_path = "../datasets/06_Universities_ranking_filtered_with_coordinates.csv"

# Prepare dataset
data = pd.read_csv(csv_file_path)
university_wikidata = data['Wikidata'].tolist()

# Results
results = []

for index, i in enumerate(university_wikidata):
    try:
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

        # Get the coordinates if the relationship exists
        if ("P625" in university_relations_keys):
            latitude = university_relations["P625"][0]["value"]["content"]["latitude"]
            longitude = university_relations["P625"][0]["value"]["content"]["longitude"]

            print("Found coordinates - Starting API call for: ", (latitude, longitude))

            # Update the 'latitude' and 'longitude' columns in the DataFrame
            data.loc[index, 'Latitude'] = latitude
            data.loc[index, 'Longitude'] = longitude
        else:
            # If coordinates not found, set 'Latitude' and 'Longitude' to None
            data.loc[index, 'Latitude'] = None
            data.loc[index, 'Longitude'] = None
            print("Finished API call for: ", index, " - NOT FOUND")
    except requests.exceptions.RequestException as ex:
        print("Failed API call for: ", index, " with exception: ", ex)
    except Exception as ex:
        print("Unexpected error for: ", index, " with exception: ", ex)

# Writing into the file
data.to_csv(csv_final_file_path, index=False)

print("Coordinates not found count: " + str(data['Latitude'].isnull().sum()))
