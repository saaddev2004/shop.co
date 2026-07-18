import React from "react";
import { useProducts } from "../../Context/ProductContext";

import HeroSection from "../../components/hero/HeroSection";
import BrandStrip from "../../components/BrandStrip/BrandStrip";
import NewArrivals from "../../components/NewArrivals/NewArrivals";
import SaleSection from "../../components/SaleSection/SaleSection";
import Testimonials from "../../components/Testimonials/Testimonials";

function HomePage() {
  const { loading } = useProducts();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-black dark:border-white border-b-transparent"></div>
      </div>
    );
  }

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
