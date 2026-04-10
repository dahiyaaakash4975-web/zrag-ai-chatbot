from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# IMPORTANT: allow all origins
CORS(app)

@app.route("/")
def home():
    return "ZRAG Backend Live"

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json(force=True)
        user_input = data.get("message", "")

        reply = f"AI Response: {user_input}"

        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# IMPORTANT for Render
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)