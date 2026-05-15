import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
import { useProducts } from "../../Context/ProductContext";
import ProductCard from "../ProductCard/ProductCard";

const OnSale = () => {
  const { products } = useProducts();
  const onSaleProducts = products.filter(p => p.discount).slice(0, 4);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="py-12 md:py-20 bg-white dark:bg-neutral-900 transition-colors duration-500 border-t border-black/5 dark:border-white/5" 
      id="on-sale"
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-4xl font-extrabold text-center mb-12 font-heading dark:text-white tracking-tight"
        >
          On Sale
        </motion.h2>
        
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
          {onSaleProducts.map((item) => (
            <SwiperSlide key={item.id}>
              <ProductCard item={item} />
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

export default OnSale;
