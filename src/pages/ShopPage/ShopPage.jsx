import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaStar, FaSlidersH } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { productsData, categories } from "../../data/products";

const ShopPage = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    if (location.state?.category) {
      setActiveCategory(location.state.category);
    }
  }, [location.state]);

  const filteredProducts = activeCategory === "All" 
    ? productsData 
    : productsData.filter(p => p.category === activeCategory);

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
          Shop by Category
        </h1>
        <div className="text-black/60 dark:text-white/60 text-sm font-medium">
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
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-left text-base transition-colors ${
                    activeCategory === cat 
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
                  className="group flex flex-col h-full"
                >
                  <Link to={item.link} className="aspect-[3/4] rounded-[20px] overflow-hidden bg-[#F0EEED] dark:bg-neutral-800 flex items-center justify-center mb-4 transition-all group-hover:shadow-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </Link>
                  
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-sm md:text-lg font-bold mb-1 dark:text-white line-clamp-1">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2 text-xs md:text-sm">
                      <div className="flex gap-0.5 text-yellow-400">
                        {[...Array(Math.floor(item.rating))].map((_, i) => (
                          <FaStar key={i} size={14} />
                        ))}
                      </div>
                      <span className="text-xs dark:text-gray-400">
                        {item.rating}/<span className="text-gray-400">5</span>
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg md:text-2xl font-bold dark:text-white">${item.price}</span>
                      {item.oldPrice && (
                        <>
                          <span className="text-sm md:text-xl font-bold text-black/30 dark:text-white/30 line-through">${item.oldPrice}</span>
                          <span className="bg-[#FF3333]/10 text-[#FF3333] px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold">
                            {item.discount}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
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
