import React from "react";
import { IMAGES } from "../data/images";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { motion } from "framer-motion";
import { Share } from "lucide-react";

export default function ShopHighlightCard({ shop }) {
  // ✅ FIXED MAPPING
  const img = shop.shopPhoto || IMAGES.shop1;
  const { showToast } = useToast();

  function handleShare(e) {
    e.preventDefault();
    e.stopPropagation();

    // ✅ FIXED
    const url = `${window.location.origin}/shop/${shop.shopId}`;

    if (navigator.share) {
      navigator.share({ title: shop.shopName, url }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => showToast("Shop link copied to clipboard", "success"));
    } else {
      showToast("Share not supported in this browser", "info");
    }
  }

  return (
    <Link
      to={`/shop/${shop.shopId}`}   // ✅ FIXED
      className="w-80 group"
      aria-label={`Open ${shop.shopName}`}  // ✅ FIXED
    >
      <motion.div
        whileHover={{ translateY: -6 }}
        transition={{ duration: 0.28 }}
        className="rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl flex flex-col"
      >
        <div className="h-2 bg-gradient-to-r from-[#68911a] to-[#efad23]"></div>

        <div className="flex gap-4 p-4 items-start">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border">
            <img
              src={img}
              alt={shop.shopName}   // ✅ FIXED
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-base leading-tight text-gray-900">
                {shop.shopName}   {/* ✅ FIXED */}
              </h4>

              <button
                onClick={handleShare}
                onKeyDown={(e) => e.stopPropagation()}
                className="p-2 rounded-full bg-white border text-[#efad23] hover:bg-[#68911a]/10 transition"
                aria-label="Forward shop"
              >
                <Share size={18} />
              </button>
            </div>

            {/* ✅ FIXED */}
            <div className="text-xs text-gray-500 mt-1">
              {(shop.shopType || "Fruits & Vegetables")} Shops
            </div>

            {/* 🔹 KEEPING SAME DESIGN (fallback values ok) */}
            <div className="mt-2 flex items-center gap-3 text-sm text-gray-700">
              <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
                Best Rated
              </span>
              <span className="font-medium">{shop.rating || "4.8"}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">
                {shop.deliveryTime || "2 hrs"}
              </span>
            </div>

            {/* ✅ ADDRESS MAP */}
            <div className="text-sm text-gray-500 mt-2">
              {shop.shopAddress || "Location not available"}
            </div>
          </div>
        </div>

        <div className="mt-auto bg-gradient-to-r from-yellow-400 to-orange-300 text-yellow-900 text-sm font-medium px-4 py-3 flex items-center justify-center">
          ⚑ Exciting Offers Inside
        </div>
      </motion.div>
    </Link>
  );
}