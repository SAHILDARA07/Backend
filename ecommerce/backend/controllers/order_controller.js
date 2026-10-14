import mongoose from "mongoose";
import Order from "../models/order_model.js";
import Product from "../models/product_model.js";

// give the stock back to the products
const restoreStock = async (items) => {
  for (const item of items) {
    await Product.updateOne(
      { _id: item.product },
      { $inc: { stock: item.quantity } },
    );
  }
};

// place a new order (logged in user)
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    // 1. check the cart items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty !" });
    }

    // if the same product comes two times, we add its quantity
    const quantities = {};
    for (const item of items) {
      if (!item || !mongoose.isValidObjectId(item.productId)) {
        return res.status(400).json({ message: "Invalid product in cart !" });
      }

      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity !" });
      }

      const id = String(item.productId);
      quantities[id] = (quantities[id] || 0) + quantity;
    }

    if (!shippingAddress || typeof shippingAddress !== "object") {
      return res
        .status(400)
        .json({ message: "Shipping address is required !" });
    }

    const { fullName, phone, address, city, pincode } = shippingAddress;

    if (typeof fullName !== "string" || fullName.trim() === "") {
      return res.status(400).json({ message: "Full name is required !" });
    }
    if (typeof phone !== "string" || !/^[0-9]{10}$/.test(phone.trim())) {
      return res.status(400).json({ message: "Phone must be 10 digits !" });
    }
    if (typeof address !== "string" || address.trim() === "") {
      return res.status(400).json({ message: "Address is required !" });
    }
    if (typeof city !== "string" || city.trim() === "") {
      return res.status(400).json({ message: "City is required !" });
    }
    if (typeof pincode !== "string" || !/^[0-9]{6}$/.test(pincode.trim())) {
      return res.status(400).json({ message: "Pincode must be 6 digits !" });
    }

    const orderItems = [];
    let totalPrice = 0;

    for (const id in quantities) {
      const product = await Product.findById(id);

      if (!product) {
        return res.status(400).json({
          message: "A product in your cart is not available anymore !",
        });
      }

      if (product.stock < quantities[id]) {
        if (product.stock === 0) {
          return res
            .status(400)
            .json({ message: `${product.title} is out of stock !` });
        }
        return res.status(400).json({
          message: `Only ${product.stock} left for ${product.title} !`,
        });
      }

      orderItems.push({
        product: product._id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: quantities[id],
      });

      totalPrice = totalPrice + product.price * quantities[id];
    }

    totalPrice = Math.round(totalPrice * 100) / 100;

    const reducedItems = [];

    try {
      for (const item of orderItems) {
        const updated = await Product.findOneAndUpdate(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
        );

        if (!updated) {
          await restoreStock(reducedItems);
          return res.status(400).json({
            message: `${item.title} just went out of stock, please check your cart !`,
          });
        }

        reducedItems.push(item);
      }

      const order = await Order.create({
        user: req.user._id,
        items: orderItems,
        shippingAddress: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
        },
        totalPrice,
      });

      return res.status(201).json({
        message: "Order placed successfully !",
        order,
      });
    } catch (err) {
      await restoreStock(reducedItems);
      throw err;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error !" });
  }
};

// get the orders of the logged in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error !" });
  }
};

// the user cancels his own order (only if it is still Pending)
export const cancelMyOrder = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id !" });
    }

    // the order must belong to this user and must be Pending
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, status: "Pending" },
      { status: "Cancelled" },
      { new: true },
    );

    if (!order) {
      return res
        .status(400)
        .json({ message: "Only your Pending orders can be cancelled !" });
    }

    await restoreStock(order.items);

    res.json({ message: "Order cancelled successfully !", order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error !" });
  }
};

// get all orders (admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error !" });
  }
};

// change the status of an order (admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const allowedStatus = ["Pending", "Shipped", "Delivered", "Cancelled"];
    const { status } = req.body;

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id !" });
    }

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status !" });
    }

    // a Delivered or Cancelled order is finished, it can not be changed again
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, status: { $in: ["Pending", "Shipped"] } },
      { status },
      { new: true },
    );

    if (!order) {
      return res.status(400).json({
        message: "Order not found, or it is already Delivered / Cancelled !",
      });
    }

    // if the admin cancels the order, give the stock back
    if (status === "Cancelled") {
      await restoreStock(order.items);
    }

    res.json({ message: "Order status updated !", order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error !" });
  }
};