const jwt = require("jsonwebtoken");

// Creates a JWT token and sets it as an HttpOnly cookie on the response
const generateToken = (res, userId, role) => {
  // Sign the token with user's id and role
  const token = jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );

  // Set token in HttpOnly cookie (JS cannot access it — XSS safe)
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

module.exports = generateToken;
