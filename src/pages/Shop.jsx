import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import ConflictModal from "../components/ConflictModal";
import api, { getAgriProductsByShop, getCustomerShopProducts, getWomenProductsByShop } from "../services/api";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useLocation } from "../context/LocationContext";

export default function Shop() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const type = queryParams.get("type");
  // BAR DISPLAY STATES
  const [lastAddedPrice, setLastAddedPrice] = useState(0);
  const [isBarVisible, setIsBarVisible] = useState(false);
const [shop, setShop] = useState(null);
  const { cartItems, subtotal, totalPayable } = useCart();

  useEffect(() => {
    fetchProducts();
  }, [id]);

  // If subtotal changes, update the display price
  useEffect(() => {
    if (subtotal >= 0) setLastAddedPrice(subtotal);
  }, [subtotal]);

  // AUTO-HIDE: Bar disappears 5 seconds after the last click
  useEffect(() => {
    let timer;
    if (isBarVisible) {
      timer = setTimeout(() => setIsBarVisible(false), 5000);
    }
    return () => clearTimeout(timer);
  }, [isBarVisible]);
const fetchProducts = async () => {
  setLoading(true);

  try {
    const shopId = Number(id);

    const res = await getCustomerShopProducts(shopId);

    // ✅ ONLY THIS
    setShop(res?.data?.shop);

    const data =
      Array.isArray(res.data)
        ? res.data
        : res?.data?.products || [];

    const normalized = data.map((item) => {
      const p = item.data;

      return {
        id: p.id,
        productName: p.productName || p.name,
        price:
          p.details?.minPrice ||
          p.minPrice ||
          p.price ||
          0,
        imageUrls: p.imageUrls || [],
        category: item.type
      };
    });

    setProducts(normalized);

  } catch (err) {
    console.error("Error fetching products", err);
    setProducts([]);
  } finally {
    setLoading(false);
  }
};

const fetchShopDetails = async () => {
  try {
    const res = await getShopById(id);

  setShop(res?.data?.shop);

  } catch (err) {
    console.error("Shop fetch error", err);
  }
};

const handlePriceUpdate = (price, action) => {
    // Show bar on every click
    setIsBarVisible(true);
    if (action === "add") {
      setLastAddedPrice((prev) => prev + price);
    } else if (action === "sub") {
      setLastAddedPrice((prev) => Math.max(0, prev - price));
    }
  };
const filteredProducts = useMemo(() => {
  return products.filter((p) => {

    const matchType =
      !type ||
      (p.category || "")
        .toLowerCase()
        .includes(type.toLowerCase());

    const matchSearch =
      (p.productName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchType && matchSearch;
  });
}, [products, searchTerm, type]);
  return (
    <div className="pb-24 bg-gray-50 min-h-screen">
      {/* Header logic remains the same */}
  {shop && (
  <div className="max-w-6xl mx-auto p-4">
    <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
      
      <img
        src={shop?.photo}
        alt={shop?.name}
        className="w-full h-48 object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute bottom-4 left-4 text-white">
        <h2 className="text-xl font-bold">{shop?.name}</h2>
        <p className="text-sm">{shop?.address}</p>
      </div>

    </div>
  </div>
)}

      <main className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-extrabold text-2xl">Products</h3>
          <div className="flex gap-3">
             <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border rounded-xl px-4 py-2 outline-none shadow-sm" />
             <button onClick={() => setShowFilter(!showFilter)} className="bg-white p-2.5 rounded-xl border"><SlidersHorizontal size={20} /></button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1,2,3,4].map(n => <div key={n} className="bg-gray-200 animate-pulse h-64 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id || p.productId} product={p} onQtyChange={handlePriceUpdate} />
            ))}
          </div>
        )}
      </main>

      <ConflictModal />

      {/* BOTTOM BAR: Only shows if items exist AND visibility is true */}
    {/* BOTTOM BAR */}
{/* BOTTOM BAR - "View Cart" Popup */}
{cartItems.length > 0 && isBarVisible && (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl bg-white shadow-2xl rounded-3xl px-8 py-5 flex items-center justify-between z-50 border border-gray-100 transition-all duration-500">
    <div className="flex flex-col">
      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Your Cart</span>
      <span className="font-bold text-lg text-gray-800 leading-none">
        {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
      </span>
    </div>

    <div className="flex flex-col items-center">
      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Total Payable</span>
      <span className="font-black text-2xl text-green-700 leading-none">
      ₹{lastAddedPrice || totalPayable || subtotal || 0}
      </span>
    </div>

    <div className="flex items-center gap-4">
      <button
        onClick={() => navigate("/cart")}
        className="px-8 py-3 bg-[#68911a] text-white rounded-2xl font-bold shadow-lg hover:bg-green-700 transition"
      >
        View Cart
      </button>
      <button
        onClick={() => setIsBarVisible(false)}
        className="p-2 text-gray-300 hover:text-red-500"
      >
        <X size={24} strokeWidth={2.5} />
      </button>
    </div>
  </div>
)}
</div>
  );
}