import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingBag, FiX, FiCheck } from "react-icons/fi";
import { useOrders } from "../../../Context/OrderContext";
import { useSettings } from "../../../Context/SettingsContext";

const OrdersTab = ({ setSuccess, setSuccessMsg }) => {
    const { orders, updateOrderStatus } = useOrders();
    const { settings } = useSettings();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const handleUpdateOrderStatus = (orderId, newStatus) => {
        updateOrderStatus(orderId, newStatus);
        if (selectedOrder && selectedOrder.id === orderId) {
            setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        }
        setSuccessMsg(`Order ${orderId} marked as ${newStatus}`);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white dark:bg-neutral-900 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-black/[0.04] dark:border-white/[0.04] shadow-sm">
                <h3 className="text-lg font-bold mb-6 dark:text-white">Store Sales Reconciliation</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-black/[0.03] dark:border-white/[0.03] bg-gray-50/50 dark:bg-neutral-800/10">
                                <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Order UID</th>
                                <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Customer Details</th>
                                <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Date</th>
                                <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Reconciled Value</th>
                                <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Payment</th>
                                <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40">Execution Status</th>
                                <th className="py-5 px-6 text-[10px] font-bold uppercase tracking-wider text-black/40 dark:text-white/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/[0.03] dark:divide-white/[0.03]">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center text-black/30 dark:text-white/30 font-bold">
                                        <FiShoppingBag className="mx-auto mb-4 text-black/10 dark:text-white/10" size={40} />
                                        No orders have been placed in the system yet.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/30 dark:hover:bg-neutral-800/10 transition-colors">
                                        <td className="py-5 px-6 text-sm font-bold dark:text-white">{order.id}</td>
                                        <td className="py-5 px-6">
                                            <div>
                                                <p className="text-sm font-bold dark:text-white">{order.customer || order.firstName + ' ' + order.lastName}</p>
                                                <p className="text-[10px] text-black/40 dark:text-white/40 mt-0.5">{order.email}</p>
                                                {order.phone && (
                                                    <p className="text-[10px] text-black/50 dark:text-white/50 mt-0.5 font-medium">{order.phone}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-xs text-black/55 dark:text-white/55 font-semibold">{order.date}</td>
                                        <td className="py-5 px-6 text-sm font-black dark:text-white">{settings.currency.split(' ')[0]} {order.total?.toLocaleString() || "0"}</td>
                                        <td className="py-5 px-6">
                                            <span className={`inline-block text-[9px] font-bold px-2.5 py-1 rounded-lg ${order.paymentMethod === 'Card' ? 'bg-indigo-55 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400' : 'bg-emerald-55 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'}`}>
                                                {order.paymentMethod || "COD"}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6">
                                            <span className={`badge ${order.status === 'Delivered' ? 'badge-success' :
                                                    order.status === 'Pending' ? 'badge-warning' :
                                                        order.status === 'Cancelled' ? 'badge-danger' :
                                                            'badge-neutral'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleOrderClick(order)}
                                                    className="px-4 py-2 bg-gray-50 hover:bg-black hover:text-white dark:bg-neutral-800 dark:hover:bg-white dark:hover:text-black text-black/60 dark:text-white/60 text-[10px] font-black rounded-lg transition-all"
                                                >
                                                    Details
                                                </button>
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                    className="bg-gray-50 dark:bg-neutral-800 text-[10px] font-bold py-2 px-3 rounded-lg border-none outline-none dark:text-white cursor-pointer"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL: ORDER DETAILS */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-neutral-900 p-10 rounded-[35px] max-w-lg w-full border border-black/5 space-y-6">
                            <div className="flex justify-between items-center border-b border-black/[0.05] dark:border-white/[0.05] pb-4">
                                <h3 className="text-lg font-bold dark:text-white">Transaction Metadata</h3>
                                <button onClick={() => setSelectedOrder(null)} className="text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"><FiX size={20} /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Order Identifier</p>
                                        <p className="text-sm font-bold dark:text-white mt-1">{selectedOrder.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Transaction Date</p>
                                        <p className="text-sm font-bold dark:text-white mt-1">{selectedOrder.date}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Customer Details</p>
                                        <p className="text-sm font-bold dark:text-white mt-1">{selectedOrder.customer || selectedOrder.firstName + ' ' + selectedOrder.lastName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Email Coordinates</p>
                                        <p className="text-sm font-bold dark:text-white mt-1">{selectedOrder.email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Phone Number</p>
                                        <p className="text-sm font-bold dark:text-white mt-1">{selectedOrder.phone || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Payment Method</p>
                                        <p className="text-sm font-bold dark:text-white mt-1">{selectedOrder.paymentMethod || "COD"}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Shipping Address</p>
                                    <p className="text-sm font-bold dark:text-white mt-1">{selectedOrder.address || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">Purchased Items Payload</p>
                                    <div className="mt-1 bg-gray-50 dark:bg-neutral-800 p-4 rounded-xl space-y-2">
                                        {selectedOrder.cart ? (
                                            selectedOrder.cart.map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-xs font-medium dark:text-white">
                                                    <span>{item.quantity}x {item.name} ({item.selectedColor}, {item.selectedSize})</span>
                                                    <span>Rs. {item.price * item.quantity}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-xs font-medium dark:text-white">{selectedOrder.items || "Legacy Order Formatting"}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-4 rounded-xl">
                                    <span className="text-xs font-bold dark:text-white">Gross Financial Value</span>
                                    <span className="text-base font-black dark:text-white">Rs. {selectedOrder.total?.toLocaleString() || "0"}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-black/[0.05] dark:border-white/[0.05]">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-black/40">Status Toggle</span>
                                    <span className={`badge block w-fit ${selectedOrder.status === 'Delivered' ? 'badge-success' :
                                            selectedOrder.status === 'Pending' ? 'badge-warning' :
                                                selectedOrder.status === 'Cancelled' ? 'badge-danger' :
                                                    'badge-neutral'
                                        }`}>{selectedOrder.status}</span>
                                </div>
                                <div className="flex gap-2">
                                    {selectedOrder.status !== 'Delivered' && selectedOrder.status !== 'Cancelled' && (
                                        <button
                                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Delivered")}
                                            className="px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-green-500/10"
                                        >
                                            <FiCheck size={14} /> Deliver
                                        </button>
                                    )}
                                    {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Delivered' && (
                                        <button
                                            onClick={() => handleUpdateOrderStatus(selectedOrder.id, "Cancelled")}
                                            className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-red-500/10"
                                        >
                                            <FiX size={14} /> Cancel
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="px-4 py-2.5 bg-gray-100 dark:bg-neutral-800 text-black dark:text-white font-bold text-xs rounded-xl"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default OrdersTab;
