import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProducts } from "../../Context/ProductContext";

import ShopFilters from "./components/ShopFilters";
import ShopGrid from "./components/ShopGrid";

const ShopPage = () => {
  const location = useLocation();
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlySale, setShowOnlySale] = useState(false);

  useEffect(() => {
    if (location.state?.filterSale) {
      setShowOnlySale(true);
      setActiveCategory("All");
    }
    if (location.state?.category) {
      setActiveCategory(location.state.category);
      setSearchQuery(""); // Clear search if a category is selected
    }
    if (location.state?.searchQuery) {
      setSearchQuery(location.state.searchQuery);
      setActiveCategory("All"); // Reset category if searching
    }
  }, [location.state]);

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSale = !showOnlySale || p.isOnSale;
    return matchesCategory && matchesSearch && matchesSale;
  });

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 transition-colors duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8">
        <Link to="/" className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">Home</Link>
        <span className="text-black/60 dark:text-white/60">/</span>
        <span className="font-bold dark:text-white">Shop</span>
      </nav>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-5xl font-extrabold font-heading dark:text-white tracking-tight capitalize">
          {searchQuery ? `Results for "${searchQuery}"` : "Shop by Category"}
        </h1>
        <div className="text-black/60 dark:text-white/60 text-sm font-medium flex flex-col items-end">
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-red-500 hover:underline mb-1"
            >
              Clear Search
            </button>
          )}
          Showing {filteredProducts.length} Products
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <ShopFilters 
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          showOnlySale={showOnlySale}
          setShowOnlySale={setShowOnlySale}
        />

        <ShopGrid filteredProducts={filteredProducts} />
      </div>
    </div>
  );
};

export default ShopPage;
