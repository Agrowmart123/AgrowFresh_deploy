import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  checkWishlist,
  removeFromWishlist,
  getPublicProducts,
} from "../services/api";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    setLoading(true);
    setError("");
    try {
      const productsResponse = await getPublicProducts();
      const source = productsResponse?.data?.data || productsResponse?.data || [];
      const products = Array.isArray(source) ? source.slice(0, 20) : [];
      const checks = await Promise.all(
        products.map(async (p) => {
          try {
            const c = await checkWishlist({ productId: p.id || p.productId });
            return c?.data?.data?.exists || c?.data?.exists
              ? {
                  id: p.id || p.productId,
                  name: p.name || p.productName,
                  image: p.image || p.productImage,
                  price: p.minPrice || p.price || 0,
                  originalPrice: p.maxPrice || p.originalPrice,
                  product: p,
                }
              : null;
          } catch {
            return null;
          }
        }),
      );
      setWishlistItems(checks.filter(Boolean));
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist({ productId });
      await fetchWishlist();
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to remove item");
    }
  };

  return (
    <div className="min-h-screen py-6 px-2">
      {loading ? (
        <div className="max-w-4xl mx-auto bg-white border rounded-sm p-8 text-center">
          <div className="w-9 h-9 mx-auto rounded-full border-4 border-green-100 border-t-[#68911a] animate-spin" />
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="max-w-4xl mx-auto bg-white border rounded-sm p-8 text-center">
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-500 mb-4">
            Add items to your wishlist to view them here
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white border rounded-sm">
          <div className="p-4 border-b text-[16px] font-semibold">
            My Wishlist ({wishlistItems.length})
          </div>

          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border-b hover:bg-gray-50 transition"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-[80px] h-[80px] object-cover rounded"
              />

              <div className="flex-1">
                <h2 className="text-[14px] text-black hover:text-[#68911a] hover:underline cursor-pointer">
                  {product.name}
                </h2>

                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-[16px] font-semibold">
                    ₹{product.price}
                  </span>

                  {product.originalPrice && (
                    <>
                      <span className="text-gray-400 line-through text-[13px]">
                        ₹{product.originalPrice}
                      </span>
                      <span className="text-green-600 text-[13px] font-semibold">
                        {product.badge}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleRemove(product.id)}
                className="text-gray-400 hover:text-red-500 self-end sm:self-center"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
