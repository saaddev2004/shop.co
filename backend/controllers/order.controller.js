const Order = require("../models/Order.model");

// @desc    Naya order place karna
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
      return res.status(400).json({ message: "Order mein koi item nahi hai" });
    }

    const order = new Order({
      // Agar user logged in hai toh uski ID save karo, warna null (guest)
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
    res.status(500).json({ message: "Order place karne mein masla aaya", error: error.message });
  }
};

// @desc    Logged-in user ke sare orders dekhna
// @route   GET /api/orders/my-orders
// @access  Private (User)
const getMyOrders = async (req, res) => {
  try {
    // Sirf uss user ke orders lao jinka ID req.user._id se match kare
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Orders fetch karne mein masla aaya", error: error.message });
  }
};

// @desc    Kisi ek order ki detail ID se dekhna
// @route   GET /api/orders/:id
// @access  Private (User/Admin)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order nahi mila" });
    }

    // Security check: Sirf khud ka order dekh sakta hai, ya Admin
    if (order.user && order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Yeh order dekhne ki ijazat nahi" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Sare orders dekhna (Admin panel ke liye)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    // Sare orders lao aur sath mein customer ka naam bhi populate karo
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Orders fetch karne mein masla aaya", error: error.message });
  }
};

// @desc    Order ka status update karna (Pending → Shipped etc.)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order nahi mila" });
    }

    order.status = req.body.status || order.status;

    // Agar order deliver ho gaya toh payment status bhi Paid kar do (COD ke liye)
    if (req.body.status === "Delivered" && order.paymentMethod === "COD") {
      order.paymentStatus = "Paid";
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Status update karne mein masla aaya", error: error.message });
  }
};

// @desc    Order delete karna
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order nahi mila" });
    }

    await Order.deleteOne({ _id: order._id });
    res.json({ message: "Order delete ho gaya" });
  } catch (error) {
    res.status(500).json({ message: "Order delete karne mein masla aaya", error: error.message });
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
