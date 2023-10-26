# Define the default target
all: ../datasets/06_Universities_ranking_filtered_with_coordinates.csv

# Task 1: Filter and Normalize European universities
../datasets/01_Universities_ranking_filtered.csv: ../datasets/00_2024_QS_World_university_rankings.csv ../datasets/00_eu_country_codes.csv 00_filter_eu_universities.py
    python3 00_filter_eu_universities.py

# Task 2: Get basic university data from Wikidata
../datasets/02_Universities_with_wikidata.csv: ../datasets/01_Universities_ranking_filtered_renamed.csv 01_get_basic_uni_data_from_wikidata.py
    python3 01_get_basic_uni_data_from_wikidata.py

# Task 3 : Get university city name, coordinates, and page data
../datasets/03_Universities_with_city_coords_and_wikipedia_page.csv: ../datasets/02_Universities_with_wikidata.csv 03_get_uni_city_coords_and_page_data.py
    python3 03_get_uni_city_coords_and_page_data.py
