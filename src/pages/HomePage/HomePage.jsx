import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import Header from "../../components/header/header";
import HeroSection from "../../components/hero/HeroSection";
import BrandStrip from "../../components/BrandStrip/BrandStrip";
import NewArrivals from "../../components/NewArrivals/NewArrivals";
import Testimonials from "../../components/Testimonials/Testimonials";
import NewsLetter from "../../components/Newsletter/Newsletter";
import Footer from "../../components/Footer/Footer";

function HomePage() {
  const location = useLocation();


  return (
    <div>
      <Header />
      <HeroSection />
      <BrandStrip />

      <div id="New-Arrivals">
        <NewArrivals />
      </div>

      <Testimonials />
      <NewsLetter />
      <Footer />
    </div>
  );
}

export default HomePage;
