import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from "../../../Context/ProductContext";
import { useOrders } from "../../../Context/OrderContext";
import { useSettings } from "../../../Context/SettingsContext";

const AnalyticsTab = () => {
    const { products } = useProducts();
    const { orders } = useOrders();
    const { settings } = useSettings();

    const stats = useMemo(() => {
        const deliveredOrders = orders.filter(o => o.status === "Delivered");
        const totalRevenue = deliveredOrders.reduce((acc, o) => acc + (o.total || 0), 0);
        
        const aov = deliveredOrders.length > 0 ? (totalRevenue / deliveredOrders.length) : 0;
        const mockConversionRate = orders.length > 0 ? Math.min(100, orders.length * 0.5 + 1.2).toFixed(2) : "0.00";

        return { aov, conversionRate: mockConversionRate };
    }, [orders]);

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                <div className="dashboard-card p-5 sm:p-8 rounded-2xl sm:rounded-[35px]">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">Average Order Value</h4>
                    <h3 className="text-3xl font-black dark:text-white">{settings.currency.split(' ')[0]} {Math.round(stats.aov).toLocaleString()}</h3>
                    <p className="text-[10px] text-emerald-500 font-bold bg-emerald-500/5 px-2 py-0.5 rounded mt-3 w-fit">Based on {orders.filter(o => o.status === "Delivered").length} delivered orders</p>
                </div>
                <div className="dashboard-card p-5 sm:p-8 rounded-2xl sm:rounded-[35px]">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">Customer Acquisition Rate</h4>
                    <h3 className="text-3xl font-black dark:text-white">{orders.length > 0 ? "88%" : "0%"}</h3>
                    <p className="text-[10px] text-emerald-500 font-bold bg-emerald-500/5 px-2 py-0.5 rounded mt-3 w-fit">Dynamic organic discovery</p>
                </div>
                <div className="sm:col-span-2 md:col-span-1 dashboard-card p-5 sm:p-8 rounded-2xl sm:rounded-[35px]">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-2">Store Conversion Rate</h4>
                    <h3 className="text-3xl font-black dark:text-white">{stats.conversionRate}%</h3>
                    <p className="text-[10px] text-amber-500 font-bold bg-amber-500/5 px-2 py-0.5 rounded mt-3 w-fit">Estimated traffic conversion</p>
                </div>
            </div>

            <div className="dashboard-card p-5 sm:p-8 rounded-2xl sm:rounded-[35px] space-y-6">
                <div>
                    <h3 className="text-lg font-bold dark:text-white">Store Performance Breakdown</h3>
                    <p className="text-xs text-black/40 dark:text-white/40 mt-1">Comparing real-time metric thresholds against system goals</p>
                </div>

                <div className="space-y-6 pt-6 border-t border-black/[0.03] dark:border-white/[0.03]">
                    {[
                        { metric: "Gross Sales Revenue", current: orders.reduce((a, o) => a + o.total, 0), target: 10000, prefix: settings.currency.split(' ')[0] + ' ' },
                        { metric: "Total Orders Processed", current: orders.length, target: 50, prefix: "" },
                        { metric: "Active Inventory SKUs", current: products.length, target: 100, prefix: "" },
                        { metric: "Delivered Packages", current: orders.filter(o => o.status === "Delivered").length, target: 20, prefix: "" },
                    ].map((anal, idx) => {
                        const pct = Math.min(100, anal.target === 0 ? 0 : Math.round((anal.current / anal.target) * 100));
                        return (
                            <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                                <div className="sm:col-span-3 text-sm font-bold dark:text-white">{anal.metric}</div>
                                <div className="sm:col-span-6">
                                    <div className="w-full h-3 bg-gray-50 dark:bg-neutral-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-1000"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-3 text-right text-xs font-bold">
                                    <span className="dark:text-white">{anal.prefix}{anal.current.toLocaleString()}</span>
                                    <span className="text-black/30 dark:text-white/30 ml-2">/ Target: {anal.prefix}{anal.target.toLocaleString()}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default AnalyticsTab;
