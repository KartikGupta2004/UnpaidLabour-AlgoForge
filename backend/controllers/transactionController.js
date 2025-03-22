import Transaction from "../models/transactions.js";
import Individual from "../models/indivisual_users.js";

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
export {confirmTransaction};