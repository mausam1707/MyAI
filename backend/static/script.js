let userName = null;

// Show message in chatbox
function displayMessage(text, sender) {
  const chatBox = document.getElementById("chat-box");
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  msgDiv.innerText = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Typing indicator
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

  // Show user message
  displayMessage(userMessage, "user");
  msgInput.value = "";

  // Show typing indicator
  const typingDiv = showTyping();

  // Wait at least 1 second before bot responds
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (!userName) {
    // Remove typing
    typingDiv.remove();

    // First message is name
    userName = userMessage;
    displayMessage(`${getGreeting()}, ${userName}! 😊 How can I help you today?`, "bot");
    return;
  }

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });
    const data = await res.json();

    // Remove typing
    typingDiv.remove();

    // Show bot response
    displayMessage(data.reply, "bot");
  } catch (err) {
    typingDiv.remove();
    displayMessage("⚠️ Error connecting to server.", "bot");
  }
}

// Button click
document.getElementById("sendBtn").addEventListener("click", sendMessage);

// Enter key
document.getElementById("message").addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

// On first load
window.onload = function () {
  displayMessage("Hi there! 👋 What's your name?", "bot");
};

document.getElementById("theme-toggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    this.textContent = document.body.classList.contains("dark-mode")
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
});

