from flask import Flask, render_template, request, jsonify
import cohere
from config import COHERE_API_KEY

app = Flask(__name__)
co = cohere.Client(COHERE_API_KEY)

@app.route("/")
def home():
    return render_template("index.html")  # Your chatbot UI

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    try:
        response = co.chat(
            message=user_message,
            model="command-r",  # "command-r" is stable; use "command" only if needed
            temperature=0.3
        )
        answer = response.text
    except Exception as e:
        answer = f"Error: {str(e)}"

    return jsonify({"reply": answer})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)  # accessible on mobile too
