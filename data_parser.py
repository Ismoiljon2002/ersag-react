from bs4 import BeautifulSoup
import json
import uuid

# Provide the path to your local HTML file
file_path = r'C:\Users\ismoi\Downloads\ersag.html'

# Try using a different encoding, like 'ISO-8859-1' or 'cp1252'
with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
    html_content = file.read()
    
soup = BeautifulSoup(html_content, 'html.parser')

# Extracted price of the products
prices = soup.find_all('span', class_='price-new')
extracted_prices = []

for price in prices:
    number_part = price.text.split('=')[1].strip().split()[0]
    extracted_prices.append(number_part)
# print(extracted_prices)

# Extracted codes of the products
codes = soup.find_all('span', class_='ml-1')
codes = [code.text for code in codes]
# print(codes)

# Extracted name of the product
product_names = soup.find_all('h6', class_="title text-dots")
product_names = [name.text for name in product_names ]  
# print(product_names)


# Combine the lists into a list of dictionaries
combined = [
    {
        "id": str(uuid.uuid4()), 
        "name": name,
        "price": price,
        "code": code
    }
    for name, price, code in zip(product_names, extracted_prices, codes)
]

# Convert to JSON format
json_output = json.dumps(combined, indent=4)

# Save the JSON data to a file
with open('./src/products.json', 'w', encoding='utf-8') as file:
    file.write(json_output)