import mongoose from "mongoose";
import ListedItem from "../models/itemList.js";
import Individual from "../models/indivisual_users.js";
import Kitchen from "../models/Kitchens.js";
import Transaction from "../models/transactions.js";

/**
 * @desc Add a new item
 * @route POST /api/itemlist
 * @access Private (User must be logged in)
 */
const addItem = async (req, res) => {
  try {
    const { listingType, itemName, itemType, Description, quantity, cost, feeds, expiryDate } = req.body;

    const listedById = req.user.id;
    const listedByType = req.user.role;

    // ✅ Validate Required Fields
    if (!listingType || !itemName || !itemType || !quantity || (itemType === "Perishable" && !expiryDate)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const validListingTypes = ["Donation", "Marketplace"];
    const validItemTypes = ["Perishable", "Non-Perishable"];

    if (!validListingTypes.includes(listingType)) {
      return res.status(400).json({ message: "Invalid listingType" });
    }

    if (!validItemTypes.includes(itemType)) {
      return res.status(400).json({ message: "Invalid itemType" });
    }

    // ✅ Fetch User Details (Including Rating)
    let listedByData = null;
    if (listedByType.toLowerCase() === "individual") {
      listedByData = await Individual.findById(listedById).select("name contact location rating");
    } else if (listedByType.toLowerCase() === "kitchen") {
      listedByData = await Kitchen.findById(listedById).select("name contact location rating");
    }

    if (!listedByData) {
      return res.status(404).json({ message: "ListedBy entity not found" });
    }

    // ✅ Set Expiry Dates
    const finalExpiryDate =
      itemType === "Perishable" ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) /* 48 hours */: new Date(expiryDate);

    // ✅ Assign rating from the fetched user data
    const finalRating = listedByData.rating ?? 3; // Default to 3 if no rating exists

    // ✅ Create New Item
    const newItem = new ListedItem({
      listingType,
      itemName,
      itemType,
      Description,
      quantity,
      cost,
      listedById,
      listedByType,
      listedBy: listedById,
      name: listedByData.name,
      contact: listedByData.contact,
      location: listedByData.location,
      feeds: feeds || 1,
      expiryDate: finalExpiryDate,
      rating: finalRating, // ✅ Rating fetched from Individual/Kitchen schema
    });

    // ✅ Save to Database
    await newItem.save();
    res.status(201).json({ message: "Item added successfully", item: newItem });

  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


/**
 * @desc Get all donation items
 * @route GET /api/itemlist/donations
 * @access Public
 */
const getDonationItems = async (req, res) => {
  try {
    const items = await ListedItem.find({ listingType: "Donation" });

    if (!items.length) {
      return res.status(404).json({ message: "No donation items found" });
    }

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching donation items:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



/**
 * @desc Get all marketplace items
 * @route GET /api/itemlist/marketplace
 * @access Public
 */
const getMarketplaceItems = async (req, res) => {
  try {
    const items = await ListedItem.find({ listingType: "Marketplace" });

    if (!items.length) {
      return res.status(404).json({ message: "No marketplace items found" });
    }

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching marketplace items:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// /**
//  * @desc Get a single item by ID
//  * @route GET /api/itemlist/:id
//  * @access Public
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }

    // ✅ Fetch item from DB
    const item = await ListedItem.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ✅ Send response
    res.status(200).json({
      _id: item._id,
      itemName: item.itemName,
      itemType: item.itemType,
      quantity: item.quantity,
      cost: item.cost || 0,
      listingType: item.listingType,
      status: item.status,
      description: item.Description,
      receiverId: item.receiverId,
      listedById: item.listedById,
      listedByType: item.listedByType,
      listedBy: item.listedBy,
      name: item.name,
      contact: item.contact,
      location: item.location,
      expiryDate: item.expiryDate ? item.expiryDate.toISOString() : null,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
  } catch (error) {
    console.error("Error fetching item by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }

    const item = await ListedItem.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Item not found or already deleted" });
    }

    res.status(200).json({ message: "Item deleted successfully", id });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const UpdateItemStatus = async (req, res) => {
  try {
    const { senderpartyId, transactionId, senderType } = req.params;
    const receiverId = req.user.id;
    
    if (!mongoose.Types.ObjectId.isValid(senderpartyId) || !mongoose.Types.ObjectId.isValid(transactionId)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    // Find the transaction
    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    
    // Find the sender based on type
    let sender;
    if (senderType === "Restaurant") {
      sender = await Kitchen.findById(senderpartyId);
    } else if (senderType === "Individual") {
      sender = await Individual.findById(senderpartyId);
    } else {
      return res.status(400).json({ message: "Invalid sender type" });
    }
    
    if (!sender) {
      return res.status(404).json({ message: "Sender not found" });
    }
    
    // Get the receiver
    const receiver = await Individual.findById(receiverId);
    
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    
    // Update transaction status
    transaction.status = req.body.status || "completed";
    await transaction.save();
    
    // Update sender stats
    if (transaction.type === "donation") {
      sender.donationsServed = (sender.donationsServed || 0) + 1;
    } else {
      sender.ordersServed = (sender.ordersServed || 0) + 1;
    }
    
    // Append transaction to sender's transactions array
    // Create transactions array if it doesn't exist
    if (!sender.transactions) {
      sender.transactions = [];
    }
    sender.transactions.push({
      transactionId: transaction._id,
      type: transaction.type,
      status: transaction.status,
      date: transaction.updatedAt || new Date(),
      partnerId: receiverId
    });
    
    await sender.save();
    
    // Update receiver stats if needed
    if (transaction.type === "donation") {
      receiver.donationsServed = (receiver.donationsServed || 0) + 1;
    } else {
      receiver.ordersServed = (receiver.ordersServed || 0) + 1;
    }
    
    // Append transaction to receiver's transactions array
    // Create transactions array if it doesn't exist
    if (!receiver.transactions) {
      receiver.transactions = [];
    }
    receiver.transactions.push({
      transactionId: transaction._id,
      type: transaction.type,
      status: transaction.status,
      date: transaction.updatedAt || new Date(),
      partnerId: senderpartyId,
      partnerType: senderType
    });
    
    await receiver.save();
    
    res.status(200).json({ 
      message: "Transaction status updated successfully", 
      transaction 
    });
    
  } catch (error) {
    console.error("Error updating transaction status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getDonationItems, getMarketplaceItems, getItemById, addItem, deleteItem, UpdateItemStatus };