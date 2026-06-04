import React, { createContext, useState, useContext, useEffect } from "react";
import { productsData as initialProducts } from "../data/products";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("shop_products");
    return savedProducts ? JSON.parse(savedProducts) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem("shop_products", JSON.stringify(products));
  }, [products]);

  const addProduct = (newProduct) => {
    const id = Date.now();
    const productWithId = {
      ...newProduct,
      id: id,
      rating: 4.5,
      link: `/product/${id}`,
      colorStock: newProduct.colorStock || {},
      isOnSale: newProduct.isOnSale || false
    };
    setProducts((prev) => [productWithId, ...prev]);
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter(p => p.id !== id));
  };

  const updateProduct = (id, updatedData) => {
    setProducts((prev) => prev.map(p => {
        if (p.id === id) {
            const price = parseFloat(updatedData.price);
            const oldPrice = updatedData.oldPrice ? parseFloat(updatedData.oldPrice) : null;
            const discount = (oldPrice && oldPrice > price)
                ? `-${Math.round((1 - price / oldPrice) * 100)}%` 
                : null;
            
            return { 
                ...p, 
                ...updatedData, 
                id, // Ensure ID remains same
                price, 
                oldPrice, 
                discount,
                link: `/product/${id}`
            };
        }
        return p;
    }));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct, updateProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
