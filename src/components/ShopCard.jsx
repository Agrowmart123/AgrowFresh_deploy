import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function ShopCard({ shop }) {
  return (
    <Link to={`/shop/${shop.shopId}`} className="block">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden w-full max-w-sm"
      >
        {/* Shop Image */}
        <div className="relative">
          <img
            src={shop.shopPhoto}
            alt={shop.shopName}
            className="w-full h-48 object-cover"
          />

          {/* Rating (static for now) */}
          <div className="absolute bottom-3 right-3 bg-[#68911a] text-white text-sm px-3 py-1 rounded-full">
            ⭐ 4.5
          </div>
        </div>

        {/* Shop Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {shop.shopName}
          </h3>

          {/* Address */}
          <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
            📍 <span>{shop.shopAddress}</span>
          </div>

          {/* Closing time */}
          <div className="flex items-center gap-2 text-orange-500 text-sm mt-1">
            ⏰ Closing at
            <span className="text-gray-500"> {shop.closesAt}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-green-50 text-green-700 text-sm font-medium px-4 py-3">
          Open: {shop.opensAt}
        </div>
      </motion.div>
    </Link>
  );
}