const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    // select: false — password never returned in queries by default
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    // Only "user" or "admin" allowed
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    phone:   { type: String, default: "" },
    address: { type: String, default: "" },
    city:    { type: String, default: "" },
    avatar:  { type: String, default: "" },
  },
  { timestamps: true } // auto adds createdAt & updatedAt
);

// Hash password before saving — only if it was modified
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare typed password with hashed DB password at login
userSchema.methods.comparePassword = async function (typedPassword) {
  return await bcrypt.compare(typedPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
