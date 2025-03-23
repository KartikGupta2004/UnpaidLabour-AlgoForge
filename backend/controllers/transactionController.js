import Transaction from "../models/transactions.js";
import Individual from "../models/indivisual_users.js";
import ListedItem from "../models/itemList.js";
/**
 * @desc Confirm order by user (server or receiver)
 * @route POST /api/transactions/confirm/:transactionId
 * @access Private
 */
 const confirmTransaction = async (req, res) => {
  try {
    const { userId } = req.body; // User who is confirming
    const { transactionId } = req.params;

    const transaction = await Transaction.findOne({ transactionId });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Identify if user is the server or receiver
    if (transaction.serverUserId.toString() === userId) {
      transaction.serverConfirmed = true;
    } else if (transaction.receiverUserId.toString() === userId) {
      transaction.receiverConfirmed = true;
    } else {
      return res.status(403).json({ message: "User not authorized" });
    }

    // If both have confirmed, update status to "delivered"
    if (transaction.serverConfirmed && transaction.receiverConfirmed) {
      transaction.status = "Delivered";

      // Update individual users
      await Individual.findByIdAndUpdate(transaction.serverUserId, { $inc: { OrdersServed: 1 } });
      await Individual.findByIdAndUpdate(transaction.receiverUserId, { $inc: { OrdersReceived: 1 } });
    }

    await transaction.save();

    return res.json({ message: "Confirmation received", transaction });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const createTransaction = async (req, res) => {
    try {
        const serverUserId = req.user.id; 
        const itemId  = req.params.itemId;  // ✅ Extract itemId from URL params

        console.log("Received Request - itemId:", itemId);
        console.log("Server User ID:", serverUserId);

        if (!serverUserId || !itemId) {
            console.log("❌ Missing sender ID or item ID");
            return res.status(400).json({ message: "Sender ID and Item ID are required" });
        }

        // 🔹 Fetch sender details
        const sender = await Individual.findById(serverUserId);
        if (!sender) {
            console.log("❌ Sender not found in database");
            return res.status(404).json({ message: "Sender not found" });
        }
        console.log("✅ Sender found:", sender.name);

        // 🔹 Fetch the listed item
        const listedItem = await ListedItem.findById(itemId);
        if (!listedItem) {
            console.log("❌ Listed item not found in database");
            return res.status(404).json({ message: "Listed item not found" });
        }
        console.log("✅ Listed item found:", listedItem.itemName);

        const receiverUserId = listedItem.listedBy; // ✅ Ensure this field exists
        if (!receiverUserId) {
            console.log("❌ No receiver assigned for this item");
            return res.status(400).json({ message: "No receiver assigned for this item" });
        }

        // 🔹 Fetch receiver details
        const receiver = await Individual.findById(receiverUserId);
        if (!receiver) {
            console.log("❌ Receiver not found in database");
            return res.status(404).json({ message: "Receiver not found" });
        }
        console.log("✅ Receiver found:", receiver.name);

        // ✅ Create new transaction with required fields
        const newTransaction = new Transaction({
            serverUserId,
            serverUserName: sender.name,  
            receiverUserId,
            receiverUserName: receiver.name,
            itemId,  // ✅ Added missing itemId field
        });

        // ✅ Save transaction
        await newTransaction.save();

        console.log("✅ Transaction saved successfully:", newTransaction);

        res.status(201).json({ message: "Transaction created successfully", transaction: newTransaction });

    } catch (error) {
        console.error("❌ Error creating transaction:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const getTransactionById = async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await Transaction.findById(id)
        .populate("serverUserId", "name")
        .populate("receiverUserId", "name")
        .populate("itemId");
  
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
  
      res.status(200).json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

export {confirmTransaction,createTransaction,getTransactionById};