const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require("../controllers/auth.controller");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Private Route (requires login)
router.get("/me", protect, getMe);

module.exports = router;
