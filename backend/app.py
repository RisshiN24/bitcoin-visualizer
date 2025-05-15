from flask import Flask, jsonify
from flask_cors import CORS
import requests

# Create app
app = Flask(__name__)
CORS(app)

# Homepage
@app.route('/api/price', methods=['GET'])
def price():
    api_url = "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&names=Bitcoin"
    headers = {
        "accept": "application/json",
        "x-cg-api-key": "CG-v4EtNxd9NxhGSUtD9czxtg38"
    }

    # Get price
    response = requests.get(api_url, headers=headers)
    print(response.text)

    # Return json of response
    return jsonify(response.text)

if __name__ == '__main__':
    app.run(port=5000)