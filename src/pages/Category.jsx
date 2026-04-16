import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import ShopCard from "../components/ShopCard";
import { IMAGES } from "../data/images";
import { categories } from "../components/CategoryGrid";
import { FiSearch, FiFilter, FiX } from "react-icons/fi";

export default function Category() {
  const { name } = useParams();
  const [sort, setSort] = useState("relevance");
  const [filterOffer, setFilterOffer] = useState(false);
  const [search, setSearch] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const categoryTitle = categories.find((c) => c.id === name)?.title || name;
  const [filters, setFilters] = useState({
    openNow: false,
    offers: false,
    fastDelivery: false,
  });

  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length + (filterOffer ? 1 : 0);

  const shops = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: `c${i}`,
        name: `${name} Shop ${i + 1}`,
        description: "Shop description and specialties",
        rating: (4.0 + (i % 5) * 0.1).toFixed(1),
        deliveryTime: 20 + i,
        image: [IMAGES.shop1, IMAGES.shop2, IMAGES.shop3][i % 3],
        offer: i % 2 === 0 ? "10% OFF" : null,
        distance: `${0.5 + i * 0.3} km`,
      })),
    [name]
  );

  const visible = shops.filter((s) => {
    const matchOffer = filterOffer ? s.offer : true;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchOpenNow = filters.openNow ? s.openNow === true : true;
    const matchFastDelivery = filters.fastDelivery ? s.deliveryTime <= 30 : true;
    const matchOffersFilter = filters.offers ? !!s.offer : true;
    return matchOffer && matchSearch && matchOpenNow && matchFastDelivery && matchOffersFilter;
  });

  if (sort === "time") visible.sort((a, b) => a.deliveryTime - b.deliveryTime);
  if (sort === "rating") visible.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));

  const FilterPanel = () => (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h4 className="font-semibold mb-3">Filters</h4>
      <div className="space-y-2 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={filters.openNow} onChange={() => handleFilterChange("openNow")} />
          Open now
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={filters.offers} onChange={() => handleFilterChange("offers")} />
          Offers
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={filters.fastDelivery} onChange={() => handleFilterChange("fastDelivery")} />
          Fast delivery
        </label>
      </div>
    </div>
  );

  return (
    <main className="max-w-6xl mx-auto p-4 pt-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">Category: {categoryTitle}</h1>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px] sm:w-72 sm:flex-none">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder={`Search in ${categoryTitle}`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-full pl-10 pr-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#68911a] text-sm"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded px-2 py-2 text-sm"
          >
            <option value="relevance">Relevance</option>
            <option value="time">Delivery time</option>
            <option value="rating">Top rated</option>
          </select>

          {/* Offers checkbox — hidden on mobile (moved to filter sheet) */}
          <label className="text-sm items-center gap-2 hidden sm:flex">
            <input
              type="checkbox"
              checked={filterOffer}
              onChange={(e) => setFilterOffer(e.target.checked)}
            />
            Offers only
          </label>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden flex items-center gap-1 border rounded px-3 py-2 text-sm relative"
          >
            <FiFilter size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#68911a] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowMobileFilters(false)}
          />
          {/* Drawer */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-base">Filters</h4>
              <button onClick={() => setShowMobileFilters(false)}>
                <FiX size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={filters.openNow} onChange={() => handleFilterChange("openNow")} />
                Open now
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={filters.offers} onChange={() => handleFilterChange("offers")} />
                Offers
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={filters.fastDelivery} onChange={() => handleFilterChange("fastDelivery")} />
                Fast delivery
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={filterOffer} onChange={(e) => setFilterOffer(e.target.checked)} />
                Offers only
              </label>
            </div>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="mt-5 w-full bg-[#68911a] text-white py-2.5 rounded-xl font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block">
          <FilterPanel />
        </aside>

        {/* Shop Cards */}
        <section className="md:col-span-3">
          {visible.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {visible.map((s) => (
                <ShopCard key={s.id} shop={s} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <img
                src={IMAGES.empty || "/empty.png"}
                alt="No product"
                className="w-32 sm:w-40 mb-4 opacity-70"
              />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-600 mb-4">
                No Product Found
              </h2>
              <button
                onClick={() => setSearch("")}
                className="bg-purple-700 text-white px-6 py-3 rounded-xl hover:bg-purple-800 transition"
              >
                Let's Shop
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}