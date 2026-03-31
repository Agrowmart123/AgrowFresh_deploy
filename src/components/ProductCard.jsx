import React from "react";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export default function ProductCard({ product, onQtyChange }) {
  const [qty, setQty] = React.useState(0);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const { user } = useAuth();

  // ✅ ONLY IMPORTANT FIX
 const image =
  product.image ||
  product.productImage ||
  (Array.isArray(product.imageUrls)
    ? product.imageUrls[0]
    : null) ||
  "https://via.placeholder.com/300";
  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
    >
      {/* Image */}
      <div className="relative">
        <img
          src={image}
          alt={product.name || product.productName}
          className="w-full h-40 object-cover"
        />

        <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-bold">
          66%
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isInWishlist(product.id || product.productId)) {
              removeFromWishlist(product.id || product.productId);
              showToast("Removed from wishlist", "info");
            } else {
              addToWishlist(product);
              showToast("Added to wishlist", "success");
            }
          }}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow hover:shadow-lg transition"
        >
          <Heart
            size={18}
            className={`transition ${
              isInWishlist(product.id || product.productId)
                ? "fill-red-500 text-red-500"
                : "text-gray-400"
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
          {product.name || product.productName}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2 text-yellow-400">
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} fill="currentColor" />
          <Star size={14} className="text-gray-300" />
          <span className="text-gray-500 text-xs ml-1">3</span>
        </div>

        <p className="text-sm text-[#efad23] mt-1">By NestFood</p>

        {/* Price Row */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-bold text-lg">₹{product.price}</span>
            <span className="text-gray-400 line-through text-sm ml-2">
              ₹122
            </span>
          </div>

          {qty === 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setQty(1);

                addToCart({
                  id: product.id || product.productId,
                  name: product.name || product.productName,
                  image: image,
                  price: product.price,
                  oldPrice: product.mrp ?? product.price,
                  discount: product.mrp
                    ? Math.round((1 - product.price / product.mrp) * 100)
                    : 0,
                  shopId: product.shopId,
                });

                showToast("Added to cart", "success");
              }}
              className="bg-[#68911a] text-white px-3 py-1 rounded-md flex items-center gap-1 text-sm"
            >
              <ShoppingCart size={14} />
              Add
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-[#68911a] text-white px-2 py-1 rounded-md">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (qty > 0) {
                    setQty(qty - 1);
                  }
                  onQtyChange(-1);
                }}
                className="px-2"
              >
                -
              </button>

              <span className="text-sm font-semibold">{qty}</span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQty(qty + 1);

                  addToCart({
                    id: product.id || product.productId,
                    name: product.name || product.productName,
                    image: image,
                    price: product.price,
                    oldPrice: product.mrp ?? product.price,
                    discount: product.mrp
                      ? Math.round((1 - product.price / product.mrp) * 100)
                      : 0,
                    shopId: product.shopId,
                  });

                  showToast("Added to cart", "success");
                }}
                className="px-2"
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