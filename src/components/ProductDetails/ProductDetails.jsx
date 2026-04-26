import React, { useState, useContext } from "react";
import { CartContext } from "../../Context/CartContext";
import { FaStar, FaCheck, FaPlus, FaMinus } from "react-icons/fa";

const ProductDetails = ({ productData }) => {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  const { id, name, price, image, rating = 4.5 } = productData;

  const colors = [
    { name: "Brown", hex: "#8B4513" },
    { name: "Black", hex: "#000000" },
    { name: "Green", hex: "#006400" },
    { name: "Red", hex: "#8B0000" },
    { name: "Gold", hex: "#FFD700" },
    { name: "Orange", hex: "#FF4500" },
    { name: "Cyan", hex: "#00CED1" },
    { name: "Blue", hex: "#1E90FF" },
  ];

  const sizes = ["Small", "Medium", "Large", "X-Large"];

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAdd = () => {
    addToCart({
      id,
      name,
      price,
      image,
      selectedColor,
      selectedSize,
      quantity,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 transition-colors duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm md:text-base mb-8">
        <a href="/" className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">Home</a>
        <span className="text-black/60 dark:text-white/60">/</span>
        <a href="/#New-Arrivals" className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">Shop</a>
        <span className="text-black/60 dark:text-white/60">/</span>
        <span className="font-bold dark:text-white ">{name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square rounded-[20px] overflow-hidden bg-[#F0EEED] dark:bg-neutral-800 flex items-center justify-center p-8">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-4xl font-extrabold mb-4 font-heading dark:text-white tracking-tight ">
            {name}
          </h1>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="flex text-yellow-400 gap-0.5">
              {[...Array(Math.floor(rating))].map((_, i) => <FaStar key={i} />)}
              {rating % 1 !== 0 && <FaStar className="opacity-50" />}
            </div>
            <span className="text-sm md:text-base dark:text-gray-400">{rating}/<span className="text-gray-400">5</span></span>
          </div>

          <div className="text-3xl font-bold mb-6 dark:text-white">${price}</div>
          
          <p className="text-black/60 dark:text-white/60 text-sm md:text-base leading-relaxed mb-8 border-b border-black/10 dark:border-white/10 pb-8 ">
            {name} meticulously crafted with premium quality materials and a modern aesthetic.
          </p>

          {/* Color Selection */}
          <div className="mb-8 pb-8 border-b border-black/10 dark:border-white/10">
            <h3 className="text-base font-medium mb-4 dark:text-white">Select Colors</h3>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color.name}
                  className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color.hex ? "border-black dark:border-white scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(color.hex)}
                  title={color.name}
                >
                  {selectedColor === color.hex && <FaCheck className={color.hex === '#FFFFFF' ? 'text-black' : 'text-white'} size={12} />}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-8 pb-8 border-b border-black/10 dark:border-white/10">
            <h3 className="text-base font-medium mb-4 dark:text-white">Choose Size</h3>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`px-6 md:px-8 py-3 rounded-full text-sm md:text-base transition-all font-medium ${selectedSize === size ? "bg-black text-white dark:bg-white dark:text-black shadow-lg" : "bg-[#F0F0F0] text-black/60 dark:bg-neutral-800 dark:text-white/60 hover:bg-black/10 dark:hover:bg-white/10"}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex gap-4">
            <div className="flex items-center bg-[#F0F0F0] dark:bg-neutral-800 rounded-full px-4 md:px-6 py-3 md:py-4 gap-6 md:gap-8">
              <button onClick={decreaseQty} className="text-xl dark:text-white hover:scale-110 transition-transform"><FaMinus /></button>
              <span className="font-bold text-lg md:text-xl dark:text-white min-w-[20px] text-center">{quantity}</span>
              <button onClick={increaseQty} className="text-xl dark:text-white hover:scale-110 transition-transform"><FaPlus /></button>
            </div>
            
            <button
              onClick={handleAdd}
              className="flex-1 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold text-base md:text-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
