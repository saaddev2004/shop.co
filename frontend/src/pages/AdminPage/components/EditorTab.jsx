import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiPlus, FiX, FiUpload, FiSave, FiArrowRight, FiMinus, FiMaximize } from "react-icons/fi";
import Cropper from "react-easy-crop";
import { categories } from "../../../data/products";
import { getCroppedImg } from "../../../utils/cropImage";

const EditorTab = ({
    editingProductId,
    resetForm,
    setActiveTab,
    formData,
    setFormData,
    images,
    setImages,
    colorInput,
    setColorInput,
    tempImage,
    setTempImage,
    crop,
    setCrop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    croppedAreaPixels,
    setCroppedAreaPixels,
    handleSubmit
}) => {
    const fileInputRef = useRef(null);

    const onCropComplete = (_area, areaPixels) => {
        setCroppedAreaPixels(areaPixels);
    };

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

    return (
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
                                        <span className="text-lg font-bold">%</span>
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
        </motion.div>
    );
};

export default EditorTab;
