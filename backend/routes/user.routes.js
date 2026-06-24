const express = require("express");
const { getAllUsers, deleteUser } = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");
const { admin } = require("../middleware/admin.middleware");

const router = express.Router();

// Admin Routes (both protect and admin middlewares required)
router.get("/", protect, admin, getAllUsers);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
