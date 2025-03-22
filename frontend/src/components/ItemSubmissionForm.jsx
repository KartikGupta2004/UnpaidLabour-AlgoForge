import React, { useState, useEffect } from "react";
import axios from "axios";

const ItemSubmissionForm = () => {
  const [user, setUser] = useState({ name: "", location: "" });
  const [formData, setFormData] = useState({
    itemName: "",
    itemType: "Perishable",
    description: "",
    quantity: 1,
    image: null,
  });

  const hardcodedUserId = "67deb786e228a44f1aa0edc4"; // Replace with a valid MongoDB ID

  useEffect(() => {
    axios.get(`/api/individualusers/${hardcodedUserId}`)
      .then((response) => {
        setUser({ name: response.data.name, location: response.data.location });
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("itemName", formData.itemName);
    data.append("itemType", formData.itemType);
    data.append("description", formData.description);
    data.append("quantity", formData.quantity);
    data.append("image", formData.image);
    data.append("listedById", hardcodedUserId);
    data.append("listedByType", "Individual");
    
    try {
      await axios.post("/api/itemList", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Item listed successfully!");
      setFormData({ itemName: "", itemType: "Perishable", description: "", quantity: 1, image: null });
    } catch (error) {
      console.error("Error listing item:", error);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">List an Item</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Location:</strong> {user.location}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="file" onChange={handleFileChange} required className="block w-full" />
        <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} placeholder="Item Name" required className="block w-full p-2 border" />
        <select name="itemType" value={formData.itemType} onChange={handleChange} className="block w-full p-2 border">
          <option value="Perishable">Perishable</option>
          <option value="Non-Perishable">Non-Perishable</option>
        </select>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="block w-full p-2 border"></textarea>
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" required className="block w-full p-2 border" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Confirm</button>
      </form>
    </div>
  );
};

export default ItemSubmissionForm;
