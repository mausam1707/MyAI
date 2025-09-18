from flask import Flask, render_template, request, jsonify
import cohere
from config import COHERE_API_KEY

app = Flask(__name__, static_folder='static')
co = cohere.Client(COHERE_API_KEY)

# Global memory (resets only when server restarts)
conversation_history = []

@app.route("/")
def home():
    global conversation_history
    conversation_history = []  # clear memory on page reload
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    global conversation_history
    user_message = request.json.get("message")
    text = user_message.lower()

    # Save user message
    conversation_history.append({"role": "user", "message": user_message})

    if any(keyword in text for keyword in [
        "who created you",
        "who made you",
        "your creator",
        "who developed you",
        "who built you",
        "who make you",
        "who developed you",
        "Who is your creator",
        "Who is your developer",
        "who is behind you"
    ]):
        answer = "I was created by Mausam Chaudhary."
    elif "who is mausam chaudhary" in text:
        answer = (
            'Mausam Chaudhary is the creator and developer of this AI chatbot, Veda. '
            'You can visit his LinkedIn profile from the link given in bottom.'
        )
    elif "who is mausam" in text:
        answer = (
            'Mausam Chaudhary is the creator and developer of this AI chatbot, Veda. '
            'You can visit his LinkedIn profile from the link given in bottom.'
        )
    elif "What is your name" in text or "who are you" in text:
        answer = ("My name is Veda. I'm an AI chatbot created to assist you."
        )

    else:
        try:
            # Send full conversation to Cohere
            response = co.chat(
                chat_history=[{"role": msg["role"], "message": msg["message"]} for msg in conversation_history],
                message=user_message,
                model="command-a-03-2025",
                temperature=0.3
            )
            answer = response.text

            # Save bot reply
            conversation_history.append({"role": "chatbot", "message": answer})

        except Exception as e:
            answer = f"Error: {str(e)}"

    return jsonify({"reply": answer})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)
