const Review = require("../models/Review.model");
const Product = require("../models/Product.model");

// Helper: Recalculate and update product's average rating
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });

  if (reviews.length === 0) {
    await Product.findByIdAndUpdate(productId, { rating: 0 });
    return;
  }

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(productId, { rating: Math.round(avgRating * 10) / 10 });
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews", error: error.message });
  }
};

// @desc    Submit a review for a product
// @route   POST /api/reviews/product/:productId
// @access  Private (User)
const submitReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = new Review({
      product: productId,
      user: req.user._id,
      rating,
      comment,
    });

    await review.save();

    // Recalculate the product's average rating after new review is saved
    await updateProductRating(productId);

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    // Handle the duplicate review error (unique index violation)
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }
    res.status(500).json({ message: "Failed to submit review", error: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const productId = review.product;
    await Review.deleteOne({ _id: review._id });

    // Recalculate product rating after review is deleted
    await updateProductRating(productId);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review", error: error.message });
  }
};

module.exports = {
  getProductReviews,
  submitReview,
  deleteReview,
};
