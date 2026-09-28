import mongoose from "mongoose";

export const connectdb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/bookstore");
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Data connection failed: error " + error.message);
  }
};