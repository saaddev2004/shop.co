import React from 'react';
import { FiMenu, FiSun, FiMoon } from "react-icons/fi";

const AdminHeader = ({ activeTab, editingProductId, setIsSidebarOpen, isDarkMode, toggleTheme, settings }) => {
    return (
        <header className="h-20 lg:h-24 bg-white dark:bg-neutral-900 border-b border-black/[0.05] dark:border-white/[0.05] px-4 sm:px-6 lg:px-10 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3">
                <button
                    className="lg:hidden p-2 -ml-1 text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    <FiMenu size={22} />
                </button>
                <h2 className="text-sm sm:text-lg lg:text-xl font-bold uppercase tracking-widest text-black/40 dark:text-white/40 font-heading">
                    {activeTab === 'overview' && "Dashboard Overview"}
                    {activeTab === 'products' && "Inventory Matrix"}
                    {activeTab === 'editor' && (editingProductId ? "Modify Identity" : "Launch Asset")}
                    {activeTab === 'orders' && "Order Reconciliation"}
                    {activeTab === 'analytics' && "Market Intelligence"}
                    {activeTab === 'settings' && "System Configuration"}
                </h2>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
                <button
                    onClick={toggleTheme}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-50 dark:bg-neutral-800 flex items-center justify-center hover:scale-105 transition-all text-black/60 dark:text-white/60"
                >
                    {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                </button>

                <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l border-black/[0.05] dark:border-white/[0.05]">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold dark:text-white truncate max-w-[120px]">{settings?.adminEmail ? settings.adminEmail.split('@')[0] : 'admin'}</p>
                        <p className="text-[10px] font-medium text-black/40 dark:text-white/40">Super Admin</p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center font-black text-white dark:text-black text-sm uppercase">
                        {settings?.adminEmail ? settings.adminEmail.charAt(0) : 'A'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
