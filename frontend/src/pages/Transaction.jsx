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
  const [deliveryConfirmLoading, setDeliveryConfirmLoading] = useState(false);
  
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
        setTransaction(response.data.transaction);
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
        `/transactions/createTransaction/${itemData._id}`,
        // {}, // No body needed as per your backend code
        // {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`
        //   }
        // }
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
  
  // Confirm delivery of the transaction
  const handleDeliveryConfirm = async () => {
    try {
      if (!transaction || !transaction._id) {
        throw new Error('Transaction data is missing');
      }
      
      setDeliveryConfirmLoading(true);
      
      const response = await axios.put(
        `/transactions/confirm/${transaction._id}`,
        { 
          userId: user.id // Send the current user's ID as required by the backend
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (response.data && response.data.transaction) {
        setTransaction(response.data.transaction);
        toast.success('Delivery confirmed successfully');
      } else {
        throw new Error('Delivery confirmation failed');
      }
      
    } catch (err) {
      console.error('Error confirming delivery:', err);
      toast.error(err.response?.data?.message || 'Failed to confirm delivery');
    } finally {
      setDeliveryConfirmLoading(false);
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
            
            {/* Delivery confirmation button (when transaction is pending) */}
            {transaction && transaction.status === 'Pending' && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  Once you've received the items, please confirm delivery below. This will complete the transaction.
                </p>
                
                <button
                  onClick={handleDeliveryConfirm}
                  disabled={deliveryConfirmLoading}
                  className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 font-medium"
                >
                  {deliveryConfirmLoading ? 'Processing...' : 'Confirm Delivery'}
                </button>
              </div>
            )}
            
            {/* For completed transactions */}
            {transaction && transaction.status === 'Delivered' && (
              <div className="space-y-4">
                <p className="text-gray-700 font-medium text-green-600">
                  This transaction has been completed. Thank you for your confirmation!
                </p>
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