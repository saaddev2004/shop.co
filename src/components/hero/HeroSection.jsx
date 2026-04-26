import React from "react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section 
      id="Hero" 
      className="relative w-full bg-[#F2F0F1] dark:bg-neutral-900 transition-colors duration-500 overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 items-center min-h-[600px] lg:min-h-[700px] gap-8">
        
        {/* Text Content */}
        <motion.div 
          className="flex flex-col justify-center py-12 lg:py-20 z-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 font-heading dark:text-white "
          >
            FIND CLOTHES <br className="hidden md:block" />
            THAT MATCHES <br className="hidden md:block" />
            YOUR STYLE
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-gray-600 dark:text-gray-400 text-base md:text-lg mb-8 max-w-[545px]"
          >
            Browse through our diverse range of meticulously crafted garments,
            designed to bring out your individuality and cater to your sense of style.
          </motion.p>

          <motion.a 
            variants={itemVariants}
            href="/#New-Arrivals" 
            className="inline-block bg-black text-white px-12 py-4 rounded-full font-medium hover:bg-neutral-800 transition-all dark:bg-white dark:text-black dark:hover:bg-neutral-200 w-full sm:w-fit text-center"
          >
            Shop Now
          </motion.a>

          {/* Stats */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-12 md:mt-16"
          >
            <motion.div variants={itemVariants}>
              <h4 className="text-2xl md:text-4xl font-bold dark:text-white">200+</h4>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">International Brands</p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <h4 className="text-2xl md:text-4xl font-bold dark:text-white">2,000+</h4>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">High-Quality Products</p>
            </motion.div>
            <motion.div variants={itemVariants} className="col-span-2 md:col-span-1">
              <h4 className="text-2xl md:text-4xl font-bold dark:text-white">30,000+</h4>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Happy Customers</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Hero Image Section */}
        <motion.div 
          className="relative flex justify-center lg:justify-end items-end h-full"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <img 
            src="/assets/hero.svg" 
            alt="Hero Model" 
            className="w-full max-w-[600px] lg:max-w-none h-auto object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;