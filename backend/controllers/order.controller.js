const Order = require("../models/Order.model");

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private (User) or Guest
const placeOrder = async (req, res) => {
  try {
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
      return res.status(400).json({ message: "Order has no items" });
    }

    const order = new Order({
      // Save user ID if logged in, otherwise null (guest checkout)
      user: req.user ? req.user._id : null,
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
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to place order", error: error.message });
  }
};

// @desc    Get all orders of the logged-in user
// @route   GET /api/orders/my-orders
// @access  Private (User)
const getMyOrders = async (req, res) => {
  try {
    // Fetch only orders belonging to the current logged-in user, latest first
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
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

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all orders (Admin panel)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    // Fetch all orders and populate user name and email alongside
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
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
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Failed to update order status", error: error.message });
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
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error: error.message });
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
