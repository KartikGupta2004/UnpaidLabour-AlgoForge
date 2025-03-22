import React, { useState } from 'react';
import { User, Lock, MapPin, Phone, Building, UtensilsCrossed, ArrowLeft } from 'lucide-react';
import axios from 'axios'
const roleOptions = [
  { id: 'individual', title: 'Individual Buyer', description: 'Purchase discounted surplus food' },
  { id: 'kitchen', title: 'Restaurant / Kitchen', description: 'List surplus food and manage donations' },
  { id: 'ngo', title: 'NGO / Food Bank', description: 'Request and distribute food donations' }
];

function SignUp() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    contact: '',
    location: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log({ role: selectedRole, ...formData });
    try {
      const res = await axios.post("http://localhost:5000/users/register", {
        role : selectedRole,
        ...formData
      });

      if (res.data.success) {
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("userType", res.data.userType);
        // navigate("/");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
      console.log(error)
    
      // if (errorMessage.includes("Email already in use")) {
      //   setErrors((prev) => ({ ...prev, email: "Email already in use. Please use a different email." }));
      // } else if (errorMessage.includes("Invalid email format")) {
      //   setErrors((prev) => ({ ...prev, email: "Invalid email format. Please enter a valid email." }));
      // } else if (errorMessage.includes("Password must contain")) {
      //   setErrors((prev) => ({ ...prev, password: errorMessage }));
      // } else {
      //   setServerError(errorMessage);
      // }
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
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 p-2 border rounded"
                    placeholder="Email"
                    required
                  />
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
                  </div>
                )}
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