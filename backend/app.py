from flask import Flask, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from urllib.parse import quote
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# === Price API ===
@app.route('/api/price/<symbol>/<minutes>', methods=['GET'])
def price(symbol, minutes):
    try:
        now = datetime.now(timezone.utc)
        n_minutes_ago = now - timedelta(minutes=int(minutes))
        start_time = n_minutes_ago.replace(microsecond=0).isoformat().replace('+00:00', 'Z')
        encoded_start = quote(start_time)

        api_url = (
            f"https://data.alpaca.markets/v1beta3/crypto/us/bars"
            f"?symbols={symbol}%2FUSD&timeframe=1Min&sort=asc&start={encoded_start}"
        )

        headers = {"accept": "application/json"}
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()

        return jsonify(response.json())

    except Exception as e:
        print("Error fetching price data:", e)
        return jsonify({"error": "Failed to fetch price data"}), 500


# === News API ===
@app.route('/api/news/<symbol>', methods=['GET'])
def news(symbol):
    API_KEY = os.getenv('GNEWS_API_KEY')
    if not API_KEY:
        return jsonify({"error": "Missing API key"}), 500

    symbol_map = {
        "BTC": "bitcoin",
        "ETH": "ethereum",
        "DOGE": "dogecoin",
        "SHIB": "shiba inu",
        "SOL": "solana"
    }
    query = symbol_map.get(symbol.upper(), symbol.lower())

    url = f"https://gnews.io/api/v4/search?q={query}&lang=en&country=us&max=10&apikey={API_KEY}"

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        return jsonify(data["articles"])
    except requests.exceptions.RequestException as e:
        print("Error fetching news:", e)
        return jsonify({"error": "Failed to fetch news"}), 500


if __name__ == '__main__':
    app.run(port=5000)
