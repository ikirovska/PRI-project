import folium
import pandas as pd

csv_file_path = "../datasets/06_Universities_ranking_filtered_with_coordinates.csv"
data = pd.read_csv(csv_file_path)

m = folium.Map(location=[50, 10], zoom_start=4)

def add_pinpoint(row):
    if pd.notnull(row['Latitude']) and pd.notnull(row['Longitude']):
        folium.Marker(
            location=[row['Latitude'], row['Longitude']],
            popup=row['Institution Name'],
            icon=folium.Icon(icon='university', prefix='fa'),
        ).add_to(m)

data.apply(add_pinpoint, axis=1)

m.save('../img/universities_map.html')

# Print the HTML content of the map
with open(map_html, 'r') as file:
    html_content = file.read()
    print(html_content)

print("Map saved as universities_map.html")
