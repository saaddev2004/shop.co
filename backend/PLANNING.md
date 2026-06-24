# 🛒 Shop.co — Backend Planning Document
### Stack: Node.js + Express.js + MongoDB (Mongoose) + JWT

---

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB connection setup
├── controllers/
│   ├── auth.controller.js     # Register, Login, Logout, Get Me
│   ├── product.controller.js  # CRUD operations for products
│   ├── order.controller.js    # Place order, get orders, update status
│   ├── user.controller.js     # User profile management
│   ├── review.controller.js   # Product reviews
│   └── settings.controller.js # Admin store settings
├── middleware/
│   ├── auth.middleware.js     # Verify JWT token (user)
│   ├── admin.middleware.js    # Verify Admin role
│   └── errorHandler.js       # Global error handler
├── models/
│   ├── User.model.js
│   ├── Product.model.js
│   ├── Order.model.js
│   ├── Review.model.js
│   └── Settings.model.js
├── routes/
│   ├── auth.routes.js
│   ├── product.routes.js
│   ├── order.routes.js
│   ├── user.routes.js
│   ├── review.routes.js
│   └── settings.routes.js
├── utils/
│   └── generateToken.js       # JWT token generation helper
├── .env                       # Environment variables (DO NOT commit to git!)
├── .env.example               # Template file (safe to commit)
├── server.js                  # Application entry point
├── PLANNING.md                # This file
└── package.json
```

---

## 🗄️ MongoDB Schemas (5 Collections)

### 1. 👤 User Schema — `models/User.model.js`

```js
{
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true },
  password:    { type: String, required: true },     // bcrypt hashed — never store plain text!
  role:        { type: String, enum: ["user", "admin"], default: "user" },
  joinDate:    { type: Date, default: Date.now },
  avatar:      { type: String, default: "" },        // profile picture URL
  phone:       { type: String, default: "" },
  address:     { type: String, default: "" },
  city:        { type: String, default: "" },
  timestamps:  true                                  // auto adds createdAt, updatedAt
}
```

### 2. 👕 Product Schema — `models/Product.model.js`

```js
{
  name:         { type: String, required: true },
  description:  { type: String, default: "" },
  price:        { type: Number, required: true },
  oldPrice:     { type: Number, default: null },
  discount:     { type: String, default: null },      // e.g. "-20%"
  category:     { type: String, required: true },     // e.g. "T-Shirts", "Jeans"
  image:        { type: String, required: true },     // main image URL
  allImages: [
    {
      color: String,
      url:   String
    }
  ],
  sizes:        [{ type: String }],                  // ["XS", "S", "M", "L", "XL"]
  colors:       [{ type: String }],                  // ["#000000", "#FFFFFF"]
  colorStock:   { type: Map, of: Number, default: {} }, // { "#000": 10, "#fff": 5 }
  rating:       { type: Number, default: 4.5, min: 0, max: 5 },
  isOnSale:     { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  createdBy:    { type: ObjectId, ref: "User" },     // admin who added this product
  timestamps:   true
}
```

### 3. 📦 Order Schema — `models/Order.model.js`

```js
{
  orderId:   { type: String, unique: true },          // e.g. "ORD-1234"
  user:      { type: ObjectId, ref: "User" },         // null if guest checkout
  customer:  { type: String, required: true },        // full name
  email:     { type: String, required: true },
  phone:     { type: String, required: true },
  address:   { type: String, required: true },
  city:      { type: String, required: true },
  items: [
    {
      productId:     { type: ObjectId, ref: "Product" },
      name:          String,
      price:         Number,
      quantity:      Number,
      selectedSize:  String,
      selectedColor: String,
      image:         String,
    }
  ],
  paymentMethod: { type: String, enum: ["COD", "Card"], required: true },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
  status: {
    type:    String,
    enum:    ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  },
  subtotal:    { type: Number, required: true },
  discount:    { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 15 },
  total:       { type: Number, required: true },
  date:        { type: Date, default: Date.now },
  timestamps:  true
}
```

### 4. ⭐ Review Schema — `models/Review.model.js`

```js
{
  product:   { type: ObjectId, ref: "Product", required: true },
  user:      { type: ObjectId, ref: "User", required: true },
  rating:    { type: Number, required: true, min: 1, max: 5 },
  comment:   { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
}
```

### 5. ⚙️ Settings Schema — `models/Settings.model.js`

```js
{
  storeName:       { type: String, default: "SHOP.CO" },
  currency:        { type: String, default: "PKR (Rs.)" },
  deliveryFee:     { type: Number, default: 15 },
  discountPercent: { type: Number, default: 20 },
  // NOTE: Admin credentials are stored in .env — NOT in the database
}
```

---

## 🛣️ API Routes

### 🔐 Auth Routes — `/api/auth`
| Method   | Endpoint        | Description                       | Auth Required |
|----------|-----------------|-----------------------------------|---------------|
| `POST`   | `/register`     | Register a new user               | ❌ Public     |
| `POST`   | `/login`        | Login and receive JWT cookie      | ❌ Public     |
| `POST`   | `/logout`       | Logout and clear cookie           | ✅ User       |
| `GET`    | `/me`           | Get currently logged-in user info | ✅ User       |
| `POST`   | `/admin/login`  | Admin login                       | ❌ Public     |

### 👤 User Routes — `/api/users`
| Method   | Endpoint            | Description              | Auth Required |
|----------|---------------------|--------------------------|---------------|
| `GET`    | `/profile`          | Get own profile          | ✅ User       |
| `PUT`    | `/profile`          | Update profile details   | ✅ User       |
| `PUT`    | `/change-password`  | Change password          | ✅ User       |
| `GET`    | `/`                 | Get all users list       | ✅ Admin      |
| `DELETE` | `/:id`              | Delete a user            | ✅ Admin      |

### 👕 Product Routes — `/api/products`
| Method   | Endpoint          | Description                        | Auth Required |
|----------|-------------------|------------------------------------|---------------|
| `GET`    | `/`               | Get all products (filter/sort/search) | ❌ Public  |
| `GET`    | `/:id`            | Get single product by ID           | ❌ Public     |
| `GET`    | `/new-arrivals`   | Get new arrival products           | ❌ Public     |
| `GET`    | `/on-sale`        | Get products currently on sale     | ❌ Public     |
| `POST`   | `/`               | Add a new product                  | ✅ Admin      |
| `PUT`    | `/:id`            | Update an existing product         | ✅ Admin      |
| `DELETE` | `/:id`            | Delete a product                   | ✅ Admin      |

### 📦 Order Routes — `/api/orders`
| Method   | Endpoint        | Description                   | Auth Required  |
|----------|-----------------|-------------------------------|----------------|
| `POST`   | `/`             | Place a new order             | ✅ User/Guest  |
| `GET`    | `/my-orders`    | Get logged-in user's orders   | ✅ User        |
| `GET`    | `/:id`          | Get single order details      | ✅ User/Admin  |
| `GET`    | `/`             | Get all orders (admin panel)  | ✅ Admin       |
| `PUT`    | `/:id/status`   | Update order status           | ✅ Admin       |
| `DELETE` | `/:id`          | Delete an order               | ✅ Admin       |

### ⭐ Review Routes — `/api/reviews`
| Method   | Endpoint                  | Description                  | Auth Required |
|----------|---------------------------|------------------------------|---------------|
| `GET`    | `/product/:productId`     | Get all reviews for a product | ❌ Public    |
| `POST`   | `/product/:productId`     | Submit a review               | ✅ User      |
| `DELETE` | `/:reviewId`              | Delete a review               | ✅ Admin     |

### ⚙️ Settings Routes — `/api/settings`
| Method | Endpoint | Description                  | Auth Required |
|--------|----------|------------------------------|---------------|
| `GET`  | `/`      | Get store settings           | ✅ Admin      |
| `PUT`  | `/`      | Update store settings        | ✅ Admin      |

### 📧 Newsletter Routes — `/api/newsletter`
| Method | Endpoint     | Description              | Auth Required |
|--------|--------------|--------------------------|---------------|
| `POST` | `/subscribe` | Subscribe with an email  | ❌ Public     |

---

## 🔐 Security Strategy — JWT + HttpOnly Cookie

### Why JWT + HttpOnly Cookie? (Recommended Approach)

```
User submits login credentials
          ↓
Server verifies password using bcrypt
          ↓
Server generates a JWT token (via jsonwebtoken)
          ↓
Token is sent inside an HttpOnly Cookie (NOT localStorage!)
          ↓
Browser automatically sends the cookie on every request
          ↓
auth.middleware.js extracts and verifies the JWT from the cookie
          ↓
Controller function executes
```

### Security Comparison

| Feature                  | localStorage JWT | HttpOnly Cookie JWT ✅ |
|--------------------------|------------------|-----------------------|
| XSS Attack protection    | ❌ Vulnerable    | ✅ Safe (JS cannot access) |
| CSRF Attack protection   | ✅ Safe          | ⚠️ Use `csurf` middleware  |
| Auto-sent on requests    | ❌ Manual code   | ✅ Automatic               |
| Easy logout              | ❌ Manual clear  | ✅ Just clear the cookie   |
| Stateless architecture   | ✅ Yes           | ✅ Yes                     |

### JWT Token Payload Structure

```js
// Payload stored inside the JWT
{
  id:   "user_mongodb_object_id",
  role: "user",     // or "admin"
  iat:  1234567890, // issued at (auto)
  exp:  1234567890  // expires after 7 days
}
```

### Middleware Execution Chain

```
Incoming Request
       ↓
cookie-parser  →  reads the cookie
       ↓
auth.middleware.js  →  verifies JWT, attaches user to req.user
       ↓
(if admin route) → admin.middleware.js  →  checks req.user.role === "admin"
       ↓
Controller function runs
```

---

## 🌍 Environment Variables — `.env`

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shopco_db

# JWT
JWT_SECRET=your_long_random_secret_key_minimum_32_characters
JWT_EXPIRE=7d

# Frontend URL (for CORS configuration)
CLIENT_URL=http://localhost:3000

# Admin Credentials (stored here, NOT in the database)
ADMIN_EMAIL=admin@shop.co
ADMIN_PASSWORD=admin123
```

---

## 📦 NPM Packages

```bash
# Navigate into the backend folder
cd backend

# Initialize package.json
npm init -y

# Install production dependencies
npm install express mongoose dotenv bcryptjs jsonwebtoken cookie-parser cors

# Install development dependencies
npm install -D nodemon
```

### Package Reference

| Package          | Purpose                                               |
|------------------|-------------------------------------------------------|
| `express`        | Backend web framework                                 |
| `mongoose`       | MongoDB ODM — for schema definition and queries       |
| `dotenv`         | Loads environment variables from `.env` file          |
| `bcryptjs`       | Securely hashes passwords before storing              |
| `jsonwebtoken`   | Creates and verifies JWT tokens                       |
| `cookie-parser`  | Parses cookies from incoming requests                 |
| `cors`           | Allows frontend (localhost:3000) to access the API    |
| `nodemon`        | Auto-restarts server on file save (dev only)          |

---

## 🗓️ Implementation Order (Step by Step)

```
Step 1  →  server.js + db.js + .env setup
Step 2  →  User model + bcrypt password hashing
Step 3  →  Auth routes (Register / Login / Logout / Me)
Step 4.1 →  JWT auth middleware (auth.middleware.js) & apply to routes
Step 4.2 →  JWT admin middleware (admin.middleware.js)
Step 5.1 →  Product Model (Product.model.js)
Step 5.2 →  Product Public API (Get Products, New Arrivals, On Sale)
Step 5.3 →  Product Admin API (Add, Update, Delete Products)
Step 6.1 →  Order Model (Order.model.js)
Step 6.2 →  User Order Routes (Place order, My orders, Single order)
Step 6.3 →  Admin Order Routes (All orders, Update status, Delete)
Step 7  →  Admin routes (manage orders, users, settings)
Step 8  →  Review routes
Step 9  →  Frontend integration (replace Context localStorage with real API calls)
```

---

## ⚠️ Important Rules

1. **Never store plain text passwords** — always hash using `bcryptjs` before saving to DB.
2. **Keep JWT_SECRET strong** — minimum 32 random characters, never share it.
3. **Never commit `.env` to Git** — add it to `.gitignore` immediately.
4. **Configure CORS properly** — only allow requests from your `CLIENT_URL`.
5. **Never hardcode admin credentials** — always read from `.env`.

---

*Planning Document | Shop.co Backend | June 2026*
