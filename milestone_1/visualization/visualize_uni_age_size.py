import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv('../datasets/01_Universities_ranking_filtered_cleaned.csv')

size_order = ['XL', 'L', 'M', 'S']

age_order = [1, 2, 3, 4, 5]

palette = ["#D0E0E3", "#A2C4C9", "#76A5AF", "#45818E", "#134F5C"]

sns.set_style("whitegrid")
plt.figure(figsize=(10, 6))
sns.countplot(data=df, x='SIZE', hue='AGE', order=size_order, hue_order=age_order, palette=sns.color_palette(palette, 5))

plt.xlabel('University Size')
plt.ylabel('Count')
plt.title('Distribution of University Sizes by Age Category')

plt.legend(title='Age Category', loc='upper right')

plt.savefig("../img/university_size_age_countplot.png")

plt.show()
