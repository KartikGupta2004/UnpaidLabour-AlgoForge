import mongoose from "mongoose";

const { Schema, model } = mongoose;

const listedItemSchema = new Schema(
  {
    itemName: { type: String, required: true },
    itemType: { type: String, enum: ["Perishable", "Non-Perishable"], required: true },
    quantity: { type: Number, required: true },
    cost: { type: Number },

    // ✅ New Field: Listing Type (Marketplace or Donation)
    listingType: { type: String, enum: ["Marketplace", "Donation"], required: true },

    status: { type: String, enum: ["notAddressed", "Pending", "Delivered"], default: "notAddressed" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    Description: { type: String },

    listedById: { type: mongoose.Schema.Types.ObjectId },
    listedByType: { type: String, enum: ["individual", "kitchen"] },
    listedBy: { type: mongoose.Schema.Types.ObjectId, refPath: "listedByType" },

    name: { type: String, required: true },
    contact: { type: String, required: true },
    location: { type: String, required: true },

    // Expiry Date
    expiryDate: { type: Date },

    // ✅ New Field: Rating (1 to 5 scale, float)
    rating: { 
      type: Number, 
      min: 1, 
      max: 5, 
      default: 3, // Optional: Default rating
    }
  },
  { timestamps: true }
);

// ✅ Middleware: Auto-set expiry date ONLY for Non-Perishable items
listedItemSchema.pre("save", function (next) {
  if (this.itemType === "Non-Perishable" && !this.expiryDate) {
    this.expiryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days from now
  }
  next();
});

const ListedItem = model("ListedItem", listedItemSchema);
export default ListedItem;
