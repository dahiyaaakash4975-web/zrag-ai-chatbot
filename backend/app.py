from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "ZRAG Backend Live"

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("message")

    # Demo response (for online)
    reply = f"AI Response: {user_input}"

    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)