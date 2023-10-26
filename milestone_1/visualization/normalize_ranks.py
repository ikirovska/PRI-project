# Normalization of the ranks
import pandas as pd
import numpy as np

df = pd.read_csv("../datasets/01_Universities_ranking_filtered.csv")


def clean_and_format_rank(rank_value):
    if isinstance(rank_value, str):
        rank_value = rank_value.replace('=', '').replace('+', '')
        if '-' in rank_value:
            rank_value = rank_value.split('-')[0]
        return int(rank_value)
    elif np.isnan(rank_value):
        return None
    else:
        return int(rank_value)


df['2024 RANK'] = df['2024 RANK'].apply(clean_and_format_rank)
df['2023 RANK'] = df['2023 RANK'].apply(clean_and_format_rank)
df.to_csv("01_Universities_ranking_filtered_cleaned.csv", index=False)
