import mongoose from "mongoose";

export const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // every new user is a normal "user", an admin is set manually (see makeAdmin.js)
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("user", userSchema);