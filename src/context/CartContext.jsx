
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCart, updateCartItem, removeCartItem, addToCart as addToCartApi } from "../services/api";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [totalPayable, setTotalPayable] = useState(0);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await getCart();
      const data = res?.data || {};

      setCartItems(data.items || []);
      setSubtotal(Number(data.subtotal) || 0);
      setTotalPayable(Number(data.totalPayable) || 0);

      console.log("✅ Cart Updated from Backend:", data);
    } catch (e) {
      console.error("❌ Fetch cart failed:", e);
    }
  };

  // ==================== ADD TO CART ====================
const addToCart = async (product) => {
  try {
    await addToCartApi({ 
      productId: product.productId,
       productType: product.productType || "REGULAR",    // ✅ FIX
      quantity: product.quantity || 1,
     getMerchantId: product.shopId,           // ✅ ADD THIS
    });

    await fetchCart(); // ✅ REMOVE setTimeout
  } catch (err) {
    console.error("Add to cart failed:", err);
  }
};

  // ==================== UPDATE QUANTITY (Fixed) ====================
 const updateQuantity = async (id, quantity) => {
  if (quantity < 1) return;

  try {
    await updateCartItem({ 
      itemId: id,   // ✅ correct
      quantity: quantity 
    });

    await fetchCart(); // ✅ instant refresh
  } catch (err) {
    console.error("Update quantity failed:", err);
  }
};

  // ==================== REMOVE FROM CART ====================
  const removeFromCart = async (id) => {
  try {
    await removeCartItem(id);
    await fetchCart(); // ✅
  } catch (err) {
    console.error("Remove from cart failed:", err);
  }
};

  const clearCart = () => {
    setCartItems([]);
    setSubtotal(0);
    setTotalPayable(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        subtotal,
        totalPayable,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};