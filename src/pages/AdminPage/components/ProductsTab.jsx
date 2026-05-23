import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiPlus, FiBox, FiEdit3, FiTrash2 } from "react-icons/fi";
import { useProducts } from "../../../Context/ProductContext";
import { useSettings } from "../../../Context/SettingsContext";
import { categories } from "../../../data/products";

const ProductsTab = ({ setActiveTab, resetForm, startEditing, setDeleteConfirmId }) => {
    const { products } = useProducts();
    const { settings } = useSettings();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, categoryFilter]);

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 sm:gap-6 bg-white dark:bg-neutral-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/[0.04] dark:border-white/[0.04] shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30" />
                    <input
                        type="text"
                        placeholder="Search by product name..."
                        className="w-full bg-gray-50 dark:bg-neutral-800/50 py-3.5 pl-12 pr-6 rounded-2xl outline-none text-sm dark:text-white placeholder:text-black/30"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        className="bg-gray-50 dark:bg-neutral-800 text-xs font-bold py-3.5 px-6 rounded-2xl border-none outline-none dark:text-white"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        {categories.filter(c => c !== "All").map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => { resetForm(); setActiveTab("editor"); }}
                        className="bg-black dark:bg-white text-white dark:text-black px-4 sm:px-6 py-3 sm:py-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-black/5"
                    >
                        <FiPlus /> Add Product
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl sm:rounded-[35px] border border-black/[0.04] dark:border-white/[0.04] shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-black/[0.03] dark:border-white/[0.03] bg-gray-50/50 dark:bg-neutral-800/10">
                                <th className="py-6 px-8 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Product Matrix</th>
                                <th className="py-6 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Classification</th>
                                <th className="py-6 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Price ({settings.currency.split(' ')[0]})</th>
                                <th className="py-6 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Color Matrix / Stock</th>
                                <th className="py-6 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Status</th>
                                <th className="py-6 px-8 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.03] dark:divide-white/[0.03]">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-black/30 dark:text-white/30 font-bold">
                                        <FiBox className="mx-auto mb-4 text-black/10 dark:text-white/10" size={40} />
                                        No matching assets found in local inventory
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => {
                                    const stock = product.colorStock || {};
                                    const totalStockQty = Object.values(stock).reduce((sAcc, sizes) => sAcc + Object.values(sizes).reduce((a, b) => a + b, 0), 0);

                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50/30 dark:hover:bg-neutral-800/10 transition-colors">
                                            <td className="py-5 px-8">
                                                <div className="flex items-center gap-5">
                                                    <img src={product.image} className="w-12 h-16 object-cover rounded-xl border border-black/5 bg-gray-50 shrink-0" alt="" />
                                                    <div>
                                                        <h4 className="text-sm font-bold dark:text-white line-clamp-1 max-w-[220px]">{product.name}</h4>
                                                        <p className="text-[10px] text-black/35 dark:text-white/35 mt-1 font-medium">UID: {product.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <span className="text-xs font-bold bg-black/5 dark:bg-white/5 dark:text-white/80 px-3 py-1.5 rounded-xl border border-black/[0.02]">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div>
                                                    <p className="text-sm font-black dark:text-white">{product.price}</p>
                                                    {product.oldPrice && (
                                                        <p className="text-xs text-black/30 dark:text-white/30 line-through mt-0.5">{product.oldPrice}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                <div className="space-y-1.5">
                                                    <div className="flex gap-1.5 flex-wrap">
                                                        {product.colors?.map((c, i) => (
                                                            <div key={i} className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm shrink-0" style={{ backgroundColor: c }} />
                                                        ))}
                                                    </div>
                                                    <p className="text-[10px] font-bold text-black/40 dark:text-white/40 mt-1">{totalStockQty} items in stock</p>
                                                </div>
                                            </td>
                                            <td className="py-5 px-6">
                                                {product.isOnSale ? (
                                                    <span className="badge badge-success">Sale Live</span>
                                                ) : totalStockQty === 0 ? (
                                                    <span className="badge badge-danger">Out of Stock</span>
                                                ) : totalStockQty < 15 ? (
                                                    <span className="badge badge-warning">Low Stock</span>
                                                ) : (
                                                    <span className="badge badge-neutral">Standard</span>
                                                )}
                                            </td>
                                            <td className="py-5 px-8 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => startEditing(product)}
                                                        className="w-10 h-10 bg-gray-50 hover:bg-black hover:text-white dark:bg-neutral-800 dark:hover:bg-white dark:hover:text-black text-black/60 dark:text-white/60 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                                                        title="Edit Product"
                                                    >
                                                        <FiEdit3 size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirmId(product.id)}
                                                        className="w-10 h-10 bg-red-50 hover:bg-red-500 hover:text-white dark:bg-red-950/20 dark:hover:bg-red-500 text-red-500 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                                                        title="Delete Product"
                                                    >
                                                        <FiTrash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductsTab;
