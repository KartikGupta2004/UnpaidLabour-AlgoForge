import { useState } from "react";
import { Star, X, Phone, Mail, MessageSquare } from "lucide-react";

export default function EnlargedItemCard({ item, onClose }) {
  const [showContactInfo, setShowContactInfo] = useState(false);
  
  if (!item) return null;

  const toggleContactInfo = () => {
    setShowContactInfo(!showContactInfo);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden relative">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100 z-10"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Image Section - Larger in the modal */}
        <div className="relative w-full h-64 bg-gray-200">
          {item.image ? (
            <img
              src={item.image}
              alt={item.itemName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-400 text-lg">
              No Image Available
            </div>
          )}
        </div>
        
        {/* Content Section - More detailed in the modal */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {item.itemName}
          </h2>
          
          {/* Description Box */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
            <p className="text-gray-700">
              {item.description || "No description available for this item."}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Item Type</h3>
              <p className="font-semibold text-gray-900">{item.itemType}</p>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Expiration</h3>
              {item.itemType === "Non-Perishable" && (
                <p className="font-semibold text-gray-900">
                  {new Date(item.expiryDate).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
              {item.itemType === "Perishable" && (() => {
                const expiryDate = new Date(item.expiryDate);
                const now = new Date();
                const timeDiff = expiryDate - now;
                if (timeDiff <= 0) return <p className="font-semibold text-red-600">Expired</p>;
                const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                return <p className="font-semibold text-green-600">Expires in: {daysLeft} {daysLeft === 1 ? "day" : "days"}</p>;
              })()}
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-4 border-t border-b border-gray-200 py-3">
            <div>
              <div className="text-gray-500 text-sm">Served By</div>
              <div className="font-medium text-lg">{item.name}</div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                {item.listedByType === "Resturant" && (
                  <span className="mr-1 font-medium">{item.ratings}</span>
                )}
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < item.ratings
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {item.listedByType === "Resturant" && (
                <span className="text-sm text-gray-500">Restaurant Rating</span>
              )}
            </div>
          </div>
          
          {item.details && item.details.distance && (
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Distance: {item.details.distance}m
              </span>
            </div>
          )}
          
          {/* Contact Information Section (toggleable) */}
          {showContactInfo && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
              <h3 className="text-sm font-bold text-blue-800 mb-2">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-gray-700">{item.phone || "+1 (555) 123-4567"}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-gray-700">{item.email || `${item.name.toLowerCase().replace(/\s+/g, ".")}@example.com`}</span>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-gray-700">Send a message through the platform</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Cost Section with larger font */}
          {item.type !== "Donation" ? (
            <div className="mt-2 text-right">
              <span className="text-sm text-gray-500">Price</span>
              <p className="text-xl font-bold text-gray-900">${item.cost?.toFixed(2)}</p>
            </div>
          ) : (
            <div className="mt-2 text-right">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Free Donation
              </span>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="mt-6 flex space-x-3">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
              {item.type !== "Donation" ? "Purchase Now" : "Request Item"}
            </button>
            <button 
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                showContactInfo 
                  ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={toggleContactInfo}
            >
              {showContactInfo ? "Hide Contact" : "Contact Provider"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}