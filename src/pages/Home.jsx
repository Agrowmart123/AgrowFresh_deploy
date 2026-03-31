import React, { useEffect, useState } from "react";

import CategoryGrid from "../components/CategoryGrid";
import { IMAGES } from "../data/images";
import { farmers } from "../data/farmers";
import ShopHighlightCard from "../components/ShopHighlightCard";
import FarmerCard from "../components/FarmerCard";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import {
  getHomeData,
  getPublicProducts,
  getTop10PopularShops,
  getRecentlyAdded,
  getPopularProducts,
} from "../services/api";

const sampleShops = [
  {
    id: "s1",
    name: "Green Grocery",
    description: "Fresh vegetables",
    rating: 4.5,
    deliveryTime: 30,
    image: IMAGES.shop1,
    offer: "10% OFF",
    distance: "0.8 km",
  },
  {
    id: "s2",
    name: "Dairy Delight",
    description: "Milk & dairy",
    rating: 4.2,
    deliveryTime: 25,
    image: IMAGES.shop2,
    offer: "Free delivery",
    distance: "1.2 km",
  },
  {
    id: "s3",
    name: "Farm Tools",
    description: "Tools for agriculture",
    rating: 4.6,
    deliveryTime: 40,
    image: IMAGES.shop3,
    offer: "Save ₹50",
    distance: "0.6 km",
  },
];

const popularProducts = [
  {
    id: 1,
    name: "Seeds of Change Organic Red Rice",
    image: IMAGES.product1,
    price: 28.85,
    originalPrice: 32.0,
    brand: "NestFood",
    rating: 1,
    reviews: 1,
    badge: "13%",
    badgeColor: "bg-[#68911a]",
    category: "Local Products",
  },
  {
    id: 2,
    name: "All Natural Style Chicken Meatballs",
    image: IMAGES.product1,
    price: 23.0,
    originalPrice: 122.0,
    brand: "NestFood",
    rating: 5,
    reviews: 3,
    badge: "66%",
    badgeColor: "bg-blue-500",
    category: "Meat & Seafood",
  },
  {
    id: 3,
    name: "Angie's Sweet & Salty Kettle Corn",
    image: IMAGES.product1,
    price: 48.85,
    originalPrice: 52.8,
    brand: "Country Crock",
    rating: 4,
    reviews: 1,
    badge: "8%",
    badgeColor: "bg-red-500",
    category: "Fruits",
  },
  {
    id: 4,
    name: "Foster Farms Takeout Crispy Classic",
    image: IMAGES.product1,
    price: 17.85,
    originalPrice: 19.0,
    brand: "Country Crock",
    rating: 0,
    reviews: 0,
    badge: "New",
    badgeColor: "bg-[#68911a]",
    category: "Vegetables",
  },
];

