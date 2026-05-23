import React from 'react';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiUser } from "react-icons/fi";

const UserProfileSidebar = ({ currentUser, userOrders, activeTab, setActiveTab }) => {
    return (
        <div className="lg:col-span-4 space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
                className="bg-white dark:bg-neutral-900 p-8 rounded-[35px] border border-black/[0.04] dark:border-white/[0.04] shadow-sm"
            >
                <div className="w-20 h-20 bg-black dark:bg-white text-white dark:text-black rounded-3xl flex items-center justify-center text-3xl font-black mb-6">
                {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold dark:text-white">{currentUser.name}</h3>
                <p className="text-sm text-black/50 dark:text-white/50 mb-6">{currentUser.email}</p>
                
                <div className="pt-6 border-t border-black/[0.04] dark:border-white/[0.04] space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-black/50 dark:text-white/50 font-medium">Member Since</span>
                    <span className="font-bold dark:text-white">{currentUser.joinDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-black/50 dark:text-white/50 font-medium">Total Orders</span>
                    <span className="font-bold dark:text-white">{userOrders.length}</span>
                </div>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white dark:bg-neutral-900 p-8 rounded-[35px] border border-black/[0.04] dark:border-white/[0.04] shadow-sm"
            >
                <nav className="space-y-2">
                <button 
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === "orders" ? "bg-black dark:bg-white text-white dark:text-black shadow-md" : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5"}`}
                >
                    <div className="flex items-center gap-3"><FiShoppingBag /> Order History</div>
                </button>
                <button 
                    onClick={() => setActiveTab("details")}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === "details" ? "bg-black dark:bg-white text-white dark:text-black shadow-md" : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5"}`}
                >
                    <div className="flex items-center gap-3"><FiUser /> Account Details</div>
                </button>
                </nav>
            </motion.div>
        </div>
    );
};

export default UserProfileSidebar;
