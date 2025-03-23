import mongoose from "mongoose";

const { Schema, model } = mongoose;

const kitchenSchema = new Schema(
  {
    role: {type: String, required: true},
    name:{
      type : String,
      required : true
    },
    email:{
      type : String,
      unique: true,
      required : true
    },
    fssaiId: {
      type: String,
      unique: true, // Ensures FSSAI ID is unique
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    ordersServed: {
      type: Number,
      default: 0, // Optional field
    },
    donationsServed: {
      type: Number,
      default: 0, // Optional field
    },
    rewards: {
      type: Number,
      default: 0, // Optional field
    },
    rating: { 
      type: Number, 
      min: 1, 
      max: 5, 
      default: 3, // Optional: Default rating
    }
  },
  
  { timestamps: true }
);

const Kitchen = model("Kitchen", kitchenSchema);
export default Kitchen;
