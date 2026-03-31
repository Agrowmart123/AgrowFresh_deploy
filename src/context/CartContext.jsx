import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() =>
    loadFromStorage("agrowfresh_cart", [])
  );
  const [orders, setOrders] = useState(() =>
    loadFromStorage("agrowfresh_orders", [])
  );

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      let updated;
      if (exist) {
        updated = prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prev, { ...product, quantity: 1 }];
      }
      localStorage.setItem("agrowfresh_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("agrowfresh_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      localStorage.setItem("agrowfresh_cart", JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("agrowfresh_cart");
  };

  const placeOrder = () => {
    if (cartItems.length === 0) return null;
    const orderId = `ORD-${Date.now()}`;
    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      status: "Processing",
      cartItems,
      total,
    };
    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      localStorage.setItem("agrowfresh_orders", JSON.stringify(updated));
      return updated;
    });
    clearCart();
    return orderId;
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, orders, placeOrder, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};