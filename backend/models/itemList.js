import mongoose from "mongoose";

const { Schema, model } = mongoose;

const listedItemSchema = new Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Unique Item ID
    itemName: { type: String, required: true },
    itemType: { type: String, enum: ["Perishable", "Non-Perishable"], required: true },
    quantity: { type: Number, required: true },
    cost: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Delivered"], default: "Pending" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // Receiver's ID (Individual, Kitchen, or NGO)

    // Dynamic Reference for Individual OR Kitchen
    listedById: { type: mongoose.Schema.Types.ObjectId, required: true },
    listedByType: { type: String, enum: ["Individual", "Kitchen"], required: true },
    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "listedByType", // Dynamically references either Individual or Kitchen
      required: true,
    },
  },
  { timestamps: true }
);

const ListedItem = model("ListedItem", listedItemSchema);
export default ListedItem;
