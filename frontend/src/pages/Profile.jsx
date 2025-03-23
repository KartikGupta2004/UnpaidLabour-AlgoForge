import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ChatBot from "../components/ChatBot";

const ProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!authToken) {
      setError("Unauthorized. Please log in.");
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/view_profile/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, authToken]);

  if (loading)
    return <p className="text-center text-gray-500">Loading profile...</p>;

  if (error)
    return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full">
        
        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
            {user.name ? user.name[0] : "?"} {/* First letter of name or '?' */}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.name || "Unknown"}</h2>
            <p className="text-gray-600 capitalize">{user.role || "User"}</p>
          </div>
        </div>

        {/* User Info Section */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <p><strong>Email:</strong> {user.email || "N/A"}</p>
            <p><strong>Contact:</strong> {user.contact || "N/A"}</p>
            <p><strong>Address:</strong> {user.location || "N/A"}</p>
            <p><strong>Reward Points:</strong> {user.reward || 0}</p>
          </div>
        </div>

        {/* User Statistics */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-700">Statistics</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <p><strong>Orders Served:</strong> {user.OrdersServed || 0}</p>
            <p><strong>Orders Received:</strong> {user.OrdersReceived || 0}</p>
            <p><strong>Donations Served:</strong> {user.DonationsServed || 0}</p>
            <p><strong>Rating:</strong> ⭐ {user.rating || 3}/5</p>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/updateProfile")}
            className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-semibold"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* ✅ Chatbot Positioned in Bottom Right */}
      <div className="fixed bottom-4 right-4 z-50">
        <ChatBot />
      </div>
    </div>
  );
};

export default ProfilePage;
