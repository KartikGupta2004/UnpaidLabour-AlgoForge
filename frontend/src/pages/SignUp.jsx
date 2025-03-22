import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, MapPin, Phone, Building, UtensilsCrossed, ArrowLeft, Globe } from 'lucide-react';
import axios from 'axios'
const roleOptions = [
  { id: 'individual', title: 'Individual Buyer', description: 'Purchase discounted surplus food' },
  { id: 'kitchen', title: 'Restaurant / Kitchen', description: 'List surplus food and manage donations' },
  { id: 'ngo', title: 'NGO / Food Bank', description: 'Request and distribute food donations' }
];
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

function SignUp() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    contact: '',
    location: '',
    fssaiId: '',
    ngoId: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear field-specific error
    setServerError(""); // Clear server errors
  };

  const validateFields = () => {
    const newErrors = {};
    if (!selectedRole) newErrors.role = "Please select a role";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.contact) newErrors.contact = "Contact number is required";
    else {
      const phoneValidation = validatePhoneNumber(formData.contact, selectedCountry.code);
      if (!phoneValidation.valid) {
        newErrors.contact = phoneValidation.message;
      }
    }
    if (!formData.location) newErrors.location = "Location is required";
    if (selectedRole === "kitchen" && !formData.fssaiId) newErrors.fssaiId = "FSSAI ID is required";
    if (selectedRole === "ngo" && !formData.ngoId) newErrors.ngoId = "NGO ID is required";
    return newErrors;
  };

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

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhoneNo(value);

    const result = validatePhoneNumber(value, selectedCountry.code);
    // Validate email and update fieldErrors
    if (!result.valid) {
      setFieldErrors((prev) => ({
        ...prev,
        phoneNo: `${result.message}`,
      }));
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        phoneNo: "",
      }));
    }
  };
  
  const handleCountryChange = (e) => {
    const country = countries.find((c) => c.name === e.target.value);
    setSelectedCountry(country);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    formData.contact = `${selectedCountry.code} ${formData.contact}`;
    // console.log({ role: selectedRole, ...formData });
    try {
      const res = await axios.post("http://localhost:5000/users/register", {
        role : selectedRole,
        ...formData
      });

      if (res.data.success) {
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("userType", res.data.userType);
        navigate("/");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      // console.log(error)
    
      if (errorMessage.includes("Email already in use")) {
        setErrors((prev) => ({ ...prev, email: "Email already in use. Please use a different email." }));
      } else if (errorMessage.includes("Invalid email format")) {
        setErrors((prev) => ({ ...prev, email: "Invalid email format. Please enter a valid email." }));
      } else if (errorMessage.includes("Password must contain")) {
        setErrors((prev) => ({ ...prev, password: errorMessage }));
      } else {
        setServerError(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create Your Account</h2>
            {!selectedRole && (
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Choose your role</h3>
                {roleOptions.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <div className="text-left">
                      <h4 className="text-lg font-medium text-gray-900">{role.title}</h4>
                      <p className="text-sm text-gray-500">{role.description}</p>
                    </div>
                  </button>
                ))}
                {errors.role && <p className="text-red-500 font-bold text-sm">{errors.role}</p>}
              </div>
            )}
            {selectedRole && (
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="flex items-center mb-4">
                  <button
                    type="button"
                    onClick={() => setSelectedRole(null)}
                    className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to role selection
                  </button>
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 p-2 border rounded"
                    placeholder="Full Name"
                    required
                  />
                  {errors[formData.name] && <p className="text-red-500 text-sm">{errors[formData.name]}</p>}
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 p-2 border rounded"
                    placeholder="Email"
                    required
                  />
                  {errors[formData.email] && <p className="text-red-500 text-sm">{errors[formData.email]}</p>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 p-2 border rounded"
                    placeholder="Password"
                    required
                  />
                  {errors[formData.password] && <p className="text-red-500 text-sm">{errors[formData.password]}</p>}
                </div>

                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                  className="w-full pl-10 p-2 border rounded"
                  value={selectedCountry.name}
                  onChange={handleCountryChange}
                >
                  {countries.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </select>
                </div>
                <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />  

                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full pl-10 p-2 border rounded"
                  placeholder="Contact Number"
                  required
                />
                  {errors[formData.contact] && <p className="text-red-500 text-sm">{errors[formData.contact]}</p>}
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 p-2 border rounded"
                    placeholder="Location"
                    required
                  />
                  {errors[formData.location] && <p className="text-red-500 text-sm">{errors[formData.location]}</p>}
                </div>
                {selectedRole === 'kitchen' && (
                  <div className="relative">
                    <UtensilsCrossed className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="fssaiId"
                      value={formData.fssaiId}
                      onChange={handleChange}
                      className="w-full pl-10 p-2 border rounded"
                      placeholder="FSSAI ID"
                      required
                    />
                    {errors[formData.fssaiId] && <p className="text-red-500 text-sm">{errors[formData.fssaiId]}</p>}
                  </div>
                )}
                {selectedRole === 'ngo' && (
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="ngoId"
                      value={formData.ngoId}
                      onChange={handleChange}
                      className="w-full pl-10 p-2 border rounded"
                      placeholder="NGO ID"
                      required
                    />
                    {errors[formData.email] && <p className="text-red-500 text-sm">{errors[formData.email]}</p>}
                  </div>
                )}
              {serverError && <p className="text-red-500 text-sm font-bold">{serverError}</p>}
                <button type="submit" className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:ring-green-500">
                  Create account
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;