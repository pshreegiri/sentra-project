import { useState, useRef, useEffect } from "react";
import "../pages/Chatbot.css";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi 👋 How can I help you?" },
  ]);
  const [input, setInput] = useState("");

  // 👉 reference for auto-scroll
  const chatEndRef = useRef(null);

  // 👉 auto scroll when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
  if (!input.trim()) return;

  // show user message instantly
  setMessages((prev) => [...prev, { sender: "user", text: input }]);

  try {
    const response = await fetch(
      "http://localhost:5000/api/chatbot/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      }
    );

    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: data.reply },
    ]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "Server error. Please try again later.",
      },
    ]);
  }

  setInput("");
};


  return (
    <>
      {/* Floating Button */}
      <button className="chatbot-btn" onClick={() => setOpen(!open)}>
        🤖
      </button>

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">Sentra Support</div>

          <div className="chatbot-body">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.sender}`}>
                {m.text}
              </div>
            ))}

            {/* 👇 auto-scroll target */}
            <div ref={chatEndRef} />
          </div>

          <div className="chatbot-footer">
            <input
              type="text"
              placeholder="Type here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
