from flask import Flask, render_template, request, jsonify
import cohere
from config import COHERE_API_KEY

app = Flask(__name__, static_folder='static')
co = cohere.Client(COHERE_API_KEY)

@app.route("/")
def home():
    return render_template("index.html")  # Your chatbot UI

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    text = user_message.lower()

    # ✅ Custom rule for creator info
    if any(keyword in text for keyword in [
        "who created you",
        "who made you",
        "your creator",
        "who developed you",
        "who built you",
        "who is behind you"
    ]):
        answer = "I was created by Mausam Chaudhary."
    elif "who is mausam chaudhary" in text:
        answer = (
            'Mausam Chaudhary is the creator and developer of this AI chatbot, Veda. '
            'You can visit his LinkedIn profile from the link given in bottom.'
        )

    else:
        try:
            response = co.chat(
                message=user_message,
                model="command-r",
                temperature=0.3
            )
            answer = response.text
        except Exception as e:
            answer = f"Error: {str(e)}"

    return jsonify({"reply": answer})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)  # accessible on mobile too
