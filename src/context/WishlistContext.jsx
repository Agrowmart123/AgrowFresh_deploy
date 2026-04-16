import React, { createContext, useContext, useState } from "react";
import {
  addToWishlist as addAPI,
  removeFromWishlist as removeAPI,
} from "../services/api";

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

const loadFromStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return fallback;
  }
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() =>
    loadFromStorage("agrowfresh_wishlist", [])
  );

  // ✅ ADD (API + local)
const addToWishlist = async (product) => {
  try {
    await addAPI({
      ...product,
      productId: product.productId || product.id,
      productType: product.type || "regular",
    });

    setWishlistItems((prev) => {
      const exist = prev.find(
        (item) =>
          item.id === (product.productId || product.id)
      );
      if (exist) return prev;

      const updated = [
        ...prev,
        { ...product, id: product.productId || product.id },
      ];

      localStorage.setItem(
        "agrowfresh_wishlist",
        JSON.stringify(updated)
      );

      return updated;
    });
  } catch (error) {
    console.error("Add wishlist error ❌", error);
  }
};

  // ✅ REMOVE (API + local)
  const removeFromWishlist = async ({ productId, productType }) => {
    try {
      // 🔥 API CALL
      await removeAPI({ productId, productType });

      setWishlistItems((prev) => {
        const updated = prev.filter(
          (item) => item.id !== productId
        );
        localStorage.setItem("agrowfresh_wishlist", JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error("Remove wishlist error ❌", error);
    }
  };

  // ✅ CHECK
  const isInWishlist = (id) => {
    return wishlistItems.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    localStorage.removeItem("agrowfresh_wishlist");
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        setWishlistItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};