async function sendMessage() {
  const msgInput = document.getElementById("message");
  const chatBox = document.getElementById("chat-box");
  const userMessage = msgInput.value.trim();
  if (!userMessage) return;

  // Show user message
  const userDiv = document.createElement("div");
  userDiv.className = "message user";
  userDiv.innerText = userMessage;
  chatBox.appendChild(userDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  msgInput.value = "";

  // Send to backend
  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });
    const data = await res.json();

    // Show bot response
    const botDiv = document.createElement("div");
    botDiv.className = "message bot";
    botDiv.innerText = data.reply;
    chatBox.appendChild(botDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "message bot";
    errorDiv.innerText = "Error connecting to server.";
    chatBox.appendChild(errorDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

// Button click
document.getElementById("sendBtn").addEventListener("click", sendMessage);

// Enter key
document.getElementById("message").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
