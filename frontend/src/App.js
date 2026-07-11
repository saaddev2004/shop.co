import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import UserProfile from "./pages/AuthPage/UserProfile";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import { CartProvider } from './Context/CartContext';
import { AuthProvider } from "./Context/AuthContext";
import { ProductProvider } from "./Context/ProductContext";
import { SettingsProvider } from "./Context/SettingsContext";
import { OrderProvider } from "./Context/OrderContext";
import { UserProvider } from "./Context/UserContext";

const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet /> 
      <Newsletter />
      <Footer />
    </>
  );
};

function App() {
  return (
    <SettingsProvider>
      <UserProvider>
        <AuthProvider>
          <ProductProvider>
            <OrderProvider>
              <CartProvider>
                <Router>
                  <ScrollToTop />
                  <Routes>
                    
                    {/* Normal Pages with Header/Footer */}
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<HeroPage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/product/:id" element={<DynamicProductPage />} />
                      <Route path="/add-to-cart-page" element={<CartPage />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/profile" element={<UserProfile />} />
                    </Route>

                    {/* Admin Pages without Header/Footer */}
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/admin" element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    
                    {/* Catch-all route */}
                    <Route path="*" element={<Navigate to="/" />} />
                    
                  </Routes>
                </Router>
              </CartProvider>
            </OrderProvider>
          </ProductProvider>
        </AuthProvider>
      </UserProvider>
    </SettingsProvider>
  );
}

export default App;