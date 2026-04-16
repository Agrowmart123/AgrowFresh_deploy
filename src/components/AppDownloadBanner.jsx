import React from "react";
import { motion } from "framer-motion";
import { IMAGES } from "../data/images";

export default function AppDownloadBanner() {
  return (
    <section className="mt-16 rounded-3xl overflow-hidden relative bg-white text-slate-900">
      {/* LEFT Background Image */}
      <div className="absolute inset-y-0 left-0 w-1/2">
        <img
          src={IMAGES.product9}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 to-transparent"></div>
      </div>

      {/* RIGHT Background Image */}
      <div className="absolute inset-y-0 right-0 w-1/2">
        <img
          src={IMAGES.product8}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-white/90 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 grid md:grid-cols-2 items-center gap-8 p-10">
        {/* Left Content */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-white font-bold shadow-lg p-1"
            >
              <img
                src={IMAGES.Logo}
                alt="Agrowfresh"
                className="w-full h-full object-contain"
              />
            </motion.div>

            <div>
              <div className="text-2xl font-semibold">Agrowfresh</div>
              <div className="text-sm text-gray-500">Fresh from farms</div>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4">
            Get the Agrowfresh App now!
          </h2>

          <p className="text-gray-600 text-lg">
            For best offers and discounts curated specially for you.
          </p>
        </div>

        {/* QR Section */}
        <div className="flex justify-center">
          <div className="bg-white rounded-3xl p-6 w-64 text-center shadow-xl border">
            <img
              src={
                IMAGES.qr ||
                "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AgrowfreshApp"
              }
              alt="QR Code"
              className="w-full"
            />
            <p className="text-[#68911a] font-semibold mt-3">
              Scan to download
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
