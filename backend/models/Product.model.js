const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      default: "" 
    },
    price: { 
      type: Number, 
      required: true 
    },
    oldPrice: { 
      type: Number, 
      default: null 
    },
    discount: { 
      type: String, 
      default: null 
    }, 
    category: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      required: true 
    }, // Main display image
    allImages: [
      {
        color: String,
        url: String,
      },
    ], // Different color images
    sizes: [
      { 
        type: String 
      }
    ], // e.g. ["Small", "Medium", "Large"]
    colors: [
      { 
        type: String 
      }
    ], // e.g. ["#000000", "#FFFFFF"]
    colorStock: {
      type: Map,
      of: Number,
      default: {},
    }, // Track stock for each color
    rating: { 
      type: Number, 
      default: 4.5, 
      min: 0, 
      max: 5 
    },
    isOnSale: { 
      type: Boolean, 
      default: false 
    },
    isNewArrival: { 
      type: Boolean, 
      default: false 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Jis admin ne yeh product add kiya uski ID
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt dates
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
