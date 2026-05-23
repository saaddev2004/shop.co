import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import { useOrders } from "../../Context/OrderContext";
import { useProducts } from "../../Context/ProductContext";
import { FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";

import UserProfileSidebar from "./components/UserProfileSidebar";
import OrdersHistoryTab from "./components/OrdersHistoryTab";
import AccountDetailsTab from "./components/AccountDetailsTab";

const UserProfile = () => {
  const { currentUser, logout } = useUser();
  const { orders } = useOrders();
  const { products } = useProducts();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders"); // orders, details, preferences

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  // Filter orders for the logged-in user
  const userOrders = orders.filter(o => o.email === currentUser.email);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] dark:bg-black py-16 px-4 font-body transition-colors duration-500">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight dark:text-white">
              My Account
            </h1>
            <p className="text-black/50 dark:text-white/50 font-medium mt-2">
              Welcome back, {currentUser.name.split(" ")[0]}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-5 py-3 rounded-full font-bold transition-all text-sm"
          >
            <FiLogOut /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <UserProfileSidebar 
            currentUser={currentUser} 
            userOrders={userOrders} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />

          {/* Main Content: Dynamic Tabs */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white dark:bg-neutral-900 p-8 md:p-10 rounded-[35px] border border-black/[0.04] dark:border-white/[0.04] shadow-sm h-full"
            >
              {activeTab === "orders" && <OrdersHistoryTab userOrders={userOrders} products={products} />}
              {activeTab === "details" && <AccountDetailsTab currentUser={currentUser} />}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
