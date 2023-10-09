import matplotlib.pyplot as plt
import pandas as pd

#Get data
df = pd.read_excel("datasets/EU country codes.xlsx")
country_names = df["Country"].tolist()
country_codes = df["Country codes"].tolist()
country_code_name = [(country_codes[i], country_names[i]) for i in range(min(len(country_names), len(country_codes)))]
unis_per_country = [ (country, 0) for country in country_codes]

df = pd.read_csv("datasets/full_list.csv")
countries = df['Country Code'].tolist()

for country in countries:
    unis_per_country = [(code, i + 1) if code == country else (code, i) for code, i in unis_per_country]

#keep only countries with univerisities
unis_per_country = [tuple for tuple in unis_per_country if tuple[1] != 0]

#Draw bar chart
data = {
    'Countries': [tuple[0] for tuple in unis_per_country],
    'Values': [tuple[1] for tuple in unis_per_country]
}

df = pd.DataFrame(data)
countries = df['Countries']
values = df['Values']

#filter country_code_name so we have only the countries with unis
country_code_name = [tuple for tuple in country_code_name if tuple[0] in countries.tolist()]
plt.bar(countries, values, color='teal')

#Set y-ticks starting from 0 to the maximum value in the data
plt.yticks(range(0, max(values) + 1, 100))
plt.xticks(countries, rotation='vertical')
for i in range(len(countries)):
        plt.text(i, values[i], values[i], ha = 'center')

plt.xlabel('Countries')
plt.ylabel('Number of universities')

plt.show()
plt.savefig('unis_per_country.png')