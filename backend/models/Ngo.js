import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ngoSchema = new Schema(
  {
    role: {type: String, required: true},
    name: { type: String, required: true },
    ngoId: {
      type: String,
      unique: true, // Ensures NGO ID is unique
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
    rateKitchens: {
      type: Map, // Dictionary where key = Kitchen ID, value = rating (1-5)
      of: Number,
      default: {}, // Optional field
    },
    contact: {
      type: String,
      required: true,
    },
    donationsReceived: {
      type: Number,
      default: 0, // Optional field
    },
  },
  { timestamps: true }
);

const Ngo = model("Ngo", ngoSchema);
export default Ngo;