const banners = [
  {
    title: "Collected From Gardens",
    offer: "UPTO 20% OFF",
    image: IMAGES.FooterImg,
    gradient: "from-green-500 to-green-600",
    textColor: "text-white",
    buttonColor: "text-green-600",
  },
  {
    title: "Change Your Diet Plan",
    offer: "UPTO 20% OFF",
    image: IMAGES.cat1,
    gradient: "from-lime-300 to-lime-400",
    textColor: "text-gray-800",
    buttonColor: "text-gray-800",
  },
  {
    title: "Vegetable 100% Organic",
    offer: "UPTO 20% OFF",
    image: IMAGES.cat2,
    gradient: "from-orange-400 to-orange-500",
    textColor: "text-white",
    buttonColor: "text-orange-500",
  },
  {
    title: "Fresh Seafood Daily",
    offer: "UPTO 15% OFF",
    image: IMAGES.cat6,
    gradient: "from-blue-500 to-blue-600",
    textColor: "text-white",
    buttonColor: "text-blue-600",
  },
  {
    title: "Premium Dairy Products",
    offer: "UPTO 25% OFF",
    image: IMAGES.cat5,
    gradient: "from-purple-500 to-purple-600",
    textColor: "text-white",
    buttonColor: "text-purple-600",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [activeProductTab, setActiveProductTab] = useState("All");
  const [activeBanner, setActiveBanner] = useState(0);

  const filteredProducts =
    activeProductTab === "All"
      ? popularProducts
      : popularProducts.filter(
          (product) => product.category === activeProductTab,
        );

  const scrollToBanner = (index) => {
    const scroller = document.getElementById("banners-scroller");
    if (scroller) {
      scroller.scrollTo({
        left: index * scroller.clientWidth,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const left = document.getElementById("discover-left");
    const right = document.getElementById("discover-right");
    const scroller = document.getElementById("discover-scroller");
    if (!scroller) return;
    function leftClick() {
      scroller.scrollBy({ left: -320, behavior: "smooth" });
    }
    function rightClick() {
      scroller.scrollBy({ left: 320, behavior: "smooth" });
    }
    left?.addEventListener("click", leftClick);
    right?.addEventListener("click", rightClick);
    return () => {
      left?.removeEventListener("click", leftClick);
      right?.removeEventListener("click", rightClick);
    };
  }, []);

  useEffect(() => {
    const left = document.getElementById("popular-left");
    const right = document.getElementById("popular-right");
    const scroller = document.getElementById("popular-scroller");
    if (!scroller) return;
    function leftClick() {
      scroller.scrollBy({ left: -320, behavior: "smooth" });
    }
    function rightClick() {
      scroller.scrollBy({ left: 320, behavior: "smooth" });
    }
    left?.addEventListener("click", leftClick);
    right?.addEventListener("click", rightClick);
    return () => {
      left?.removeEventListener("click", leftClick);
      right?.removeEventListener("click", rightClick);
    };
  }, []);

  useEffect(() => {
    const scroller = document.getElementById("banners-scroller");
    if (!scroller) return;

    const handleScroll = () => {
      const bannerWidth = scroller.clientWidth;
      const index = Math.round(scroller.scrollLeft / bannerWidth);
      setActiveBanner(index % banners.length);
    };

    scroller.addEventListener("scroll", handleScroll);

    let index = 0;

    const interval = setInterval(() => {
      const bannerWidth = scroller.clientWidth;

      index++;

      scroller.scrollTo({
        left: index * bannerWidth,
        behavior: "smooth",
      });

      if (index >= banners.length) {
        setTimeout(() => {
          scroller.scrollTo({
            left: 0,
            behavior: "auto",
          });
          index = 0;
        }, 600);
      }
    }, 4000);

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const left = document.getElementById("farmers-left");
    const right = document.getElementById("farmers-right");
    const scroller = document.getElementById("farmers-scroller");

    if (!scroller) return;

    function leftClick() {
      scroller.scrollBy({ left: -320, behavior: "smooth" });
    }

    function rightClick() {
      scroller.scrollBy({ left: 320, behavior: "smooth" });
    }

    left?.addEventListener("click", leftClick);
    right?.addEventListener("click", rightClick);

    return () => {
      left?.removeEventListener("click", leftClick);
      right?.removeEventListener("click", rightClick);
    };
  }, []);

  return (
    <div>
      <main className="max-w-6xl mx-auto p-4 pt-8">
        {/* Promotional Banners Section */}
        <section className="mb-12 ">
          <div className="relative">
            <div
              id="banners-scroller"
              className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
            >
              {[...banners, ...banners].map((banner, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-full md:w-1/2 bg-gradient-to-br ${banner.gradient}
          rounded-xl flex overflow-hidden min-h-52 transform transition duration-300
          hover:scale-[1.02] hover:shadow-xl group`}
                >
                  {/* TEXT */}
                  <div
                    className={`w-1/2 p-6 flex flex-col justify-center ${banner.textColor}`}
                  >
                    <p className="text-sm font-semibold mb-2">{banner.offer}</p>

                    <h3 className="text-2xl md:text-2xl font-bold mb-4">
                      {banner.title}
                    </h3>

                    <button
                      className={`bg-white ${banner.buttonColor} font-bold px-5 py-2 rounded-full text-sm w-fit
              transition transform hover:scale-105`}
                    >
                      SEE ALL
                    </button>
                  </div>

                  {/* IMAGE */}
                  <div className="w-1/2 overflow-hidden">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div className="flex justify-center mt-4 space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToBanner(index)}
                  className={`w-1.5 h-1.5 rounded-full transition ${
                    activeBanner === index
                      ? "bg-[#68911a] scale-125"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Fresh Products Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Fresh Products</h2>

            <button
              onClick={() => navigate("/fresh_products")}
              className="text-[#68911a] font-semibold hover:underline"
            >
              View More →
            </button>
          </div>{" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 1, title: "Fresh Vegetables", image: IMAGES.cat2 },
              { id: 2, title: "Fresh Fruits", image: IMAGES.product9 },
              { id: 3, title: "Milk", image: IMAGES.cat5 },
              { id: 4, title: "Meat", image: IMAGES.cat6 },
            ].map((product, i) => (
              <div
                key={i}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              >
                <div className="h-48 overflow-hidden bg-gray-200 flex items-center justify-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <p className="text-gray-700 text-sm mb-2">{product.title}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-[#68911a]"></div>
                    <p className="font-bold text-gray-900">MIN 27% OFF</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Categories</h2>

            <div className="flex gap-2">
              <button
                id="cats-left"
                className="bg-white border rounded-full px-3 py-1 shadow hover:bg-gray-100"
              >
                ‹
              </button>

              <button
                id="cats-right"
                className="bg-white border rounded-full px-3 py-1 shadow hover:bg-gray-100"
              >
                ›
              </button>
            </div>
          </div>

          <CategoryGrid layout="carousel" />
        </section>

        {/* Farmers Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Farmers</h2>

            <button
              onClick={() => navigate("/farmers")}
              className="text-[#68911a] font-semibold hover:underline flex items-center gap-1"
            >
              See All
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="relative">
            {/* Left Arrow */}
            <button
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full shadow hidden md:block"
              id="farmers-left"
            >
              ‹
            </button>

            {/* Right Arrow */}
            <button
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full shadow hidden md:block"
              id="farmers-right"
            >
              ›
            </button>

            <div
              ref={(el) => {
                window.__farmersEl = el;
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft")
                  window.__farmersEl?.scrollBy({
                    left: -320,
                    behavior: "smooth",
                  });
                if (e.key === "ArrowRight")
                  window.__farmersEl?.scrollBy({
                    left: 320,
                    behavior: "smooth",
                  });
              }}
              className="flex gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
              id="farmers-scroller"
            >
              {farmers.concat(farmers).map((item, i) => (
                <div key={item.id + "-" + i} className="flex-shrink-0">
                  <FarmerCard farmer={item} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="near-shops" className="mb-8">
          {" "}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Shops Near You</h2>
            <button
              onClick={() => navigate("/shops")}
              className="text-[#68911a] font-semibold hover:underline flex items-center gap-1"
            >
              See All
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="relative">
            <button
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full shadow hidden md:block"
              id="discover-left"
            >
              ‹
            </button>
            <button
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full shadow hidden md:block"
              id="discover-right"
            >
              ›
            </button>

            <div
              ref={(el) => {
                window.__discoverEl = el;
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft")
                  window.__discoverEl?.scrollBy({
                    left: -320,
                    behavior: "smooth",
                  });
                if (e.key === "ArrowRight")
                  window.__discoverEl?.scrollBy({
                    left: 320,
                    behavior: "smooth",
                  });
              }}
              className="flex gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
              id="discover-scroller"
            >
              {sampleShops.concat(sampleShops).map((s, i) => (
                <div key={s.id + "-" + i} className="flex-shrink-0">
                  <ShopHighlightCard
                    shop={{
                      ...s,
                      image: [IMAGES.cat2, IMAGES.cat5, IMAGES.cat4][i % 3],
                      rating: s.rating,
                      deliveryTime: "2 hrs",
                      distance: s.distance,
                      locality: "Umerkhadi",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Products</h2>
            <div className="flex gap-2 flex-wrap">
              {[
                "All",
                "Fruits",
                "Vegetables",
                "Milks & Dairies",
                "Meat & Seafood",
                "Local Products",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveProductTab(tab)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    activeProductTab === tab
                      ? "bg-[#68911a] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <button
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full shadow hidden md:block hover:bg-white"
              id="popular-left"
            >
              ‹
            </button>
            <button
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/80 p-2 rounded-full shadow hidden md:block hover:bg-white"
              id="popular-right"
            >
              ›
            </button>

            <div
              ref={(el) => {
                window.__popularEl = el;
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft")
                  window.__popularEl?.scrollBy({
                    left: -320,
                    behavior: "smooth",
                  });
                if (e.key === "ArrowRight")
                  window.__popularEl?.scrollBy({
                    left: 320,
                    behavior: "smooth",
                  });
              }}
              className="flex gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar"
              id="popular-scroller"
            >
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-64">
                  <ProductCard
                    product={product}
                    onQtyChange={(change) => {
                      console.log(
                        `Quantity changed by ${change} for ${product.name}`,
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
