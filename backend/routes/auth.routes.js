const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require("../controllers/auth.controller");

// Step 4 ka middleware (Jab hum banayenge toh yahan use karenge)
// const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Public Routes (Koi bhi access kar sakta hai)
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Private Route (Sirf logged-in users ke liye - baad me protect middleware lagega)
router.get("/me", getMe);

module.exports = router;
