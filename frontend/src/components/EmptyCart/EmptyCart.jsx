import React from "react";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="container mx-auto px-4 py-20 min-h-[70vh] flex flex-col lg:flex-row items-center justify-center gap-12 transition-colors duration-500">
      
      <div className="flex-1 max-w-[500px] animate-in slide-in-from-bottom duration-700">
        <img
          src="/assets/cart.png"
          alt="Empty Cart"
          className="w-full h-auto object-contain grayscale opacity-50 dark:opacity-30"
        />
      </div>

      <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold mb-6 font-heading dark:text-white leading-tight  tracking-tight">
          YOUR CART IS <br /> EMPTY
        </h1>
        <p className="text-black/60 dark:text-white/60 text-lg md:text-xl mb-10 max-w-[400px]">
          Must add items on the cart before you proceed to checkout. Browse our latest collections to find something you love.
        </p>
        <Link 
          to="/#New-Arrivals" 
          className="bg-black text-white dark:bg-white dark:text-black px-12 py-4 rounded-full font-bold text-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all transform active:scale-95 shadow-xl"
        >
          Go to Shop
        </Link>
      </div>

    </div>
  );
};

export default EmptyCart;
