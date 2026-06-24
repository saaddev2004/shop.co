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

// Admin Routes (Sirf admin access kar sakta hai)
// In par humne pehle 'protect' lagaya (login check karne ke liye) aur phir 'admin' (role check karne ke liye)
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
