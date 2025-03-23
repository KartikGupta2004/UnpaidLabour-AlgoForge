import React, { useState, useEffect } from "react";
import PriceAI from "./PriceAI";
import { IoAdd } from "react-icons/io5";
import axios from "axios";

function AddItems({name, contact, address, id}) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [price, setPrice] = useState("");
  const [itemType, setItemType] = useState("Perishable");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const [errors,setErrors] = useState(false)
  const [listingType, setListingType] = useState("Marketplace");
  // const [userDetails, setUserDetails] = useState({
  //   name: "John Doe",
  //   address: "123 Main St, City",
  //   contact: "+123456789",
  // });

  // useEffect(() => {
  //   setTimeout(() => {
  //     setUserDetails({
  //       name: "Jane Doe",
  //       address: "456 Elm St, Town",
  //       contact: "+987654321",
  //     });
  //   }, 1000);
  // }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!query.trim()) newErrors.query = "Item name is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (quantity <= 0) newErrors.quantity = "Quantity must be at least 1.";
    if (!contact.trim()) newErrors.contact = "Contact is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
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
      console.log(price,"yeloooooooooooooooo")
    }, 2000);
    return () => clearTimeout(timeout);
  }, [query]);
  
  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };
  
  const photoUpload = async () => {
    if (!photo || typeof photo === "string") return photoURL;

    const formData = new FormData();
    formData.append("file", photo);
    try {
      const upload = await axios.post(
        "http://localhost:5000/users/upload_photo",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Photo upload response:", upload);
      return upload.data.imageURL;
    } catch (e) {
      console.error("Error during photo upload:", e);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const uploadedPhotoURL = await photoUpload();
      console.log("Uploaded Photo URL:", uploadedPhotoURL);
      setPhotoURL(uploadedPhotoURL);

      const newItem = {
        itemName: query,
        itemType,
        quantity,
        cost: price || 0,
        listingType,
        status: "Pending",
        receiverId: null,
        Description: description,
        listedById: id,
        listedByType: "individual",
        name,
        contact,
        location: address,
        expiryDate: itemType === "Perishable" ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) : null,
        rating: 3,
        photo: uploadedPhotoURL
      };
      console.log("\nKAAAAARTTIK",newItem);
      
      const response = await axios.post("http://localhost:5000/itemlist/addItem", newItem);
      console.log("Item added successfully:", response.data);
      alert("Item listed successfully!");
      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding item:", error);
      setErrors({ form: "Failed to add item. Please try again later." });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      {/* Floating Add Button */}
      <button
        className="fixed bottom-20 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all"
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
              <p className="text-gray-700"><strong>Name:</strong> { name}</p>
              <p className="text-gray-700"><strong>Address:</strong> {address}</p>
              <p className="text-gray-700"><strong>Contact:</strong> {contact}</p>
            </div>

            {/* File Upload */}
            <div className="">
                <label htmlFor="logo">Upload Image:</label>
                <input
                  type="file"
                  id="logo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className=""
                />
                {photoURL && (
                  <img
                    src={photoURL}
                    alt="Photo Preview"
                    className=""
                  />
                )}
              </div>

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
              <option value="Perishable">Perishable</option>
              <option value="Non-Perishable">Non-Perishable</option>
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
              <input type="text" className="p-2 border b-2"
              placeholder={submittedQuery && `Suggested Price: ${price || "Fetching..."}`}
              onChange={(e)=>setPrice = e.target.value}
              />
              <button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all">
              {isLoading ? "Submitting..." : "Confirm"}
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
