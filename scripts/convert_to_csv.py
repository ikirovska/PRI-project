import pandas as pd
# Read Excel file with UTF-8 encoding
excel_file = pd.read_excel("datasets/full_list.xlsx")

# Save as CSV with UTF-8 encoding
excel_file.to_csv('datasets/full_list.csv', encoding='utf-8', index=False)