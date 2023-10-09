import requests
import mwparserfromhell
import pandas as pd
import json

csv_file_path = "datasets/wikidata_for_all_universities.csv"
data = pd.read_csv(csv_file_path)
wikidata_list = data['Wikidata'].tolist()

skipped = 0
for index, wikidata in enumerate(wikidata_list):
    if wikidata == "NOT FOUND":
        skipped+=1
        continue
    wikidata_id = list(json.loads(wikidata)['entities'].keys())[0]

    # Get Wikipedia Page ID from Wikidata ID
    wikidata_url = f"https://www.wikidata.org/w/api.php?action=wbgetentities&ids={wikidata_id}&format=json"
    r = requests.get(wikidata_url)
    wikidata_data = r.json()
    title = wikidata_data['entities'][wikidata_id]['sitelinks']['enwiki']['title']
    print("Retrieving wikipedia text for: ", index, " ", title)

    # Get Wikipedia Page Text using Page ID
    wikipedia_url = f"https://en.wikipedia.org/w/api.php?action=query&titles={title}&prop=revisions&rvprop=content&format=json"
    r = requests.get(wikipedia_url)
    wikipedia_data = r.json()
    page_id = list(wikipedia_data['query']['pages'].keys())[0]
    page_text = wikipedia_data['query']['pages'][page_id]['revisions'][0]['*']

    # page_text is in wikitext format, we have to convert it to plain text
    parsed_wikitext = mwparserfromhell.parse(page_text)
    plain_text = parsed_wikitext.strip_code()
    data.loc[index, 'Wikipedia Text'] = plain_text

#write to file
data.to_csv(csv_file_path, index=False)
print("not found wikipedia text for:", skipped)

