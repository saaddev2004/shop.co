import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isAdminAuthenticated } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // If admin, fetch all orders. If user, fetch my-orders.
        if (isAdminAuthenticated) {
          const { data } = await api.get("/orders");
          if (data.success) setOrders(data.orders);
        } else if (isAuthenticated) {
          const { data } = await api.get("/orders/my-orders");
          if (data.success) setOrders(data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated || isAdminAuthenticated) {
      fetchOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [isAuthenticated, isAdminAuthenticated]);

  const addOrder = async (orderData) => {
    try {
      const { data } = await api.post("/orders", orderData);
      if (data.success) {
        setOrders(prev => [data.order, ...prev]);
        return { success: true, order: data.order };
      }
      return { success: false, message: data.message || "Failed to place order" };
    } catch (error) {
      console.error("Order creation failed:", error);
      return { success: false, message: error.response?.data?.message || "Failed to place order" };
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { data } = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (data.success) {
        setOrders(prev => prev.map(o => (o._id === orderId || o.id === orderId) ? { ...o, status: newStatus } : o));
        return { success: true };
      }
    } catch (error) {
      console.error("Order update failed:", error);
      return { success: false };
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const { data } = await api.delete(`/orders/${orderId}`);
      if (data.success) {
        setOrders(prev => prev.filter(o => o._id !== orderId));
        return { success: true };
      }
    } catch (error) {
      console.error("Order deletion failed:", error);
      return { success: false };
    }
  };

  return (
    <OrderContext.Provider value={{ orders, loading, addOrder, updateOrderStatus, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);
