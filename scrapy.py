from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

app = Flask(__name__)
# Configure CORS to allow requests from Vite frontend
CORS(app, resources={
    r"/market_prices": {
        "origins": ["http://localhost:5173"],
        "methods": ["POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

def scrape_prices(crop_name):
    # Mock data fallback if scraping fails
    mock_prices = [
        {'location': 'Delhi', 'crop': 'Wheat', 'min_price': '2000', 'modal_price': '2200', 'max_price': '2400'},
        {'location': 'Guntur', 'crop': 'Wheat', 'min_price': '2100', 'modal_price': '2300', 'max_price': '2500'},
        {'location': 'Mumbai', 'crop': 'Wheat', 'min_price': '2050', 'modal_price': '2250', 'max_price': '2450'}
    ]

    try:
        # Set up Selenium with headless Chrome
        chrome_options = Options()
        chrome_options.add_argument('--headless')  # Run without opening browser
        chrome_options.add_argument('--disable-gpu')
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--disable-dev-shm-usage')
        chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')

        driver = webdriver.Chrome(options=chrome_options)
        
        # Navigate to e-NAM trade data page
        url = "https://enam.gov.in/web/dashboard/trade-data"  # Adjust if needed
        driver.get(url)
        
        # Wait for the page to load (adjust timeout as needed)
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "table"))
        )
        
        # Simulate selecting crop (if form exists)
        try:
            crop_input = driver.find_element(By.ID, "commodity-select")  # Hypothetical ID
            crop_input.send_keys(crop_name)
            submit_button = driver.find_element(By.ID, "submit-filter")  # Hypothetical ID
            submit_button.click()
            time.sleep(2)  # Wait for table to update
        except:
            print("No form input found, scraping table directly")

        # Find the price table
        prices = []
        table = driver.find_element(By.TAG_NAME, "table")
        rows = table.find_elements(By.TAG_NAME, "tr")
        
        for row in rows[1:]:  # Skip header row
            cells = row.find_elements(By.TAG_NAME, "td")
            if len(cells) >= 5:  # Assume: location, crop, min, modal, max
                scraped_crop = cells[1].text.strip().lower()
                if crop_name.lower() in scraped_crop:
                    price_data = {
                        'location': cells[0].text.strip(),
                        'crop': cells[1].text.strip(),
                        'min_price': cells[2].text.strip(),
                        'modal_price': cells[3].text.strip(),
                        'max_price': cells[4].text.strip()
                    }
                    prices.append(price_data)
        
        driver.quit()
        
        if not prices:
            print(f"No prices found for {crop_name}, returning mock data")
            return [price for price in mock_prices if crop_name.lower() == price['crop'].lower()]
        
        return prices
    
    except Exception as e:
        print(f"Error scraping prices: {e}")
        driver.quit()
        # Fallback to mock data
        return [price for price in mock_prices if crop_name.lower() == price['crop'].lower()]

@app.route('/market_prices', methods=['POST', 'OPTIONS'])
def get_market_prices():
    if request.method == 'OPTIONS':
        # Respond to preflight request
        return jsonify({}), 200

    data = request.get_json()
    crop_name = data.get('crop', '').strip()
    
    if not crop_name:
        return jsonify({'error': 'Crop name is required'}), 400

    prices = scrape_prices(crop_name)
    return jsonify({'prices': prices})

if __name__ == '__main__':
    app.run(port=5000, debug=True)