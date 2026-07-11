const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("./models/Product.model");
const Order = require("./models/Order.model");

const TEST_PRODUCT_FILTER = {
  $or: [
    { name: "Test Shirt" },
    { name: /^Test /i },
    { description: "Test" },
  ],
};

const TEST_ORDER_FILTER = {
  $or: [
    { customer: "Test User" },
    { customer: "Test" },
    { email: "test@test.com" },
    { email: "test@example.com" },
    { "items.name": "Test Shirt" },
  ],
};

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const productResult = await Product.deleteMany(TEST_PRODUCT_FILTER);
    const orderResult = await Order.deleteMany(TEST_ORDER_FILTER);

    console.log(`Deleted ${productResult.deletedCount} test product(s)`);
    console.log(`Deleted ${orderResult.deletedCount} test order(s)`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
