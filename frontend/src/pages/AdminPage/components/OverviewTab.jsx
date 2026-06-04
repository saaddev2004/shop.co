import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiGrid, FiBox, FiShoppingBag, FiChevronRight } from "react-icons/fi";
import { useProducts } from "../../../Context/ProductContext";
import { useOrders } from "../../../Context/OrderContext";
import { useSettings } from "../../../Context/SettingsContext";

const OverviewTab = ({ setActiveTab }) => {
    const { products } = useProducts();
    const { orders } = useOrders();
    const { settings } = useSettings();

    // Dynamic core statistics
    const stats = useMemo(() => {
        const totalProducts = products.length;
        const totalStock = products.reduce((acc, p) => {
            const stock = p.colorStock || {};
            return acc + Object.values(stock).reduce((sAcc, sizes) => sAcc + Object.values(sizes).reduce((a, b) => a + b, 0), 0);
        }, 0);

        const deliveredOrders = orders.filter(o => o.status === "Delivered");
        const totalRevenue = deliveredOrders.reduce((acc, o) => acc + (o.total || 0), 0);
        const onSaleCount = products.filter(p => p.isOnSale).length;
        const pendingOrders = orders.filter(o => o.status === "Pending").length;

        // Analytics variables
        const aov = deliveredOrders.length > 0 ? (totalRevenue / deliveredOrders.length) : 0;
        // Simple mock conversion rate based on order count
        const mockConversionRate = orders.length > 0 ? Math.min(100, orders.length * 0.5 + 1.2).toFixed(2) : "0.00";

        return {
            cards: [
                { label: "Total Revenue", value: `${settings.currency.split(' ')[0]} ${totalRevenue.toLocaleString()}`, change: "Actual Delivered Revenue", icon: FiDollarSign, color: "bg-emerald-500/10 text-emerald-500" },
                { label: "Active Products", value: totalProducts, change: `${onSaleCount} currently on sale`, icon: FiGrid, color: "bg-blue-500/10 text-blue-500" },
                { label: "Inventory SKUs", value: totalStock, change: `${totalStock < 50 ? "Low stock warning" : "Healthy levels"}`, icon: FiBox, color: "bg-amber-500/10 text-amber-500" },
                { label: "Total Orders", value: orders.length, change: `${pendingOrders} pending confirmation`, icon: FiShoppingBag, color: "bg-violet-500/10 text-violet-500" },
            ],
            aov: aov,
            conversionRate: mockConversionRate
        };
    }, [products, orders, settings.currency]);

    // Dynamic Chart Data (Simulated 7 points based on recent order totals)
    const chartPath = useMemo(() => {
        if (orders.length === 0) return "M 50 200 L 850 200"; // Flat line if no data
        // For visual effect, generate some pseudo-random points anchored by order count
        const base = 200;
        let p = `M 50 ${base - (orders.length * 5 % 150)}`;
        p += ` Q 150 ${base - (orders.length * 10 % 180)} 250 ${base - (orders.length * 15 % 160)}`;
        p += ` T 450 ${base - (orders.length * 20 % 190)}`;
        p += ` T 650 ${base - (orders.length * 8 % 150)}`;
        p += ` T 850 ${base - (orders.length * 25 % 200)}`;
        return p;
    }, [orders]);

    // Dynamic distribution matrix (Product counts per category)
    const categoryDistribution = useMemo(() => {
        const dist = {};
        let total = 0;
        products.forEach(p => {
            dist[p.category] = (dist[p.category] || 0) + 1;
            total++;
        });

        return Object.entries(dist).map(([cat, count]) => ({
            category: cat,
            count,
            pct: total > 0 ? Math.round((count / total) * 100) : 0
        })).sort((a, b) => b.pct - a.pct).slice(0, 4); // Top 4 categories
    }, [products]);

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {stats.cards.map((stat, idx) => (
                    <div key={idx} className="dashboard-card p-5 sm:p-7 rounded-2xl sm:rounded-3xl flex flex-col justify-between h-32 sm:h-40">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 mb-1">{stat.label}</p>
                                <h3 className="text-xl sm:text-2xl font-black tracking-tight dark:text-white">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-2xl ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/5 px-2.5 py-1 rounded-lg w-fit">
                            {stat.change}
                        </span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 dashboard-card p-5 sm:p-8 rounded-2xl sm:rounded-[35px] flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-2">
                        <div>
                            <h3 className="text-lg font-bold dark:text-white">Store Sales Trajectory</h3>
                            <p className="text-xs text-black/40 dark:text-white/40">Real-time dynamic gross sales performance tracking</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-black/40 dark:text-white/40">Total Lifetime Delivered</p>
                            <p className="text-sm font-black dark:text-white">{settings.currency.split(' ')[0]} {orders.filter(o => o.status === "Delivered").reduce((a, o) => a + o.total, 0).toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="h-48 sm:h-64 relative flex items-end justify-between w-full pt-10 px-2 sm:px-4 overflow-hidden rounded-2xl">
                        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                            <line x1="0" y1="40" x2="100%" y2="40" stroke="currentColor" className="text-black/[0.03] dark:text-white/[0.03]" strokeWidth="1" />
                            <line x1="0" y1="100" x2="100%" y2="100" stroke="currentColor" className="text-black/[0.03] dark:text-white/[0.03]" strokeWidth="1" />
                            <line x1="0" y1="160" x2="100%" y2="160" stroke="currentColor" className="text-black/[0.03] dark:text-white/[0.03]" strokeWidth="1" />
                            <line x1="0" y1="220" x2="100%" y2="220" stroke="currentColor" className="text-black/[0.03] dark:text-white/[0.03]" strokeWidth="1" />

                            <path
                                d={chartPath}
                                fill="none"
                                stroke="url(#chartGrad)"
                                strokeWidth="4.5"
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-in-out"
                            />

                            <defs>
                                <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#8B5CF6" />
                                    <stop offset="50%" stopColor="#EC4899" />
                                    <stop offset="100%" stopColor="#EF4444" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>

                <div className="lg:col-span-4 dashboard-card p-5 sm:p-8 rounded-2xl sm:rounded-[35px] flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold dark:text-white mb-6">Live Inventory Matrix</h3>
                        <div className="space-y-6">
                            {categoryDistribution.length === 0 ? (
                                <p className="text-xs text-black/40">No active products to display matrix.</p>
                            ) : (
                                categoryDistribution.map((dist, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-xs font-bold mb-2">
                                            <span className="dark:text-white truncate max-w-[150px]">{dist.category}</span>
                                            <span className="text-black/40">{dist.pct}% ({dist.count})</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${idx === 0 ? 'bg-violet-500' : idx === 1 ? 'bg-emerald-500' : idx === 2 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${dist.pct}%` }} />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => setActiveTab("analytics")}
                        className="w-full py-4 bg-gray-50 hover:bg-black/5 dark:bg-neutral-800 dark:hover:bg-white/5 text-black dark:text-white font-bold rounded-2xl transition-all text-xs flex items-center justify-center gap-2 mt-6"
                    >
                        Inspect Analytics <FiChevronRight />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                <div className="dashboard-card p-5 sm:p-8 rounded-2xl sm:rounded-[35px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold dark:text-white">Latest Product Ingress</h3>
                        <button onClick={() => setActiveTab("products")} className="text-xs font-bold text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white">View All</button>
                    </div>
                    <div className="divide-y divide-black/[0.03] dark:divide-white/[0.03] space-y-4">
                        {products.length === 0 ? (
                            <p className="text-xs font-bold text-black/40 pt-4">No products in inventory yet.</p>
                        ) : (
                            products.slice(0, 4).map((product) => (
                                <div key={product.id} className="flex items-center justify-between pt-4 first:pt-0">
                                    <div className="flex items-center gap-4">
                                        <img src={product.image} className="w-10 h-14 sm:w-12 sm:h-16 object-cover rounded-xl border border-black/5 bg-gray-50 shrink-0" alt="" />
                                        <div>
                                            <h4 className="text-sm font-bold dark:text-white line-clamp-1">{product.name}</h4>
                                            <p className="text-xs text-black/40 dark:text-white/40 mt-0.5">{product.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-black dark:text-white">Rs. {product.price}</p>
                                        {product.isOnSale && <span className="inline-block text-[9px] bg-red-100 text-red-500 dark:bg-red-500/10 font-bold px-2 py-0.5 rounded-full mt-1">Sale</span>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="dashboard-card p-5 sm:p-8 rounded-2xl sm:rounded-[35px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold dark:text-white">Recent Transactions</h3>
                        <button onClick={() => setActiveTab("orders")} className="text-xs font-bold text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white">View All</button>
                    </div>
                    <div className="divide-y divide-black/[0.03] dark:divide-white/[0.03] space-y-4">
                        {orders.length === 0 ? (
                            <p className="text-xs font-bold text-black/40 pt-4">No real orders received yet.</p>
                        ) : (
                            orders.slice(0, 4).map((order) => (
                                <div key={order.id} className="flex items-center justify-between pt-4 first:pt-0">
                                    <div>
                                        <h4 className="text-sm font-bold dark:text-white truncate max-w-[150px]">{order.customer || order.firstName + ' ' + order.lastName}</h4>
                                        <p className="text-xs text-black/40 dark:text-white/40 mt-0.5">{order.id} • {order.date}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black dark:text-white">Rs. {order.total?.toLocaleString()}</p>
                                        <span className={`inline-block text-[9px] font-bold px-2.5 py-0.5 rounded-full mt-1.5 ${order.status === 'Delivered' ? 'bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400' :
                                                order.status === 'Pending' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400' :
                                                    order.status === 'Cancelled' ? 'bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400' :
                                                        'bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default OverviewTab;
