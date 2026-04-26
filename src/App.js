import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import HeroPage from './pages/HomePage/HomePage';
import Tshirt from './pages/Black-Stripped-Shirt-page/Black-Stripped-Shirt-page';
import Jeans from './pages/skinny-fit-jeans-page/skinny-fit-jeans-page';
import Shirt from './pages/chekered-shirt-page/chekered-shirt-page';
import TShirts from './pages/sleave-stripped-t-shirt-page/sleave-stripped-t-shirt-page';
import VerticalShirt from './pages/Stripped-Shirt-page/Stripped-Shirt-page';
import CourageShirt from './pages/Courage-Graphic-T-Shirt-page/Courage-Graphic-T-Shirt-page';
import Shorts from './pages/Loose-fit-Bermuda-shorts-page/Loose-fit-Bermuda-shorts-page';
import RelaxedShorts from './pages/Relaxed-Fit-Shorts-page/Relaxed-Fit-Shorts-page';
import FadedJeans from './pages/Faded-Skinny-Jeans-page/Faded-Skinny-Jeans-page';
import GraphicShirt from './pages/Graphic-Shirt-page/Graphic-Shirt-page';
import PoloShirt from './pages/Polo-T-Shirt-page/Polo-T-Shirt-page';
import Checkout from './pages/Checkout-page/Checkout-page';
import CartPage from './pages/CartPage/CartPage';  
import ShopPage from './pages/ShopPage/ShopPage';

import { CartProvider } from './Context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HeroPage />} />
          <Route path="/tshirt-details" element={<Tshirt />} />
          <Route path="/jeans-details" element={<Jeans />} />
          <Route path="/checkered-shirt-details" element={<Shirt />} />
          <Route path="/striped-tshirt-details" element={<TShirts />} />
          <Route path="/vertical-shirt-details" element={<VerticalShirt />} />
          <Route path="/courage-tshirt-details" element={<CourageShirt />} />
          <Route path="/loose-shorts-details" element={<Shorts />} />
          <Route path="/relaxed-shorts-details" element={<RelaxedShorts />} />
          <Route path="/skinny-jeans-details" element={<FadedJeans />} />
          <Route path="/graphic-tshirt-details" element={<GraphicShirt />} />
          <Route path="/polo-tshirt-details" element={<PoloShirt />} />
          <Route path="/add-to-cart-page" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/shop" element={<ShopPage />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
