import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const countries = [
    { name: "India", code: "+91" },
    { name: "United States", code: "+1" },
    { name: "United Kingdom", code: "+44" },
    { name: "Canada", code: "+1" },
    { name: "Australia", code: "+61" },
    { name: "Germany", code: "+49" },
    { name: "France", code: "+33" },
    { name: "Japan", code: "+81" },
    { name: "China", code: "+86" },
    { name: "Brazil", code: "+55" },
    { name: "Russia", code: "+7" },
    { name: "Spain", code: "+34" },
    { name: "Italy", code: "+39" },
    { name: "South Africa", code: "+27" },
    { name: "Indonesia", code: "+62" },
    { name: "Philippines", code: "+63" },
    { name: "New Zealand", code: "+64" },
    { name: "Egypt", code: "+20" },
    { name: "Netherlands", code: "+31" },
    { name: "Sweden", code: "+46" },
    { name: "South Korea", code: "+82" },
    { name: "Singapore", code: "+65" },
    { name: "Portugal", code: "+351" },
    { name: "Turkey", code: "+90" },
    { name: "Iran", code: "+98" },
  ];
  
  const countryCodeLengths = {
    "+91": 10, // India
    "+1": 10, // USA/Canada
    "+44": 10, // United Kingdom
    "+61": 9,  // Australia
    "+81": 10, // Japan
    "+86": 11, // China
    "+33": 9,  // France
    "+49": 10, // Germany
    "+39": 10, // Italy
    "+34": 9,  // Spain
    "+7": 10,  // Russia
    "+55": 11, // Brazil
    "+27": 9,  // South Africa
    "+62": 10, // Indonesia
    "+63": 10, // Philippines
    "+64": 9,  // New Zealand
    "+20": 10, // Egypt
    "+31": 9,  // Netherlands
    "+46": 9,  // Sweden
    "+82": 10, // South Korea
    "+65": 8,  // Singapore
    "+351": 9, // Portugal
    "+90": 10, // Turkey
    "+98": 10, // Iran
  };

const UpdateProfile = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
    fssaiId: '',
    ngoId: '',
  });
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const authToken = localStorage.getItem("authToken");
  const role = localStorage.getItem("userType");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/users/getUserData", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        response.data.users.contact = response.data.users.contact.replace(/^\+\d+\s/, '');
        setProfile(response.data.users)
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const validatePhoneNumber = (phoneNumber, countryCode) => {
  
    // Check if phone number contains only numeric characters
    const numericPattern = /^\d+$/;
    if (!numericPattern.test(phoneNumber)) {
      return { valid: false, message: "Phone number must contain only numbers." };
    }
  
    // Check if phone number length matches the country code requirements
    const expectedLength = countryCodeLengths[countryCode];
    if (phoneNumber.length !== expectedLength) {
      return {
        valid: false,
        message: `Phone number must be ${expectedLength} digits long for ${countryCode}.`,
      };
    }

    return {valid : true};
  };

  const validateFields = () => {
    let newErrors = {};
  
    if (!profile.name) newErrors.name = "Name is required";
  
    if (!profile.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
      newErrors.email = "Invalid email format";
  
    // Validate contact number
    const phoneValidation = validatePhoneNumber(profile.contact, "+91");
    if (!profile.contact || !/^\d+$/.test(profile.contact) || !phoneValidation.valid) {
      newErrors.contact = phoneValidation.message;
    }
  
    if (!profile.location) newErrors.location = "Location is required";
    if (role === "kitchen" && !profile.fssaiId) newErrors.fssaiId = "FSSAI ID is required";
    if (role === "ngo" && !profile.ngoId) newErrors.ngoId = "NGO ID is required";
    return newErrors;
  };
  

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    profile.contact = `${selectedCountry.code} ${profile.contact}`;    
    setLoading(true);
    try {
      await axios.put("http://localhost:5000/individual/update-profile", profile, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
    //   alert("Profile updated successfully!");
      navigate('/viewProfile');
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold">Name</label>
          <input type="text" name="name" value={profile.name} onChange={handleChange} className="border p-2 w-full" />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Email</label>
          <input type="email" name="email" value={profile.email} onChange={handleChange} className="border p-2 w-full" />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Contact</label>
          <input type="text" name="contact" value={profile.contact} onChange={handleChange} className="border p-2 w-full" />
          {errors.contact && <p className="text-red-500">{errors.contact}</p>}
        </div>

        <div className="mb-4">
          <label className="block font-semibold">Location</label>
          <input type="text" name="location" value={profile.location} onChange={handleChange} className="border p-2 w-full" />
          {errors.location && <p className="text-red-500">{errors.location}</p>}
        </div>

        {role === "kitchen" && <div className="mb-4">
          <label className="block font-semibold">Fssai Id</label>
          <input type="number" name="fssaiId" value={profile.fssaiId} onChange={handleChange} className="border p-2 w-full" />
          {errors.fssaiId && <p className="text-red-500">{errors.fssaiId}</p>}
        </div>}

        {role === "ngo" && <div className="mb-4">
          <label className="block font-semibold">NGO Id</label>
          <input type="text" name="location" value={profile.ngoId} onChange={handleChange} className="border p-2 w-full" />
          {errors.ngoId && <p className="text-red-500">{errors.ngoId}</p>}
        </div>}
        
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:cursor-pointer" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
