import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from "../../../Context/SettingsContext";

const SettingsTab = ({ setSuccess, setSuccessMsg }) => {
    const { settings, updateSettings } = useSettings();

    const [settingsForm, setSettingsForm] = useState({
        storeName: settings.storeName,
        currency: settings.currency,
        adminEmail: settings.adminEmail,
        adminPassword: settings.adminPassword
    });

    const handleUpdateStore = (e) => {
        e.preventDefault();
        updateSettings({
            storeName: settingsForm.storeName,
            currency: settingsForm.currency
        });
        setSuccessMsg("Store configurations successfully saved!");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 1500);
    };

    const handleUpdateAdmin = (e) => {
        e.preventDefault();
        updateSettings({
            adminEmail: settingsForm.adminEmail,
            adminPassword: settingsForm.adminPassword
        });
        setSuccessMsg("Administrative credentials successfully updated!");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 1500);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-8">
            <div className="dashboard-card p-5 sm:p-8 rounded-2xl sm:rounded-[35px] space-y-6">
                <h3 className="text-lg font-bold dark:text-white border-b border-black/[0.03] dark:border-white/[0.03] pb-4">Store Identity Configuration</h3>

                <form onSubmit={handleUpdateStore} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">Marketplace Endpoint Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={settingsForm.storeName}
                            onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">Reconciliation Currency Base</label>
                        <input
                            type="text"
                            className="input-field"
                            value={settingsForm.currency}
                            onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-4 bg-black dark:bg-white text-white dark:text-black font-bold text-xs rounded-xl hover:scale-[1.02] transition-all mt-4"
                    >
                        Commit Configuration
                    </button>
                </form>
            </div>

            <div className="dashboard-card p-8 rounded-[35px] space-y-6">
                <h3 className="text-lg font-bold dark:text-white border-b border-black/[0.03] dark:border-white/[0.03] pb-4">Administrative Identity Access</h3>

                <form onSubmit={handleUpdateAdmin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">System Email Credentials</label>
                        <input
                            type="email"
                            className="input-field"
                            value={settingsForm.adminEmail}
                            onChange={(e) => setSettingsForm({ ...settingsForm, adminEmail: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40">Update Secure Password</label>
                        <input
                            type="text"
                            className="input-field"
                            value={settingsForm.adminPassword}
                            onChange={(e) => setSettingsForm({ ...settingsForm, adminPassword: e.target.value })}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-4 bg-red-500 text-white font-bold text-xs rounded-xl hover:scale-[1.02] transition-all mt-4 shadow-lg shadow-red-500/20"
                    >
                        Update Master Security Key
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default SettingsTab;
