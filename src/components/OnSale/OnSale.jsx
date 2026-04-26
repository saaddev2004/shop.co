import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const products = [
  {
    id: 1,
    name: "One Life Graphic T-shirt",
    rating: 4.1,
    price: 220,
    oldPrice: 260,
    discount: "-15%",
    image: "/assets/graphic-t-shirt.svg",
    link: "/graphic-tshirt-details", 
  },
  {
    id: 2,
    name: "Polo with Contrast Trims",
    rating: 4.2,
    price: 180,
    oldPrice: 220,
    discount: "-18%",
    image: "/assets/polo-t-shirt.svg",
    link: "/polo-tshirt-details",
  },
  {
    id: 3,
    name: "Skinny fit Jeans",
    rating: 4.8,
    price: 99,
    oldPrice: 120,
    discount: "-10%",
    image: "/assets/Skinny-fit-jeans.svg",
    link: "/jeans-details",
  },
  {
    id: 4,
    name: "Vertical Striped shirt",
    rating: 4.5,
    price: 350,
    oldPrice: 399,
    discount: "-12%",
    image: "/assets/Vertical-Stripped-Shirt.svg",
    link: "/vertical-shirt-details",
  },
  {
    id: 5,
    name: "Black Stripped T Shirt",
    rating: 4.1,
    price: 220,
    oldPrice: 260,
    discount: "-15%",
    image: "/assets/black-stripped-t-shirt.svg",
    link: "/tshirt-details",
  },
  {
    id: 6,
    name: "Courage Graphic T-Shirt",
    rating: 4.1,
    price: 220,
    oldPrice: 260,
    discount: "-15%",
    image: "/assets/courage-graphic-tshirt.svg",
    link: "/courage-tshirt-details",
  },
  {
    id: 7,
    name: "Loose Fit Bermuda Shorts",
    rating: 4.1,
    price: 220,
    oldPrice: 260,
    discount: "-15%",
    image: "/assets/loose-fit-shorts.svg",
    link: "/loose-shorts-details",
  },
  {
    id: 8,
    name: "Relaxed Fit Shorts",
    rating: 4.1,
    price: 220,
    oldPrice: 260,
    discount: "-15%",
    image: "/assets/relaxed-fit-shorts.svg",
    link: "/relaxed-shorts-details",
  },
];

const OnSale = () => {
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
          {products.map((item) => (
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

export default OnSale;
