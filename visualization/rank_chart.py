# Normalization of the ranks
import pandas as pd
from normalize_ranks import clean_and_format_rank

df = pd.read_csv("../datasets/01_Universities_ranking_filtered.csv")

df['2024 RANK'] = df['2024 RANK'].apply(clean_and_format_rank)
df['2023 RANK'] = df['2023 RANK'].apply(clean_and_format_rank)
df.to_csv("01_Universities_ranking_filtered_cleaned.csv", index=False)

# Plot Rank Comparison 2024 vs 2023
import matplotlib.pyplot as plt

df['Rank Category'] = pd.cut(df['2024 RANK'] - df['2023 RANK'],
                             bins=[float('-inf'), -1, 1, float('inf')],
                             labels=["Lower Rank", "Same Rank", "Higher Rank"])  # Updated labels

rank_counts = df['Rank Category'].value_counts()

plt.bar(rank_counts.index, rank_counts.values, color=['teal', 'teal', 'teal'])

plt.ylabel('Number of Universities')
plt.savefig("../img/rank_comparison_plot.png")
plt.show()
