import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv("../datasets/01_Universities_ranking_filtered.csv")

country_counts = df['Country Code'].value_counts().reset_index()
country_counts.columns = ['Country Code', 'Number of Universities']

country_counts = country_counts.sort_values(by='Number of Universities', ascending=False)

plt.figure(figsize=(12, 6))
bars = plt.bar(country_counts['Country Code'], country_counts['Number of Universities'], color='teal')
plt.xlabel('Country Code')
plt.ylabel('Number of Universities')
plt.title('Number of Universities per Country')
plt.xticks(rotation=90)

for bar in bars:
    height = bar.get_height()
    plt.annotate(f'{height}', xy=(bar.get_x() + bar.get_width() / 2, height), xytext=(0, 3),
                 textcoords='offset points', ha='center', va='bottom')

plt.tight_layout()
plt.savefig("../img/number_of_universities_per_country.png")
plt.show()