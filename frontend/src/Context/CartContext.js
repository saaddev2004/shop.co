import React, { createContext, useEffect, useMemo, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart:v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // persist to localStorage
  useEffect(() => {
    localStorage.setItem("cart:v1", JSON.stringify(items));
  }, [items]);

  // total quantity (for badge)
  const totalQty = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items]
  );

  // add or merge (same id + same options)
  const addToCart = (product) => {
    // Strip large image data to save localStorage quota
    const { image, allImages, ...slimProduct } = product;
    
    setItems((prev) => {
      const idx = prev.findIndex(
        (p) =>
          p.id === product.id &&
          p.selectedSize === product.selectedSize &&
          p.selectedColor === product.selectedColor
      );

      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          quantity: copy[idx].quantity + (product.quantity || 1),
        };
        return copy;
      }
      return [...prev, { ...slimProduct, quantity: product.quantity || 1 }];
    });
  };

  const removeFromCart = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQty = (index, qty) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], quantity: Math.max(1, qty) };
      return copy;
    });
  };

  const clearCart = () => setItems([]);

  const value = {
    items,
    totalQty,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
