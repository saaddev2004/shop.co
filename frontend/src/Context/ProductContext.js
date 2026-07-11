import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/api";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products on initial load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        // The backend returns an array directly
        if (Array.isArray(data)) {
          const formattedProducts = data.map(p => ({
            ...p,
            id: p._id, // map _id to id for frontend consistency
            link: `/product/${p._id}`
          }));
          setProducts(formattedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addProduct = async (newProduct) => {
    try {
      const { data } = await api.post("/products", newProduct);
      // The backend returns the created product object directly
      if (data && data._id) {
        const addedProduct = {
          ...data,
          id: data._id,
          link: `/product/${data._id}`
        };
        setProducts((prev) => [addedProduct, ...prev]);
        return { success: true };
      }
      return { success: false, message: "Unexpected response from server" };
    } catch (error) {
      console.error("Add product failed:", error);
      const backendMessage = error.response?.data?.message;
      const backendError = error.response?.data?.error;
      const fullError = backendError ? `${backendMessage}: ${backendError}` : (backendMessage || "Error adding product");
      return { success: false, message: fullError };
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { data } = await api.delete(`/products/${id}`);
      // Backend returns { message: "Product deleted successfully" }
      if (data && data.message) {
        setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Delete product failed:", error);
      return { success: false };
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const { data } = await api.put(`/products/${id}`, updatedData);
      // Backend returns the updated product directly
      if (data && data._id) {
        setProducts((prev) => 
          prev.map((p) => {
            if (p.id === id || p._id === id) {
              return { 
                ...p, 
                ...data, 
                id: data._id, 
                link: `/product/${data._id}` 
              };
            }
            return p;
          })
        );
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      console.error("Update product failed:", error);
      return { success: false };
    }
  };

  return (
    <ProductContext.Provider 
      value={{ 
        products, 
        loading, 
        addProduct, 
        deleteProduct, 
        updateProduct 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
