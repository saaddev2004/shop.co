import React, { useState, useContext } from "react";
import { CartContext } from "../../Context/CartContext";
import { FaCheck, FaPlus, FaMinus } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ProductDetails = ({ productData }) => {
  const { id, name, price, image, description, colors: dynamicColors, allImages, colorStock } = productData;
  
  // Normalize allImages to {url, color} format
  const normalizedImages = (allImages || [image]).map(img => 
    typeof img === 'string' ? { url: img, color: null } : img
  );

  const [selectedColor, setSelectedColor] = useState(dynamicColors?.[0] || "");
  const [activeImage, setActiveImage] = useState(image);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState("details"); // details, shipping, reviews
  const { addToCart } = useContext(CartContext);

  const defaultColors = [
    { name: "Black", hex: "#000000" },
    { name: "Blue", hex: "#1E90FF" },
    { name: "Red", hex: "#8B0000" },
  ];

  const displayColors = dynamicColors && dynamicColors.length > 0 
    ? dynamicColors.map(c => ({ name: c, hex: c }))
    : defaultColors;

  // Available Sizes Mapping
  const sizes = [
    { id: "S", label: "Small" },
    { id: "M", label: "Medium" },
    { id: "L", label: "Large" },
    { id: "XL", label: "X-Large" },
  ];

  const getStock = (sizeId) => {
    if (!colorStock) return 0;
    const colorKey = selectedColor;
    return colorStock[colorKey] ? colorStock[colorKey][sizeId] : 0;
  };

  const increaseQty = () => {
    const maxStock = getStock(selectedSize) || 99;
    setQuantity((q) => (q < maxStock ? q + 1 : q));
  };
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleColorChange = (hex) => {
    setSelectedColor(hex);
    // Find the first image that matches this color to set as active
    const colorImages = normalizedImages.filter(img => img.color === hex);
    if (colorImages.length > 0) {
        setActiveImage(colorImages[0].url);
    }
  };

  // STRICT FILTERING: Only show images of selected color
  const filteredThumbnails = normalizedImages.filter(img => img.color === selectedColor);

  // Fallback: if no images found for selected color, show all (though usually admin will add images)
  const displayThumbnails = filteredThumbnails.length > 0 ? filteredThumbnails : normalizedImages;

  const handleAdd = () => {
    if (!selectedSize) {
        alert("Please select a size first");
        return;
    }
    if (getStock(selectedSize) === 0) {
        alert("Sorry, this size is currently out of stock");
        return;
    }
    addToCart({
      id,
      name,
      price,
      image: activeImage, // Use the currently viewed color image
      selectedColor,
      selectedSize,
      quantity,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 transition-colors duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm md:text-base mb-8">
        <a href="/" className="text-black/60 dark:text-white/60 hover:text-black transition-colors">Home</a>
        <span className="text-black/60 dark:text-white/60">/</span>
        <a href="/shop" className="text-black/60 dark:text-white/60 hover:text-black transition-colors">Shop</a>
        <span className="text-black/60 dark:text-white/60">/</span>
        <span className="font-bold dark:text-white ">{name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="flex flex-col md:flex-row-reverse gap-4">
          <div className="flex-1 aspect-[3/4] rounded-[20px] overflow-hidden bg-[#F0EEED] dark:bg-neutral-800 flex items-center justify-center relative">
            <img 
              src={activeImage} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-500" 
            />
            {productData.isOnSale && (
              <span className="absolute top-6 left-6 bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-lg shadow-red-500/30">
                Sale
              </span>
            )}
          </div>
          {displayThumbnails.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar">
              {displayThumbnails.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(img.url)} className={`w-20 md:w-24 aspect-square rounded-xl overflow-hidden bg-[#F0EEED] dark:bg-neutral-800 border-2 transition-all ${activeImage === img.url ? "border-black dark:border-white" : "border-transparent"}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-4xl font-bold mb-6 font-heading dark:text-white tracking-tight ">{name}</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl md:text-4xl font-semibold dark:text-white">Rs. {price.toLocaleString()}</span>
            {productData.oldPrice && (
              <div className="flex items-center gap-3">
                <span className="text-xl md:text-2xl font-medium text-black/30 dark:text-white/30 line-through">Rs. {productData.oldPrice.toLocaleString()}</span>
                {productData.discount && <span className="bg-[#FF3333]/10 text-[#FF3333] px-3 py-1 rounded-full text-xs md:text-sm font-bold">{productData.discount}</span>}
              </div>
            )}
          </div>
          <p className="text-black/60 dark:text-white/60 text-sm md:text-base leading-relaxed mb-8 border-b border-black/10 dark:border-white/10 pb-8 ">{description}</p>

          {/* Color Selection */}
          <div className="mb-8 pb-8 border-b border-black/10 dark:border-white/10">
            <h3 className="text-base font-medium mb-4 dark:text-white">Select Color</h3>
            <div className="flex flex-wrap gap-3">
              {displayColors.map((color) => (
                <button key={color.name} className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color.hex ? "border-black dark:border-white scale-110" : "border-transparent"}`} style={{ backgroundColor: color.hex.toLowerCase() }} onClick={() => handleColorChange(color.hex)}>
                  {selectedColor === color.hex && <FaCheck className="text-white drop-shadow-md" size={12} />}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection with Stock */}
          <div className="mb-8 pb-8 border-b border-black/10 dark:border-white/10">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium dark:text-white">Choose Size</h3>
                {selectedSize && (
                    <span className={`text-xs font-bold ${getStock(selectedSize) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {getStock(selectedSize) > 0 ? `${getStock(selectedSize)} In Stock` : 'Out of Stock'}
                    </span>
                )}
            </div>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => {
                const stock = getStock(size.id);
                const isOutOfStock = stock === 0;
                return (
                  <button
                    key={size.id}
                    className={`px-6 md:px-8 py-3 rounded-full text-sm md:text-base transition-all font-medium relative ${selectedSize === size.id ? "bg-black text-white dark:bg-white dark:text-black shadow-lg" : "bg-[#F0F0F0] text-black/60 dark:bg-neutral-800 dark:text-white/60 hover:bg-black/10"} ${isOutOfStock ? "opacity-40 grayscale" : "cursor-pointer"}`}
                    onClick={() => { setSelectedSize(size.id); setQuantity(1); }}
                  >
                    {size.label}
                    {isOutOfStock && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="w-full h-[1px] bg-black/40 rotate-12" /></div>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex gap-4 mb-12">
            <div className="flex items-center bg-[#F0F0F0] dark:bg-neutral-800 rounded-full px-4 md:px-6 py-3 md:py-4 gap-6 md:gap-8">
              <button onClick={decreaseQty} className="text-xl dark:text-white"><FaMinus /></button>
              <span className="font-bold text-lg md:text-xl dark:text-white min-w-[20px] text-center">{quantity}</span>
              <button onClick={increaseQty} className="text-xl dark:text-white"><FaPlus /></button>
            </div>
            <button onClick={handleAdd} className="flex-1 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold text-base md:text-lg hover:opacity-90 transition-opacity active:scale-[0.98]">Add to Cart</button>
          </div>

          {/* Premium Accordion Section */}
          <div className="space-y-4">
            {/* Details Accordion */}
            <div className="border-b border-black/5 dark:border-white/5 overflow-hidden">
              <button 
                onClick={() => setOpenAccordion(openAccordion === 'details' ? '' : 'details')}
                className="w-full flex items-center justify-between py-5 text-left transition-colors hover:text-black/60 dark:hover:text-white/60"
              >
                <span className="font-bold text-sm uppercase tracking-widest dark:text-white">Product Details</span>
                <motion.div animate={{ rotate: openAccordion === 'details' ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <FiChevronDown className="dark:text-white" size={18} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openAccordion === 'details' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="pb-6"
                  >
                    <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">
                      Crafted with premium materials, this {productData.category} offers a perfect blend of comfort and style. 
                      Designed for a modern fit, it features reinforced stitching and a lightweight feel. Follow the care instructions on the label to maintain optimal quality.
                    </p>
                    <ul className="list-disc list-inside mt-4 text-sm text-black/60 dark:text-white/60 space-y-1">
                      <li>Material: 100% Premium Cotton Blend</li>
                      <li>Fit: Tailored / True to Size</li>
                      <li>Care: Machine wash cold, tumble dry low</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shipping Accordion */}
            <div className="border-b border-black/5 dark:border-white/5 overflow-hidden">
              <button 
                onClick={() => setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')}
                className="w-full flex items-center justify-between py-5 text-left transition-colors hover:text-black/60 dark:hover:text-white/60"
              >
                <span className="font-bold text-sm uppercase tracking-widest dark:text-white">Shipping & Returns</span>
                <motion.div animate={{ rotate: openAccordion === 'shipping' ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <FiChevronDown className="dark:text-white" size={18} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openAccordion === 'shipping' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="pb-6"
                  >
                    <p className="text-sm text-black/60 dark:text-white/60 leading-relaxed">
                      We offer free standard shipping on all orders over Rs. 5000. Express delivery is available for an additional fee. 
                      If you're not completely satisfied with your purchase, you can return it within 30 days of receipt in its original, unworn condition.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Reviews Accordion */}
            <div className="border-b border-black/5 dark:border-white/5 overflow-hidden">
              <button 
                onClick={() => setOpenAccordion(openAccordion === 'reviews' ? '' : 'reviews')}
                className="w-full flex items-center justify-between py-5 text-left transition-colors hover:text-black/60 dark:hover:text-white/60"
              >
                <span className="font-bold text-sm uppercase tracking-widest dark:text-white">Customer Reviews</span>
                <motion.div animate={{ rotate: openAccordion === 'reviews' ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <FiChevronDown className="dark:text-white" size={18} />
                </motion.div>
              </button>
              <AnimatePresence>
                {openAccordion === 'reviews' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="pb-6"
                  >
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-400">★★★★★</span>
                          <span className="text-xs font-bold dark:text-white">Sarah M.</span>
                        </div>
                        <p className="text-sm text-black/60 dark:text-white/60">"Absolutely love the quality and fit. Will definitely be ordering more colors soon!"</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-yellow-400">★★★★☆</span>
                          <span className="text-xs font-bold dark:text-white">John D.</span>
                        </div>
                        <p className="text-sm text-black/60 dark:text-white/60">"Great piece, fits perfectly. Delivery was faster than expected."</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
