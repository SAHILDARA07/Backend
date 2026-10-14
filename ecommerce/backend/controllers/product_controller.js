import mongoose from "mongoose";
import Product from "../models/product_model.js";


const checkProduct = (data) => {
  if (typeof data.title !== "string" || data.title.trim() === "") {
    return "Title is required !";
  }

  if (data.price === "" || data.price === undefined || data.price === null) {
    return "Price is required !";
  }

  if (isNaN(Number(data.price)) || Number(data.price) < 0) {
    return "Price must be a number and 0 or more !";
  }

  if (data.stock !== "" && data.stock !== undefined && data.stock !== null) {
    if (!Number.isInteger(Number(data.stock)) || Number(data.stock) < 0) {
      return "Stock must be a whole number and 0 or more !";
    }
  }

  return "";
};

const getProductData = (body) => {
  let stock = 0;
  if (body.stock !== "" && body.stock !== undefined && body.stock !== null) {
    stock = Number(body.stock);
  }

  return {
    title: body.title.trim(),
    description: String(body.description || "").trim(),
    price: Number(body.price),
    category: String(body.category || "").trim(),
    image: String(body.image || "").trim(),
    stock: stock,
  };
};

// create product
export const createProduct = async (req, res) => {
  try {
    const message = checkProduct(req.body);
    if (message) {
      return res.status(400).json({ message });
    }

    const product = await Product.create(getProductData(req.body));
    res.status(201).json({
      message: "Product added successfully !",
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error !" });
  }
};

// get all product (with search, filter, sort and pagination)
// example: /api/products?search=shoe&category=Shoes&minPrice=100&maxPrice=2000&sort=price_asc&page=2&limit=8
export const getProduct = async (req, res) => {
  try {
    // page and limit (how many products on one page)
    let page = Number(req.query.page);
    let limit = Number(req.query.limit);

    if (!Number.isInteger(page) || page < 1) {
      page = 1;
    }
    if (!Number.isInteger(limit) || limit < 1) {
      limit = 12;
    }
    if (limit > 100) {
      limit = 100;
    }

    // build the filter step by step, only with the things the user selected
    const filter = {};

    // search in title and description
    if (
      typeof req.query.search === "string" &&
      req.query.search.trim() !== ""
    ) {
      // special characters like ( or * are written with a \ before them,
      // so the user's text is searched as normal text, not as a regex pattern
      const text = req.query.search
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      filter.$or = [
        { title: { $regex: text, $options: "i" } },
        { description: { $regex: text, $options: "i" } },
      ];
    }

    // category
    if (typeof req.query.category === "string" && req.query.category !== "") {
      filter.category = req.query.category;
    }

    // price range
    const priceFilter = {};
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;

    if (minPrice !== undefined && minPrice !== "" && !isNaN(Number(minPrice))) {
      priceFilter.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined && maxPrice !== "" && !isNaN(Number(maxPrice))) {
      priceFilter.$lte = Number(maxPrice);
    }
    if (Object.keys(priceFilter).length > 0) {
      filter.price = priceFilter;
    }

    // sorting: we only allow these 4 options (_id is added so the order stays the same on every page)
    let sortOption = { createdAt: -1, _id: -1 };
    if (req.query.sort === "price_asc") {
      sortOption = { price: 1, _id: 1 };
    } else if (req.query.sort === "price_desc") {
      sortOption = { price: -1, _id: 1 };
    } else if (req.query.sort === "title_asc") {
      sortOption = { title: 1, _id: 1 };
    }

    // the same filter is used for counting and for finding
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit) || 1;

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      currentPage: page,
      totalPages,
      totalProducts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error !" });
  }
};

// get all the categories (for the category dropdown)
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");

    // remove empty categories and sort a to z
    const cleanCategories = categories.filter((category) => category);
    cleanCategories.sort();

    res.json(cleanCategories);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error !" });
  }
};

// get one product by id
export const getSingleProduct = async (req, res) => {
  try {
    // if the id is not a valid mongodb id, stop here
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id !" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found !" });
    }

    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error !" });
  }
};

// update Product
export const updateProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id !" });
    }

    const message = checkProduct(req.body);
    if (message) {
      return res.status(400).json({ message });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      getProductData(req.body),
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found !" });
    }

    res.json({
      message: "Product updated successfully !",
      updatedProduct,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error !" });
  }
};

// delete Product
export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid product id !" });
    }

    const deleted = await Product.findByIdAndDelete(req.params.id);

    // check first, then send the success message
    if (!deleted) {
      return res.status(404).json({ message: "Product not found !" });
    }

    res.json({ message: "Product deleted successfully !", deleted });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server error !" });
  }
};