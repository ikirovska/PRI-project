import json
import requests
import mwparserfromhell
from pandas import *

base_url = "https://en.wikipedia.org/w/api.php"
wikidata_base_url = "https://www.wikidata.org/w/rest.php/wikibase/v0/entities/items/"
nominatim_endpoint = "https://nominatim.openstreetmap.org/reverse"

# CSV file paths
csv_file_path = "../datasets/02_Universities_with_wikidata.csv"
new_csv_file_path = "../datasets/04_Universities_with_city_coords_and_wikipedia_page.csv"

# Prepare dataset
data = read_csv(csv_file_path)
university_wikidata = data['Wikidata'].tolist()

# Results
results = []

# Add columns for Wikipedia text, city text, latitude, and longitude
data["Wikipedia Text"] = None
data["City name"] = None
data["Latitude"] = None
data["Longitude"] = None
coordinates_not_found = 0
city_name = None

for index, uni_wikidata in enumerate(university_wikidata):
    try:
        print("Starting API call for university: ", index)

        # Get University wikidata from file
        wikidata_json = json.loads(uni_wikidata)
        wikidata_json = wikidata_json["entities"]
        university_id = list(wikidata_json.keys())[0]

        # Get the whole wikidata page for university
        response_body = requests.get(
            wikidata_base_url + university_id,
        ).json()

        university_relations = response_body["statements"]
        university_relations_keys = list(university_relations.keys())

        # Get Wikipedia Page ID from Wikidata ID
        wikidata_url = f"https://www.wikidata.org/w/api.php?action=wbgetentities&ids={university_id}&format=json"
        r = requests.get(wikidata_url)
        wikidata_data = r.json()
        title = wikidata_data['entities'][university_id]['sitelinks']['enwiki']['title']
        print(f"University Wikipedia title: {title}")

        # Get Wikipedia Page Text using Page Title
        wikipedia_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={title}&prop=revisions&rvprop=content&format=json"
        r = requests.get(wikipedia_url)
        wikipedia_data = r.json()
        page_id = list(wikipedia_data['query']['pages'].keys())[0]
        page_text = wikipedia_data['query']['pages'][page_id]['revisions'][0]['*']

        # page_text is in wikitext format, so it needs to be converted to plain text
        parsed_wikitext = mwparserfromhell.parse(page_text)
        plain_text = parsed_wikitext.strip_code()
        data.at[index, 'Wikipedia Text'] = plain_text

        # Get the city wikidata if the relationship to the city exists
        possible_relations_list = ["P131", "P276"]

        for rel in possible_relations_list:
            relation_found = False
            if rel in university_relations_keys and not relation_found:
                relation_found = True
                city_id = university_relations[rel][0]["value"]["content"]
                print("Found city wikidata ID: ", city_id)

                city_response_body = requests.get(
                    wikidata_base_url + city_id,
                ).json()

                city_name = city_response_body["labels"]["en"]
                print("Found city Wikipedia title: ", city_name)

                # Get Wikipedia Page Text using the city's title
                wikipedia_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={city_name}&prop=revisions&rvprop=content&format=json"
                r = requests.get(wikipedia_url)
                wikipedia_data = r.json()
                page_id = list(wikipedia_data['query']['pages'].keys())[0]
                page_text = wikipedia_data['query']['pages'][page_id]['revisions'][0]['*']

                # page_text is in wikitext format, we have to convert it to plain text
                parsed_wikitext = mwparserfromhell.parse(page_text)
                plain_text = parsed_wikitext.strip_code()
                data.at[index, 'City name'] = plain_text

        # Get the coordinates if the relationship exists
        latitude = None
        longitude = None
        if "P625" in university_relations_keys:
            latitude = university_relations["P625"][0]["value"]["content"]["latitude"]
            longitude = university_relations["P625"][0]["value"]["content"]["longitude"]
            data.at[index, 'Latitude'] = latitude
            data.at[index, 'Longitude'] = longitude
        else:
            data.at[index, 'Latitude'] = None
            data.at[index, 'Longitude'] = None
            coordinates_not_found += 1

            # If no relation to the coordinates was found, try to get the coordinates from the city
            if relation_found:
                # Define the parameters for the geocoding request
                params = {
                    'q': city_name,  # City name or query
                    'format': 'json'  # Response format
                }
                try:
                    response = requests.get(nominatim_endpoint, params=params)
                    if response.status_code == 200:
                        _data = response.json()
                        if _data:
                            latitude = _data[0]['lat']
                            longitude = _data[0]['lon']
                            data.at[index, 'Latitude'] = latitude
                            data.at[index, 'Longitude'] = longitude
                            coordinates_not_found -= 1
                except Exception as e:
                    pass


        # If no relation to the city was found, try to get the city from the coordinates
        if not relation_found:
            results.append(False)
            # Try to get the city from the coordinates
            # Define the parameters for the reverse geocoding request
            params = {
                'format': 'json',
                'lat': latitude,
                'lon': longitude
            }

            try:
                # Send a GET request to the Nominatim API
                response = requests.get(nominatim_endpoint, params=params)

                # Check if the request was successful
                if response.status_code == 200:
                    _data = response.json()

                    # Extract the city name from the response
                    if 'address' in _data:
                        city = _data['address'].get('city', '')
                        data.at[index, 'City name'] = city
                        results.pop()
                    else:
                        data.at[index, 'City name'] = None
                else:
                    print("Request to get the city name from the coordinates failed with status code: " + str(response.status_code))
            except Exception as e:
                print("Request to get the city name from the coordinates failed with error: " + str(e))
    except Exception as ex:
        print("Unexpected error for university: ", index, " with exception: ", ex)
        data.at[index, "Wikipedia Text"] = "ERROR"
        data.at[index, "City name"] = "ERROR"
        data.at[index, 'Latitude'] = "ERROR"
        data.at[index, 'Longitude'] = "ERROR"

# Writing into the files
data.to_csv(new_csv_file_path, index=False)

print("University Wikipedia text NOT FOUND for: ", results.count(False))
