import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import ShopHighlightCard from "../components/ShopHighlightCard";
import ShopCard from "../components/ShopCard";
import { getAllShops, getPopularShops, searchShops } from "../services/api";

// Safely extract an array from various API response shapes
const extractArray = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (Array.isArray(d?.data)) return d.data;
  if (Array.isArray(d?.content)) return d.content; // paginated Spring responses
  if (Array.isArray(d?.shops)) return d.shops;
  return [];
};

export default function Shops() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    setLoading(true);
    setError(null);

    // Try endpoints in order until one succeeds
    const attempts = [
      { label: "/shops/all",     fn: getAllShops },
      { label: "/shops/popular", fn: getPopularShops },
      { label: "/shops/search",  fn: () => searchShops({ page: 0, size: 50 }) },
    ];

    for (const attempt of attempts) {
      try {
        const res = await attempt.fn();
        const data = extractArray(res);
        if (data.length > 0) {
          setShops(data);
          setLoading(false);
          return;
        }
        // empty array — try next endpoint
      } catch (err) {
        const status = err?.response?.status;
        console.warn(`${attempt.label} failed (${status ?? "network error"}), trying next…`);
        // If it's a 4xx (auth, not found, bad request), stop — retrying won't help
        if (status && status < 500) break;
      }
    }

    // All attempts failed or returned empty
    setShops([]);
    setError("Unable to load shops right now. Please try again later.");
    setLoading(false);
  };

  const filteredShops = useMemo(() =>
    shops.filter((shop) =>
      selectedCategory === "All" ? true : shop.category === selectedCategory
    ),
    [shops, selectedCategory]
  );

  const list = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  const sidebarCategories = [
    { label: "All Shops", value: "All" },
    { label: "Fruits & Vegetables", value: "Fruits & Vegetables" },
    { label: "Meat & Seafood", value: "Meat & Fish" },
    { label: "Dairy Products", value: "Dairy Products" },
    { label: "Homemade Products", value: "Homemade Products" },
    { label: "Agri Products", value: "Agri Products" },
  ];

  return (
    <main className="max-w-6xl mx-auto p-4 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar categories */}
        <aside className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="space-y-3">
              {sidebarCategories.map((cat) => (
                <button
                  key={cat.value}
                  className={`w-full flex items-center gap-3 rounded p-3 shadow-sm ${
                    selectedCategory === cat.value ? "bg-gray-50" : "bg-white"
                  }`}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  <span
                    className={`text-sm font-semibold ${
                      selectedCategory === cat.value
                        ? "text-[#68911a]"
                        : "text-black"
                    }`}
                  >
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right content */}
        <section className="md:col-span-3">
          <h2 className="text-xl font-semibold mb-4" style={{ color: "#000" }}>
            Browse Shops Near You
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-40" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-gray-500 py-16">
              <p className="text-lg font-medium">Something went wrong</p>
              <p className="text-sm mt-1">{error}</p>
              <button
                onClick={fetchShops}
                className="mt-4 px-5 py-2 bg-[#68911a] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition"
              >
                Retry
              </button>
            </div>
          ) : filteredShops.length === 0 ? (
            <div className="text-center text-gray-500 py-16">
              <p className="text-lg font-medium">No shops found</p>
              <p className="text-sm mt-1">Try selecting a different category</p>
            </div>
          ) : (
            <>
              <motion.div
                className="flex gap-4 overflow-x-auto pb-2 mb-6 no-scrollbar"
                initial="hidden"
                animate="show"
                variants={list}
              >
                {filteredShops.slice(0, 3).map((s) => (
                  <motion.div key={s.id} variants={item} className="flex-shrink-0">
                    <ShopHighlightCard shop={s} />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={list}
              >
                {filteredShops.map((s) => (
                  <motion.div key={s.id} variants={item}>
                    <ShopCard shop={s} />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
