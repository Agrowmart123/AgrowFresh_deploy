import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { farmers } from "../data/farmers";
import { ChevronLeft } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { IMAGES } from "../data/images";

export default function FarmerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const farmer = farmers.find((f) => f.id === parseInt(id, 10));

  // build placeholder recent harvest items from farmer.products
  const harvestProducts = farmer
    ? farmer.products.map((p, idx) => ({
        id: `${farmer.id}-h${idx}`,
        name: p,
        price: 100 + idx * 10,
        image: [IMAGES.product1, IMAGES.product2, IMAGES.product3][
          idx % 3
        ],
        shopId: farmer.id,
      }))
    : [];

  if (!farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Farmer not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#68911a] font-semibold mb-6 hover:opacity-80"
        >
          <ChevronLeft size={20} />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="relative">
            <img
              src={farmer.coverImage}
              alt="cover"
              className="w-full h-56 object-cover"
            />
            <div className="absolute -bottom-16 left-8">
              <img
                src={farmer.image}
                alt={farmer.name}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            </div>
          </div>

          <div className="pt-20 pb-8 px-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {farmer.name}
            </h1>
            <div className="flex items-center gap-1 text-gray-600 mt-1">
              <MapPin size={16} className="text-[#68911a]" />
              {farmer.location}
            </div>


            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800">
                Popular Products
              </h2>
              <div className="flex gap-2 mt-2 flex-wrap">
                {farmer.products.map((p) => (
                  <span
                    key={p}
                    className="bg-gray-100 text-[#68911a] px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
           
            {/* Recent Harvest section */}
            <div className="mt-8">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Harvest
                </h2>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {harvestProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}