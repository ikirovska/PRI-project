'''
The script completes the list of universities with their respective english names.
Firstly, it compares the new list with the old one to find the already translated ones.
For the rest of the universities it checks if the current name returns a successful API call.
In the case it doesn't we manually translated the name.
'''

import pandas as pd
import requests
import json

base_url = "https://wikidata.org/w/api.php?action=wbgetentities&sites=enwiki&props=descriptions&languages=en&format=json"

new_data = pd.read_csv("datasets/NEW - Universities.csv")
old_data = pd.read_csv("datasets/Universities_without_wikipedia_page.csv")
new_wrong_names = new_data['Institution Name - WRONG'].tolist()
old_wrong_names = old_data['Wrong Name'].tolist()
correct_names = old_data['Correct Name'].tolist()

for index, name in enumerate(new_wrong_names):
    if name in old_wrong_names:
        correct_name_index =  old_wrong_names.index(name)
        new_data.loc[index, 'Institution Name'] = correct_names[correct_name_index]
    else:
        print("Starting API call for: ", index, " ",name)
        url = base_url + "&titles=" + name.replace(" ", "_")
        r = requests.get(url)
        request_payload = json.loads(r.content.decode())

        # check if university data is found and update the field
        if ("-1" not in request_payload["entities"].keys()):
            new_data.loc[index, 'Institution Name'] = name
        else:
            new_data.loc[index, 'Institution Name'] = " "

new_data.to_csv("datasets/updated_list.csv", index=False)
