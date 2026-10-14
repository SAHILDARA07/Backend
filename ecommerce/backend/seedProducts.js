
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import Product from "./models/product_model.js";

dotenv.config();

const sampleProducts = [
  {
    title: "Running Shoes",
    price: 1999,
    category: "Shoes",
    stock: 25,
    description: "Light and comfortable shoes for daily running.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop",
  },
  {
    title: "Casual Sneakers",
    price: 1499,
    category: "Shoes",
    stock: 18,
    description: "Everyday sneakers that go with any outfit.",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600",
  },
  {
    title: "Leather Formal Shoes",
    price: 2999,
    category: "Shoes",
    stock: 10,
    description: "Classic formal shoes for office and events.",
    image:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=600",
  },
  {
    title: "Cotton T-Shirt",
    price: 499,
    category: "Clothing",
    stock: 60,
    description: "Soft 100% cotton t-shirt.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
  },
  {
    title: "Denim Jeans",
    price: 1299,
    category: "Clothing",
    stock: 30,
    description: "Slim fit denim jeans.",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
  },
  {
    title: "Hooded Sweatshirt",
    price: 1199,
    category: "Clothing",
    stock: 22,
    description: "Warm hoodie with front pocket.",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
  },
  {
    title: "Wireless Earbuds",
    price: 1799,
    category: "Electronics",
    stock: 40,
    description: "Bluetooth earbuds with charging case.",
    image:
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600",
  },
  {
    title: "Bluetooth Speaker",
    price: 2499,
    category: "Electronics",
    stock: 15,
    description: "Portable speaker with deep bass.",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
  },
  {
    title: "Smart Watch",
    price: 3499,
    category: "Electronics",
    stock: 12,
    description: "Fitness tracking smart watch.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
  },
  {
    title: "Backpack",
    price: 999,
    category: "Accessories",
    stock: 35,
    description: "Water resistant backpack with laptop pocket.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
  },
  {
    title: "Sunglasses",
    price: 799,
    category: "Accessories",
    stock: 3,
    description: "UV protected sunglasses.",
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
  },
  {
    title: "Leather Wallet",
    price: 599,
    category: "Accessories",
    stock: 0,
    description: "Slim leather wallet.",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600",
  },
  {
    title: "Water Bottle",
    price: 349,
    category: "Home",
    stock: 80,
    description: "1 litre steel water bottle.",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600",
  },
  {
    title: "Desk Lamp",
    price: 899,
    category: "Home",
    stock: 20,
    description: "LED desk lamp with 3 brightness levels.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600",
  },
];

const seed = async () => {
  try {
    await connectDB();

    for (const product of sampleProducts) {
      await Product.findOneAndUpdate(
        { title: product.title },
        { $set: product },
        {
          upsert: true,
          returnDocument: "after",
          runValidators: true,
        }
      );
    }

    console.log(
      `${sampleProducts.length} products and images updated successfully!`
    );
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();
