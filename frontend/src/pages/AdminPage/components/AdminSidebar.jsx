import React from 'react';
import { FiGrid, FiBox, FiPlus, FiShoppingBag, FiTrendingUp, FiSettings, FiLogOut } from "react-icons/fi";

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen, activeTab, setActiveTab, resetForm, logout, settings, orders }) => {
    return (
        <aside className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 w-72 bg-white dark:bg-neutral-900 border-r border-black/[0.05] dark:border-white/[0.05] flex flex-col justify-between h-screen`}>
            <div>
                <div className="p-8 border-b border-black/[0.05] dark:border-white/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-3 w-full">
                        <span className="w-3.5 h-3.5 bg-black dark:bg-white rounded-full animate-pulse shrink-0" />
                        <h1 className="text-xl font-black tracking-tighter font-heading truncate flex-1">{settings.storeName}</h1>
                    </div>
                </div>

                <nav className="p-6 space-y-2" onClick={() => setIsSidebarOpen(false)}>
                    <button
                        onClick={() => { resetForm(); setActiveTab("overview"); }}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-sm ${activeTab === 'overview' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/5' : 'text-black/55 dark:text-white/55 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white'}`}
                    >
                        <FiGrid size={18} /> Overview
                    </button>

                    <button
                        onClick={() => { resetForm(); setActiveTab("products"); }}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-sm ${activeTab === 'products' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/5' : 'text-black/55 dark:text-white/55 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white'}`}
                    >
                        <FiBox size={18} /> Inventory
                    </button>

                    <button
                        onClick={() => { resetForm(); setActiveTab("editor"); }}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-sm ${activeTab === 'editor' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/5' : 'text-black/55 dark:text-white/55 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white'}`}
                    >
                        <FiPlus size={18} /> Launch Product
                    </button>

                    <button
                        onClick={() => { resetForm(); setActiveTab("orders"); }}
                        className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all text-sm ${activeTab === 'orders' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/5' : 'text-black/55 dark:text-white/55 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white'}`}
                    >
                        <div className="flex items-center gap-4"><FiShoppingBag size={18} /> Orders</div>
                        {orders.filter(o => o.status === "Pending").length > 0 && (
                            <span className="w-5 h-5 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                                {orders.filter(o => o.status === "Pending").length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => { resetForm(); setActiveTab("analytics"); }}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-sm ${activeTab === 'analytics' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/5' : 'text-black/55 dark:text-white/55 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white'}`}
                    >
                        <FiTrendingUp size={18} /> Analytics
                    </button>

                    <button
                        onClick={() => { resetForm(); setActiveTab("settings"); }}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-sm ${activeTab === 'settings' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/5' : 'text-black/55 dark:text-white/55 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] hover:text-black dark:hover:text-white'}`}
                    >
                        <FiSettings size={18} /> Settings
                    </button>
                </nav>
            </div>

            <div className="p-6 border-t border-black/[0.05] dark:border-white/[0.05]">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-500/10 transition-all text-sm"
                >
                    <FiLogOut size={18} /> Log Out
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
