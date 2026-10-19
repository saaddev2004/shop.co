const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

const app = express();

// Vercel proxy ke peeche chalta hai
app.set("trust proxy", 1);

// ── Middleware ─────────────────────────────────────────────
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Har request se pehle DB connected hone ki guarantee
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

// ── Routes ─────────────────────────────────────────────────
app.use("/api/auth",     require("./routes/auth.routes"));
app.use("/api/users",    require("./routes/user.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/orders",   require("./routes/order.routes"));
app.use("/api/reviews",  require("./routes/review.routes"));
app.use("/api/settings", require("./routes/settings.routes"));

app.get("/", (req, res) => {
  res.json({ success: true, message: "Shop.co API is running ✅", version: "1.0.0" });
});

app.use(errorHandler);

// ── Local pe listen, Vercel pe sirf export ──────────────────
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

module.exports = app;