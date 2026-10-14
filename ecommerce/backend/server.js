
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth_Routes.js";
import productRoutes from "./routes/product_Routes.js";
import orderRoutes from "./routes/order_Routes.js";

// Load environment variables
dotenv.config();

console.log(
  "JWT_SECRET loaded:",
  Boolean(process.env.JWT_SECRET)
);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Test route
app.get("/", (req, res) => {
  res.status(200).send("API is running...");
});

// Start server after database connection
const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server started successfully! PORT: ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
