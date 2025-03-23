import React, { useState, useEffect } from "react";
import PriceAI from "./PriceAI";
import { IoAdd } from "react-icons/io5";

function AddItems() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [price, setPrice] = useState("");
  const [itemType, setItemType] = useState("perishable");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "John Doe",
    address: "123 Main St, City",
    contact: "+123456789",
  });

  useEffect(() => {
    setTimeout(() => {
      setUserDetails({
        name: "Jane Doe",
        address: "456 Elm St, Town",
        contact: "+987654321",
      });
    }, 1000);
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        sessionStorage.setItem("uploadedImage", reader.result);
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (query.trim() === "") return;
    const timeout = setTimeout(() => {
      setSubmittedQuery(query);
      setPrice("");
    }, 2000);
    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div>
      {/* Floating Add Button */}
      <button
        className="fixed bottom-21 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
        onClick={() => setIsOpen(true)}
      >
        <IoAdd size={24} />
      </button>

      {/* Pop-up Form Window */}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-0 backdrop-blur-sm"
          onClick={() => setIsOpen(false)} // Close on background click
        >
          <div
            className="bg-white shadow-xl rounded-lg p-6 w-3/4 max-w-lg relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
              Upload Item & Get Suggested Price
            </h2>

            {/* User Details */}
            <div className="bg-gray-100 p-3 rounded-lg mb-4 shadow-sm">
              <p className="text-gray-700"><strong>Name:</strong> {userDetails.name}</p>
              <p className="text-gray-700"><strong>Address:</strong> {userDetails.address}</p>
              <p className="text-gray-700"><strong>Contact:</strong> {userDetails.contact}</p>
            </div>

            {/* File Upload */}
            <label className="block text-gray-700 font-medium mb-2">Upload Image:</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400" />

            {/* Display Selected Image */}
            {image && (
              <div className="mb-4 flex justify-center">
                <img src={image} alt="Uploaded preview" className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300 shadow-md" />
              </div>
            )}

            {/* Item Name */}
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
              placeholder="Enter item name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {/* Item Type Dropdown */}
            <select
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-white shadow-sm focus:ring-2 focus:ring-blue-400"
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
            >
              <option value="perishable">Perishable</option>
              <option value="non-perishable">Non-Perishable</option>
            </select>

            {/* Quantity */}
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
              placeholder="Enter quantity..."
              value={quantity}
              min="1"
              onChange={(e) => setQuantity(e.target.value)}
            />

            {/* Description */}
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
              placeholder="Enter description..."
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            {/* Suggested Price & Confirm Button */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-lg font-semibold text-blue-700">
                {submittedQuery && <p>Suggested Price: {price || "Fetching..."}</p>}
              </div>
              <button className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calls PriceAI with query and callback */}
      {submittedQuery && <PriceAI query={submittedQuery} onPriceFetched={setPrice} />}
    </div>
  );
}

export default AddItems;
