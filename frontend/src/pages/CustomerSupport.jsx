import React, { useState } from 'react';

export default function CustomerService() {
  const [formData, setFormData] = useState({
    name: '',
    transactionId: '',
    complaint: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after showing success message
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          transactionId: '',
          complaint: ''
        });
      }, 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6" style={{backgroundImage: 'linear-gradient(to bottom right, #f3f4f6, #d1d5db)'}}>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl relative">
        {/* Decorative element */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-gray-200 rounded-full opacity-30"></div>
        <div className="absolute top-32 -left-6 w-12 h-12 bg-gray-300 rounded-full opacity-20"></div>
        
        <div className="relative overflow-hidden" style={{backgroundImage: 'linear-gradient(135deg, #059669, #065f46)'}}>
          <div className="p-6 text-white relative z-10">
            <h2 className="text-2xl font-bold">Raise a Complaint</h2>
            <p className="mt-1 text-green-100 opacity-90">We value your feedback</p>
          </div>
          {/* Abstract shapes */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10">
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-white"></div>
            <div className="absolute bottom-2 left-12 w-20 h-8 rounded-full bg-white"></div>
          </div>
          <div className="h-1 w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
        </div>
        
        {isSubmitted ? (
          <div className="p-8 flex flex-col items-center justify-center h-64 bg-white relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"></div>
            <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <p className="text-gray-800 text-lg font-medium">Thank you for your feedback!</p>
            <p className="text-gray-600 mt-2 text-center">We'll review your complaint and get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-white">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-200 focus:border-green-500 transition-all duration-200 bg-gray-50"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700">Transaction ID</label>
              <input
                type="text"
                id="transactionId"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-200 focus:border-green-500 transition-all duration-200 bg-gray-50"
                placeholder="Enter transaction ID"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="complaint" className="block text-sm font-medium text-gray-700">Describe your complaint</label>
              <textarea
                id="complaint"
                name="complaint"
                value={formData.complaint}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-green-200 focus:border-green-500 transition-all duration-200 bg-gray-50"
                placeholder="Please provide details about your issue"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-white font-medium transition-all duration-200 transform hover:-translate-y-0.5"
              style={{backgroundImage: 'linear-gradient(to right, #059669, #047857)'}}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Submit Complaint"}
            </button>
            
            {/* Subtle footer with light gray text */}
            <div className="pt-2 text-center text-xs text-gray-400">
              Your feedback helps us improve our service
            </div>
          </form>
        )}
      </div>
    </div>
  );
}