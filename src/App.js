import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import HeroPage from './pages/HomePage/HomePage';
import Checkout from './components/Checkout/Checkout';
import CartPage from './pages/CartPage/CartPage';  
import ShopPage from './pages/ShopPage/ShopPage';
import Header from './components/header/header';
import Footer from './components/Footer/Footer';
import Newsletter from './components/Newsletter/Newsletter';
import AdminLoginPage from "./pages/AdminPage/AdminLoginPage";
import AdminDashboard from "./pages/AdminPage/AdminDashboard";
import DynamicProductPage from "./pages/DynamicProductPage/DynamicProductPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import { CartProvider } from './Context/CartContext';
import { AuthProvider } from "./Context/AuthContext";
import { ProductProvider } from "./Context/ProductContext";

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <ScrollToTop />
            <Header />
            <Routes>
              <Route path="/" element={<HeroPage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/product/:id" element={<DynamicProductPage />} />
              <Route path="/add-to-cart-page" element={<CartPage />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<AuthPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Newsletter />
            <Footer />
          </Router>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
