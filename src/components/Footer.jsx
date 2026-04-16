import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
} from "lucide-react";
import { IMAGES } from "../data/images";

export default function Footer() {
  return (
    <footer className="mt-0 relative">
      {/* Wave separator */}
      <svg
        className="w-full h-24"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: "#68911a", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#68911b", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>
        <path
          d="M0,40 Q240,0 480,40 T960,40 T1440,40 L1440,120 L0,120 Z"
          fill="url(#waveGrad)"
        />
      </svg>

      {/* Footer Content */}
      <div className="bg-gradient-to-b from-[#68911b] via-[#85a84a] to-[#efad23] text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-8">
            {" "}
            {/* Column 1 - About */}
            <div>
              <h5 className="font-bold text-lg mb-4">About</h5>
              <ul className="text-sm text-white opacity-85 space-y-2">
                <li>
                  <Link to="/" className="hover:text-yellow-400 transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-yellow-400 transition"
                  >
                    About Us
                  </Link>
                </li>

                <li>
                  <Link
                    to="/careers"
                    className="hover:text-yellow-400 transition"
                  >
                    Join Our Team
                  </Link>
                </li>
              </ul>
            </div>
            {/* Column 2 - Shopping */}
            <div>
              <h5 className="font-bold text-lg mb-4">Shopping</h5>
              <ul className="text-sm text-white opacity-85 space-y-2">
                <li>
                  <Link
                    to="/shops"
                    className="hover:text-yellow-400 transition"
                  >
                    All Shops
                  </Link>
                </li>

                <li>
                  <Link
                    to="/farmers"
                    className="hover:text-yellow-400 transition"
                  >
                    All Farmers
                  </Link>
                </li>
              </ul>
            </div>
            {/* Column 3 - Support */}
            <div>
              <h5 className="font-bold text-lg mb-4">Support</h5>
              <ul className="text-sm text-white opacity-85 space-y-2">
                <li>
                  <Link to="/faq" className="hover:text-yellow-400 transition">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-yellow-400 transition"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-yellow-400 transition"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:text-yellow-400 transition"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
            {/* Column 4 - Download App */}
            <div>
              <h5 className="font-bold text-lg mb-2">Be A Seller</h5>

              <div className="flex flex-col gap-3 items-start">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Get it on Google Play"
                  className="h-8 hover:scale-105 transition"
                />
              </div>
            </div>
            {/* Column 5 - Image */}
            <div>
              <img
                src={IMAGES.FooterImg}
                alt="Fresh Produce"
                className="w-full max-w-[220px] object-cover"
              />
            </div>
          </div>

          {/* Social & Copyright */}
          <div className="border-t border-white border-opacity-20 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex gap-4 mb-4 md:mb-0">
              <a
                href="https://www.facebook.com/share/1GfBrzF4yf/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:bg-opacity-10 hover:scale-105 transition"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.instagram.com/agrowmart.india?igsh=MWxwZ3BicTAwOGI3ZQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:bg-opacity-10 hover:scale-105 transition"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://x.com/agrowmartindia?t=OUK73HwJ8IUsq_AFL18XWQ&s=09"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:bg-opacity-10 hover:scale-105 transition"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/agrowmart-naturals-india-pvt-ltd/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-white hover:bg-opacity-10 hover:scale-105 transition"
              >
                <Linkedin size={18} />
              </a>
            </div>
            <div className="text-xs text-white opacity-70">
              <p>© 2026 Agrowfresh. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
