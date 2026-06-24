const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
    }, // e.g. "ORD-1234" — auto-generate karenge save se pehle

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }, // Agar guest checkout hai toh null hoga

    // Customer details (Chahe logged in ho ya guest)
    customer: { type: String, required: true },
    email:    { type: String, required: true },
    phone:    { type: String, required: true },
    address:  { type: String, required: true },
    city:     { type: String, required: true },

    // Ordered items ki list
    items: [
      {
        productId:     { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name:          String,
        price:         Number,
        quantity:      Number,
        selectedSize:  String,
        selectedColor: String,
        image:         String,
      },
    ],

    paymentMethod: {
      type: String,
      enum: ["COD", "Card"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    // Price breakdown
    subtotal:    { type: Number, required: true },
    discount:    { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 15 },
    total:       { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Order save hone se pehle ek unique orderId auto-generate karo
orderSchema.pre("save", async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderId = `ORD-${1000 + count + 1}`; // e.g. ORD-1001, ORD-1002
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
