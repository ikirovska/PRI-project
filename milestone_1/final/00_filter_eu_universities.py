"""
This script reads the universities ranking csv and
filters it by using the eu_country_codes csv file.

The EU universities are then saved in the 01_Universities_ranking_filtered.csv

REQUIREMENTS
- have 00_eu_country_codes.csv and 00_2024_QS_World_university_rankings.csv
  in the /datasets folder
"""

import pandas as pd

df = pd.read_csv("../datasets/00_eu_country_codes.csv")
country_codes = df["Country codes"].tolist()

df = pd.read_csv("../datasets/00_2024_QS_World_university_rankings.csv")
mask = df["Country Code"].isin(country_codes)

filtered_df = df[mask]

filtered_df.to_csv("../datasets/01_Universities_ranking_filtered.csv", index=False)

print("Filtering finished.")
