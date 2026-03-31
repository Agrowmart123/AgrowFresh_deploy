import React, { useState } from "react";
import { Search, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FarmerCard from "../components/FarmerCard";
import { farmers } from "../data/farmers";

export default function Farmers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Filter farmers based on search term
  const filteredFarmers = farmers.filter((farmer) =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.products.some((product) =>
      product.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort farmers
  const sortedFarmers = [...filteredFarmers].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "location") {
      return a.location.localeCompare(b.location);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#68911a] font-semibold mb-3 md:mb-4 hover:opacity-80"
          >
            <ChevronLeft size={20} />
            Back
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
            Our Farmers
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Connect with local farmers and explore their fresh produce
          </p>
        </div>

        {/* Search and Sort Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative mb-3 sm:mb-0">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search farmers, locations, or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#68911a] focus:border-transparent"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="w-full sm:w-64">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#68911a] focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="location">Sort by Location</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-gray-500">
            Showing {sortedFarmers.length} farmer{sortedFarmers.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Farmers Grid */}
        {sortedFarmers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {sortedFarmers.map((farmer) => (
              <div key={farmer.id} className="h-full">
                <FarmerCard farmer={farmer} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 bg-white rounded-lg px-4 sm:px-0">
            <p className="text-gray-500 text-lg">
              No farmers found matching your search.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-4 px-6 py-2 bg-[#68911a] text-white rounded-lg hover:bg-[#5a7815] transition"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}