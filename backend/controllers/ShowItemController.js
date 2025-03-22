import mongoose from "mongoose";
import ListedItem from "../models/itemList.js";
import Individual from "../models/indivisual_users.js";
import Kitchen from "../models/Kitchens.js";

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

    // ✅ Fetch User Details
    let listedByData = null;
    if (listedByType.toLowerCase() === "individual") {
      listedByData = await Individual.findById(listedById).select("name contact location");
    } else if (listedByType.toLowerCase() === "kitchen") {
      listedByData = await Kitchen.findById(listedById).select("name contact location");
    }

    if (!listedByData) {
      return res.status(404).json({ message: "ListedBy entity not found" });
    }

    // ✅ Set Expiry Dates
    const finalExpiryDate =
      itemType === "Perishable" ? new Date(expiryDate) : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

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
export { getDonationItems, getMarketplaceItems, getItemById, addItem, deleteItem };
