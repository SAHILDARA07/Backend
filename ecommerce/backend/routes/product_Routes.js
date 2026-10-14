import express from "express";
import {
  createProduct,
  deleteProduct,
  getCategories,
  getProduct,
  getSingleProduct,
  updateProduct,
} from "../controllers/product_controller.js";
import { verifyToken, isAdmin } from "../middleware/auth_middleware.js";

const router = express.Router();

// anyone can see the products
router.get("/", getProduct); // get products (search, filter, sort, pagination)
router.get("/categories", getCategories); // get all categories (keep this above "/:id")
router.get("/:id", getSingleProduct); // get one product

// only a logged in admin can add, update or delete
router.post("/add", verifyToken, isAdmin, createProduct); // create
router.put("/update/:id", verifyToken, isAdmin, updateProduct); // update product
router.delete("/delete/:id", verifyToken, isAdmin, deleteProduct); // delete product

export default router;