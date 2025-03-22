import mongoose from "mongoose";

const { Schema, model } = mongoose;

const transactionSchema = new Schema({
  serverUserId: { type: Schema.Types.ObjectId, ref: "Individual", required: true }, // TODO can be Indi or Resturant
  receiverUserId: { type: Schema.Types.ObjectId, ref: "Individual", required: true }, // TODO can be Indi or NGO
  transactionId: { type: Schema.Types.ObjectId, auto: true },
  status: { type: String, enum: ["Pending", "Delivered"], default: "Pending" },
  serverConfirmed: { type: Boolean, default: false },
  receiverConfirmed: { type: Boolean, default: false },
  itemId: {type: Schema.Types.ObjectId, ref: "ListedItem", required: true }
}); 

const Transaction = model("Transaction", transactionSchema);
export default Transaction;
