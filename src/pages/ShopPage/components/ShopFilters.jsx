import React from 'react';
import { FaSlidersH } from "react-icons/fa";
import { categories } from "../../../data/products";

const ShopFilters = ({ activeCategory, setActiveCategory, showOnlySale, setShowOnlySale }) => {
    return (
        <div className="w-full lg:w-1/4">
            <div className="border border-black/10 dark:border-white/10 rounded-[20px] p-6 bg-white dark:bg-neutral-900 sticky top-24">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-black/10 dark:border-white/10">
                <h2 className="text-xl font-bold dark:text-white">Filters</h2>
                <FaSlidersH className="text-black/40 dark:text-white/40" />
                </div>

                <div className="flex flex-col gap-4">
                <button
                    onClick={() => { setActiveCategory("All"); setShowOnlySale(false); }}
                    className={`text-left text-base transition-colors ${activeCategory === "All" && !showOnlySale
                        ? "font-bold text-black dark:text-white"
                        : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                    }`}
                >
                    All Products
                </button>

                <button
                    onClick={() => { setShowOnlySale(!showOnlySale); setActiveCategory("All"); }}
                    className={`text-left text-base transition-colors flex items-center justify-between ${showOnlySale
                        ? "font-bold text-red-500"
                        : "text-black/60 dark:text-white/60 hover:text-red-500"
                    }`}
                >
                    Sale Items
                    {showOnlySale && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                </button>

                <div className="h-[1px] bg-black/5 dark:bg-white/5 my-2" />

                {categories.filter(c => c !== "All").map((cat) => (
                    <button
                    key={cat}
                    onClick={() => { setActiveCategory(cat); setShowOnlySale(false); }}
                    className={`text-left text-base transition-colors ${activeCategory === cat && !showOnlySale
                        ? "font-bold text-black dark:text-white"
                        : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
                        }`}
                    >
                    {cat}
                    </button>
                ))}
                </div>
            </div>
        </div>
    );
};

export default ShopFilters;
