import express from "express";
import {
  cancelMyOrder,
  createOrder,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/order_controller.js";
import { verifyToken, isAdmin } from "../middleware/auth_middleware.js";

const router = express.Router();

// logged in users
router.post("/", verifyToken, createOrder); // place an order
router.get("/my", verifyToken, getMyOrders); // my orders
router.put("/cancel/:id", verifyToken, cancelMyOrder); // cancel my pending order

// only admin
router.get("/", verifyToken, isAdmin, getAllOrders); // all orders
router.put("/status/:id", verifyToken, isAdmin, updateOrderStatus); // change status

export default router;