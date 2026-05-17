import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useProducts } from "../../Context/ProductContext";
import { useAuth } from "../../Context/AuthContext";
import { useOrders } from "../../Context/OrderContext";
import { useSettings } from "../../Context/SettingsContext";
import { categories } from "../../data/products";
import {
    FiUpload, FiPlus, FiX, FiCheckCircle, FiMinus, FiMaximize,
    FiTrash2, FiShoppingBag, FiAlertTriangle, FiEdit3, FiArrowLeft,
    FiGrid, FiList, FiSave, FiArrowRight, FiBox, FiPercent,
    FiTrendingUp, FiSettings, FiLogOut, FiSearch, FiBell, FiMoon,
    FiSun, FiEye, FiUsers, FiDollarSign, FiChevronRight, FiCheck, FiMenu
} from "react-icons/fi";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
    const { products, addProduct, deleteProduct, updateProduct } = useProducts();
    const { logout } = useAuth();
    const { orders, updateOrderStatus } = useOrders();
    const { settings, updateSettings } = useSettings();

    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [activeTab, setActiveTab] = useState("overview");
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [editingProductId, setEditingProductId] = useState(null);
    const fileInputRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [isDarkMode, setIsDarkMode] = useState(
        document.documentElement.classList.contains("dark")
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (root.classList.contains("dark")) {
            root.classList.remove("dark");
            setIsDarkMode(false);
        } else {
            root.classList.add("dark");
            setIsDarkMode(true);
        }
    };

    const [formData, setFormData] = useState({
        name: "",
        category: "T-Shirts",
        price: "",
        oldPrice: "",
        description: "",
        colors: [],
        colorStock: {},
        isOnSale: false
    });

    const [images, setImages] = useState([]);
    const [colorInput, setColorInput] = useState("");

    const [tempImage, setTempImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const [selectedOrder, setSelectedOrder] = useState(null);

    // Settings local state for the form
    const [settingsForm, setSettingsForm] = useState({
        storeName: settings.storeName,
        currency: settings.currency,
        adminEmail: settings.adminEmail,
        adminPassword: settings.adminPassword
    });

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
        // In a real app, group by date
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

    const onCropComplete = useCallback((_area, areaPixels) => {
        setCroppedAreaPixels(areaPixels);
    }, []);

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = () => {
                    setImages(prev => [...prev, { url: reader.result, color: formData.colors[0] || null }]);
                };
                reader.readAsDataURL(file);
            });
        }
        e.target.value = null;
    };

    const handleCropSave = async () => {
        try {
            const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels, rotation);
            setImages(prev => [...prev, { url: croppedImage, color: formData.colors[0] || null }]);
            setTempImage(null);
            setRotation(0);
            setZoom(1);
        } catch (e) {
            console.error(e);
        }
    };

    const updateImageColor = (index, color) => {
        setImages(prev => prev.map((img, i) => i === index ? { ...img, color } : img));
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const addColor = () => {
        if (colorInput.trim() && !formData.colors.includes(colorInput.trim())) {
            const newColor = colorInput.trim();
            setFormData(prev => ({
                ...prev,
                colors: [...prev.colors, newColor],
                colorStock: {
                    ...prev.colorStock,
                    [newColor]: { S: 0, M: 0, L: 0, XL: 0 }
                }
            }));
            setColorInput("");
        }
    };

    const removeColor = (color) => {
        setFormData(prev => {
            const newStock = { ...prev.colorStock };
            delete newStock[color];
            return {
                ...prev,
                colors: prev.colors.filter(c => c !== color),
                colorStock: newStock
            };
        });
    };

    const handleSizeStockChange = (color, size, value) => {
        setFormData(prev => ({
            ...prev,
            colorStock: {
                ...prev.colorStock,
                [color]: {
                    ...prev.colorStock[color],
                    [size]: value === "" ? 0 : parseInt(value) || 0
                }
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.colors.length === 0) return alert("Please register at least one color for the product.");
        if (images.length === 0) return alert("Please upload at least one image");

        const productPayload = {
            ...formData,
            image: images[0]?.url || "",
            allImages: images,
        };

        if (editingProductId) {
            updateProduct(editingProductId, productPayload);
            setSuccessMsg("Product details updated successfully!");
        } else {
            addProduct(productPayload);
            setSuccessMsg("New product launched successfully!");
        }

        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            resetForm();
            setActiveTab("products");
        }, 1500);
    };

    const resetForm = () => {
        setFormData({ name: "", category: "T-Shirts", price: "", oldPrice: "", description: "", colors: [], colorStock: {}, isOnSale: false });
        setImages([]);
        setEditingProductId(null);
    };

    const startEditing = (product) => {
        setEditingProductId(product.id);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            oldPrice: product.oldPrice || "",
            description: product.description || "",
            colors: product.colors || [],
            colorStock: product.colorStock || {},
            isOnSale: product.isOnSale || false
        });

        if (!product.colorStock && product.sizes && product.colors) {
            const migratedStock = {};
            product.colors.forEach(c => {
                migratedStock[c] = { ...product.sizes };
            });
            setFormData(prev => ({ ...prev, colorStock: migratedStock }));
        }

        const processedImages = (product.allImages || [product.image]).map(img =>
            typeof img === 'string' ? { url: img, color: null } : img
        );
        setImages(processedImages);
        setActiveTab("editor");
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const handleUpdateOrderStatus = (orderId, newStatus) => {
        updateOrderStatus(orderId, newStatus);
        if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
        setSuccessMsg(`Order ${orderId} marked as ${newStatus}`);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
    };

    // Filter products
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, categoryFilter]);

    return (
        <div className="min-h-screen bg-[#FBFBFB] dark:bg-black text-black dark:text-white flex transition-colors duration-500 font-body">

            {/* SIDEBAR OVERLAY (mobile only) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* SIDEBAR */}
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

            {/* MAIN PORT */}
            <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden w-full">

                {/* TOP HEADER */}
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
                                <p className="text-xs font-bold dark:text-white truncate max-w-[120px]">{settings.adminEmail.split('@')[0]}</p>
                                <p className="text-[10px] font-medium text-black/40 dark:text-white/40">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black dark:bg-white rounded-xl flex items-center justify-center font-black text-white dark:text-black text-sm uppercase">
                                {settings.adminEmail.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* VIEW CONTROLLER */}
                <div className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto">

                    {/* VIEW: OVERVIEW */}
                    {activeTab === "overview" && (
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

                                    {/* Dynamic SVG Chart */}
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
                                {/* Recent Products */}
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

                                {/* Recent Orders */}
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
                    )}

                    {/* VIEW: PRODUCTS (INVENTORY DATA TABLE) */}
                    {activeTab === "products" && (
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
                    )}

                    {/* VIEW: LAUNCH / EDIT PRODUCT FORM */}
                    {activeTab === "editor" && (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {editingProductId && (
                                        <button
                                            onClick={() => { resetForm(); setActiveTab("products"); }}
                                            className="w-11 h-11 bg-white border border-black/5 dark:bg-neutral-900 dark:border-white/5 rounded-xl flex items-center justify-center text-black/60 dark:text-white/60 hover:bg-black/[0.02]"
                                        >
                                            <FiArrowLeft size={16} />
                                        </button>
                                    )}
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold dark:text-white">
                                            {editingProductId ? `Edit Asset: ${formData.name}` : "Launch New Apparel Asset"}
                                        </h3>
                                        <p className="text-xs text-black/40 dark:text-white/40 mt-1 hidden sm:block">Configure specification matrix and visual media parameters</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
                                {/* Form Left (Identity & Specs) */}
                                <div className="lg:col-span-7 space-y-8">
                                    <div className="bg-white dark:bg-neutral-900 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[35px] border border-black/[0.04] dark:border-white/[0.04] shadow-sm space-y-8">
                                        <h4 className="text-sm font-bold uppercase tracking-wider dark:text-white flex items-center gap-3 border-b border-black/[0.03] dark:border-white/[0.03] pb-4">
                                            <span className="w-1.5 h-5 bg-black dark:bg-white rounded-full" /> Identity Specs
                                        </h4>

                                        <div className="space-y-6">
                                            <div className="space-y-2.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 ml-1">Asset Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="e.g. Minimalist Core Tee"
                                                    className="input-field"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                <div className="space-y-2.5">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 ml-1">Category Classification</label>
                                                    <select
                                                        className="input-field appearance-none cursor-pointer"
                                                        value={formData.category}
                                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                    >
                                                        {categories.filter(c => c !== "All").map(cat => (
                                                            <option key={cat} value={cat}>{cat}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div className="space-y-2.5">
                                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 ml-1">Retail Price</label>
                                                    <input
                                                        type="number"
                                                        required
                                                        placeholder="0"
                                                        className="input-field font-bold"
                                                        value={formData.price}
                                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 ml-1">Comparative Price - Optional</label>
                                                <input
                                                    type="number"
                                                    placeholder="Original price before markup markdown discount"
                                                    className="input-field"
                                                    value={formData.oldPrice}
                                                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                                                />
                                            </div>

                                            <div className="bg-red-500/5 dark:bg-red-500/[0.02] p-6 rounded-2xl border border-red-500/10 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                                                        <FiPercent size={18} />
                                                    </div>
                                                    <div>
                                                        <h5 className="text-sm font-bold dark:text-white">Promotional Discount Suite</h5>
                                                        <p className="text-[10px] text-black/40 dark:text-white/40 mt-0.5">Categorize this apparel under the "End of Season Sale"</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={formData.isOnSale}
                                                        onChange={(e) => setFormData({ ...formData, isOnSale: e.target.checked })}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 dark:bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black dark:peer-checked:bg-white" />
                                                </label>
                                            </div>

                                            <div className="space-y-2.5">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 ml-1">Asset Narrative Description</label>
                                                <textarea
                                                    rows="4"
                                                    required
                                                    placeholder="Specify textile content, fitment guidelines, and styling parameters..."
                                                    className="input-field resize-none leading-relaxed"
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Inventory Allocations */}
                                    <div className="bg-white dark:bg-neutral-900 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[35px] border border-black/[0.04] dark:border-white/[0.04] shadow-sm space-y-8">
                                        <h4 className="text-sm font-bold uppercase tracking-wider dark:text-white flex items-center gap-3 border-b border-black/[0.03] dark:border-white/[0.03] pb-4">
                                            <span className="w-1.5 h-5 bg-black dark:bg-white rounded-full" /> Stock Matrix Allocations
                                        </h4>

                                        {formData.colors.length === 0 ? (
                                            <div className="py-8 text-center text-black/30 dark:text-white/30 text-xs font-bold bg-gray-50/50 dark:bg-neutral-800/10 rounded-2xl border border-dashed border-black/10">
                                                Register color palette variants below to construct sizing matrix allocations.
                                            </div>
                                        ) : (
                                            <div className="space-y-8">
                                                {formData.colors.map(color => (
                                                    <div key={color} className="space-y-4 bg-gray-50/30 dark:bg-neutral-800/10 p-5 rounded-2xl border border-black/[0.02]">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-5 h-5 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: color }} />
                                                            <h5 className="text-xs font-black dark:text-white uppercase tracking-wider">{color} Allocations</h5>
                                                        </div>
                                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                            {['S', 'M', 'L', 'XL'].map((size) => (
                                                                <div key={size} className="space-y-2">
                                                                    <label className="text-[9px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 ml-1">Size {size}</label>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        placeholder="0"
                                                                        className="w-full bg-white dark:bg-neutral-900 rounded-xl px-4 py-3 outline-none dark:text-white font-bold text-center border border-black/[0.05]"
                                                                        value={formData.colorStock[color]?.[size] === 0 ? "" : formData.colorStock[color]?.[size]}
                                                                        onChange={(e) => handleSizeStockChange(color, size, e.target.value)}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Form Right (Visual Palette & Assets) */}
                                <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
                                    <div className="bg-white dark:bg-neutral-900 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[35px] border border-black/[0.04] dark:border-white/[0.04] shadow-sm space-y-6">
                                        <h4 className="text-sm font-bold uppercase tracking-wider dark:text-white flex items-center gap-3 border-b border-black/[0.03] dark:border-white/[0.03] pb-4">
                                            <span className="w-1.5 h-5 bg-black dark:bg-white rounded-full" /> Aesthetic Spectrum
                                        </h4>
                                        <div className="flex gap-4">
                                            <input
                                                type="color"
                                                className="w-20 h-14 rounded-xl cursor-pointer bg-transparent border-none p-0 outline-none shrink-0"
                                                value={colorInput || "#000000"}
                                                onChange={(e) => setColorInput(e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={addColor}
                                                className="flex-1 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold text-xs hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                            >
                                                <FiPlus /> Register Color
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2.5">
                                            {formData.colors.map(color => (
                                                <span key={color} className="flex items-center gap-2 bg-gray-50 dark:bg-neutral-800 dark:text-white pl-2.5 pr-4 py-2 rounded-xl text-[10px] font-black border border-black/5">
                                                    <div className="w-4 h-4 rounded-md shadow-inner border border-black/5" style={{ backgroundColor: color }} />
                                                    {color.toUpperCase()}
                                                    <FiX className="cursor-pointer text-black/20 hover:text-red-500 transition-colors ml-1" onClick={() => removeColor(color)} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-neutral-900 p-5 sm:p-8 md:p-10 rounded-2xl sm:rounded-[35px] border border-black/[0.04] dark:border-white/[0.04] shadow-sm space-y-6">
                                        <h4 className="text-sm font-bold uppercase tracking-wider dark:text-white flex items-center gap-3 border-b border-black/[0.03] dark:border-white/[0.03] pb-4">
                                            <span className="w-1.5 h-5 bg-black dark:bg-white rounded-full" /> Media Assets
                                        </h4>

                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="group border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-black/[0.01] transition-all relative"
                                        >
                                            <FiUpload size={32} className="text-black/20 dark:text-white/20 mb-4 group-hover:-translate-y-0.5 transition-transform" />
                                            <span className="font-bold text-xs dark:text-white text-center">Import Image File</span>
                                            <span className="text-[10px] text-black/30 dark:text-white/30 text-center mt-1">Accepts high-res media aspect ratio [3:4]</span>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                multiple
                                                className="hidden"
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                            />
                                        </div>

                                        {images.length > 0 && (
                                            <div className="grid grid-cols-2 gap-4">
                                                {images.map((img, idx) => (
                                                    <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden group border border-black/5 bg-gray-50 shadow-inner">
                                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                                            <select
                                                                value={img.color || ""}
                                                                onChange={(e) => updateImageColor(idx, e.target.value)}
                                                                className="w-full bg-white/15 backdrop-blur-md text-white text-[9px] font-bold py-1.5 rounded-lg outline-none border-none cursor-pointer px-1"
                                                            >
                                                                <option value="" className="text-black">Unbound</option>
                                                                {formData.colors.map(c => (
                                                                    <option key={c} value={c} className="text-black">{c.toUpperCase()}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(idx)}
                                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                                        >
                                                            <FiX size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-black dark:bg-white text-white dark:text-black font-black py-5 rounded-[22px] text-base shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3"
                                    >
                                        {editingProductId ? <FiSave size={18} /> : <FiArrowRight size={18} />}
                                        {editingProductId ? "Commit Configuration" : "Deploy Product Asset"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* VIEW: ORDERS */}
                    {activeTab === "orders" && (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <div className="bg-white dark:bg-neutral-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/[0.04] dark:border-white/[0.04] shadow-sm">
                                <h3 className="text-lg font-bold mb-6 dark:text-white">Store Sales Reconciliation</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-black/[0.03] dark:border-white/[0.03] bg-gray-50/50 dark:bg-neutral-800/10">
                                                <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Order UID</th>
                                                <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Customer Details</th>
                                                <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Date</th>
                                                <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Reconciled Value</th>
                                                <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Execution Status</th>
                                                <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black/[0.03] dark:divide-white/[0.03]">
                                            {orders.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="py-20 text-center text-black/30 dark:text-white/30 font-bold">
                                                        <FiShoppingBag className="mx-auto mb-4 text-black/10 dark:text-white/10" size={40} />
                                                        No orders have been placed in the system yet.
                                                    </td>
                                                </tr>
                                            ) : (
                                                orders.map((order) => (
                                                    <tr key={order.id} className="hover:bg-gray-50/30 dark:hover:bg-neutral-800/10 transition-colors">
                                                        <td className="py-5 px-6 text-sm font-bold dark:text-white">{order.id}</td>
                                                        <td className="py-5 px-6">
                                                            <div>
                                                                <p className="text-sm font-bold dark:text-white">{order.customer || order.firstName + ' ' + order.lastName}</p>
                                                                <p className="text-[10px] text-black/40 dark:text-white/40 mt-0.5">{order.email}</p>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-6 text-xs text-black/55 dark:text-white/55 font-semibold">{order.date}</td>
                                                        <td className="py-5 px-6 text-sm font-black dark:text-white">{settings.currency.split(' ')[0]} {order.total?.toLocaleString() || "0"}</td>
                                                        <td className="py-5 px-6">
                                                            <span className={`badge ${order.status === 'Delivered' ? 'badge-success' :
                                                                    order.status === 'Pending' ? 'badge-warning' :
                                                                        order.status === 'Cancelled' ? 'badge-danger' :
                                                                            'badge-neutral'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-6 text-right">
                                                            <div className="flex items-center justify-end gap-3">
                                                                <button
                                                                    onClick={() => handleOrderClick(order)}
                                                                    className="px-4 py-2 bg-gray-50 hover:bg-black hover:text-white dark:bg-neutral-800 dark:hover:bg-white dark:hover:text-black text-black/60 dark:text-white/60 text-[10px] font-black rounded-lg transition-all"
                                                                >
                                                                    Details
                                                                </button>
                                                                <select
                                                                    value={order.status}
                                                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                                    className="bg-gray-50 dark:bg-neutral-800 text-[10px] font-bold py-2 px-3 rounded-lg border-none outline-none dark:text-white cursor-pointer"
                                                                >
                                                                    <option value="Pending">Pending</option>
                                                                    <option value="Shipped">Shipped</option>
                                                                    <option value="Delivered">Delivered</option>
                                                                    <option value="Cancelled">Cancelled</option>
                                                                </select>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* VIEW: ANALYTICS */}
                    {activeTab === "analytics" && (
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
                    )}

                    {/* VIEW: SETTINGS */}
                    {activeTab === "settings" && (
                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl space-y-8">
                            <div className="dashboard-card p-5 sm:p-8 rounded-2xl sm:rounded-[35px] space-y-6">
                                <h3 className="text-lg font-bold dark:text-white border-b border-black/[0.03] dark:border-white/[0.03] pb-4">Store Identity Configuration</h3>

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        updateSettings({
                                            storeName: settingsForm.storeName,
                                            currency: settingsForm.currency
                                        });
                                        setSuccessMsg("Store configurations successfully saved!");
                                        setSuccess(true);
                                        setTimeout(() => setSuccess(false), 1500);
                                    }}
                                    className="space-y-4"
                                >
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

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        updateSettings({
                                            adminEmail: settingsForm.adminEmail,
                                            adminPassword: settingsForm.adminPassword
                                        });
                                        setSuccessMsg("Administrative credentials successfully updated!");
                                        setSuccess(true);
                                        setTimeout(() => setSuccess(false), 1500);
                                    }}
                                    className="space-y-4"
                                >
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
                    )}
                </div>
            </main>

            {/* MODAL: IMAGE CROPPER OVERLAY */}
            <AnimatePresence>
                {tempImage && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4">
                        <div className="relative w-full h-[70vh] bg-neutral-900 rounded-[30px] overflow-hidden mb-8">
                            <Cropper
                                image={tempImage}
                                crop={crop}
                                zoom={zoom}
                                rotation={rotation}
                                aspect={3 / 4}
                                onCropChange={setCrop}
                                onRotationChange={setRotation}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </div>

                        <div className="w-full max-w-md space-y-6">
                            <div className="flex items-center gap-6">
                                <FiMinus className="text-white/40" />
                                <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} className="flex-1 accent-white" />
                                <FiMaximize className="text-white/40" />
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setTempImage(null)} className="flex-1 py-4 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all">Cancel</button>
                                <button onClick={handleCropSave} className="flex-1 py-4 rounded-2xl bg-white text-black font-bold hover:scale-105 transition-all shadow-2xl">Register Image</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL: DELETE CONFIRMATION */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 p-10 rounded-[35px] max-w-sm w-full text-center border border-black/5">
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiAlertTriangle size={32} />
                            </div>
                            <h3 className="text-2xl font-black dark:text-white mb-2">Delete Product?</h3>
                            <p className="text-black/40 dark:text-white/40 font-medium mb-8">This action is irreversible. All product data will be lost.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => setDeleteConfirmId(null)} className="py-4 rounded-2xl bg-black/5 dark:bg-white/5 font-bold dark:text-white">Keep</button>
                                <button onClick={() => { deleteProduct(deleteConfirmId); setDeleteConfirmId(null); }} className="py-4 rounded-2xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/30">Delete</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL: ORDER DETAILS */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 p-10 rounded-[35px] max-w-lg w-full border border-black/5 space-y-6">
                            <div className="flex justify-between items-center border-b border-black/[0.05] dark:border-white/[0.05] pb-4">
                                <h3 className="text-lg font-bold dark:text-white">Transaction Metadata</h3>
                                <button onClick={() => setSelectedOrder(null)} className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"><FiX size={20} /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Order Identifier</p>
                                        <p className="text-sm font-bold dark:text-white mt-1">{selectedOrder.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Transaction Date</p>
                                        <p className="text-sm font-bold dark:text-white mt-1">{selectedOrder.date}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Customer Details</p>
                                        <p className="text-sm font-bold dark:text-white mt-1">{selectedOrder.customer || selectedOrder.firstName + ' ' + selectedOrder.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Email Coordinates</p>
                                        <p className="text-sm font-bold dark:text-white mt-1">{selectedOrder.email}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Purchased Items Payload</p>
                                    <div className="mt-1 bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl space-y-2">
                                        {selectedOrder.cart ? (
                                            selectedOrder.cart.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-xs font-medium dark:text-white">
                                                    <span>{item.quantity}x {item.name} ({item.selectedColor}, {item.selectedSize})</span>
                                                    <span>Rs. {item.price * item.quantity}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs font-medium dark:text-white">{selectedOrder.items || "Legacy Order Formatting"}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                                    <span className="text-xs font-bold dark:text-white">Gross Financial Value</span>
                                    <span className="text-base font-black dark:text-white">Rs. {selectedOrder.total?.toLocaleString() || "0"}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-black/[0.05] dark:border-white/[0.05]">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Status Toggle</span>
                                    <span className={`badge block w-fit ${selectedOrder.status === 'Delivered' ? 'badge-success' :
                                            selectedOrder.status === 'Pending' ? 'badge-warning' :
                                                selectedOrder.status === 'Cancelled' ? 'badge-danger' :
                                                    'badge-neutral'
                                        }`}>{selectedOrder.status}</span>
                                </div>
                                <div className="flex gap-2">
                                    {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                                        <button
                                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Delivered")}
                                            className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-green-500/10"
                                        >
                                            <FiCheck size={14} /> Deliver
                                        </button>
                                    )}
                                    {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Delivered' && (
                                        <button
                                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Cancelled")}
                                            className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-red-500/10"
                                        >
                                            <FiX size={14} /> Cancel
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="px-4 py-2.5 bg-gray-100 dark:bg-neutral-800 text-black dark:text-white font-bold text-xs rounded-xl"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* TOAST: SYSTEM STATUS SUCCESS */}
            <AnimatePresence>
                {success && (
                    <motion.div initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -100 }} className="fixed top-10 left-0 right-0 mx-auto w-fit z-[110] bg-black dark:bg-white text-white dark:text-black px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10">
                        <FiCheckCircle className="text-green-400" size={24} />
                        <span className="font-black tracking-tight">{successMsg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default AdminDashboard;
