import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  MapPin,
  Store,
  User,
  Search,
  ChevronDown,
  Menu,
  X,
  Heart,
  ShoppingBag,
  Bell,
  Settings,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLocation } from "../context/LocationContext";
import LocationPicker from "./LocationPicker";
import { useWishlist } from "../context/WishlistContext";
import logo from "../../public/AMLogo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { location, setLocation } = useLocation();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  const [openDropdown, setOpenDropdown] = useState(false);

  const [search, setSearch] = useState("");
  const [openLocation, setOpenLocation] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const [mobileLocationOpen, setMobileLocationOpen] = useState(false);

  const locationRef = useRef(null);
  const mobileLocationRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const placeholders = [
    "Search fruits...",
    "Search vegetables...",
    "Search local products...",
    "Search pulses...",
    "Search dairy products...",
    "Search meat & seafood...",
    "Search fertilizers...",
    "search seefood...",
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Close desktop location on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setOpenLocation(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenu(false);
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu or search overlay is open
  useEffect(() => {
    if (mobileMenu || mobileSearch) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu, mobileSearch]);

  // Auto focus search input when overlay opens
  useEffect(() => {
    if (mobileSearch && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [mobileSearch]);

  // Close search overlay on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setMobileSearch(false);
      }
    }
    if (mobileSearch) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileSearch]);

  const handleLogout = () => {
    logout();
    setOpenDropdown(false);
    setMobileMenu(false);
    navigate("/login");
  };

  const handleSearchSubmit = () => {
    // Handle search submit — add your navigation logic here
    // e.g. navigate(`/search?q=${search}`)
    setMobileSearch(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-white/20 py-3">
        <div className="max-w-[90%] mx-auto px-2 md:px-3 flex items-center justify-between">
          {" "}
          {/* ── LEFT: LOGO + LOCATION ── */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={logo}
                alt="AgrowFresh"
                className="h-10 w-auto rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-xl md:text-1.5xl font-bold text-[#68911a] leading-tight">
                  AgrowFresh
                </span>
                <span className="text-[10px] text-[#efad23] text-right uppercase tracking-tighter hidden sm:block">
                  Fresh From Farmers
                </span>
              </div>
            </Link>

            {/* LOCATION SELECTOR — desktop only */}
            <div ref={locationRef} className="relative hidden md:block">
              <button
                onClick={() => setOpenLocation(!openLocation)}
                className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                <MapPin size={16} className="text-[#68911a]" />
                <span className="font-semibold text-sm text-gray-700 truncate max-w-[150px]">
                  {location?.name && location?.pin
                    ? `${location.name} • ${location.pin}`
                    : "Select Location"}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${openLocation ? "rotate-180" : ""}`}
                />
              </button>
              <LocationPicker
                open={openLocation}
                onClose={() => setOpenLocation(false)}
              />
            </div>
          </div>
          {/* ── CENTER: SEARCH BAR — desktop only ── */}
          <div className="hidden md:flex items-center border-2 border-[#68911a] rounded-xl overflow-hidden w-1/3 focus-within:border-[#68911a] transition-all">
            <div className="relative flex-1 overflow-hidden h-full flex items-center">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder=""
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 outline-none text-sm"
              />

              {!search && (
                <span
                  key={placeholderIndex}
                  className="absolute left-10 text-gray-400 text-sm animate-placeholder-slide"
                >
                  {placeholders[placeholderIndex]}
                </span>
              )}
            </div>
          </div>
          {/* ── RIGHT ── */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/shops"
                className="text-gray-700 hover:text-[#68911a] font-semibold text-sm transition-colors"
              >
                Shops
              </Link>
              <Link
                to="/sell"
                className="text-gray-700 hover:text-[#68911a] font-semibold text-sm transition-colors"
              >
                Sell
              </Link>
              <Link
                to="/cart"
                className="relative text-gray-700 hover:text-[#68911a] font-semibold text-sm transition-colors"
              >
                Cart
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-3 bg-[#68911a] text-white text-xs px-1.5 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              <Link
                to="/wishlist"
                className="relative text-gray-700 hover:text-[#68911a]"
              >
                <Heart size={20} />

                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#efad23] text-white text-xs px-1 rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {!user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-[#68911a] hover:text-white border border-[#68911a] rounded-full hover:bg-[#68911a] transition"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-semibold text-white bg-[#68911a] border border-[#68911a] rounded-full hover:bg-white hover:text-[#68911a] transition"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setOpenDropdown(!openDropdown)}
                      className="flex items-center gap-1 text-gray-700 hover:text-[#68911a] font-semibold text-sm transition-colors"
                    >
                      <span>Hi,</span>

                      <span>{user?.name?.split(" ")[0] || "Profile"}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform ${openDropdown ? "rotate-180" : ""}`}
                      />
                    </button>
                    {openDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 z-50 py-1">
                        {[
                          { label: "My Profile", to: "/profile" },
                          { label: "Bank Details", to: "/bank" },
                          { label: "My Wishlist", to: "/wishlist" },
                          { label: "My Orders", to: "/orders" },
                          { label: "Address", to: "/address" },
                          { label: "Notifications", to: "/notification" },
                          { label: "Wallet", to: "/wallet" },
                        ].map(({ label, to }) => (
                          <Link
                            key={to}
                            to={to}
                            onClick={() => setOpenDropdown(false)}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-[#68911a] transition-colors"
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-semibold text-red-500 border border-red-400 rounded-full hover:bg-red-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile: Search + Wishlist + Hamburger */}
            <div className="flex items-center gap-3 md:hidden">
              {/* Search */}
              <button
                onClick={() => setMobileSearch(true)}
                className="text-gray-700 hover:text-[#68911a] transition-colors"
                aria-label="Search"
              >
                <Search size={22} />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative text-gray-700 hover:text-[#68911a]"
              >
                <Heart size={22} />

                {wishlistItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#efad23] text-white text-[10px] px-1 rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Menu */}
              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="text-gray-700 hover:text-[#68911a] transition-colors"
                aria-label="Menu"
              >
                {mobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── FULL-SCREEN SEARCH OVERLAY (mobile) ── */}
      {mobileSearch && (
        <div className="fixed inset-0 z-[60] md:hidden animate-search-overlay-in">
          {/* Blurred backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSearch(false)}
          />

          {/* Search panel — slides down from top */}
          <div className="relative z-10 bg-white animate-search-panel-in">
            {/* Top bar */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
              <div className="relative flex items-center flex-1 gap-3 bg-gray-50 border-2 border-[#68911a] rounded-2xl px-4 py-3 shadow-inner overflow-hidden">
                {" "}
                <Search size={20} className="text-[#68911a] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder=""
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
                  className="flex-1 bg-transparent outline-none text-base text-gray-800"
                />
                {!search && (
                  <span
                    key={placeholderIndex}
                    className="absolute left-12 text-gray-400 text-base animate-placeholder-slide"
                  >
                    {placeholders[placeholderIndex]}
                  </span>
                )}
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <button
                onClick={() => setMobileSearch(false)}
                className="shrink-0 px-3 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>

            {/* Quick suggestion chips */}
            <div className="px-4 pt-4 pb-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Tomatoes",
                  "Potatoes",
                  "Onions",
                  "Mangoes",
                  "Spinach",
                  "Carrots",
                  "Bananas",
                  "Capsicum",
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSearch(item);
                      handleSearchSubmit();
                    }}
                    className="px-3 py-1.5 bg-green-50 text-[#68911a] text-sm font-medium rounded-full border border-green-100 hover:bg-green-100 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Search button */}
            {search && (
              <div className="px-4 pt-3 pb-4 animate-fade-in">
                <button
                  onClick={handleSearchSubmit}
                  className="w-full py-3 bg-[#68911a] text-white font-semibold rounded-2xl hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Search size={18} />
                  Search "{search}"
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── MOBILE MENU DRAWER ── */}
      {mobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <div
        ref={mobileMenuRef}
        className={`
          fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-in-out md:hidden
          ${mobileMenu ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="font-bold text-[#68911a] text-lg">Menu</span>
          <button
            onClick={() => setMobileMenu(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
          {/* ── LOCATION ── */}
          <div className="mb-3">
            <button
              onClick={() => setMobileLocationOpen(!mobileLocationOpen)}
              className="w-full flex items-center justify-between gap-2 border border-gray-200 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#68911a] shrink-0" />
                <span className="font-semibold text-sm text-gray-700 text-left leading-tight">
                  {location?.name && location?.pin
                    ? `${location.name} • ${location.pin}`
                    : "Select Your Location"}
                </span>
              </div>
              <ChevronDown
                size={14}
                className={`transition-transform shrink-0 ${mobileLocationOpen ? "rotate-180" : ""}`}
              />
            </button>

            {mobileLocationOpen && (
              <div className="mt-2 relative">
                <LocationPicker
                  open={mobileLocationOpen}
                  onClose={() => setMobileLocationOpen(false)}
                  className="!static !w-full !shadow-none !border !border-gray-100 rounded-xl"
                />
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-1">
            <Link
              to="/shops"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#68911a] font-semibold text-sm transition-colors"
            >
              <Store size={18} className="text-[#68911a]" />
              Shops
            </Link>

            <Link
              to="/sell"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#68911a] font-semibold text-sm transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#68911a]"
              >
                <path d="M20 12V22H4V12" />
                <path d="M22 7H2v5h20V7z" />
                <path d="M12 22V7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
              Sell
            </Link>

            <Link
              to="/cart"
              onClick={() => setMobileMenu(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-[#68911a] font-semibold text-sm transition-colors"
            >
              <div className="relative">
                <ShoppingCart size={18} className="text-[#68911a]" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#68911a] text-white text-[10px] px-1 rounded-full leading-4">
                    {cartItems.length}
                  </span>
                )}
              </div>
              Cart{" "}
              {cartItems.length > 0 && (
                <span className="text-[#68911a]">({cartItems.length})</span>
              )}
            </Link>
          </div>

          {/* ── AUTH ── */}
          <div className="space-y-2">
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-center w-full py-2.5 text-sm font-semibold text-[#68911a] border border-[#68911a] rounded-xl hover:bg-[#68911a] hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-center w-full py-2.5 text-sm font-semibold text-white bg-[#68911a] border border-[#68911a] rounded-xl hover:bg-white hover:text-[#68911a] transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {[
                  {
                    label: "My Profile",
                    to: "/profile",
                    icon: <User size={18} className="text-green-500" />,
                  },
                  {
                    label: "Bank Details",
                    to: "/bank_details",
                    icon: <Settings size={18} className="text-green-500" />,
                  },
                  {
                    label: "My Wishlist",
                    to: "/wishlist",
                    icon: <Heart size={18} className="text-green-500" />,
                  },
                  {
                    label: "My Orders",
                    to: "/orders",
                    icon: <ShoppingBag size={18} className="text-green-500" />,
                  },
                  {
                    label: "Address",
                    to: "/address",
                    icon: <MapPin size={18} className="text-green-500" />,
                  },
                  {
                    label: "Notifications",
                    to: "/notifications",
                    icon: <Bell size={18} className="text-green-500" />,
                  },
                  {
                    label: "Wallet",
                    to: "/wallet",
                    icon: <Settings size={18} className="text-green-500" />,
                  },
                ].map(({ label, to, icon }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-green-50 hover:text-[#68911a] font-semibold text-sm transition-colors"
                  >
                    {icon}
                    {label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full py-2.5 text-sm font-semibold text-red-500 border border-red-400 rounded-xl hover:bg-red-50 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes search-overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes search-panel-in {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-search-overlay-in { animation: search-overlay-in 0.2s ease-out; }
        .animate-search-panel-in   { animation: search-panel-in 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-in           { animation: fade-in 0.2s ease-out; }

        @keyframes placeholder-slide {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  30% {
    transform: translateY(0);
    opacity: 1;
  }
  70% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-20px);
    opacity: 0;
  }
}

.animate-placeholder-slide {
  animation: placeholder-slide 2s ease-in-out;
}
      `}</style>
    </>
  );
}
