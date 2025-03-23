import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatBot from "../components/ChatBot";

const ProfilePage = () => {
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
        const response = await axios.get("http://localhost:5000/users/getUserData", {
          headers: { Authorization: `Bearer ${authToken}`},
        });

        if (response.data.success) {
          setUser(response.data.user);
        } else {
          setError("Failed to load profile. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authToken]);

  const completeTransaction = async (transactionId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/transactions/complete/${transactionId}`,
        {}, // No request body needed, transactionId is in params
        {
          headers: { Authorization: `Bearer ${authToken}`},
        }
      );

      if (response.data.message) {
        alert("Transaction completed successfully! ✅");
        window.location.reload(); // Refresh the page to update status
      } else {
        alert("Failed to complete transaction.");
      }
    } catch (error) {
      console.error("Error completing transaction:", error);
      alert("Error completing transaction. Please try again.");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading profile...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-3xl w-full">
        
        {/* Profile Header with Circle Avatar */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md">
            {user.name ? user.name[0] : "?"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.name || "Unknown"}</h2>
            <p className="text-gray-600 capitalize">{user.role || "User"}</p>
          </div>
        </div>

        {/* User Info Section with Bubble Style */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-700">Personal Information</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
              <p><strong className="text-gray-700">Email:</strong> {user.email || "N/A"}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
              <p><strong className="text-gray-700">Contact:</strong> {user.contact || "N/A"}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
              <p><strong className="text-gray-700">Address:</strong> {user.location || "N/A"}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
              <p><strong className="text-gray-700">Reward Points:</strong> <span className="text-green-600 font-medium">{user.reward || 0}</span></p>
            </div>
          </div>
        </div>

        {/* User Statistics with Bubble Style */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-700">Statistics</h3>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
              <p><strong className="text-gray-700">Orders Served:</strong> <span className="text-green-600">{user.OrdersServed || 0}</span></p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
              <p><strong className="text-gray-700">Orders Received:</strong> <span className="text-green-600">{user.OrdersReceived || 0}</span></p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
              <p><strong className="text-gray-700">Donations Served:</strong> <span className="text-green-600">{user.DonationsServed || 0}</span></p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-200">
              <p><strong className="text-gray-700">Rating:</strong> <span className="text-green-600">⭐ {user.rating || 3}/5</span></p>
            </div>
          </div>
        </div>

        {/* Orders Placed Section with Bubble Style */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-700">Orders Placed</h3>
          {user.orders_placed.length > 0 ? (
            <ul className="mt-2 space-y-3">
              {user.orders_placed.map((order, index) => (
                <li key={index} className="border border-gray-200 p-3 rounded-lg bg-gray-50 hover:border-green-600 transition-colors shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p><strong className="text-gray-700">Order ID:</strong> {order.orderId?._id || "N/A"}</p>
                      <p><strong className="text-gray-700">Ordered At:</strong> {new Date(order.orderedAt).toLocaleString()}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white border border-gray-200 text-sm">
                      <span className={`font-medium ${
                        order.status === "Completed" ? "text-green-600" : 
                        order.status === "Pending" ? "text-yellow-600" : "text-gray-600"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p><strong className="text-gray-700">Food Items:</strong></p>
                    <ul className="ml-4 text-gray-600">
                      {order.foodItems.map((item, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                          {item.foodName} ({item.quantity})
                        </li>
                      ))}
                    </ul>
                  </div>

                  {order.status === "Pending" && (
                    <button
                      onClick={() => completeTransaction(order.orderId?._id)}
                      className="mt-3 bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 shadow-sm"
                    >
                      Complete Transaction
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No orders placed yet.</p>
          )}
        </div>

        {/* Orders Received Section with Bubble Style */}
        <div className="mt-6 border-t border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-700">Orders Received</h3>
          {user.orders_received.length > 0 ? (
            <ul className="mt-2 space-y-3">
              {user.orders_received.map((order, index) => (
                <li key={index} className="border border-gray-200 p-3 rounded-lg bg-gray-50 hover:border-green-600 transition-colors shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <p><strong className="text-gray-700">Order ID:</strong> {order.orderId?._id || "N/A"}</p>
                      <p><strong className="text-gray-700">Ordered At:</strong> {new Date(order.orderedAt).toLocaleString()}</p>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-white border border-gray-200 text-sm">
                      <span className={`font-medium ${
                        order.status === "Completed" ? "text-green-600" : 
                        order.status === "Pending" ? "text-yellow-600" : "text-gray-600"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <p><strong className="text-gray-700">Food Items:</strong></p>
                    <ul className="ml-4 text-gray-600">
                      {order.foodItems.map((item, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                          {item.foodName} ({item.quantity})
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No orders received yet.</p>
          )}
        </div>

        {/* Edit Profile Button with Bubble Style */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/updateProfile")}
            className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 shadow-sm"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Chatbot Positioned in Bottom Right */}
      <div className="fixed bottom-4 right-4 z-50">
        <ChatBot />
      </div>
    </div>
  );
};

export default ProfilePage;