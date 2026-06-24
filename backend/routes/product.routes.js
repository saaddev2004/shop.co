const express = require("express");
const {
  getProducts,
  getProductById,
  getNewArrivals,
  getOnSaleProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const { protect } = require("../middleware/auth.middleware");
const { admin } = require("../middleware/admin.middleware");

const router = express.Router();

// Public Routes
router.get("/", getProducts);
router.get("/new-arrivals", getNewArrivals);
router.get("/on-sale", getOnSaleProducts);
router.get("/:id", getProductById);

// Admin Routes (protected by both protect and admin middlewares)
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
