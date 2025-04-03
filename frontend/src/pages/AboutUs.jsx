import React from 'react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-100" style={{backgroundImage: 'linear-gradient(to bottom right, #f3f4f6, #d1d5db)'}}>
      {/* Header with gradient */}
      <div className="relative overflow-hidden" style={{backgroundImage: 'linear-gradient(135deg, #10b981, #059669)'}}>
        <div className="container mx-auto px-6 py-16 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">About Food Hero</h1>
          <p className="text-green-100 text-xl max-w-2xl">Fighting food waste and building stronger communities, one meal at a time.</p>
        </div>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10">
          <div className="absolute top-10 right-20 w-32 h-32 rounded-full bg-white"></div>
          <div className="absolute bottom-8 left-40 w-24 h-12 rounded-full bg-white"></div>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-gray-200 rounded-full opacity-30"></div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 text-lg mb-6">
            Food Hero is a web-based platform designed to reduce food waste and enhance community support by connecting individual households, local businesses, and charities. 
            We leverage AI technology to match surplus food with donation requests, while gamifying the process to drive community engagement.
          </p>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 bg-gray-50 p-6 rounded-lg border-l-4 border-green-500">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Reducing Food Waste</h3>
              <p className="text-gray-600">
                Every year, billions of dollars worth of food goes to waste. Food Hero provides a simple solution to redistribute surplus food to those who need it most.
              </p>
            </div>
            <div className="flex-1 bg-gray-50 p-6 rounded-lg border-l-4 border-green-500">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Building Communities</h3>
              <p className="text-gray-600">
                Our platform brings people together, fostering a sense of community responsibility and promoting sustainable practices in neighborhoods.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">How Food Hero Works</h2>
          
          <div className="mb-10">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{backgroundImage: 'linear-gradient(135deg, #10b981, #059669)'}}>1</div>
              <h3 className="text-2xl font-bold text-gray-800 ml-4">Two Powerful Modes</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 pl-16">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h4 className="text-xl font-bold text-green-700 mb-2">Donation Mode</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Verified donors (households, restaurants, bakeries) list surplus food</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>NGOs and individuals in need can request available donations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>AI matches food based on urgency, expiration, and proximity</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h4 className="text-xl font-bold text-green-700 mb-2">Marketplace Mode</h4>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Local food outlets sell discounted items approaching expiry</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Community members purchase affordable treats</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span>Real-time inventory updates and smart pricing</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mb-10">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{backgroundImage: 'linear-gradient(135deg, #10b981, #059669)'}}>2</div>
              <h3 className="text-2xl font-bold text-gray-800 ml-4">Smart Features</h3>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 pl-16">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Real-Time Mapping</h4>
                <p className="text-gray-600 text-sm">Live map showing donation hotspots and available discounted food</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Smart Pickup & Delivery</h4>
                <p className="text-gray-600 text-sm">Optimized routes for volunteers and logistics partners</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-bold text-gray-800 mb-2">Sustainability Dashboard</h4>
                <p className="text-gray-600 text-sm">Track your environmental impact and community contribution</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl" style={{backgroundImage: 'linear-gradient(135deg, #10b981, #059669)'}}>3</div>
              <h3 className="text-2xl font-bold text-gray-800 ml-4">Gamified Experience</h3>
            </div>
            
            <div className="pl-16">
              <p className="text-gray-600 mb-4">
                Users earn points and badges for donating, requesting, and participating in community challenges. 
                Our gamification approach makes reducing food waste fun and rewarding!
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                <p className="italic text-gray-700">
                  "Join Food Hero today and become a champion for sustainable food practices in your community!"
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Join Us Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Join The Movement</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
            Whether you're a household with leftover meals, a restaurant with surplus food, or someone looking to make a difference, 
            Food Hero provides the platform to turn potential waste into valuable resources.
          </p>
          
          
        </div>
      </div>
    </div>
  );
}