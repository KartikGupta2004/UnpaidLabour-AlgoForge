import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () { return this.authProvider !== 'google'; }, // Required only if not Google OAuth
    },
    authProvider: {
      type: String,
      enum: ['email', 'google'],
      required: true,
      default: 'email',
    },
    role: {
      type: String,
      enum: ["Individual", "Kitchen", "Ngo"], // Only accepts these roles
      required: true,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchema);
export default User;
