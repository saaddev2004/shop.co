const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: "SHOP.CO",
    },
    currency: {
      type: String,
      default: "PKR (Rs.)",
    },
    deliveryFee: {
      type: Number,
      default: 15,
    },
    discountPercent: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
