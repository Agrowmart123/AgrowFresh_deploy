
import React from "react";
import { ShoppingCart, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { clearCart as clearCartApi } from "../services/api";
export default function ProductCard({ product ,onQtyChange }) {
  const navigate = useNavigate();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const productId = product.id || product.productId;
  const cartItem = cartItems.find(
    (item) => item.productId === productId || item.id === productId
  );
  const currentQty = cartItem ? cartItem.quantity : 0;

  const currentPrice = Number(product.details?.minPrice || product.price || 0);
  const image =
  product.image ||
  product.productImage ||
  product.imageUrls?.[0] ||   // 🔥 ADD THIS
  "https://via.placeholder.com/300";

  const [liked, setLiked] = React.useState(isInWishlist(productId));

  // Handle Add / + / -
 const handleCartAction = async (e, action) => {
  e.stopPropagation();

  try {
    if (action === "add") {
      if (currentQty === 0) {
   const newType = product.type === "farmer" ? "FARMER" : "REGULAR";
const newMerchantId = product.shopId || product.shop?.id;

// 👉 existing cart item
const existingItem = cartItems[0];

if (existingItem) {
  // ⚠️ conflict check
  if (existingItem.productType !== newType) {
    const confirmClear = window.confirm(
      "Your cart contains items from another seller. Do you want to clear the cart and add this item?"
    );

    if (!confirmClear) return;

    // 🧹 clear cart
    await clearCartApi();
  }
}

// ✅ now add item
await addToCart({
  productId: product.id,
  productType: newType,
  shopId: newMerchantId,
  quantity: 1,
});

        showToast("Added to cart", "success");

        // ✅ ADD THIS
        onQtyChange?.(currentPrice, "add");

      } else {
        await updateQuantity(cartItem.id || productId, currentQty + 1);

        // ✅ ADD THIS
        onQtyChange?.(currentPrice, "add");
      }
    } 
    else if (action === "sub") {
      if (currentQty > 1) {
        await updateQuantity(cartItem.id || productId, currentQty - 1);

        // ✅ ADD THIS
        onQtyChange?.(currentPrice, "sub");

      } else {
        await removeFromCart(cartItem.id || productId);
        showToast("Removed from cart", "info");

        // ✅ ADD THIS
        onQtyChange?.(currentPrice, "sub");
      }
    }
  } catch (error) {
    console.error("Cart action failed:", error);
    showToast("Something went wrong", "error");
  }
};
  return (
    <div
      onClick={() => navigate(`/product/${productId}`, {
        state: { product, type: product.type || "regular" },
      })}
      className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
    >
      <div className="relative">
        <img src={image} alt={product.name} className="w-full h-40 object-cover" />

        {/* Wishlist Button */}
        <button
          onClick={async (e) => {
            e.stopPropagation();
            try {
              if (liked) {
                await removeFromWishlist({ productId, productType: product.type || "regular" });
                setLiked(false);
                showToast("Removed from wishlist", "info");
              } else {
                await addToWishlist({
                  productId,
                  productName: product.name || product.productName,
                  productImage: product.image || product.productImage || product.imageUrls?.[0],
                  shopName: product.shopName,
                  vendorName: product.vendorName,
                  minPrice: currentPrice,
                  maxPrice: product.maxPrice || currentPrice,
                  category: product.category || product.categoryName,
                  type: product.type || "regular",
                  inStock: true,
                });
                setLiked(true);
                showToast("Added to wishlist", "success");
              }
            } catch (err) {
              console.error("Wishlist error:", err);
            }
          }}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
        >
          <Heart size={18} className={liked ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
          {product.name || product.productName}
        </h3>

        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-lg">₹{currentPrice}</span>

          {currentQty === 0 ? (
            <button
              onClick={(e) => handleCartAction(e, "add")}
              className="bg-[#68911a] text-white px-4 py-1.5 rounded-md flex items-center gap-1 text-sm font-bold hover:bg-[#5a7a15]"
            >
              <ShoppingCart size={14} /> Add
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#68911a] text-white px-3 py-1 rounded-md font-bold">
              <button
                onClick={(e) => handleCartAction(e, "sub")}
                className="px-3 hover:bg-black/10 rounded"
              >
                −
              </button>
              <span className="text-sm min-w-[20px] text-center">{currentQty}</span>
              <button
                onClick={(e) => handleCartAction(e, "add")}
                className="px-3 hover:bg-black/10 rounded"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}