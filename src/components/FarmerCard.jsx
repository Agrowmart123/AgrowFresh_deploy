
import { IMAGES } from "../data/images";

import React from "react";
import { MapPin, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FarmerCard({ farmer }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/farmers/${farmer.id}`)}
      className="w-80 h-full bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Cover Image */}
      <div className="h-20 bg-gray-200 overflow-hidden">
        <img
          src={farmer.coverImage}
          alt="farm"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Profile + Name */}
        <div className="flex gap-4">
          {/* Profile Image */}
          <div className="-mt-12 flex-shrink-0">
            <div className="bg-white rounded-full shadow">
              <img
                src={farmer.image}
                alt={farmer.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-[#68911a]"
              />
            </div>
          </div>

          {/* Name + Location */}
          <div className="flex flex-col justify-center">
            <h3 className="text-lg font-bold text-gray-900">{farmer.name}</h3>

            <div className="flex items-center gap-1 text-sm w-full">
              <MapPin size={16} className="text-[#68911a] flex-shrink-0" />

              <span className="text-gray-500 font-semibold truncate max-w-[140px]">
                {" "}
                {farmer.location}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs font-semibold text-[#efad23] tracking-wide">
          POPULAR PRODUCTS
        </p>

        <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar pb-1">
          {farmer.products.map((product, i) => (
            <span
              key={i}
              className="flex items-center gap-1 bg-gray-100 text-[#68911a] px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0"
            >
              <Leaf size={12} />
              {product}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
