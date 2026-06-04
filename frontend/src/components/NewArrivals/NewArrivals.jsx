import React, { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";

import { useProducts } from "../../Context/ProductContext";
import { categories } from "../../data/products";
import ProductCard from "../ProductCard/ProductCard";

const NewArrivals = () => {
  const { products } = useProducts();
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts = activeCategory === "All" 
    ? products.slice(0, 8) // Show latest 8 products for "All"
    : products.filter(p => p.category === activeCategory);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="py-12 md:py-20 bg-white dark:bg-neutral-900 transition-colors duration-500" 
      id="New-Arrivals"
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-4xl font-bold text-center mb-8 font-heading dark:text-white tracking-tight"
        >
          New Arrivals
        </motion.h2>

        {/* Category Pills */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10"
        >
          {categories.map((cat) => (
             <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 md:px-6 py-2 md:py-2.5 rounded-full text-sm md:text-base font-medium transition-all ${
                  activeCategory === cat 
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-md" 
                    : "bg-[#F0F0F0] text-black/60 hover:text-black dark:bg-neutral-800 dark:text-white/60 dark:hover:text-white"
                }`}
             >
                {cat}
             </button>
          ))}
        </motion.div>
        
        {filteredProducts.length > 0 ? (
          <Swiper
            slidesPerView={1.2}
            spaceBetween={16}
            breakpoints={{
              640: { slidesPerView: 2.2, spaceBetween: 20 },
              1024: { slidesPerView: 3.2, spaceBetween: 24 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="pb-12"
          >
            {filteredProducts.map((item) => (
              <SwiperSlide key={item.id}>
                <ProductCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="py-20 text-center text-black/40 dark:text-white/40 italic">
            No products in this category yet.
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Link 
            to="/shop" 
            className="px-12 py-4 border border-black/10 dark:border-white/10 rounded-full font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 w-full sm:w-fit text-center dark:text-white"
          >
            View All
          </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default NewArrivals;
