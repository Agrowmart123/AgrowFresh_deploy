import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import ConflictModal from "../components/ConflictModal";
import { getCustomerShopProducts } from "../services/api";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function Shop() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
const shop = products[0]?.shop;

  useEffect(() => {
    fetchProducts();
  }, [id]);
const fetchProducts = async () => {
  setLoading(true);
  try {
    const shopId = Number(id); // ✅ FIX

    console.log("SHOP ID:", shopId);

    const res = await getCustomerShopProducts(shopId);

    const data = Array.isArray(res.data)
      ? res.data
      : res?.data?.data || [];

    console.log("PRODUCTS:", data);

    setProducts(data);
  } catch (err) {
    console.error("Error fetching products", err);
    setProducts([]);
  } finally {
    setLoading(false);
  }
};

  // Derive categories from real product data
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["All", ...cats];
  }, [products]);

const filteredProducts = useMemo(() => {
  let result = products.filter((p) => {
    const matchCategory =
      selectedCategory === "All" ||
      (p.category || p.productCategory) === selectedCategory;

    const matchSearch = (p.name || p.productName || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchCategory && matchSearch;
  });

  if (priceSort === "low-high") {
    result.sort((a, b) => (a.price || 0) - (b.price || 0));
  }
  if (priceSort === "high-low") {
    result.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  return result;
}, [products, searchTerm, priceSort, selectedCategory]);

  const cartContext = useCart();
  const cartItems = cartContext?.cartItems || [];

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      {shop && (
  <div className="max-w-6xl mx-auto p-4">
  <div className="relative rounded-2xl overflow-hidden shadow-lg mb-6">
    {/* Banner */}
    <img
      src={shop.shopPhoto}
      alt={shop.shopName}
      className="w-full h-48 object-cover"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-black/40"></div>

    {/* Content */}
    <div className="absolute bottom-4 left-4 flex items-center gap-4">
      <img
        src={shop.shopPhoto}
        alt={shop.shopName}
        className="w-16 h-16 rounded-xl object-cover border-2 border-white"
      />

      <div>
        <h2 className="text-white text-xl font-bold">
          {shop.shopName}
        </h2>
        <p className="text-white text-sm">
          {shop.shopAddress}
        </p>
        <p className="text-[#efad23] text-sm">
          {shop.shopType}
        </p>
      </div>
    </div>
  </div>
  </div>
)}
{shop && (
  <div className="max-w-6xl mx-auto px-4">
  <div className="bg-white rounded-2xl shadow p-5 mb-6">    <div className="flex flex-wrap gap-6">

      {/* Shop Type */}
      <div>
        <p className="text-gray-500 text-sm">Category</p>
        <p className="font-semibold text-black">
          {shop.shopType || "N/A"}
        </p>
      </div>

      {/* Timing */}
      <div>
        <p className="text-gray-500 text-sm">Timing</p>
        <p className="font-semibold text-black">
          {shop.opensAt || "--"} - {shop.closesAt || "--"}
        </p>
      </div>

      {/* Status */}
      <div>
        <p className="text-gray-500 text-sm">Status</p>
        <p className="font-semibold text-green-600">
          {shop.isActive ? "Open Now" : "Closed"}
        </p>
      </div>

      {/* Vendor */}
      <div>
      
        <p className="font-semibold text-black">
          {shop.vendorName || "N/A"}
        </p>
      </div>

    </div>

    {/* Description */}
    {shop.shopDescription && (
      <div className="mt-4">
        <p className="text-gray-500 text-sm">About</p>
        <p className="text-sm text-gray-700 mt-1">
          {shop.shopDescription}
        </p>
      </div>
    )}
  </div>
  </div>
)}
      
      <main className="max-w-6xl mx-auto p-4">
        {/* Search + Filter */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
  <h3 className="font-bold text-2xl">
  Products
</h3>
</div>
          <div className="flex gap-3">
            <div className="relative w-64">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-lg pl-10 pr-3 py-2 w-full"
              />
            </div>

            <button
              onClick={() => setShowFilter(!showFilter)}
              className="border p-2 rounded-lg"
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilter && (
          <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-sm font-medium text-gray-600 mr-2">Sort by Price:</label>
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value)}
                className="border rounded-lg px-3 py-1.5 text-sm"
              >
                <option value="">Default</option>
                <option value="low-high">Low to High</option>
                <option value="high-low">High to Low</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600 mr-2">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border rounded-lg px-3 py-1.5 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-64" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((p) => (
             <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      <ConflictModal />

      {/* Cart Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-2xl px-5 py-3 flex gap-4">
          <div>{cartItems.length} items</div>
          <div className="font-bold">₹{cartTotal}</div>

          <button
            onClick={() => navigate("/cart")}
            className="px-4 py-2 bg-green-600 text-white rounded-full"
          >
            View Cart
          </button>

          <button onClick={() => {}}>
            <X />
          </button>
        </div>
      )}
    </div>
  );
}
