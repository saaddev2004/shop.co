const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User.model");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@shop.co";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      console.log("Admin already exists in the database.");
      // Ensure role is admin
      if (adminExists.role !== "admin") {
        adminExists.role = "admin";
        await adminExists.save();
        console.log("Updated existing user to admin role.");
      }
    } else {
      const adminUser = await User.create({
        name: "Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      console.log("Admin user seeded successfully:", adminUser.email);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
