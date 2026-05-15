import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";


import HeroSection from "../../components/hero/HeroSection";
import BrandStrip from "../../components/BrandStrip/BrandStrip";
import NewArrivals from "../../components/NewArrivals/NewArrivals";
import SaleSection from "../../components/SaleSection/SaleSection";
import Testimonials from "../../components/Testimonials/Testimonials";


function HomePage() {
  const location = useLocation();


  return (
    <div>

      <HeroSection />
      <BrandStrip />

      <div id="New-Arrivals">
        <NewArrivals />
      </div>

      <SaleSection />

      <Testimonials />

    </div>
  );
}

export default HomePage;
