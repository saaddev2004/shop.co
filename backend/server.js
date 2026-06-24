const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(express.json());          // Parse incoming JSON body
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cookieParser());          // Parse cookies

// CORS — allow requests from the React frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // Allow cookies to be sent cross-origin
  })
);

// ── Routes ─────────────────────────────────────────────────
// (We will plug routes in here one by one as we build them)
app.use("/api/auth",     require("./routes/auth.routes"));
// app.use("/api/users",    require("./routes/user.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/orders",   require("./routes/order.routes"));
// app.use("/api/reviews",  require("./routes/review.routes"));
// app.use("/api/settings", require("./routes/settings.routes"));

// ── Health Check Route ──────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Shop.co API is running ✅",
    version: "1.0.0",
  });
});

// ── Global Error Handler (must be LAST middleware) ──────────
app.use(errorHandler);

// ── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
