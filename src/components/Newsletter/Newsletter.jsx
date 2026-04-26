import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope } from "react-icons/fa";

const Newsletter = () => {
  return (
    <section className="px-4 relative -mb-20 z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto bg-black dark:bg-[#1A1A1A] text-white rounded-[20px] p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 transition-colors duration-500"
      >
        <motion.h2 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-[1.1] text-center lg:text-left max-w-[550px] font-heading"
        >
          Stay up to date about our latest offers
        </motion.h2>

        <motion.form 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col gap-4 w-full max-w-[350px]"
        >
          <div className="relative group">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 text-xl group-focus-within:text-black transition-colors" />
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-white text-black pl-12 pr-4 py-4 rounded-full outline-none text-sm md:text-base font-medium transition-all"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-white text-black py-4 rounded-full font-bold hover:bg-neutral-200 transition-all active:scale-95"
          >
            Subscribe to Newsletter
          </button>
        </motion.form>
      </motion.div>
    </section>
  );
};

export default Newsletter;
