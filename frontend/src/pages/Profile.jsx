import React, { useEffect, useState } from "react";
import axios from "axios";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
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
      }
    };

    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="mb-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Contact:</strong> {user.contact}</p>
        <p><strong>Address:</strong> {user.location}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-xl font-semibold">Statistics</h3>
        <p><strong>Orders Served:</strong> {user.OrdersServed}</p>
        <p><strong>Orders Received:</strong> {user.OrdersReceived}</p>
        <p><strong>Donations Served:</strong> {user.DonationsServed}</p>
        <p><strong>Reward Points:</strong> {user.reward}</p>
      </div>
      <a href="/updateProfile" className="bg-blue-500 text-white px-4 py-2 rounded-md">Edit Profile</a>
    </div>
  );
};

export default ProfilePage;
