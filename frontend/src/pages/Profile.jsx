import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatBot from "../components/ChatBot"; // ✅ Import ChatBot

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users/getUserData", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUser(response.data.users);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile. Please try again later.");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!user) return <p className="text-center text-gray-500">Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md relative">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      {/* User Details */}
      <div className="mb-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Contact:</strong> {user.contact}</p>
        <p><strong>Address:</strong> {user.location}</p>
      </div>

      {/* User Statistics */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Statistics</h3>
        <p><strong>Orders Served:</strong> {user.OrdersServed}</p>
        <p><strong>Orders Received:</strong> {user.OrdersReceived}</p>
        <p><strong>Donations Served:</strong> {user.DonationsServed}</p>
        <p><strong>Reward Points:</strong> {user.reward}</p>
      </div>

      <a href="/updateProfile" className="bg-blue-500 text-white px-4 py-2 rounded-md">Edit Profile</a>

      {/* ✅ Chatbot Positioned in Bottom Right */}
      <div className="fixed bottom-4 right-4 z-50">
        <ChatBot />
      </div>
    </div>
  );
};

export default ProfilePage;
