import mongoose from "mongoose";
import ListedItem from "../models/itemList.js";

/**
 * @desc Get all listed items of type 'Donations'
 * @route GET /api/itemlist/donations
 * @access Public
 */

const getDonationItems = async (req, res) => {
  try {
    const items = await ListedItem.find({ listingType: { $regex: /^donations$/i } }) // Case-insensitive match
      .populate("listedBy", "name contact address");

    const formattedItems = items.map((item) => ({
      itemName: item.itemName,
      listingType: item.listingType,
      description: item.Description,
      quantity: item.quantity,
      cost: item.cost,
      feeds: item.feeds || 1, // Default feeds if missing
      location: item.listedBy?.contact || "N/A",
      address: item.listedBy?.address || "N/A",
      expiryDate: item.expiryDate,
      listedBy: item.listedBy?.name || "Unknown",
    }));

    res.status(200).json(formattedItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getMarketplaceItems = async (req, res) => {
    try {
      const items = await ListedItem.find({ listingType: { $regex: /^marketplace$/i } }) // Case-insensitive match
        .populate("listedBy", "name contact address");
  
      const formattedItems = items.map((item) => ({
        itemName: item.itemName,
        listingType: item.listingType,
        description: item.Description,
        quantity: item.quantity,
        cost: item.cost,
        feeds: item.feeds || 1, // Default feeds if missing
        location: item.listedBy?.contact || "N/A",
        address: item.listedBy?.address || "N/A",
        expiryDate: item.expiryDate,
        listedBy: item.listedBy?.name || "Unknown",
      }));
  
      res.status(200).json(formattedItems);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  
/**
 * @desc Get all listed items of type 'Marketplace'
 * @route GET /api/itemlist/marketplace
 * @access Public
 */


/**
 * @desc Get a single item by ID
 * @route GET /api/itemlist/:id
 * @access Public
 */
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ID before querying
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }

    const item = await ListedItem.findById(id).populate("listedBy", "name contact address");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({
      itemName: item.itemName,
      description: item.Description,
      listingType: item.listingType,
      quantity: item.quantity,
      cost: item.cost,
      feeds: item.feeds || 1,
      location: item.listedBy?.contact || "N/A",
      address: item.listedBy?.address || "N/A",
      expiryDate: item.expiryDate,
      listedBy: item.listedBy?.name || "Unknown",
    });
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getDonationItems, getMarketplaceItems, getItemById };
