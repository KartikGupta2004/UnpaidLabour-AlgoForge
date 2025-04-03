import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Transaction = () => {
  const [itemData, setItemData] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialConfirmLoading, setInitialConfirmLoading] = useState(false);
  const [serverConfirmed, setServerConfirmed] = useState(false);
  const [receiverConfirmed, setReceiverConfirmed] = useState(false);
  
  const navigate = useNavigate();
  const { itemId } = useParams(); // We're using itemId from URL params
  
  // Get user info from local storage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  useEffect(() => {
    // First load the item data to show details
    const storedItemData = sessionStorage.getItem("transactionItem");
    
    if (storedItemData) {
      try {
        const parsedData = JSON.parse(storedItemData);
        setItemData(parsedData);
        // If we already have a transaction, try to fetch it
        if (parsedData._id) {
          fetchTransactionDetails(parsedData._id);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error parsing session data:", err);
        setError('Failed to load item details');
        setLoading(false);
      }
    } else {
      // If no data in sessionStorage, redirect back
      setError('No item data found');
      setLoading(false);
      toast.error('No item data found');
    }
  }, []);
  
  const fetchTransactionDetails = async (itemIdToFetch) => {
    try {
      setLoading(true);
      const response = await axios.get(`/transactions/${itemIdToFetch}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data && response.data.transaction) {
        const transactionData = response.data.transaction;
        setTransaction(transactionData);
        
        // Check if confirmations exist and update states
        if (transactionData.serverConfirmed) {
          setServerConfirmed(true);
        }
        if (transactionData.receiverConfirmed) {
          setReceiverConfirmed(true);
        }
      }
    } catch (err) {
      console.error("Error fetching transaction:", err);
      // It's okay if there's no transaction yet
    } finally {
      setLoading(false);
    }
  };
  
  // Initial confirmation to create transaction
  const handleInitialConfirm = async () => {
    try {
      setInitialConfirmLoading(true);
      
      if (!itemData || !itemData._id) {
        throw new Error('Item data is missing');
      }
      
      // Create transaction using the correct endpoint
      const response = await axios.post(
        `/transactions/createTransaction/${itemData._id}`
      );
      
      if (response.data && response.data.transaction) {
        setTransaction(response.data.transaction);
        toast.success('Transaction created successfully');
      } else {
        throw new Error('Transaction creation failed');
      }
      
    } catch (err) {
      console.error('Error creating transaction:', err);
      toast.error(err.response?.data?.message || 'Failed to create transaction');
    } finally {
      setInitialConfirmLoading(false);
    }
  };
  
  // Handler for confirmation (both server and receiver)
  const handleConfirm = async (userId, role) => {
    try {
      if (!transaction || !transaction._id) {
        throw new Error('Transaction data is missing');
      }
      
      const response = await axios.post(`/transactions/confirm/${transaction._id}`, 
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await response.data;
      if (response.status === 200) {
        if (role === "server") {
          setServerConfirmed(true);
        } else {
          setReceiverConfirmed(true);
        }
        toast.success(`${role} confirmation successful!`);
        
        // Update transaction state with the new data
        setTransaction(data.transaction);
      } else {
        toast.error(data.message || "Confirmation failed");
      }
    } catch (error) {
      console.error("Error confirming transaction:", error);
      toast.error(error.response?.data?.message || "Error confirming transaction");
    }
  };
  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 p-4 rounded-md text-red-800">
          {error}
          <div className="mt-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!itemData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-yellow-100 p-4 rounded-md text-yellow-800">
          Item data not found
          <div className="mt-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-blue-500 text-white p-4">
          <h1 className="text-2xl font-bold">Transaction Details</h1>
          <p className="text-sm opacity-80">Item: {itemData.itemName}</p>
          {transaction && <p className="text-sm opacity-80">Transaction ID: {transaction._id}</p>}
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-md p-4">
              <h2 className="text-lg font-semibold mb-2">Item Information</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 font-medium">Type:</span>
                  <span className="ml-2 capitalize">{itemData.listingType}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    getStatusColor(transaction?.status || itemData.status)
                  }`}>
                    {transaction?.status || itemData.status || 'New'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Date Listed:</span>
                  <span className="ml-2">{new Date(itemData.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Quantity:</span>
                  <span className="ml-2">{itemData.quantity || 0}</span>
                </div>
                {itemData.cost && (
                  <div>
                    <span className="text-gray-600 font-medium">Amount:</span>
                    <span className="ml-2">₹{itemData.cost * itemData.quantity}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600 font-medium">Expiry Date:</span>
                  <span className="ml-2">{new Date(itemData.expiryDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <h2 className="text-lg font-semibold mb-2">Provider Information</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 font-medium">Provider Type:</span>
                  <span className="ml-2 capitalize">{itemData.listedByType}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Provider Name:</span>
                  <span className="ml-2">{itemData.name}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Contact:</span>
                  <span className="ml-2">{itemData.contact}</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Location:</span>
                  <span className="ml-2">{itemData.location}</span>
                </div>
                {itemData.rating && (
                  <div>
                    <span className="text-gray-600 font-medium">Rating:</span>
                    <span className="ml-2">{itemData.rating} ★</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Transaction Action Section */}
          <div className="mt-6 border rounded-md p-4">
            <h2 className="text-lg font-semibold mb-4">Transaction Actions</h2>
            
            {/* Initial confirmation button (when no transaction exists) */}
            {!transaction && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  Please confirm this transaction to begin the process. This will reserve the items and notify the provider.
                </p>
                
                <button
                  onClick={handleInitialConfirm}
                  disabled={initialConfirmLoading}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 font-medium"
                >
                  {initialConfirmLoading ? 'Processing...' : 'Confirm Transaction'}
                </button>
              </div>
            )}
            
            {/* Confirm Buttons for Server and Receiver (when transaction exists) */}
            {transaction && (
              <div className="space-y-6">
                <p className="text-gray-700 font-medium text-lg">
                  Please confirm delivery of the items. Both server and receiver must confirm to complete the transaction.
                </p>
                
                {/* Confirmation buttons with improved styling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Server button */}
                  <div className="flex flex-col items-center border rounded-lg overflow-hidden shadow-md">
                    <div className="w-full bg-blue-50 p-3 text-center border-b">
                      <h3 className="text-lg font-semibold text-blue-800">Provider</h3>
                    </div>
                    <div className="p-6 flex flex-col items-center w-full">
                      <div className="mb-4 text-center">
                        <span className="block text-gray-500 mb-2">Server Status</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          serverConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {serverConfirmed ? "Confirmed" : "Awaiting Confirmation"}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleConfirm(transaction.serverUserId || itemData.listedById, "server")} 
                        disabled={serverConfirmed}
                        className={`w-full py-3 rounded-md shadow text-center transition-all duration-200 font-medium text-lg ${
                          serverConfirmed 
                            ? 'bg-green-500 text-white cursor-not-allowed opacity-80' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                        }`}
                      >
                        {serverConfirmed ? "Server Confirmed ✓" : "Confirm as Server"}
                      </button>
                    </div>
                  </div>
                  
                  {/* Receiver button */}
                  <div className="flex flex-col items-center border rounded-lg overflow-hidden shadow-md">
                    <div className="w-full bg-indigo-50 p-3 text-center border-b">
                      <h3 className="text-lg font-semibold text-indigo-800">Receiver</h3>
                    </div>
                    <div className="p-6 flex flex-col items-center w-full">
                      <div className="mb-4 text-center">
                        <span className="block text-gray-500 mb-2">Receiver Status</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          receiverConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {receiverConfirmed ? "Confirmed" : "Awaiting Confirmation"}
                        </span>
                      </div>
                      <button 
                        onClick={() => handleConfirm(transaction.receiverUserId || user.id, "receiver")} 
                        disabled={receiverConfirmed}
                        className={`w-full py-3 rounded-md shadow text-center transition-all duration-200 font-medium text-lg ${
                          receiverConfirmed 
                            ? 'bg-green-500 text-white cursor-not-allowed opacity-80' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg'
                        }`}
                      >
                        {receiverConfirmed ? "Receiver Confirmed ✓" : "Confirm as Receiver"}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Transaction status */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-medium text-gray-700 mb-3">Transaction Status:</h4>
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-700 font-bold">S</div>
                    <div className={`h-1 w-24 ${serverConfirmed && receiverConfirmed ? 'bg-green-500' : serverConfirmed || receiverConfirmed ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold">R</div>
                  </div>
                  <p className="mt-3 text-center text-sm text-gray-600">
                    {serverConfirmed && receiverConfirmed 
                      ? "✅ Transaction complete! Both parties have confirmed."
                      : serverConfirmed 
                        ? "Server has confirmed. Waiting for receiver confirmation."
                        : receiverConfirmed
                          ? "Receiver has confirmed. Waiting for server confirmation."
                          : "Awaiting confirmation from both parties."}
                  </p>
                </div>
                
                {/* For completed transactions */}
                {transaction.status === 'Delivered' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 font-medium text-center">
                      ✅ This transaction has been completed. Thank you for your confirmation!
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;