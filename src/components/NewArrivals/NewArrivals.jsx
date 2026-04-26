import React, { useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

import { productsData, categories } from "../../data/products";

const NewArrivals = () => {
  const displayCategories = categories.filter(c => c !== "All");
  const [activeCategory, setActiveCategory] = useState(displayCategories[0]);

  const filteredProducts = productsData.filter(p => p.category === activeCategory);

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
          className="text-2xl md:text-4xl font-extrabold text-center mb-8 font-heading dark:text-white tracking-tight"
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
          {displayCategories.map((cat) => (
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
              <div className="group h-full flex flex-col">
                <Link to={item.link} className="aspect-[3/4] rounded-[20px] overflow-hidden bg-[#F0EEED] dark:bg-neutral-800 flex items-center justify-center mb-4 transition-all group-hover:shadow-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>
                
                <div className="flex flex-col flex-grow">
                  <h3 className="text-lg md:text-xl font-bold mb-2 dark:text-white line-clamp-1">
                    {item.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5 text-yellow-400">
                      {[...Array(Math.floor(item.rating))].map((_, i) => (
                        <FaStar key={i} size={18} />
                      ))}
                      {item.rating % 1 !== 0 && <FaStar size={18} className="opacity-50" />}
                    </div>
                    <span className="text-sm dark:text-gray-400">
                      {item.rating}/<span className="text-gray-400">5</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold dark:text-white">${item.price}</span>
                    {item.oldPrice && (
                      <>
                        <span className="text-2xl font-bold text-black/30 dark:text-white/30 line-through">${item.oldPrice}</span>
                        <span className="bg-[#FF3333]/10 text-[#FF3333] px-3 py-1 rounded-full text-xs font-bold">
                          {item.discount}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

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
