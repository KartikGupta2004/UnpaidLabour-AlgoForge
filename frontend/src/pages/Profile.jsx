import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatBot from "../components/ChatBot";

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

  if (error) return <p className="text-red-500 text-center font-medium mt-8">{error}</p>;
  if (!user) return <p className="text-center text-gray-500 mt-8">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6" style={{backgroundImage: 'linear-gradient(to bottom right, #f3f4f6, #d1d5db)'}}>
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-gray-200 rounded-full opacity-30"></div>
        <div className="absolute top-32 -left-6 w-12 h-12 bg-gray-300 rounded-full opacity-20"></div>
        
        {/* Header with gradient */}
        <div className="relative overflow-hidden" style={{backgroundImage: 'linear-gradient(135deg,rgb(13, 155, 37),rgb(15, 148, 59))'}}>
          <div className="p-6 text-white relative z-10">
            <h2 className="text-2xl font-bold">Profile</h2>
            <p className="mt-1 text-green-100 opacity-90">Your account information</p>
          </div>
          {/* Abstract shapes */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10">
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white"></div>
            <div className="absolute bottom-2 left-12 w-20 h-8 rounded-full bg-white"></div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
        </div>
        
        <div className="p-6 space-y-5 bg-white">
          {/* User Details */}
          <div className="bg-gray-50 p-4 rounded-md border-l-4 border-green-500 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Personal Information</h3>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-800">{user.name}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-800">{user.email}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Contact:</span>
                <span className="font-medium text-gray-800">{user.contact}</span>
              </p>
              <p className="flex justify-between">
                
                <span className="text-gray-600">Address:</span>

                <span className="font-medium text-gray-800">{user.location}</span>
              </p>
            </div>
          </div>

          {/* User Statistics */}
          <div className="bg-gray-50 p-4 rounded-md border-l-4 border-green-500 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded shadow-sm">
                <p className="text-gray-500 text-sm">Orders Served</p>
                <p className="text-2xl font-bold text-gray-800">{user.OrdersServed}</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <p className="text-gray-500 text-sm">Orders Received</p>
                <p className="text-2xl font-bold text-gray-800">{user.OrdersReceived}</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <p className="text-gray-500 text-sm">Donations Served</p>
                <p className="text-2xl font-bold text-gray-800">{user.DonationsServed}</p>
              </div>
              <div className="bg-white p-3 rounded shadow-sm">
                <p className="text-gray-500 text-sm">Reward Points</p>
                <p className="text-2xl font-bold text-green-600">{user.reward}</p>
              </div>
            </div>
          </div>

          <a 
            href="/updateProfile" 
            className="inline-block px-5 py-2.5 rounded-md shadow-sm text-white font-medium transition-all duration-200 transform hover:-translate-y-0.5"
            style={{backgroundImage: 'linear-gradient(to right,rgb(27, 176, 74),rgb(18, 170, 58))'}}
          >
            Edit Profile
          </a>
          
          {/* Subtle footer with light gray text */}
          <div className="pt-2 text-center text-xs text-gray-400">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </div>
      
      {/* ✅ Chatbot Positioned in Bottom Right */}
      {/* <div className="fixed bottom-4 right-4 z-50">
        <ChatBot />
      </div> */}
    </div>
  );
};

export default ProfilePage;