import pandas as pd
df = pd.read_excel("eu_country_codes.xlsx")

country_codes = df["AT"].tolist()
print(country_codes)

df = pd.read_csv("kaggle_qs_v1.csv")

mask = df["Country Code"].isin(country_codes)

filtered_df = df[mask]

filtered_df.to_csv("kaggle_qs.csv", index=False)