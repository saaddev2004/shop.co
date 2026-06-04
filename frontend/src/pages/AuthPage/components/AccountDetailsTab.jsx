import React from 'react';
import { FiUser } from "react-icons/fi";

const AccountDetailsTab = ({ currentUser }) => {
    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/[0.04] dark:border-white/[0.04]">
            <h3 className="text-xl font-bold dark:text-white flex items-center gap-3">
                <FiUser /> Account Details
            </h3>
            </div>
            <div className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-black/60 dark:text-white/60 mb-2">Full Name</label>
                <input type="text" readOnly value={currentUser.name} className="w-full bg-gray-50 dark:bg-neutral-800 border border-transparent rounded-2xl px-6 py-4 outline-none font-medium dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-bold text-black/60 dark:text-white/60 mb-2">Email Address</label>
                <input type="email" readOnly value={currentUser.email} className="w-full bg-gray-50 dark:bg-neutral-800 border border-transparent rounded-2xl px-6 py-4 outline-none font-medium dark:text-white" />
            </div>
            <div>
                <label className="block text-sm font-bold text-black/60 dark:text-white/60 mb-2">Member Since</label>
                <input type="text" readOnly value={currentUser.joinDate} className="w-full bg-gray-50 dark:bg-neutral-800 border border-transparent rounded-2xl px-6 py-4 outline-none font-medium dark:text-white" />
            </div>
            <button className="bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-full font-bold hover:scale-[1.02] transition-transform">
                Update Details
            </button>
            </div>
        </div>
    );
};

export default AccountDetailsTab;
