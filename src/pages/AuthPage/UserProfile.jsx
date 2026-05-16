import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import { useOrders } from "../../Context/OrderContext";
import { useProducts } from "../../Context/ProductContext";
import { FiLogOut, FiShoppingBag, FiUser, FiPackage, FiSettings } from "react-icons/fi";
import { motion } from "framer-motion";

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
          
          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
              className="bg-white dark:bg-neutral-900 p-8 rounded-[35px] border border-black/[0.04] dark:border-white/[0.04] shadow-sm"
            >
              <div className="w-20 h-20 bg-black dark:bg-white text-white dark:text-black rounded-3xl flex items-center justify-center text-3xl font-black mb-6">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-bold dark:text-white">{currentUser.name}</h3>
              <p className="text-sm text-black/50 dark:text-white/50 mb-6">{currentUser.email}</p>
              
              <div className="pt-6 border-t border-black/[0.04] dark:border-white/[0.04] space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/50 dark:text-white/50 font-medium">Member Since</span>
                  <span className="font-bold dark:text-white">{currentUser.joinDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-black/50 dark:text-white/50 font-medium">Total Orders</span>
                  <span className="font-bold dark:text-white">{userOrders.length}</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white dark:bg-neutral-900 p-8 rounded-[35px] border border-black/[0.04] dark:border-white/[0.04] shadow-sm"
            >
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === "orders" ? "bg-black dark:bg-white text-white dark:text-black shadow-md" : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5"}`}
                >
                  <div className="flex items-center gap-3"><FiShoppingBag /> Order History</div>
                </button>
                <button 
                  onClick={() => setActiveTab("details")}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all ${activeTab === "details" ? "bg-black dark:bg-white text-white dark:text-black shadow-md" : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-white/5"}`}
                >
                  <div className="flex items-center gap-3"><FiUser /> Account Details</div>
                </button>
              </nav>
            </motion.div>
          </div>

          {/* Main Content: Dynamic Tabs */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white dark:bg-neutral-900 p-8 md:p-10 rounded-[35px] border border-black/[0.04] dark:border-white/[0.04] shadow-sm h-full"
            >
              {activeTab === "orders" && (
                <>
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/[0.04] dark:border-white/[0.04]">
                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-3">
                      <FiPackage /> Recent Orders
                    </h3>
                  </div>

                  {userOrders.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                      <div className="w-24 h-24 bg-gray-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                        <FiShoppingBag className="text-black/20 dark:text-white/20 text-4xl" />
                      </div>
                      <h4 className="text-lg font-bold dark:text-white mb-2">No orders found</h4>
                      <p className="text-black/50 dark:text-white/50 text-sm max-w-[250px] mb-8">
                        You haven't placed any orders yet. Discover our latest collections.
                      </p>
                      <button 
                        onClick={() => navigate("/shop")}
                        className="bg-black dark:bg-white text-white dark:text-black px-8 py-3.5 rounded-full font-bold hover:scale-105 transition-transform shadow-xl"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {userOrders.map((order) => (
                        <div key={order.id} className="border border-black/[0.05] dark:border-white/[0.05] rounded-[24px] p-6 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                            <div>
                              <p className="text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider mb-1">Order ID: {order.id}</p>
                              <p className="text-sm font-medium dark:text-white">{order.date}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                                  order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                  order.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                  order.status === 'Cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              }`}>
                                  {order.status}
                              </span>
                              <span className="font-black text-lg dark:text-white">Rs. {order.total?.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="space-y-3 bg-gray-50/50 dark:bg-neutral-800/30 rounded-2xl p-4">
                            {order.cart?.map((item, idx) => {
                              const productDetails = products.find(p => p.id === item.id);
                              const fallbackImage = "https://via.placeholder.com/150?text=No+Image";
                              const displayImage = productDetails?.image || item.image || fallbackImage;

                              return (
                                <div key={idx} className="flex justify-between items-center text-sm">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white dark:bg-neutral-900 rounded-lg overflow-hidden border border-black/5">
                                      <img src={displayImage} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = fallbackImage }} />
                                    </div>
                                    <span className="font-bold dark:text-white">
                                      {item.quantity}x {item.name}
                                    </span>
                                  </div>
                                  <span className="text-black/50 dark:text-white/50 font-medium">
                                    {item.selectedColor}, {item.selectedSize}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {activeTab === "details" && (
                <div className="animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/[0.04] dark:border-white/[0.04]">
                    <h3 className="text-xl font-bold dark:text-white flex items-center gap-3">
                      <FiUser /> Account Details
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-black/60 dark:text-white/60 mb-2">Full Name</label>
                      <input type="text" readOnly value={currentUser.name} className="w-full bg-gray-50 dark:bg-neutral-800 border border-transparent rounded-2xl px-6 py-4 outline-none font-medium dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black/60 dark:text-white/60 mb-2">Email Address</label>
                      <input type="email" readOnly value={currentUser.email} className="w-full bg-gray-50 dark:bg-neutral-800 border border-transparent rounded-2xl px-6 py-4 outline-none font-medium dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black/60 dark:text-white/60 mb-2">Member Since</label>
                      <input type="text" readOnly value={currentUser.joinDate} className="w-full bg-gray-50 dark:bg-neutral-800 border border-transparent rounded-2xl px-6 py-4 outline-none font-medium dark:text-white" />
                    </div>
                    <button className="bg-black text-white dark:bg-white dark:text-black px-8 py-4 rounded-full font-bold hover:scale-[1.02] transition-transform">
                      Update Details
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;
