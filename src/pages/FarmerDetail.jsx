import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { getAllApprovedFarmers, getProductsByFarmer } from "../services/api";

export default function FarmerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState(null);
const [products, setProducts] = useState([]);

useEffect(() => {
  fetchFarmer();
  fetchProducts();
}, [id]);

const fetchFarmer = async () => {
  try {
    const res = await getAllApprovedFarmers();
    const found = res.data.find((f) => f.id === Number(id));
    setFarmer(found);
  } catch (err) {
    console.error(err);
  }
};

const fetchProducts = async () => {
  try {
    const res = await getProductsByFarmer(id);
    setProducts(res.data || []);
  } catch (err) {
    console.error(err);
  }
};
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
            src={farmer?.photoUrl}
              alt="cover"
              className="w-full h-56 object-cover"
            />
            <div className="absolute -bottom-16 left-8">
              <img
              src={farmer?.photoUrl }
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
             {farmer?.village}, {farmer?.district}
            </div>


            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800">
                Popular Products
              </h2>
              <div className="flex gap-2 mt-2 flex-wrap">
               {products.slice(0, 5).map((p) => (
  <span
    key={p.id}
    className="bg-gray-100 text-[#68911a] px-3 py-1 rounded-full text-xs font-medium"
  >
    {p.productName}
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
  {products.map((prod) => (
<ProductCard
  key={prod.id}
  product={{
    id: prod.id,
    name: prod.productName,
    price: prod.maxPrice,
    image: prod.imageUrl,
    type: "farmer",
    shopId: prod.farmerId,        
  }}
/>
  ))}
</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}