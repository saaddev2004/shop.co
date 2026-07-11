const Order = require("../models/Order.model");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User.model");

const formatOrder = (order) => {
  const obj = order.toObject ? order.toObject() : order;
  return {
    ...obj,
    id: obj.orderId || obj._id?.toString(),
  };
};

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private (User) or Guest
const placeOrder = async (req, res) => {
  try {
    // Optionally identify the user if they are logged in (cookie present)
    let userId = null;
    if (req.cookies && req.cookies.token) {
      try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("_id");
        if (user) userId = user._id;
      } catch (e) {
        // Invalid token — treat as guest
      }
    }

    const {
      customer,
      email,
      phone,
      address,
      city,
      items,
      paymentMethod,
      subtotal,
      discount,
      deliveryFee,
      total,
    } = req.body;

    // Basic validation
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Order has no items" });
    }

    const sanitizedItems = items.map((item) => {
      const sanitized = { ...item };
      if (sanitized.productId && !mongoose.Types.ObjectId.isValid(sanitized.productId)) {
        delete sanitized.productId;
      }
      return sanitized;
    });

    const order = new Order({
      user: userId,
      customer,
      email,
      phone,
      address,
      city,
      items: sanitizedItems,
      paymentMethod,
      subtotal,
      discount,
      deliveryFee,
      total,
    });

    const createdOrder = await order.save();
    res.status(201).json({ success: true, order: formatOrder(createdOrder) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to place order", error: error.message });
  }
};

// @desc    Get all orders of the logged-in user
// @route   GET /api/orders/my-orders
// @access  Private (User)
const getMyOrders = async (req, res) => {
  try {
    // Fetch only orders belonging to the current logged-in user, latest first
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders: orders.map(formatOrder) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders", error: error.message });
  }
};

// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// @access  Private (User/Admin)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Security check: only the order owner or an admin can view it
    if (order.user && order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json({ success: true, order: formatOrder(order) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc    Get all orders (Admin panel)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders and populate user name and email alongside
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json({ success: true, orders: orders.map(formatOrder) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch orders", error: error.message });
  }
};

// @desc    Update order status (Pending → Shipped etc.)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status || order.status;

    // Auto-mark payment as Paid when order is delivered via COD
    if (req.body.status === "Delivered" && order.paymentMethod === "COD") {
      order.paymentStatus = "Paid";
    }

    const updatedOrder = await order.save();
    res.json({ success: true, order: formatOrder(updatedOrder) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update order status", error: error.message });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await Order.deleteOne({ _id: order._id });
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete order", error: error.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
