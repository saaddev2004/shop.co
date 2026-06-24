const Settings = require("../models/Settings.model");

// @desc    Get store settings
// @route   GET /api/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
  try {
    // Find the single settings document. If it doesn't exist yet, create it with defaults.
    let settings = await Settings.findOne({});

    if (!settings) {
      settings = await Settings.create({});
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings", error: error.message });
  }
};

// @desc    Update store settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({});

    if (!settings) {
      // If no settings document exists, create one with the incoming data
      settings = await Settings.create(req.body);
    } else {
      // Update only the fields provided, keep existing values for others
      settings.storeName = req.body.storeName || settings.storeName;
      settings.currency = req.body.currency || settings.currency;
      settings.deliveryFee = req.body.deliveryFee !== undefined ? req.body.deliveryFee : settings.deliveryFee;
      settings.discountPercent = req.body.discountPercent !== undefined ? req.body.discountPercent : settings.discountPercent;

      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings", error: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
