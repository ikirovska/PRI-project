import requests
import pandas as pd
import json

base_url = "https://en.wikipedia.org/w/api.php"
wikidata_base_url = "https://www.wikidata.org/w/rest.php/wikibase/v0/entities/items/"
csv_file_path = "../datasets/02_Universities_with_wikidata.csv"
csv_final_file_path =  "../datasets/05_Universities_ranking_filtered_with_city.csv"

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

        # Get the city wikidata if the relationship to the city exists
        if ("P131" in university_relations_keys):
            city_id = university_relations["P131"][0]["value"]["content"]

            city_response_body = requests.get(
                wikidata_base_url + city_id,
            ).json()

            city_name = city_response_body["labels"]["en"]
            print("Found city - Starting API call for: ", city_name)

            # Update the 'city' column in the DataFrame
            data.loc[index, 'city'] = city_name
        else:
            # If city not found, set 'city' to None
            data.loc[index, 'city'] = None
            print("Finished API call for: ", index, " - NOT FOUND")
    except requests.exceptions.RequestException as ex:
        print("Failed API call for: ", index, " with exception: ", ex)
    except Exception as ex:
        print("Unexpected error for: ", index, " with exception: ", ex)

# Writing into the file
data.to_csv(csv_final_file_path, index=False)

print("City not found count: " + str(data['city'].isnull().sum()))