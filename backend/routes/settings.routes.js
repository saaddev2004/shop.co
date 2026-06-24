const express = require("express");
const { getSettings, updateSettings } = require("../controllers/settings.controller");
const { protect } = require("../middleware/auth.middleware");
const { admin } = require("../middleware/admin.middleware");

const router = express.Router();

// Admin Routes
router.get("/", protect, admin, getSettings);
router.put("/", protect, admin, updateSettings);

module.exports = router;
