from flask import Flask, jsonify
from flask_cors import CORS
import requests
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from urllib.parse import quote

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/price', methods=['GET'])
def price():
    # Get current time
    now = datetime.now(timezone.utc)
    print(now)

    # Subtract 60 minutes
    sixty_minutes_ago = now - timedelta(minutes=60)

    # Convert to ISO format
    # Format time correctly for Alpaca: RFC3339 with no microseconds
    start_time = sixty_minutes_ago.replace(microsecond=0).isoformat().replace('+00:00', 'Z')

    # URL encode the time string
    encoded_start = quote(start_time)

    # Construct API URL
    api_url = (
        f"https://data.alpaca.markets/v1beta3/crypto/us/bars"
        f"?symbols=BTC%2FUSD&timeframe=1Min&sort=asc&start={encoded_start}"
    )

    headers = {"accept": "application/json"}

    response = requests.get(api_url, headers=headers)

    print(response.text)

    return jsonify(response.text)

if __name__ == '__main__':
    app.run(port=5000)
