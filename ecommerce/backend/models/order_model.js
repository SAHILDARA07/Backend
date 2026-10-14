import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // which user placed the order
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },

    // we save title, price and image inside the order,
    // so the order stays the same even if the product is changed later
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
    },

    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export default mongoose.model("order", orderSchema);