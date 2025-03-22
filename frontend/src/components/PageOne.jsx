import React, { useState, useEffect } from "react";
import PriceAI from "./PriceAI";

function PageOne() {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [price, setPrice] = useState("");
  const [itemType, setItemType] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  // Function to detect input typing and trigger fetch after 5s
  useEffect(() => {
    if (query.trim() === "") return;
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      setSubmittedQuery(query);
      setPrice(""); // Clear previous price
    }, 2000); // Wait 5 seconds before triggering search

    setTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-4">Upload Item & Get Suggested Price</h2>

        {/* File Upload */}
        <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />

        {/* Item Name */}
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter item name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* Item Type */}
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter item type..."
          value={itemType}
          onChange={(e) => setItemType(e.target.value)}
        />

        {/* Description */}
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter description..."
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {/* Display Selected Image */}
        {image && (
          <div className="mb-4">
            <p className="text-sm text-gray-500">Selected Image:</p>
            <img src={URL.createObjectURL(image)} alt="Uploaded preview" className="w-32 h-32 object-cover rounded" />
          </div>
        )}
      </div>

      {/* Suggested Price */}
      <div className="mt-6 text-xl font-semibold">
        {submittedQuery && <p>Suggested Price: {price || "Fetching..."}</p>}
      </div>

      {/* Calls PriceAI with query and callback */}
      {submittedQuery && <PriceAI query={submittedQuery} onPriceFetched={setPrice} />}
    </div>
  );
}

export default PageOne;
