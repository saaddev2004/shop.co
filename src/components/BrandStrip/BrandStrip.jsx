import React from 'react';
import { motion } from 'framer-motion';

const BrandStrip = () => {
  const brands = [
    { name: "Versace", src: "/assets/versace.svg" },
    { name: "Zara", src: "/assets/zara.svg" },
    { name: "Gucci", src: "/assets/gucci.svg" },
    { name: "Prada", src: "/assets/prada.svg" },
    { name: "Calvin Klein", src: "/assets/calvinklein.svg" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="w-full bg-black py-8 md:py-10 dark:bg-[#1A1A1A] transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex flex-wrap justify-center md:justify-around items-center gap-8 md:gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {brands.map((brand) => (
            <motion.img 
              key={brand.name}
              variants={itemVariants}
              src={brand.src} 
              alt={brand.name} 
              className="h-6 md:h-8 lg:h-9 object-contain brightness-0 invert opacity-100 hover:opacity-80 transition-opacity transform hover:scale-105 duration-300" 
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BrandStrip;
