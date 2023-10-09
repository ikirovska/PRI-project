'''
This script reads the the universities ranking csv and 
filters it by using the eu_country_codes csv file.

The EU universities are then saved in th Universities_ranking_filtered.csv

REQUIREMENTS
- have eu_country_codes.csv and 2024_QS_World_university_rankings.csv
  in the /datasets folder

'''

import pandas as pd

df = pd.read_csv("datasets/eu_country_codes.csv")
country_codes = df["Country codes"].tolist()

df = pd.read_csv("datasets/2024_QS_World_university_rankings.csv")
mask = df["Country Code"].isin(country_codes)

filtered_df = df[mask]

filtered_df.to_csv("datasets/Universities_ranking_filtered.csv", index=False)

print("Filtering finished.")
