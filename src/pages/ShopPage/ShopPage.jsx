import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaSlidersH } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useProducts } from "../../Context/ProductContext";
import { categories } from "../../data/products";
import ProductCard from "../../components/ProductCard/ProductCard";

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
        {/* Sidebar Filters */}
        <div className="w-full lg:w-1/4">
          <div className="border border-black/10 dark:border-white/10 rounded-[20px] p-6 bg-white dark:bg-neutral-900 sticky top-24">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-black/10 dark:border-white/10">
              <h2 className="text-xl font-bold dark:text-white">Filters</h2>
              <FaSlidersH className="text-black/40 dark:text-white/40" />
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => { setActiveCategory("All"); setShowOnlySale(false); }}
                className={`text-left text-base transition-colors ${
                  activeCategory === "All" && !showOnlySale
                    ? "font-bold text-black dark:text-white" 
                    : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                }`}
              >
                All Products
              </button>
              
              <button
                onClick={() => { setShowOnlySale(!showOnlySale); setActiveCategory("All"); }}
                className={`text-left text-base transition-colors flex items-center justify-between ${
                  showOnlySale 
                    ? "font-bold text-red-500" 
                    : "text-black/60 dark:text-white/60 hover:text-red-500"
                }`}
              >
                Sale Items
                {showOnlySale && <span className="w-2 h-2 bg-red-500 rounded-full" />}
              </button>

              <div className="h-[1px] bg-black/5 dark:bg-white/5 my-2" />

              {categories.filter(c => c !== "All").map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setShowOnlySale(false); }}
                  className={`text-left text-base transition-colors ${
                    activeCategory === cat && !showOnlySale
                      ? "font-bold text-black dark:text-white" 
                      : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-full lg:w-3/4">
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          >
            <AnimatePresence>
              {filteredProducts.map((item) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={item.id} 
                >
                  <ProductCard item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 && (
            <div className="py-20 text-center text-black/60 dark:text-white/60">
              No products found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
