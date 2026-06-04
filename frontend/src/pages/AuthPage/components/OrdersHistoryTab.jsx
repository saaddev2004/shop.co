import React from 'react';
import { useNavigate } from "react-router-dom";
import { FiPackage, FiShoppingBag } from "react-icons/fi";

const OrdersHistoryTab = ({ userOrders, products }) => {
    const navigate = useNavigate();

    return (
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
    );
};

export default OrdersHistoryTab;
