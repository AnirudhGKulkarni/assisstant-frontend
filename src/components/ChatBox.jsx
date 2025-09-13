import { useState } from "react";

const API_URL = "https://assisstant-backend.onrender.com/api/ask"; 


export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages([...messages, newMessage]);
    const question = input;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      const aiMessage = { role: "assistant", content: data.answer || "No answer returned." };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Could not connect to backend. Check CORS or backend URL." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>AI Chat</h2>
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: "5px 0" }}>
            <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.content}
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me something..."
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={sendMessage} disabled={loading} style={{ padding: "8px 16px" }}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}
