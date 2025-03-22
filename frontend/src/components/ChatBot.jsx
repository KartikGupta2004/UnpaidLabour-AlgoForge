import React, { useState } from 'react';
// import { FaPaperPlane, FaCommentAlt } from 'react-icons/fa';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import '../ChatBot.css';

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, user: true }];
      setMessages(newMessages);
      setInput('');

      try {
        setLoading(true);
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [{
              parts: [{
                text: `This app is called FoodHero. If the user's query is related to food, health, donation, or food donation, provide a detailed response using your knowledge. Otherwise, respond with 'I'm here to help with food, health, and donation-related topics only!'. This Chatbot is used for FoodHero Website which provides features like a marketplace for buying food someone has rejected, for food donation and like saving food that goes to waste, whenever a person queries you can sometimes tell about how FoodHero can help the user with that . User query: ${input}`
              }]
            }]
          }
        );
        const botResponse = response.data.candidates[0].content.parts[0].text;
        setLoading(false);
        setMessages([...newMessages, { text: botResponse, user: false }]);
      } catch (error) {
        console.error('Error sending message:', error);
        setLoading(false);
        setMessages([...newMessages, { text: 'Error: Could not get response from AI', user: false }]);
      }
    }
  };

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
                <div key={index} className={msg.user ? 'message user' : 'message bot'}>
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
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button className="send-button" onClick={handleSendMessage}>
                {/* <FaPaperPlane /> */}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="chat-icon" onClick={toggleChat}>
        {/* <FaCommentAlt /> */}
      </div>
    </>
  );
}

export default ChatBot;
