import React, { useContext } from "react";
import { CartContext } from "../../Context/CartContext";
import { FaTrash, FaPlus, FaMinus, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";   
import { useProducts } from "../../Context/ProductContext";

const FilledCart = () => {
  const { items, removeFromCart, updateQty } = useContext(CartContext);
  const { products } = useProducts();

  const getItemImage = (item) => {
    const product = products.find(p => p.id === item.id);
    if (!product) return "";
    
    if (product.allImages && item.selectedColor) {
        const colorImg = product.allImages.find(img => 
            typeof img === 'object' ? img.color === item.selectedColor : false
        );
        if (colorImg) return colorImg.url;
    }
    return product.image || "";
  };

  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const discount = items.length > 0 ? subtotal * 0.2 : 0; // 20% discount as suggested in promo
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 transition-colors duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm mb-8">
        <Link to="/" className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors">Home</Link> 
        <span className="text-black/60 dark:text-white/60">/</span> 
        <span className="font-bold dark:text-white">Cart</span>
      </nav>

      <h1 className="text-2xl md:text-4xl font-extrabold mb-8 font-heading dark:text-white tracking-tight ">
        YOUR CART
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart Items */}
        <div className="lg:col-span-7">
          <div className="border border-black/10 dark:border-white/10 rounded-[20px] p-4 md:p-6 bg-white dark:bg-neutral-900 overflow-hidden">
            {items.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center gap-4">
                 <p className="text-black/60 dark:text-white/60 text-lg">Your cart is empty.</p>
                 <Link to="/#New-Arrivals" className="bg-black text-white dark:bg-white dark:text-black px-8 py-3 rounded-full font-bold">Start Shopping</Link>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-4 py-6 ${index !== items.length - 1 ? 'border-b border-black/10 dark:border-white/10' : ''}`}
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-[#F0EEED] dark:bg-neutral-800 rounded-[15px] flex-shrink-0 flex items-center justify-center p-2">
                    <img
                      src={getItemImage(item)}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between h-24 md:h-32">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base md:text-xl font-bold dark:text-white line-clamp-1">{item.name}</h3>
                        <p className="text-sm dark:text-gray-400">
                          <span className="text-black font-medium dark:text-white">Size:</span> {item.selectedSize || "L"} 
                          <span className="mx-2">|</span> 
                          <span className="text-black font-medium dark:text-white">Color:</span> {item.selectedColor || "Black"}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-red-500 hover:scale-110 transition-transform p-2"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>

                    <div className="flex justify-between items-end">
                      <span className="text-xl md:text-2xl font-bold dark:text-white">Rs. {item.price}</span>
                      <div className="flex items-center bg-[#F0F0F0] dark:bg-neutral-800 rounded-full px-3 md:px-4 py-2 gap-4 md:gap-6">
                        <button 
                          onClick={() => updateQty(index, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="hover:scale-110 transition-transform disabled:opacity-30 dark:text-white"
                        >
                          <FaMinus size={14} />
                        </button>
                        <span className="font-bold dark:text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQty(index, item.quantity + 1)}
                          className="hover:scale-110 transition-transform dark:text-white"
                        >
                          <FaPlus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="border border-black/10 dark:border-white/10 rounded-[20px] p-6 lg:p-8 bg-white dark:bg-neutral-900 flex flex-col gap-6">
            <h2 className="text-xl md:text-2xl font-bold dark:text-white">Order Summary</h2>
            
            <div className="flex flex-col gap-4 border-b border-black/10 dark:border-white/10 pb-6">
              <div className="flex justify-between text-black/60 dark:text-white/60 text-lg">
                <span>Subtotal</span>
                <span className="font-bold text-black dark:text-white">Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between text-black/60 dark:text-white/60 text-lg">
                <span>Discount (20%)</span>
                <span className="font-bold text-red-500">-Rs. {discount}</span>
              </div>
              <div className="flex justify-between text-black/60 dark:text-white/60 text-lg">
                <span>Delivery Fee</span>
                <span className="font-bold text-black dark:text-white">Rs. {deliveryFee}</span>
              </div>
            </div>

            <div className="flex justify-between text-xl md:text-2xl font-bold">
              <span className="dark:text-white">Total</span>
              <span className="dark:text-white">Rs. {total}</span>
            </div>

            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Add promo code" 
                className="flex-grow bg-[#F0F0F0] dark:bg-neutral-800 rounded-full px-6 py-4 outline-none text-sm md:text-base dark:text-white border border-transparent focus:border-black/20"
              />
              <button className="bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-full font-bold hover:opacity-90 transition-opacity">
                Apply
              </button>
            </div>

            <Link 
              to="/checkout" 
              className="w-full bg-black text-white dark:bg-white dark:text-black py-4 rounded-full font-bold text-center flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
            >
              Go to Checkout <FaChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilledCart;
