import React from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaStar } from "react-icons/fa";
import "swiper/css";

const reviews = [
  {
    name: "Sarah M.",
    review:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    name: "Alex K.",
    review:
      "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable.",
  },
  {
    name: "James L.",
    review:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection is diverse and trendy.",
  },
  {
    name: "Mooen",
    review:
      "Thrilled to have stumbled upon Shop.co. The clothes are trendy, affordable, and super comfortable. Love it!",
  },
  {
    name: "Samantha D.",
    review:
      "I'm blown away by the quality and style. Every piece I've bought has exceeded my expectations.",
  },
];

const Testimonials = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="py-12 md:py-20 bg-white dark:bg-neutral-900 transition-colors duration-500"
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl md:text-4xl font-extrabold mb-10 md:mb-16 font-heading dark:text-white tracking-tight leading-tight"
        >
          Our Happy Customers
        </motion.h2>

        <Swiper
          spaceBetween={24}
          slidesPerView={1.1}
          breakpoints={{
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2.2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {reviews.map((r, i) => (
            <SwiperSlide key={i}>
              <div className="bg-white dark:bg-neutral-800 border border-black/10 dark:border-white/10 rounded-[20px] p-6 md:p-8 h-full flex flex-col transition-all hover:border-black dark:hover:border-white">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <FaStar key={idx} className="text-[#FFC633]" size={20} />
                  ))}
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg md:text-xl font-bold dark:text-white">{r.name}</span>
                  <img
                    src="/assets/greentick.svg"
                    alt="verified"
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                </div>
                
                <p className="text-black/60 dark:text-white/60 text-sm md:text-base leading-relaxed">
                  "{r.review}"
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </motion.section>
  );
};

export default Testimonials;
