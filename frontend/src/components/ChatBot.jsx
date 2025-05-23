import React, { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "../ChatBot.css";
import { useEffect } from "react";

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
      const fetchProfile = async () => {
        try {
          const response = await axios.get("http://localhost:5000/users/getUserData", {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          setUser(response.data.user);
          console.log(response.data)
        } catch (error) {
          console.error("Error fetching profile:", error);
          setError("Failed to load profile. Please try again later.");
        }
      };
  
      fetchProfile();
    }, []);
  
  const fetchChatbotResponse = async () => {
    if (!input.trim()) return; // Prevent empty messages

    const newMessages = [...messages, { text: input, user: true }];
    setMessages(newMessages);
    setInput("");

    try {
      setLoading(true);

      const userId = user._id || "67defe62390df5253f109d11"; // Ensure userId exists
      console.log(userId,"wellllllllllllll\n\n")
      // ✅ Step 1: Send query to backend (Agentic Workflow)
      const response = await axios.post("http://localhost:5000/chatBot/chat", {
        query: input,
        userId: userId,
      });

      const botResponse = response.data.reply;

      // ✅ Step 2: Add bot's reply to chat history
      setMessages([...newMessages, { text: botResponse, user: false }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages([...newMessages, { text: "Error: Could not fetch response", user: false }]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle Chatbot Visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>FoodHero ChatBot</span>
            <button className="close-button" onClick={toggleChat}>X</button>
          </div>

          <div className="chat-box">
            <div className="messages">
              {messages.map((msg, index) => (
                <div key={index} className={msg.user ? "message user" : "message bot"}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ))}
              {loading && <div className="loading">Loading...</div>}
            </div>

            <div className="input-container">
              <input
                type="text"
                className="chat-input"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && fetchChatbotResponse()}
              />
              <button className="send-button" onClick={fetchChatbotResponse}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="chat-icon" onClick={toggleChat}>
        💬
      </div>
    </>
  );
}

export default ChatBot;
