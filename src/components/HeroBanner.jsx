import React from "react";
import { IMAGES } from "../data/images";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HeroBanner() {
  const navigate = useNavigate();
  return (
    <section className="relative overflow-hidden rounded-2xl text-black bg-white py-12 md:py-20 mb-10">
      {/* decorative gradients */}
      <div className="absolute -left-20 -top-20 w-72 h-72 bg-gradient-to-tr from-[#689018] to-[#85a84a] rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute right-[-80px] top-12 w-56 h-56 bg-gradient-to-br from-[#f1aa27] to-[#f0ae24] rounded-full filter blur-2xl opacity-30"></div>

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold tracking-tight leading-tight"
          >
            Groceries from your local kirana, faster than ever
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.6 }}
            className="text-base md:text-lg text-black/90 mt-4 max-w-xl"
          >
            Support neighbourhood shops and get fresh produce delivered to your
            doorstep with real-time tracking and trusted quality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={() => navigate("/shops")}
              className="inline-flex items-center justify-center bg-[#689018] text-white px-6 py-3 rounded-full text-black shadow-lg hover:scale-105 transition-transform"
            >
              Explore Shops
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mt-6 flex gap-3 text-sm"
          >
            <span className="bg-white/10 text-black px-3 py-1 rounded">
              Free delivery over ₹499
            </span>
            <span className="bg-white/10 text-black px-3 py-1 rounded">
              Live tracking
            </span>
            <span className="bg-white/10 text-black px-3 py-1 rounded">
              Support local
            </span>
          </motion.div>
        </div>

        <div className="flex items-center justify-center">
          <motion.img
            src={IMAGES.shop3}
            alt="hero"
            initial={{ scale: 0.98, y: 6 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md rounded-2xl shadow-2xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
