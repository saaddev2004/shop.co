const mongoose = require("mongoose");

// Serverless mein connection reuse karne ke liye cache
let cached = global._mongooseCache;
if (!cached) cached = global._mongooseCache = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
      .then((m) => {
        console.log("✅ MongoDB Connected");
        return m;
      })
      .catch((err) => {
        cached.promise = null; // agli request pe dobara try ho
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;