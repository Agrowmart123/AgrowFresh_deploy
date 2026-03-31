import React, { createContext, useContext, useState } from "react";

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

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      const exist = prev.find((item) => item.id === product.id);
      if (exist) {
        return prev;
      }
      const updated = [...prev, product];
      localStorage.setItem("agrowfresh_wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem("agrowfresh_wishlist", JSON.stringify(updated));
      return updated;
    });
  };

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
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
