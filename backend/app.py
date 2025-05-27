from flask import Flask, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from urllib.parse import quote
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

# API endpoint to fetch price data
@app.route('/api/price/<symbol>/<minutes>', methods=['GET'])
def price(symbol, minutes):
    # Get current time
    now = datetime.now(timezone.utc)
    print(now)

    # Subtract n minutes
    n_minutes_ago = now - timedelta(minutes=int(minutes))

    # Convert to ISO format
    # Format time correctly for Alpaca: RFC3339 with no microseconds
    start_time = n_minutes_ago.replace(microsecond=0).isoformat().replace('+00:00', 'Z')

    # URL encode the time string
    encoded_start = quote(start_time)

    # Construct API URL
    api_url = (
        f"https://data.alpaca.markets/v1beta3/crypto/us/bars?symbols={symbol}%2FUSD&timeframe=1Min&sort=asc&start={encoded_start}"
    )

    print(api_url)

    headers = {"accept": "application/json"}

    response = requests.get(api_url, headers=headers)

    print(response.text)

    return jsonify(response.text)


@app.route('/api/news/<symbol>', methods=['GET'])
def news(symbol):
    # API_KEY = os.getenv('GNEWS_API_KEY')  # Your GNews key in .env
    # print(API_KEY)
    # if not API_KEY:
    #     return jsonify({"error": "Missing API key"}), 500

    symbol_map = {
        "BTC": "bitcoin",
        "ETH": "ethereum"
    }
    query = symbol_map.get(symbol.upper(), symbol.lower())

    url = f"https://gnews.io/api/v4/search?q={query}&lang=en&country=us&max=10&apikey=77510a4527e9163e3e9e5b72a26cdb9b"
    print(url)
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return jsonify(data["articles"])  # just return articles array
    except requests.exceptions.RequestException as e:
        print("Error fetching news:", e)
        return jsonify({"error": "Failed to fetch news"}), 500

if __name__ == '__main__':
    app.run(port=5000)
