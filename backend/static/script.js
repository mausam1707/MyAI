let userName = null;

function displayMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  msgDiv.innerText = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  const chatBox = document.getElementById("chat-box");
  const typingDiv = document.createElement("div");
  typingDiv.className = "message bot typing";
  typingDiv.innerText = "Typing...";
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return typingDiv;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  else if (hour < 18) return "Good afternoon";
  else return "Good evening";
}

async function sendMessage() {
  const msgInput = document.getElementById("message");
  const userMessage = msgInput.value.trim();
  if (!userMessage) return;

  displayMessage(userMessage, "user");
  msgInput.value = "";

  const typingDiv = showTyping();
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!userName) {
    typingDiv.remove();

    // Force name first, no guessing
    if (userMessage.split(" ").length === 1 && /^[a-zA-Z]+$/.test(userMessage)) {
      userName = userMessage;
      displayMessage(`${getGreeting()}, ${userName}! 😊 How can I help you today?`, "bot");
    } else {
      displayMessage("I just need your *name* first 🙂 Could you please type your name?", "bot");
    }
    return;
  }

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });
    const data = await res.json();

    typingDiv.remove();
    displayMessage(data.reply, "bot");
  } catch (err) {
    typingDiv.remove();
    displayMessage("⚠️ Error connecting to server.", "bot");
  }
}

document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("message").addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

window.onload = function () {
  displayMessage("Hi there! 👋 What's your name?", "bot");
};


document.getElementById("theme-toggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    this.textContent = document.body.classList.contains("dark-mode")
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
});

