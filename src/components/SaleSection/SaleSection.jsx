import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom"; 
import { useProducts } from "../../Context/ProductContext";
import ProductCard from "../ProductCard/ProductCard";

const SaleSection = () => {
  const { products } = useProducts();
  const saleProducts = products.filter(p => p.isOnSale);

  if (saleProducts.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="py-12 md:py-20 bg-white dark:bg-neutral-900 transition-colors duration-500 overflow-hidden" 
      id="sale-section"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10 md:mb-16">
            <div>
                <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block shadow-lg shadow-red-500/20"
                >
                    Limited Time
                </motion.div>
                <motion.h2 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-5xl font-bold font-heading dark:text-white tracking-tighter"
                >
                    End Of Season Sale
                </motion.h2>
            </div>
            <Link 
                to="/shop" 
                state={{ filterSale: true }}
                className="hidden md:block text-sm font-bold uppercase tracking-widest border-b-2 border-black dark:border-white pb-1 hover:opacity-60 transition-opacity dark:text-white"
            >
                View All Sale Items
            </Link>
        </div>
        
        <Swiper
          slidesPerView={1.2}
          spaceBetween={16}
          breakpoints={{
            640: { slidesPerView: 2.2, spaceBetween: 20 },
            1024: { slidesPerView: 3.2, spaceBetween: 24 },
            1280: { slidesPerView: 4.2, spaceBetween: 24 },
          }}
          className="!pb-12"
        >
          {saleProducts.map((item) => (
            <SwiperSlide key={item.id}>
              <ProductCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex justify-center mt-4 md:hidden">
            <Link 
                to="/shop" 
                state={{ filterSale: true }}
                className="px-10 py-4 border border-black/10 dark:border-white/10 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all w-full text-center dark:text-white"
            >
                View All Sale
            </Link>
        </div>
      </div>
    </motion.section>
  );
};

export default SaleSection;
