import matplotlib.pyplot as plt
import pandas as pd

# Get raw data (from Kaggle)
csv_file_path = "../datasets/00_2024_QS_World_university_rankings.csv"
raw_data = pd.read_csv(csv_file_path)
total_uni_list = raw_data['Institution Name'].tolist()

# First value is 'institution'
total_number_uni = len(total_uni_list) - 1
csv_file_path = "../datasets/01_Universities_ranking_filtered_cleaned.csv"
retrieved_data = pd.read_csv(csv_file_path)
retrieved_uni_list = retrieved_data['Institution Name'].tolist()
retrieved_number_uni = len(retrieved_uni_list)
print(total_number_uni,retrieved_number_uni)

# Draw bar chart
data = {
    'Categories': ['All universities', 'Retrieved universities'],
    'Values': [total_number_uni, retrieved_number_uni]
}

df = pd.DataFrame(data)
categories = df['Categories']
values = df['Values']

plt.bar(categories, values, color='teal')

plt.yticks(range(0, max(values) + 1, 100))

for i in range(len(categories)):
        plt.text(i, values[i], values[i], ha = 'center')

plt.xlabel('Categories')
plt.ylabel('Values')

plt.show()
plt.savefig('../img/all_vs_retrieved_unis.png')