import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "../../../components/ProductCard/ProductCard";

const ShopGrid = ({ filteredProducts }) => {
    return (
        <div className="w-full lg:w-3/4">
            <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
            >
                <AnimatePresence>
                {filteredProducts.map((item) => (
                    <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={item.id}
                    >
                    <ProductCard item={item} />
                    </motion.div>
                ))}
                </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
                <div className="py-20 text-center text-black/60 dark:text-white/60">
                No products found in this category.
                </div>
            )}
        </div>
    );
};

export default ShopGrid;
