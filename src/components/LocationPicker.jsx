import React, { useState } from "react";
import { useLocation } from "../context/LocationContext";

export default function LocationPicker({ open, onClose, className }) {
  const { location, setLocation } = useLocation();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleSearch(value) {
    const cleanValue = value.replace(/\D/g, "");
    setSearch(value);

    if (!cleanValue) {
      setResults([]);
      return;
    }

    // PIN search
    if (cleanValue.length === 6) {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${cleanValue}`,
        );
        const data = await res.json();

        if (data[0].Status === "Success") {
          const offices = data[0].PostOffice.map((p) => ({
            name: `${p.Name}, ${p.District}`,
            pin: p.Pincode,
          }));
          setResults(offices);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.log(err);
        setResults([]);
      }
      setLoading(false);
      return;
    }

    setResults(filtered);
  }

  function choose(loc) {
    setLocation(loc);
    onClose();
  }

  // Default: floating dropdown (desktop). With className prop: inline (mobile drawer).
  const containerClass = className
    ? `bg-white rounded-xl border border-gray-100 p-4 ${className}`
    : "absolute top-12 left-0 w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50";

  return (
    <div className={containerClass}>
      <h3 className="text-sm font-semibold mb-2">Select your location</h3>

      <div className="border-t pt-2">
        <div className="text-xs text-gray-500 mb-1">Enter Your PIN</div>

        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Enter Your PIN Code"
          className="w-full border  p-2 rounded-md mb-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#68911a]"
        />

        {loading && (
          <p className="text-xs text-gray-500 mb-2">Searching location...</p>
        )}

        {results.length > 0 && (
          <div className="space-y-1 mb-2 max-h-48 overflow-y-auto">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => choose(r)}
                className="w-full text-left p-2 rounded-lg hover:bg-gray-50 text-sm"
              >
                {r.name} • {r.pin}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
