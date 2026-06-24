const express = require("express");
const { placeOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, deleteOrder } = require("../controllers/order.controller");
const { protect } = require("../middleware/auth.middleware");
const { admin } = require("../middleware/admin.middleware");

const router = express.Router();

// User Routes
// ⚠️ /my-orders must be defined before /:id to avoid being treated as an ID
router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// Admin Routes
router.get("/", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.delete("/:id", protect, admin, deleteOrder);

module.exports = router;
