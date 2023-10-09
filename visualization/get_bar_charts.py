import matplotlib.pyplot as plt
import pandas as pd

#Get data
csv_file_path = "datasets/raw_data.csv"
raw_data = pd.read_csv(csv_file_path)
total_uni_list = raw_data['Institution Name'].tolist()
#first value is 'institution'
total_number_uni = len(total_uni_list) - 1
csv_file_path = "datasets/full_list.csv"
retrieved_data = pd.read_csv(csv_file_path)
retrieved_uni_list = retrieved_data['Institution Name'].tolist()
retrieved_number_uni = len(retrieved_uni_list)
print(total_number_uni,retrieved_number_uni)

#Draw bar chart
data = {
    'Categories': ['All universities', 'Retrieved universities'],
    'Values': [total_number_uni, retrieved_number_uni]
}

df = pd.DataFrame(data)
categories = df['Categories']
values = df['Values']

plt.bar(categories, values, color='teal')

#Set y-ticks starting from 0 to the maximum value in the data
plt.yticks(range(0, max(values) + 1, 100))

for i in range(len(categories)):
        plt.text(i, values[i], values[i], ha = 'center')

plt.xlabel('Categories')
plt.ylabel('Values')
#plt.title('')

plt.show()
plt.savefig('all_vs_retrieved_unis.png')