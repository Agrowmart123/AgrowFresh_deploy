import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShopHighlightCard from "../components/ShopHighlightCard";
import { ChevronRight } from "lucide-react";
import { getVendorBanners, getAllShops,getAllApprovedFarmers  } from "../services/api";
import FarmerCard from "../components/FarmerCard";

// ✅ FIX (gradient function)
const getGradient = (index) => {
  const gradients = [
    "from-green-500 to-green-600",
    "from-lime-400 to-lime-500",
    "from-orange-400 to-orange-500",
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
  ];
  return gradients[index % gradients.length];
};

export default function Home() {
  const navigate = useNavigate();

  const [banners, setBanners] = useState([]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [shops, setShops] = useState([]);
  const [farmers, setFarmers] = useState([]);

  // ✅ API CALLS
  useEffect(() => {
    fetchBanners();
    fetchShops();
     fetchFarmers(); 
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await getVendorBanners();
      setBanners(res.data || []);
    } catch (error) {
      console.error("Banner fetch error:", error);
    }
  };

  const fetchShops = async () => {
    try {
      const res = await getAllShops();
      setShops(res.data || []);
    } catch (error) {
      console.error("Shop fetch error:", error);
    }
  };
 const fetchFarmers = async () => {
  try {
    const res = await getAllApprovedFarmers();

    console.log("Farmers API:", res.data);

    let farmersData = [];

    if (Array.isArray(res.data)) {
      farmersData = res.data;
    } else if (Array.isArray(res.data?.data)) {
      farmersData = res.data.data;
    } else if (Array.isArray(res.data?.content)) {
      farmersData = res.data.content;
    }

    setFarmers(farmersData);

  } catch (error) {
    console.error("Farmers fetch error:", error);
  }
};
  // 🔥 AUTO SLIDER (UNCHANGED)
  useEffect(() => {
    const scroller = document.getElementById("banners-scroller");
    if (!scroller || banners.length === 0) return;

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
          scroller.scrollTo({ left: 0, behavior: "auto" });
          index = 0;
        }, 600);
      }
    }, 4000);

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, [banners]);

  const scrollToBanner = (index) => {
    const scroller = document.getElementById("banners-scroller");
    if (scroller) {
      scroller.scrollTo({
        left: index * scroller.clientWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <div>
      <main className="max-w-6xl mx-auto p-4 pt-8">

        {/* 🔥 BANNERS */}
        <section className="mb-12">
          <div className="relative">
            <div
              id="banners-scroller"
              className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar"
            >
              {[...banners, ...banners].map((banner, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-full md:w-1/2 
                  rounded-xl overflow-hidden flex items-center
                  bg-gradient-to-r ${banner.gradient || getGradient(index)}
                  min-h-[210px] md:min-h-[240px] px-6`}
                >
                  {/* TEXT */}
                  <div className="w-1/2 text-white">
                    <p className="text-xs font-semibold mb-2 tracking-wide">
                      {banner.offerText || "UPTO 20% OFF"}
                    </p>

                    <h2 className="text-xl md:text-2xl font-bold leading-tight mb-4">
                      {banner.title}
                    </h2>
                  </div>

                  {/* IMAGE */}
                  <div className="w-1/2 flex justify-end items-end">
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="h-[170px] md:h-[200px] object-contain drop-shadow-xl"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* DOTS */}
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

        {/* 🔥 SHOPS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Shops Near You</h2>

            <button
              onClick={() => navigate("/shops")}
              className="text-[#68911a] font-semibold flex items-center gap-1"
            >
              See All
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar">
            {shops.concat(shops).map((s, i) => (
              <div key={s.id + "-" + i} className="flex-shrink-0">
                <ShopHighlightCard
                  shop={{
                    ...s,
                    image: s.imageUrl,
                  }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* 🔥 FARMERS */}
{/* 🔥 FARMERS */}
<section className="mt-10">
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold">Farmers Near You</h2>

    <button
      onClick={() => navigate("/farmers")}
      className="text-[#68911a] font-semibold flex items-center gap-1"
    >
      See All
      <ChevronRight size={16} />
    </button>
  </div>

  <div className="flex gap-4 overflow-x-auto pb-2 scroll-smooth no-scrollbar">
    {(farmers || []).concat(farmers || []).map((f, i) => (
      <div key={f.id + "-" + i} className="flex-shrink-0 w-[280px]">
        <FarmerCard farmer={f} />
      </div>
    ))}
  </div>
</section>

      </main>
    </div>
  );
}