const express = require("express");
const { getProductReviews, submitReview, deleteReview } = require("../controllers/review.controller");
const { protect } = require("../middleware/auth.middleware");
const { admin } = require("../middleware/admin.middleware");

const router = express.Router();

// Public Route
router.get("/product/:productId", getProductReviews);

// Private Route (logged-in user)
router.post("/product/:productId", protect, submitReview);

// Admin Route
router.delete("/:reviewId", protect, admin, deleteReview);

module.exports = router;
