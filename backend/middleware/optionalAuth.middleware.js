const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

// Optional protect — attaches user to req if token exists, but allows requests without token (guest)
const optionalProtect = async (req, res, next) => {
  if (req.cookies.token) {
    try {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (error) {
      // Token is invalid — treat as guest
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

module.exports = { optionalProtect };
