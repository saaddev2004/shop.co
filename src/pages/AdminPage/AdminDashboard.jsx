import React, { useState, useCallback, useMemo, useRef } from "react";
import { useProducts } from "../../Context/ProductContext";
import { categories } from "../../data/products";
import { FiUpload, FiPlus, FiX, FiCheckCircle, FiMinus, FiMaximize, FiTrash2, FiShoppingBag, FiAlertTriangle, FiEdit3, FiArrowLeft, FiGrid, FiList, FiPieChart, FiTrendingUp, FiSave, FiArrowRight, FiBox, FiPercent } from "react-icons/fi";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../../utils/cropImage";
import { motion, AnimatePresence } from "framer-motion";

const AdminDashboard = () => {
  const { products, addProduct, deleteProduct, updateProduct } = useProducts();
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("add"); 
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const fileInputRef = useRef(null);
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

  const stats = useMemo(() => [
    { label: "Total Products", value: products.length, icon: FiGrid },
    { label: "Inventory SKUs", value: products.reduce((acc, p) => {
        const stock = p.colorStock || {};
        return acc + Object.values(stock).reduce((sAcc, sizes) => sAcc + Object.values(sizes).reduce((a, b) => a + b, 0), 0);
    }, 0), icon: FiBox },
    { label: "On Sale", value: products.filter(p => p.isOnSale).length, icon: FiPercent },
  ], [products]);

  // Cropper State
  const [tempImage, setTempImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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
    // Always clear the value so the same file can be picked again
    e.target.value = null;
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels, rotation);
      // Ask for color after crop - using a temporary state to show a small color picker
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
        allImages: images, // now an array of {url, color}
    };

    if (editingProductId) {
        updateProduct(editingProductId, productPayload);
    } else {
        addProduct(productPayload);
    }

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      resetForm();
      setActiveTab("manage");
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
    
    // Migration for old data
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
    setActiveTab("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-black transition-colors duration-500 pb-20">
      <div className="container mx-auto px-4 pt-12 max-w-6xl">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter font-heading dark:text-white">
                    {editingProductId ? "Product Editor" : "Control Panel"}
                </h1>
                <p className="text-black/40 dark:text-white/40 font-medium ml-1">Store Management & Promotional Suite</p>
            </div>
            
            <div className="flex bg-white dark:bg-neutral-900 p-1.5 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 w-full md:w-auto">
                <button 
                    onClick={() => { resetForm(); setActiveTab("add"); }} 
                    className={`flex-1 md:px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${activeTab === 'add' && !editingProductId ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'text-black/40 dark:text-white/40 hover:text-black hover:bg-black/5'}`}
                >
                    <FiPlus /> New Product
                </button>
                <button 
                    onClick={() => setActiveTab("manage")} 
                    className={`flex-1 md:px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm ${activeTab === 'manage' ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg' : 'text-black/40 dark:text-white/40 hover:text-black hover:bg-black/5'}`}
                >
                    <FiList /> Manage Store
                </button>
            </div>
        </div>

        {activeTab === "manage" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-neutral-900 p-6 rounded-[30px] border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-black dark:text-white"><stat.icon size={24} /></div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30 mb-1">{stat.label}</p>
                            <h4 className="text-2xl font-extrabold dark:text-white">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </motion.div>
        )}

        {activeTab === "add" ? (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                {editingProductId && (
                    <button onClick={() => { resetForm(); setActiveTab("manage"); }} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40 bg-black/5 px-4 py-2 rounded-full w-fit transition-all"><FiArrowLeft /> Back to Management</button>
                )}
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-white dark:bg-neutral-900 p-8 md:p-10 rounded-[40px] border border-black/5 dark:border-white/5 shadow-sm">
                            <h2 className="text-xl font-bold mb-8 dark:text-white flex items-center gap-3"><span className="w-2 h-8 bg-black dark:bg-white rounded-full" /> Product Identity</h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30 ml-1">Product Title</label>
                                    <input type="text" required placeholder="e.g. Premium Oversized Tee" className="w-full bg-gray-50 dark:bg-neutral-800 rounded-2xl px-6 py-4 outline-none border-2 border-transparent focus:border-black/5 dark:text-white font-medium" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30 ml-1">Classification</label>
                                        <select className="w-full bg-gray-50 dark:bg-neutral-800 rounded-2xl px-6 py-4 outline-none dark:text-white font-medium appearance-none" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                            {categories.filter(c => c !== "All").map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30 ml-1">Price (Rs.)</label>
                                        <input type="number" required placeholder="0.00" className="w-full bg-gray-50 dark:bg-neutral-800 rounded-2xl px-6 py-4 outline-none dark:text-white font-bold" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30 ml-1">Old Price (Rs.) - Optional</label>
                                    <input type="number" placeholder="Higher price for discount display" className="w-full bg-gray-50 dark:bg-neutral-800 rounded-2xl px-6 py-4 outline-none border-2 border-transparent focus:border-black/5 dark:text-white font-medium" value={formData.oldPrice} onChange={(e) => setFormData({...formData, oldPrice: e.target.value})} />
                                </div>

                                {/* SALE TOGGLE */}
                                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-[30px] border border-red-100 dark:border-red-900/20 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white"><FiPercent size={20} /></div>
                                        <div>
                                            <h4 className="font-bold dark:text-white">End of Season Sale</h4>
                                            <p className="text-xs text-black/40 dark:text-white/40">Include in "Upto 50% Sale" page</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" checked={formData.isOnSale} onChange={(e) => setFormData({...formData, isOnSale: e.target.checked})} />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                    </label>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30 ml-1">Product Narrative</label>
                                    <textarea rows="3" required placeholder="Describe the soul of this product..." className="w-full bg-gray-50 dark:bg-neutral-800 rounded-3xl px-6 py-4 outline-none dark:text-white font-medium resize-none leading-relaxed" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-neutral-900 p-8 md:p-10 rounded-[40px] border border-black/5 dark:border-white/5 shadow-sm">
                            <h2 className="text-xl font-bold mb-8 dark:text-white flex items-center gap-3"><span className="w-2 h-8 bg-black dark:bg-white rounded-full" /> Inventory Matrix</h2>
                            
                            {formData.colors.length === 0 ? (
                                <p className="text-center py-10 text-black/40 dark:text-white/40 font-medium">Please add colors first to manage their stock levels.</p>
                            ) : (
                                <div className="space-y-10">
                                    {formData.colors.map(color => (
                                        <div key={color} className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: color }} />
                                                <h4 className="text-sm font-bold dark:text-white uppercase tracking-widest">{color} Stock</h4>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                                {['S', 'M', 'L', 'XL'].map((size) => (
                                                    <div key={size} className="space-y-2">
                                                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 ml-1">Size {size}</label>
                                                        <input 
                                                            type="number" 
                                                            min="0" 
                                                            placeholder="0"
                                                            className="w-full bg-gray-50 dark:bg-neutral-800 rounded-2xl px-5 py-3.5 outline-none dark:text-white font-bold text-center border-2 border-transparent focus:border-black/5" 
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

                        <div className="bg-white dark:bg-neutral-900 p-8 md:p-10 rounded-[40px] border border-black/5 dark:border-white/5 shadow-sm">
                            <h2 className="text-xl font-bold mb-8 dark:text-white flex items-center gap-3"><span className="w-2 h-8 bg-black dark:bg-white rounded-full" /> Aesthetic Palette</h2>
                            <div className="flex gap-4 mb-8">
                                <input type="color" className="w-24 h-16 rounded-2xl cursor-pointer bg-gray-50 dark:bg-neutral-800 border-none p-1.5" value={colorInput || "#000000"} onChange={(e) => setColorInput(e.target.value)} />
                                <button type="button" onClick={addColor} className="flex-1 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:scale-[1.02] transition-all flex items-center justify-center gap-2"><FiPlus /> Register Color</button>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                {formData.colors.map(color => (
                                    <span key={color} className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-800 dark:text-white pl-3 pr-5 py-3 rounded-2xl text-xs font-bold border border-black/5">
                                        <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: color }} />
                                        {color.toUpperCase()}
                                        <FiX className="cursor-pointer text-black/20 hover:text-red-500 transition-colors ml-1" onClick={() => removeColor(color)} />
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5 space-y-8 sticky top-28">
                        <div className="bg-white dark:bg-neutral-900 p-8 md:p-10 rounded-[40px] border border-black/5 shadow-sm">
                            <h2 className="text-xl font-bold mb-8 dark:text-white flex items-center gap-3"><span className="w-2 h-8 bg-black dark:bg-white rounded-full" /> Visual Assets</h2>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="group border-2 border-dashed border-black/10 dark:border-white/10 rounded-[30px] p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-black/[0.02] transition-all mb-8 relative"
                            >
                                <FiUpload size={48} className="text-black/10 dark:text-white/10 mb-5 group-hover:-translate-y-1 transition-transform" />
                                <span className="font-bold text-sm dark:text-white text-center">Import High-Res Image</span>
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    multiple
                                    className="hidden" 
                                    onChange={handleImageUpload} 
                                    accept="image/*" 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {images.map((img, idx) => (
                                    <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden group border border-black/5 shadow-sm bg-gray-50">
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                                            <select 
                                                value={img.color || ""} 
                                                onChange={(e) => updateImageColor(idx, e.target.value)}
                                                className="w-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold py-1 rounded-lg outline-none border-none cursor-pointer"
                                            >
                                                <option value="" className="text-black">No Color</option>
                                                {formData.colors.map(c => (
                                                    <option key={c} value={c} className="text-black">{c.toUpperCase()}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-xl"><FiX size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black font-extrabold py-6 rounded-[30px] text-xl shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-4">
                            {editingProductId ? <FiSave /> : <FiArrowRight />}
                            {editingProductId ? "Update Product" : "Launch Product"}
                        </button>
                    </div>
                </form>
            </motion.div>
        ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.length === 0 ? (
                    <div className="col-span-full py-40 text-center bg-white dark:bg-neutral-900 rounded-[50px] border border-dashed border-black/10">
                        <FiShoppingBag size={80} className="mx-auto text-black/[0.03] mb-8" />
                        <h3 className="text-2xl font-bold dark:text-white">No products live</h3>
                        <button onClick={() => setActiveTab("add")} className="mt-8 px-10 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold">Launch First Item</button>
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="bg-white dark:bg-neutral-900 rounded-[45px] border border-black/5 dark:border-white/5 overflow-hidden shadow-sm group transition-all hover:shadow-xl relative">
                            {product.isOnSale && (
                                <div className="absolute top-6 right-6 z-10 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest">Sale 50%</div>
                            )}
                            <div className="aspect-[3/4] relative overflow-hidden">
                                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-5">
                                    <button onClick={() => setDeleteConfirmId(product.id)} className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 shadow-2xl"><FiTrash2 size={24} /></button>
                                    <button onClick={() => startEditing(product)} className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 shadow-2xl"><FiEdit3 size={24} /></button>
                                </div>
                                <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-black shadow-sm">{product.category}</div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-lg font-bold dark:text-white mb-2 line-clamp-1">{product.name}</h3>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-xl font-black dark:text-white">Rs. {product.price}</p>
                                    <div className="flex gap-1.5">
                                        {product.colors?.slice(0, 3).map((c, i) => <div key={i} className="w-3.5 h-3.5 rounded-full border border-black/5" style={{ backgroundColor: c }} />)}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-4">
                                    {Object.entries(product.colorStock || {}).slice(0, 2).map(([color, sizes]) => (
                                        <div key={color} className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: color }} />
                                            <div className="flex gap-2 text-[8px] font-bold dark:text-white/60">
                                                {Object.entries(sizes).map(([s, q]) => (
                                                    <span key={s} className={q === 0 ? 'text-red-500/50' : ''}>{s}:{q}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </motion.div>
        )}

        {/* CROPPER OVERLAY */}
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

        {/* DELETE CONFIRMATION */}
        <AnimatePresence>
          {deleteConfirmId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 p-10 rounded-[40px] max-w-sm w-full text-center border border-black/5">
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

        {/* SUCCESS TOAST */}
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -100 }} className="fixed top-10 left-0 right-0 mx-auto w-fit z-[110] bg-black dark:bg-white text-white dark:text-black px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10">
              <FiCheckCircle className="text-green-400" size={24} />
              <span className="font-extrabold tracking-tight">System Updated Successfully</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
