<div align="center">

# 🛍️ SHOP.CO 

### A Full-Stack MERN E-Commerce Platform

*Modern shopping experience with a complete admin dashboard, JWT authentication, and real-time inventory management.*

<!-- Hero Banner Placeholder -->
<!-- ![Shop.co Banner](./docs/banner.png) -->

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20HttpOnly%20Cookies-black?logo=jsonwebtokens)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](#-license)
[![Status](https://img.shields.io/badge/Status-Active%20Development-orange)]()

[Overview](#-project-overview) •
[Features](#-key-features) •
[Tech Stack](#-tech-stack) •
[Installation](#-installation-guide) •
[API](#-api-overview) •
[Contributing](#-contributing-guidelines)

</div>

---

## 📚 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Screenshots](#-screenshots)
4. [Demo](#-demo)
5. [Tech Stack](#-tech-stack)
6. [Project Architecture](#-project-architecture-overview)
7. [Folder Structure](#-folder-structure)
8. [Installation Guide](#-installation-guide)
9. [Prerequisites](#-prerequisites)
10. [Environment Variables](#-environment-variables)
11. [Running Locally](#-running-the-project-locally)
12. [Build Instructions](#-build-instructions)
13. [Deployment Guide](#-deployment-guide)
14. [Available Scripts](#-available-scripts)
15. [API Overview](#-api-overview)
16. [Database Schema](#-database-schema-overview)
17. [Authentication Flow](#-authentication-flow)
18. [State Management](#-state-management)
19. [Routing Structure](#-routing-structure)
20. [Performance Optimizations](#-performance-optimizations)
21. [Security Features](#-security-features)
22. [Error Handling](#-error-handling-strategy)
23. [Responsive Design](#-responsive-design-support)
24. [Browser Compatibility](#-browser-compatibility)
25. [Future Improvements](#-future-improvements)
26. [Known Limitations](#-known-limitations)
27. [Contributing Guidelines](#-contributing-guidelines)
28. [Code Style](#-code-style)
29. [Testing](#-testing-instructions)
30. [FAQ](#-faq)
31. [Troubleshooting](#-troubleshooting)
32. [License](#-license)
33. [Author](#-author)
34. [Acknowledgements](#-acknowledgements)
35. [Contact](#-contact-information)

---

## 🌟 Project Overview

**Shop.co** is a full-stack e-commerce web application built on the **MERN stack** (MongoDB, Express, React, Node.js). It provides a complete online shopping experience — product browsing, cart management, guest and authenticated checkout, order tracking, product reviews — paired with a dedicated **admin dashboard** for managing products, orders, users, and store settings.

The project is structured as a **monorepo** with an independent `frontend/` (React SPA) and `backend/` (Express REST API), connected through a JWT + HttpOnly cookie authentication layer and a MongoDB database via Mongoose.

> 🎓 Built as a personal full-stack project to practice production-grade patterns: role-based access control, secure authentication, RESTful API design, and a component-driven React architecture.

---

## ✨ Key Features

- 🛒 **Full Shopping Flow** — browse, filter, view product details, add to cart, and checkout as a guest or logged-in user
- 🔐 **JWT Authentication** — secure login/register using HttpOnly cookies (not localStorage) to protect against XSS
- 🧑‍💼 **Role-Based Access Control** — separate `user` and `admin` roles enforced at the middleware level
- 🖥️ **Admin Dashboard** — dedicated panel with tabs for Overview, Products, Orders, Analytics, and Settings
- 👕 **Product Variants** — per-color image galleries, size options, and per-color stock tracking (`colorStock` map)
- 📦 **Order Management** — supports guest checkout, Cash on Delivery / Card payment methods, and full order lifecycle (`Pending → Processing → Shipped → Delivered → Cancelled`)
- ⭐ **Product Reviews & Ratings** — one review per user per product, enforced via a compound unique index
- ⚙️ **Dynamic Store Settings** — admin-configurable store name, currency, delivery fee, and discount percentage
- 🖼️ **Image Cropping** — built-in avatar/image cropping using `react-easy-crop`
- 🎞️ **Smooth Animations** — page and component transitions powered by `framer-motion`
- 🧭 **Client-Side Routing** — protected routes for admin-only pages via a custom `ProtectedRoute` component
- 📱 **Responsive UI** — built with Tailwind CSS utility classes across all breakpoints
- 🧵 **Product Carousels** — sliders for New Arrivals, Sale items, and Similar Products via `swiper`

---

## 🖼️ Screenshots

### 🛍️ Storefront (User-Facing)

| Home Page | Sign In | Product Details |
|:---:|:---:|:---:|
| ![Home Page](./docs/screenshots/home-page.png) | ![Sign In](./docs/screenshots/auth-login.png) | ![Product Details](./docs/screenshots/product-details.png) |

| Empty Cart | Cart | Checkout |
|:---:|:---:|:---:|
| ![Empty Cart](./docs/screenshots/empty-cart.png) | ![Cart Page](./docs/screenshots/cart-page.png) | ![Checkout Page](./docs/screenshots/checkout-page.png) |

| Order Confirmation | Live Search |
|:---:|:---:|
| ![Order Confirmation](./docs/screenshots/order-confirmation.png) | ![Search Feature](./docs/screenshots/search-feature.png) |

### 🧑‍💼 Admin Dashboard

| Admin Sign In | Dashboard — Light Mode | Dashboard — Dark Mode |
|:---:|:---:|:---:|
| ![Admin Login](./docs/screenshots/admin-login.png) | ![Dashboard Light](./docs/screenshots/admin-dashboard-light.png) | ![Dashboard Dark](./docs/screenshots/admin-dashboard-dark.png) |

| Inventory Matrix | Launch Product | Order Reconciliation |
|:---:|:---:|:---:|
| ![Inventory](./docs/screenshots/admin-inventory.png) | ![Launch Product](./docs/screenshots/admin-launch-product.png) | ![Orders](./docs/screenshots/admin-orders.png) |

| Market Intelligence (Analytics) | Store Settings | Delete Confirmation |
|:---:|:---:|:---:|
| ![Analytics](./docs/screenshots/admin-analytics.png) | ![Settings](./docs/screenshots/admin-settings.png) | ![Delete Confirm](./docs/screenshots/admin-delete-confirm.png) |

---




## 🧰 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | Core UI library (SPA) |
| **React Router DOM v7** | Client-side routing (`react-router-dom`, `react-router-hash-link`) |
| **Tailwind CSS 3.4** | Utility-first styling with a custom theme (`primary`, `secondary`, `accent` colors, custom fonts) |
| **Bootstrap 5** | Supplementary UI utilities |
| **Framer Motion** | Animations & transitions |
| **Swiper** | Carousels (New Arrivals, Sale, Similar Products) |
| **React Icons** | Icon library |
| **Axios** | HTTP client for API requests |
| **react-easy-crop** | Image cropping for avatars/product images |
| **React Scripts (CRA 5)** | Build tooling |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express 5** | REST API framework |
| **Nodemon** | Dev-time auto-restart |

### Database
| Technology | Purpose |
|---|---|
| **MongoDB** | NoSQL document database |
| **Mongoose** | ODM — schema modeling & validation |

### Authentication
| Technology | Purpose |
|---|---|
| **jsonwebtoken (JWT)** | Token generation & verification |
| **bcryptjs** | Password hashing |
| **cookie-parser** | Reading HttpOnly auth cookies |
| **Custom middleware** | `protect` (JWT check) and `admin` (role check) |

### APIs
| API Group | Description |
|---|---|
| `/api/auth` | Register, login, logout, current user |
| `/api/users` | Admin user management |
| `/api/products` | Product CRUD, new arrivals, on-sale |
| `/api/orders` | Order placement & management |
| `/api/reviews` | Product reviews |
| `/api/settings` | Store-wide configuration |

### Libraries
`axios` · `cors` · `dotenv` · `bcryptjs` · `jsonwebtoken` · `cookie-parser` · `mongoose` · `framer-motion` · `swiper` · `react-icons` · `react-easy-crop` · `react-scroll`

### Tools
`Create React App` · `PostCSS` · `Autoprefixer` · `Nodemon` · `Vercel` (deployment config present)

---

## 🏗️ Project Architecture Overview

Shop.co follows a **decoupled client-server architecture**:

```
┌─────────────────────┐        HTTPS / REST (Axios)        ┌──────────────────────┐
│                      │  ────────────────────────────────▶ │                      │
│   React Frontend     │                                    │   Express Backend    │
│   (Port 3000)        │  ◀──────────────────────────────── │   (Port 5000)        │
│                      │        JSON + HttpOnly Cookie       │                      │
└─────────────────────┘                                     └──────────┬───────────┘
                                                                        │ Mongoose ODM
                                                                        ▼
                                                              ┌──────────────────────┐
                                                              │   MongoDB Database   │
                                                              └──────────────────────┘
```

**Frontend layer:** React components are organized by feature (`pages/`) and reusable UI (`components/`). Global state (auth, cart, products, orders, settings, user) is managed through dedicated **React Context providers**, all composed in `App.js`.

**Backend layer:** Follows an **MVC-style pattern**:
- **Routes** define endpoints and attach middleware
- **Controllers** contain business logic
- **Models** define MongoDB schemas via Mongoose
- **Middleware** handles authentication (`protect`), authorization (`admin`), optional auth, and centralized error handling

**Request lifecycle (protected route example):**
```
Client Request → cookie-parser → protect (verify JWT) → admin (check role) → Controller → Mongoose → MongoDB
```

---

## 📁 Folder Structure

```
shop.co/
├── frontend/                          # React SPA (Create React App)
│   ├── public/
│   │   ├── assets/                    # Product SVGs, brand logos, icons
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/                # Reusable UI components
│   │   │   ├── header/, Footer/, hero/
│   │   │   ├── ProductCard/, SimilarProducts/, NewArrivals/, SaleSection/
│   │   │   ├── Checkout/, EmptyCart/, FilledCart/
│   │   │   ├── Newsletter/, Testimonials/, BrandStrip/
│   │   │   ├── ProtectedRoute/        # Route guard for admin pages
│   │   │   └── ScrollToTop/
│   │   ├── pages/
│   │   │   ├── HomePage/
│   │   │   ├── ShopPage/              # + components/ (ShopGrid, ShopFilters)
│   │   │   ├── DynamicProductPage/    # Product detail page (dynamic route)
│   │   │   ├── CartPage/
│   │   │   ├── AuthPage/              # + components/ (AuthForm, AuthHero, tabs)
│   │   │   └── AdminPage/             # AdminDashboard, AdminLoginPage + tab components
│   │   │       └── components/       # Overview, Products, Orders, Analytics, Settings tabs
│   │   ├── Context/                   # Global state providers
│   │   │   ├── AuthContext.js
│   │   │   ├── CartContext.js
│   │   │   ├── OrderContext.js
│   │   │   ├── ProductContext.js
│   │   │   ├── SettingsContext.js
│   │   │   └── UserContext.js
│   │   ├── data/products.js           # Static/demo product data
│   │   ├── utils/
│   │   │   ├── api.js                 # Axios instance (baseURL + credentials)
│   │   │   └── cropImage.js           # Image cropping helper
│   │   ├── App.js                     # Routes & provider composition
│   │   └── index.js                   # React entry point
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/                           # Express REST API
│   ├── config/
│   │   └── db.js                      # MongoDB connection
│   ├── controllers/                   # Business logic per resource
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   ├── user.controller.js
│   │   ├── review.controller.js
│   │   └── settings.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js         # JWT verification (protect)
│   │   ├── admin.middleware.js        # Role check (admin)
│   │   ├── optionalAuth.middleware.js # Non-blocking auth check (guest support)
│   │   └── errorHandler.js            # Global error handler
│   ├── models/                        # Mongoose schemas
│   │   ├── User.model.js
│   │   ├── Product.model.js
│   │   ├── Order.model.js
│   │   ├── Review.model.js
│   │   └── Settings.model.js
│   ├── routes/                        # Express routers
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── order.routes.js
│   │   ├── user.routes.js
│   │   ├── review.routes.js
│   │   └── settings.routes.js
│   ├── utils/
│   │   └── generateToken.js           # JWT signing helper
│   ├── seedAdmin.js                   # Script: seed an admin user from .env
│   ├── deleteTestProducts.js          # Utility/cleanup script
│   ├── server.js                      # App entry point
│   ├── PLANNING.md                    # Original backend design document
│   ├── .env.example                   # Environment variable template
│   └── package.json
│
├── vercel.json                        # Deployment config (builds frontend/build)
├── package.json                       # Root build script
└── .gitignore
```

---

## 🚀 Installation Guide

### 1. Clone the repository
```bash
git clone https://github.com/saaddev2004/shop.co
cd shop.co
```

### 2. Install dependencies

The project has **two independent `package.json` files** — install each separately.

<details>
<summary><b>Using npm</b></summary>

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```
</details>

<details>
<summary><b>Using yarn</b></summary>

```bash
# Backend
cd backend
yarn install

# Frontend
cd ../frontend
yarn install
```
</details>

<details>
<summary><b>Using pnpm</b></summary>

```bash
# Backend
cd backend
pnpm install

# Frontend
cd ../frontend
pnpm install
```
</details>

---

## ✅ Prerequisites

Make sure you have the following installed before running the project:

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | ≥ 18.x | Required to run both frontend and backend |
| **npm / yarn / pnpm** | Latest | Package manager of your choice |
| **MongoDB** | Local (Compass) or **MongoDB Atlas** | Connection string required in `.env` |
| **Git** | Any recent version | For cloning the repository |

---

## 🔑 Environment Variables

Create a `.env` file inside the **`backend/`** folder (copy from `.env.example`):

```env
# ─────────────────────────────────────────────
# Shop.co Backend — Environment Variables
# Copy this file to .env and fill in the values
# NEVER commit .env to GitHub!
# ─────────────────────────────────────────────

# Server
PORT=5000
NODE_ENV=development

# MongoDB — Local (MongoDB Compass)
MONGO_URI=mongodb://localhost:27017/shopco_db


# JWT
JWT_SECRET=your_super_secret_key_minimum_32_characters_long
JWT_EXPIRE=7d

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000

# Admin Credentials (stored here, NOT in DB)
ADMIN_EMAIL=admin@shop.co
ADMIN_PASSWORD=admin123
```

> ⚠️ The frontend currently points to a **hardcoded API base URL** (`http://localhost:5000/api`) in `frontend/src/utils/api.js`. If you deploy the backend elsewhere, update this value (or refactor it to use a `REACT_APP_API_URL` environment variable).

---

## 🏃 Running the Project Locally

You'll need **two terminals** — one for the backend, one for the frontend.

**Terminal 1 — Backend**
```bash
cd backend
npm run dev
# 🚀 Server running in development mode on port 5000
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm start
# Opens http://localhost:3000
```

**(Optional) Seed an admin account:**
```bash
cd backend
node seedAdmin.js
```
This creates/promotes a user with the credentials from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in your `.env` to the `admin` role.

---

## 🏗️ Build Instructions

Build the frontend for production:

```bash
cd frontend
npm run build      # or: yarn build / pnpm build
```

This generates an optimized static build in `frontend/build/`, ready to be served by any static host or a Node/Express static file server.

The **root** `package.json` also exposes a convenience script that installs and builds the frontend in one step (used by Vercel):
```bash
npm run build
```

---

## ☁️ Deployment Guide

The repository includes a `vercel.json` configured to serve the frontend build:

```json
{
  "outputDirectory": "frontend/build"
}
```

**Recommended deployment strategy:**

| Component | Suggested Platform |
|---|---|
| **Frontend** | Vercel / Netlify (static build output) |
| **Backend** | Render / Railway / Fly.io / a VPS (Node.js server) |
| **Database** | MongoDB Atlas (cloud cluster) |

**Steps:**
1. Deploy `backend/` to a Node-friendly host and set the environment variables listed above (using your Atlas `MONGO_URI`, a strong `JWT_SECRET`, and the deployed frontend's URL as `CLIENT_URL`).
2. Deploy `frontend/` to Vercel — Vercel will pick up `vercel.json` and output `frontend/build`.
3. Update `frontend/src/utils/api.js` to point to your deployed backend URL before building.
4. Set `NODE_ENV=production` on the backend to disable stack traces in error responses.

---

## 📜 Available Scripts

### Backend (`backend/package.json`)
| Script | Command | Description |
|---|---|---|
| `npm start` | `node server.js` | Run the server in production mode |
| `npm run dev` | `nodemon server.js` | Run the server with auto-reload (development) |

### Frontend (`frontend/package.json`)
| Script | Command | Description |
|---|---|---|
| `npm start` | `react-scripts start` | Run the app in development mode |
| `npm run build` | `CI=false react-scripts build` | Create an optimized production build |
| `npm test` | `react-scripts test` | Run the test suite in watch mode |
| `npm run eject` | `react-scripts eject` | Eject CRA configuration (irreversible) |

---

## 🔌 API Overview

Base URL: `http://localhost:5000/api`

### 🔐 Auth — `/api/auth`
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/register` | Register a new user | Public |
| `POST` | `/login` | Login, receive JWT via HttpOnly cookie | Public |
| `POST` | `/logout` | Logout and clear the auth cookie | Private |
| `GET` | `/me` | Get the currently logged-in user | Private |

### 👤 Users — `/api/users`
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | List all users | Admin |
| `DELETE` | `/:id` | Delete a user | Admin |

### 👕 Products — `/api/products`
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | List all products (filter/search) | Public |
| `GET` | `/new-arrivals` | Get newest products | Public |
| `GET` | `/on-sale` | Get discounted products | Public |
| `GET` | `/:id` | Get a single product | Public |
| `POST` | `/` | Create a product | Admin |
| `PUT` | `/:id` | Update a product | Admin |
| `DELETE` | `/:id` | Delete a product | Admin |

### 📦 Orders — `/api/orders`
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/` | Place an order (guest or user) | Public / Private |
| `GET` | `/my-orders` | Get the logged-in user's orders | Private |
| `GET` | `/:id` | Get a single order | Private |
| `GET` | `/` | List all orders | Admin |
| `PUT` | `/:id/status` | Update order status | Admin |
| `DELETE` | `/:id` | Delete an order | Admin |

### ⭐ Reviews — `/api/reviews`
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/product/:productId` | Get reviews for a product | Public |
| `POST` | `/product/:productId` | Submit a review | Private |
| `DELETE` | `/:reviewId` | Delete a review | Admin |

### ⚙️ Settings — `/api/settings`
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | Get store settings | Admin |
| `PUT` | `/` | Update store settings | Admin |

**Example request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@shop.co", "password": "admin123"}' \
  -c cookies.txt
```

---

## 🗄️ Database Schema Overview

MongoDB (via Mongoose) with **5 core collections**:

<details>
<summary><b>User</b></summary>

```js
{
  name:     String,   // required
  email:    String,   // required, unique, lowercase
  password: String,   // required, bcrypt-hashed, select: false
  role:     String,   // enum: ["user", "admin"], default: "user"
  phone:    String,
  address:  String,
  city:     String,
  avatar:   String,
  timestamps: true
}
```
</details>

<details>
<summary><b>Product</b></summary>

```js
{
  name:         String,   // required
  description:  String,
  price:        Number,   // required
  oldPrice:     Number,
  discount:     String,   // e.g. "-20%"
  category:     String,   // required
  image:        String,   // required, main image
  allImages:    [{ color: String, url: String }],
  sizes:        [String],
  colors:       [String],
  colorStock:   Map,      // per-color/size stock quantities
  rating:       Number,   // default 4.5, min 0, max 5
  isOnSale:     Boolean,
  isNewArrival: Boolean,
  createdBy:    ObjectId, // ref: "User"
  timestamps: true
}
```
</details>

<details>
<summary><b>Order</b></summary>

```js
{
  orderId:       String,  // auto-generated, e.g. "ORD-1001"
  user:          ObjectId, // ref: "User", null if guest
  customer:      String,  // required
  email:         String,  // required
  phone:         String,  // required
  address:       String,  // required
  city:          String,  // required
  items: [{
    productId: ObjectId, name: String, price: Number,
    quantity: Number, selectedSize: String,
    selectedColor: String, image: String
  }],
  paymentMethod: String,  // enum: ["COD", "Card"]
  paymentStatus: String,  // enum: ["Pending", "Paid", "Failed"]
  status:        String,  // enum: ["Pending","Processing","Shipped","Delivered","Cancelled"]
  subtotal:      Number,
  discount:      Number,
  deliveryFee:   Number,  // default 15
  total:         Number,
  timestamps: true
}
```
</details>

<details>
<summary><b>Review</b></summary>

```js
{
  product: ObjectId, // ref: "Product", required
  user:    ObjectId, // ref: "User", required
  rating:  Number,   // required, 1–5
  comment: String,
  timestamps: true
}
// Compound unique index: { product: 1, user: 1 } — one review per user per product
```
</details>

<details>
<summary><b>Settings</b></summary>

```js
{
  storeName:       String, // default: "SHOP.CO"
  currency:        String, // default: "PKR (Rs.)"
  deliveryFee:     Number, // default: 15
  discountPercent: Number, // default: 20
  timestamps: true
}
```
</details>

**Entity relationships:**
```
User ──1:N── Product (createdBy)
User ──1:N── Order   (user)
User ──1:N── Review  (user)
Product ──1:N── Review (product)
Order ──contains──▶ embedded Product snapshots (items[])
```

---

## 🔐 Authentication Flow

Shop.co uses **JWT stored in an HttpOnly cookie** rather than `localStorage`, chosen deliberately for stronger XSS protection:

```
1. User submits login credentials
2. Server verifies the password with bcrypt.compare()
3. Server signs a JWT (payload: { id, role })
4. JWT is sent back inside an HttpOnly, Secure cookie
5. Browser automatically attaches the cookie on every request (withCredentials: true)
6. auth.middleware.js verifies the JWT and attaches the user to req.user
7. admin.middleware.js (if required) checks req.user.role === "admin"
8. Controller executes the requested action
```

| Approach | XSS Protection | CSRF Protection | Auto-sent | Easy Logout |
|---|:---:|:---:|:---:|:---:|
| `localStorage` JWT | ❌ | ✅ | ❌ Manual | ❌ Manual |
| **HttpOnly Cookie JWT (used here)** | ✅ | ⚠️ Needs CSRF middleware | ✅ | ✅ |

- Passwords are hashed with **bcryptjs** (`salt rounds: 10`) in a Mongoose `pre("save")` hook — never stored in plain text.
- An `optionalAuth.middleware.js` allows routes (like guest checkout) to identify a logged-in user *if present*, without blocking anonymous access.
- Admin accounts are seeded from `.env` credentials via `seedAdmin.js`, not hardcoded in the database.

---

## 🧠 State Management

Global state is handled with **React Context API** — no external state library. Providers are composed in `App.js`:

```jsx
<SettingsProvider>
  <UserProvider>
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <CartProvider>
            <Router>{/* routes */}</Router>
          </CartProvider>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  </UserProvider>
</SettingsProvider>
```

| Context | Responsibility |
|---|---|
| `AuthContext` | Login, register, logout, current user session |
| `CartContext` | Cart items, quantities, totals |
| `ProductContext` | Product catalog, filters, fetching |
| `OrderContext` | Order placement & history |
| `SettingsContext` | Store-wide settings (currency, delivery fee, discount) |
| `UserContext` | User profile data |

All API calls flow through a shared **Axios instance** (`src/utils/api.js`) configured with `withCredentials: true` so the auth cookie is sent automatically.

---

## 🧭 Routing Structure

Routing is handled with **React Router DOM v7**, split into a public layout and standalone admin routes:

```jsx
<Routes>
  {/* Main layout: Header + Outlet + Newsletter + Footer */}
  <Route element={<MainLayout />}>
    <Route path="/" element={<HeroPage />} />
    <Route path="/shop" element={<ShopPage />} />
    <Route path="/product/:id" element={<DynamicProductPage />} />
    <Route path="/add-to-cart-page" element={<CartPage />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/auth" element={<AuthPage />} />
    <Route path="/profile" element={<UserProfile />} />
  </Route>

  {/* Admin — no Header/Footer, guarded by ProtectedRoute */}
  <Route path="/admin/login" element={<AdminLoginPage />} />
  <Route path="/admin" element={
    <ProtectedRoute><AdminDashboard /></ProtectedRoute>
  } />

  {/* Fallback */}
  <Route path="*" element={<Navigate to="/" />} />
</Routes>
```

- `ScrollToTop` resets scroll position on every route change.
- `ProtectedRoute` guards `/admin` and redirects unauthenticated/non-admin users.
- The admin dashboard itself is tab-based (`Overview`, `Products`, `Orders`, `Analytics`, `Settings`) rather than using nested routes.

---

## ⚡ Performance Optimizations

- **CI=false production builds** to prevent CRA warnings from failing deployment builds
- **Component-level code splitting** by feature (`pages/`, `components/`) for maintainability and easier lazy-loading adoption
- **Swiper carousels** for efficient rendering of large product lists (New Arrivals, Sale, Similar Products)
- **Mongoose lean queries & indexes** — e.g. compound unique index on `Review` to prevent duplicate writes and speed up lookups
- **Selective field projection** — password field uses `select: false` so it's excluded from queries by default, reducing payload size

---

## 🛡️ Security Features

- ✅ **Password hashing** with `bcryptjs` (never stored in plain text)
- ✅ **HttpOnly cookies** for JWT storage (mitigates XSS token theft)
- ✅ **Role-based middleware** (`protect` + `admin`) guarding sensitive routes
- ✅ **CORS restricted** to a configured `CLIENT_URL` with `credentials: true`
- ✅ **Environment-based secrets** — `.env` excluded from version control via `.gitignore`
- ✅ **Admin credentials never hardcoded** — read from environment variables and seeded via script
- ⚠️ **CSRF protection** is not yet implemented — recommended if deploying publicly (see [Future Improvements](#-future-improvements))

---

## 🧯 Error Handling Strategy

A centralized **Express error-handling middleware** (`middleware/errorHandler.js`) is registered last in the middleware chain:

```js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
```

- Stack traces are **only exposed in development** (`NODE_ENV=development`), hidden in production.
- Auth failures return structured `401`/`403` JSON responses (`"Not authorized..."`).
- On the frontend, Axios errors are caught per-request in Context providers and surfaced as `{ success: false, message }` to the UI.

---

## 📱 Responsive Design Support

The UI is built with **Tailwind CSS** utility classes, using a mobile-first approach with a custom theme (`primary`/`secondary`/`accent` colors, `Outfit` + `Plus Jakarta Sans` fonts) defined in `tailwind.config.js`. Layouts adapt across breakpoints for mobile, tablet, and desktop viewports.

---

## 🌐 Browser Compatibility

Defined via the CRA `browserslist` config in `frontend/package.json`:

**Production:**
```
>0.2%, not dead, not op_mini all
```

**Development:**
```
last 1 Chrome version, last 1 Firefox version, last 1 Safari version
```

---

## 🔮 Future Improvements

- [ ] Add CSRF protection (`csurf` middleware) to complement cookie-based JWT auth
- [ ] Replace the hardcoded API base URL with a `REACT_APP_API_URL` environment variable
- [ ] Add payment gateway integration (currently supports COD/Card as data fields only)
- [ ] Add pagination to product listing and admin order/user tables
- [ ] Add email notifications for order status changes
- [ ] Add automated test coverage (unit + integration) for backend controllers
- [ ] Add image upload to a cloud storage provider (e.g. Cloudinary/S3) instead of static asset paths
- [ ] Add rate limiting on auth endpoints to mitigate brute-force attempts

---

## ⚠️ Known Limitations

- No CSRF middleware currently in place (relies solely on `SameSite` cookie behavior + CORS)
- The Axios base URL is hardcoded to `http://localhost:5000/api` and must be manually updated for other environments
- No automated test suite is currently included in the backend
- Product images are served as static files (`public/assets/`) rather than a media/CDN pipeline
- Newsletter subscription route referenced in planning docs (`/api/newsletter/subscribe`) is not yet implemented in the current routes

---

## 🤝 Contributing Guidelines

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please open an issue first for major changes to discuss what you'd like to modify.

---

## 🎨 Code Style

- **JavaScript (ES6+)** across frontend and backend
- Functional React components with **Hooks** (no class components)
- **Context API** for global state — colocate related logic within each Context file
- Backend follows an **MVC-style separation**: routes → middleware → controllers → models
- Descriptive, resource-based naming (`Product.model.js`, `product.controller.js`, `product.routes.js`)
- ESLint config extended from `react-app` / `react-app/jest` (CRA defaults)

---

## 🧪 Testing Instructions

The frontend is scaffolded with **React Testing Library** (via Create React App defaults):

```bash
cd frontend
npm test
```

> ⚠️ No backend test suite is currently included. Adding integration tests (e.g. with `jest` + `supertest`) for controllers and routes is listed under [Future Improvements](#-future-improvements).

---

## ❓ FAQ

**Q: Can I use this project without MongoDB Atlas?**
A: Yes — set `MONGO_URI` to a local MongoDB instance (e.g. via MongoDB Compass): `mongodb://localhost:27017/shopco_db`.

**Q: How do I get admin access?**
A: Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`, then run `node seedAdmin.js` to create or promote that user to the `admin` role.

**Q: Why use cookies instead of localStorage for the JWT?**
A: HttpOnly cookies can't be accessed by client-side JavaScript, which significantly reduces the risk of token theft via XSS attacks.

**Q: Can guests place orders?**
A: Yes — the `POST /api/orders` route allows guest checkout; if a user is authenticated, the order is also linked to their account via `optionalAuth.middleware.js`.

---

## 🔧 Troubleshooting

| Issue | Likely Cause | Solution |
|---|---|---|
| `MongoDB Connection Error` on startup | Invalid or missing `MONGO_URI` | Verify your `.env` file and that MongoDB is running/accessible |
| `401 Not authorized, no token` | Missing/expired auth cookie | Log in again; ensure `withCredentials: true` on the frontend and correct `CLIENT_URL` in CORS config |
| CORS errors in the browser console | `CLIENT_URL` mismatch or protocol mismatch | Ensure the backend's `CLIENT_URL` exactly matches the frontend's origin (including port) |
| `403 Not authorized as an admin` | Logged-in user isn't an admin | Run `seedAdmin.js` or manually update the user's `role` field to `"admin"` |
| Frontend can't reach the API in production | Hardcoded `localhost` base URL | Update `frontend/src/utils/api.js` to point to your deployed backend |

---

## 📄 License

This project is licensed under the **ISC License** (as declared in `backend/package.json`). Feel free to use, modify, and distribute with attribution.

---

## 👨‍💻 Author

**Saad**
Final-Year Software Engineering Student

- 💻 GitHub: https://github.com/saaddev2004
- 💼 LinkedIn: https://www.linkedin.com/in/m-saad-dev/
- 📧 Email: m.saad.dev1@gmail.com

---

## 🙏 Acknowledgements

- [Create React App](https://create-react-app.dev/) for frontend scaffolding
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first design system
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) for data modeling
- [Swiper](https://swiperjs.com/) for carousel components
- [Framer Motion](https://www.framer.com/motion/) for animations
- The open-source community behind every package listed in the [Tech Stack](#-tech-stack)

---

## 📬 Contact Information

Questions, feedback, or collaboration ideas? Reach out:

- 📧 **Email:** m.saad.dev1@gmail.com
- 💼 **LinkedIn:** https://www.linkedin.com/in/m-saad-dev/

---

## ⭐ Star the Repository

If you found this project useful or interesting, please consider giving it a ⭐ — it helps others discover it and motivates further development!

```bash
# One more reason to smile today 🙂
git clone https://github.com/saaddev2004/shop.co
```

---

<div align="center">

**Built with ❤️ using the MERN Stack**

*Shop.co — Shop Smart, Shop Simple.*

</div>
