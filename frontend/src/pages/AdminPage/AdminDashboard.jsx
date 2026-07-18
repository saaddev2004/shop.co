import React, { useState, useEffect } from "react";
import { useProducts } from "../../Context/ProductContext";
import { useAuth } from "../../Context/AuthContext";
import { useOrders } from "../../Context/OrderContext";
import { useSettings } from "../../Context/SettingsContext";
import { FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import OverviewTab from "./components/OverviewTab";
import ProductsTab from "./components/ProductsTab";
import EditorTab from "./components/EditorTab";
import OrdersTab from "./components/OrdersTab";
import AnalyticsTab from "./components/AnalyticsTab";
import SettingsTab from "./components/SettingsTab";

const AdminDashboard = () => {
    const { deleteProduct, addProduct, updateProduct } = useProducts();
    const { logout } = useAuth();
    const { settings } = useSettings();
    const { orders } = useOrders();

    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [activeTab, setActiveTab] = useState("overview");
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [editingProductId, setEditingProductId] = useState(null);
    
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // 1. Initial load par browser se theme check karo
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    // 2. Theme change hone par HTML class update karo aur save karo
    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    // 3. Toggle button sirf state change karega
    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    const [formData, setFormData] = useState({
        name: "", category: "T-Shirts", price: "", oldPrice: "", description: "", colors: [], colorStock: {}, isOnSale: false
    });
    const [images, setImages] = useState([]);
    const [colorInput, setColorInput] = useState("");
    const [tempImage, setTempImage] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const resetForm = () => {
        setFormData({ name: "", category: "T-Shirts", price: "", oldPrice: "", description: "", colors: [], colorStock: {}, isOnSale: false });
        setImages([]);
        setEditingProductId(null);
    };

    const startEditing = (product) => {
        setEditingProductId(product.id);
        setFormData({
            name: product.name, category: product.category, price: product.price, oldPrice: product.oldPrice || "", description: product.description || "", colors: product.colors || [], colorStock: product.colorStock || {}, isOnSale: product.isOnSale || false
        });
        if (!product.colorStock && product.sizes && product.colors) {
            const migratedStock = {};
            product.colors.forEach(c => { migratedStock[c] = { ...product.sizes }; });
            setFormData(prev => ({ ...prev, colorStock: migratedStock }));
        }
        const processedImages = (product.allImages || [product.image]).map(img =>
            typeof img === 'string' ? { url: img, color: null } : img
        );
        setImages(processedImages);
        setActiveTab("editor");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return alert("Product name is required.");
        if (!formData.price) return alert("Product price is required.");
        if (formData.colors.length === 0) return alert("Please register at least one color for the product.");
        if (images.length === 0) return alert("Please upload at least one image");
        const productPayload = { ...formData, image: images[0]?.url || "", allImages: images };
        
        let res;
        if (editingProductId) {
            res = await updateProduct(editingProductId, productPayload);
        } else {
            res = await addProduct(productPayload);
        }

        if (res && res.success) {
            setSuccessMsg(editingProductId ? "Product details updated successfully!" : "New product launched successfully!");
            setSuccess(true);
            setTimeout(() => { setSuccess(false); resetForm(); setActiveTab("products"); }, 1500);
        } else {
            alert(res?.message || "Operation failed. Check server logs or inputs.");
        }
    };

    return (
        <div className="min-h-screen bg-[#FBFBFB] dark:bg-black text-black dark:text-white flex transition-colors duration-500 font-body">
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            <AdminSidebar 
                isSidebarOpen={isSidebarOpen} 
                setIsSidebarOpen={setIsSidebarOpen} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                resetForm={resetForm} 
                logout={logout} 
                settings={settings} 
                orders={orders} 
            />

            <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden w-full">
                <AdminHeader 
                    activeTab={activeTab} 
                    editingProductId={editingProductId} 
                    setIsSidebarOpen={setIsSidebarOpen} 
                    isDarkMode={isDarkMode} 
                    toggleTheme={toggleTheme} 
                    settings={settings} 
                />

                <div className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto">
                    {activeTab === "overview" && <OverviewTab setActiveTab={setActiveTab} />}
                    {activeTab === "products" && <ProductsTab setActiveTab={setActiveTab} resetForm={resetForm} startEditing={startEditing} setDeleteConfirmId={setDeleteConfirmId} />}
                    {activeTab === "editor" && <EditorTab editingProductId={editingProductId} resetForm={resetForm} setActiveTab={setActiveTab} formData={formData} setFormData={setFormData} images={images} setImages={setImages} colorInput={colorInput} setColorInput={setColorInput} tempImage={tempImage} setTempImage={setTempImage} crop={crop} setCrop={setCrop} zoom={zoom} setZoom={setZoom} rotation={rotation} setRotation={setRotation} croppedAreaPixels={croppedAreaPixels} setCroppedAreaPixels={setCroppedAreaPixels} handleSubmit={handleSubmit} />}
                    {activeTab === "orders" && <OrdersTab setSuccess={setSuccess} setSuccessMsg={setSuccessMsg} />}
                    {activeTab === "analytics" && <AnalyticsTab />}
                    {activeTab === "settings" && <SettingsTab setSuccess={setSuccess} setSuccessMsg={setSuccessMsg} />}
                </div>
            </main>

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
