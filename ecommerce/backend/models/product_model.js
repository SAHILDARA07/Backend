import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, trim: true },
    image: { type: String },
    stock: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("product", productSchema);