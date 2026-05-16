import React, { useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom"; 
import { CartContext } from "../../Context/CartContext";
import { useOrders } from "../../Context/OrderContext";
import { useUser } from "../../Context/UserContext";

const ThankYou = () => {
  const { items, clearCart } = useContext(CartContext);
  const { addOrder } = useOrders();
  const { currentUser } = useUser();
  const orderProcessed = useRef(false);

  useEffect(() => {
    if (items.length > 0 && !orderProcessed.current) {
      orderProcessed.current = true;
      const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
      const discount = subtotal * 0.2;
      const deliveryFee = 15;
      const total = subtotal - discount + deliveryFee;
      
      addOrder({
        customer: currentUser ? currentUser.name : "Guest Customer",
        email: currentUser ? currentUser.email : "guest@shop.co",
        cart: items,
        total: total,
      });
      
      clearCart();
    }
  }, [items, addOrder, clearCart]);

  return (
    <div className="min-h-[70vh] flex flex-col lg:flex-row items-center justify-between container mx-auto px-4 py-12 gap-12 transition-colors duration-500">
      
      <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold mb-6 font-heading dark:text-white leading-[1.1] tracking-tight ">
          THANK YOU FOR <br className="hidden md:block" /> YOUR PURCHASE
        </h1>
        <p className="text-black/60 dark:text-white/60 text-lg mb-8 max-w-[500px]">
          Your order has been placed successfully. We'll send you an email confirmation shortly.
        </p>
        <Link 
          to="/" 
          className="bg-black text-white dark:bg-white dark:text-black px-12 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity transform active:scale-95"
        >
          Go to Shop
        </Link>
      </div>

      <div className="flex-1 flex justify-center items-center">
        <div className="relative group grayscale">
          <img
            src="/assets/confirmation.png"
            alt="Order Confirmed"
            className="w-full max-w-[500px] h-auto object-contain transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
          />
        </div>
      </div>

    </div>
  );
};

export default ThankYou;
