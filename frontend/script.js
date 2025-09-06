let userName = "";
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Append messages
function appendMessage(message, className) {
  const msg = document.createElement("div");
  msg.className = `message ${className}`;
  msg.textContent = message;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Greeting
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

// Ask name first
function askUserName() {
  appendMessage("👋 Hi! What's your name?", "bot-message");
  userInput.disabled = false;
  sendBtn.disabled = false;
}

function handleUserName(input) {
  userName = input;
  appendMessage(userName, "user-message");
  appendMessage(`${getGreeting()}, ${userName}! How can I help you today?`, "bot-message");
}

// Send message
function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  if (!userName) {
    handleUserName(message);
    userInput.value = "";
    return;
  }

  appendMessage(message, "user-message");
  userInput.value = "";

  // Call backend
  fetch("http://127.0.0.1:5000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: message }),
  })
    .then((res) => res.json())
    .then((data) => {
      appendMessage(data.reply, "bot-message");
    })
    .catch(() => {
      appendMessage("⚠️ Error: Could not connect to server", "bot-message");
    });
}

// Events
sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Start chat
askUserName();
