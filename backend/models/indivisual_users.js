import mongoose from "mongoose";

const { Schema, model } = mongoose;

const individualSchema = new Schema(
  {
    role: {type: String, required: true},
    name: { type: String, required: true },
    email: { type: String, unique:true, required: true },
    password: { type: String, required: true },
    contact: { type: String,unique:true, required: true },
    location: { type: String, required: true },
    reward: { type: Number, default: 0 },
    OrdersServed: { type: Number, default: 0 },
    OrdersReceived: { type: Number, default: 0 },
    DonationsServed: { type: Number, default: 0 },
    CommGroupId: { type: Number, default: 0 },

    // Orders placed by the user
    orders_placed: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
        status: { type: String, enum: ["pending", "completed"], default: "pending" },
        foodItems: [{ foodName: String, quantity: Number }], // List of food items ordered
        orderedAt: { type: Date, default: Date.now },
      },
      
    ],
    orders_received: [
      {
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Transaction" },
        status: { type: String, enum: ["pending", "completed"], default: "pending" },
        foodItems: [{ foodName: String, quantity: Number }], // List of food items ordered
        orderedAt: { type: Date, default: Date.now },
      },
      
    ],
    rating: { 
      type: Number, 
      min: 1, 
      max: 5, 
      default: 3, // Optional: Default rating
    }
  },
  { timestamps: true }
);

const Individual = model("Individual", individualSchema);
export default Individual;
