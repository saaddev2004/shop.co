const User = require("../models/User.model");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validation - check if all fields are filled
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User with this email already exists" });
    }

    // 3. Create new user in the database
    // (Note: Password will be automatically hashed because of Step 2.2 pre-save middleware)
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      // 4. Generate token and set cookie (Step 3.1)
      generateToken(res, user._id, user.role);

      // 5. Send success response back to frontend
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation - check if both fields are filled
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    // 2. Find user in database. 
    // Note: We use .select("+password") because in Step 2.1 we set select: false for password
    const user = await User.findOne({ email }).select("+password");

    // 3. Check if user exists AND if the password matches (Using Step 2.3 function)
    if (user && (await user.comparePassword(password))) {
      // 4. Generate token (Step 3.1)
      generateToken(res, user._id, user.role);

      // 5. Send success response
      res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = (req, res) => {
  // Clear the cookie by setting it to an empty string and expiring it immediately
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user.id aayega Step 4 (Middleware) ki wajah se jo hum baad mein banayenge
    const user = await User.findById(req.user.id);

    if (user) {
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Get Me Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
};
