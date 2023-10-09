import requests
from pandas import *

base_url = "https://en.wikipedia.org/wiki/"

# Prepare dataset
data = read_csv("kaggle_qs.csv")
institution_name = data['Institution Name'].tolist()[1:]

# Results
results = []

for i in institution_name:
    print(i)
    url = base_url + '_' + i.replace(' ', '_')

    r = requests.head(url)
    results.append(str(r.ok))

print("Url exist count: " + str(results.count(True)))
print("Url don't exist count: " + str(results.count(False)))