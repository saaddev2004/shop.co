import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  { name: "Shirts", image: "/assets/chekered-shirts.svg" },
  { name: "Jackets", image: "/assets/premium_denim_jacket.png" },
  { name: "Jeans", image: "/assets/Skinny-fit-jeans.svg" },
  { name: "Shorts", image: "/assets/loose-fit-shorts.svg" },
  { name: "Sweaters", image: "/assets/premium_knit_sweater.png" },
  { name: "Caps", image: "/assets/premium_baseball_cap.png" },
];

const BrowseByCategory = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="container mx-auto bg-[#F0EEED] dark:bg-neutral-900 rounded-[40px] px-8 py-16 md:px-16 md:py-20 transition-colors duration-500 shadow-sm border border-black/5 dark:border-white/5">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-extrabold text-center mb-12 lg:mb-16 font-heading dark:text-white capitalize"
        >
          BROWSE BY CATEGORY
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {categories.map((cat, index) => (
            <motion.div variants={itemVariants} key={index} className="h-[250px] md:h-[289px]">
              <Link
                to={`/shop`}
                // We're using state to pass category to Shop page if we used React Router state, 
                // but for simplicity it links to the shop and user can select tab.
                className="group relative block w-full h-full rounded-[20px] overflow-hidden bg-white dark:bg-neutral-800 shadow-sm transition-all hover:shadow-xl"
              >
                <div className="absolute top-6 left-8 z-10">
                  <h3 className="text-2xl md:text-3xl font-bold dark:text-white group-hover:-translate-y-1 transition-transform">
                    {cat.name}
                  </h3>
                </div>
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute bottom-0 right-0 w-3/4 max-h-[80%] object-contain group-hover:scale-110 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform duration-500"
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrowseByCategory;
