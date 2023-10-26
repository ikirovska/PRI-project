import folium
from folium.plugins import HeatMap
import pandas as pd

# Load the dataset with university coordinates
csv_file_path = "../datasets/06_Universities_ranking_filtered_with_coordinates.csv"
data = pd.read_csv(csv_file_path)

# Create a map centered around Europe
m = folium.Map(location=[50, 10], zoom_start=4)  # You can adjust the center and zoom level as needed

# Create a list of university locations as [latitude, longitude] pairs
locations = data[['Latitude', 'Longitude']].dropna().values.tolist()

# Create a HeatMap layer with the university locations
HeatMap(locations).add_to(m)

# Save the map to an HTML file
m.save('../img/universities_heatmap.html')

print("Heatmap saved as universities_heatmap.html")
