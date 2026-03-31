// src/pages/About.jsx
import React from "react";
import { motion } from "framer-motion";
import { Users, Award, Globe, Heart, BadgeCheck, Lightbulb, Handshake, ShoppingCart } from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-md ${className}`}>
    {children}
  </div>
);

export default function About() {
const features = [
  {
    icon: BadgeCheck,
    title: "Proven Experience",
    desc: "Years of delivering quality work across diverse projects with consistent client satisfaction.",
  },
  {
    icon: Lightbulb,
    title: "Affordable Solutions",
    desc: "Cost-effective applications designed to fit budgets while maintaining excellent service standards.",
  },
  {
    icon: Handshake,
    title: "Strong Support",
    desc: "Reliable assistance available to guide, help and resolve queries whenever needed.",
  },
  {
    icon: ShoppingCart,
    title: "Direct Market Access Across India",
    desc: "Better prices for farmers, pan-India customer reach and faster transparent sales.",
  },
];
  const stats = [
    { number: "25+", label: "Happy Customers" },
    { number: "10", label: "Expert Farmers" },
    { number: "25", label: "Shops" },
    { number: "50", label: "Products" },
  ];

  return (
    <div className="overflow-hidden">

      {/* Hero Section */}
      <section
  className="relative bg-cover bg-center bg-no-repeat text-white text-center h-[350px] flex items-center justify-center"
  style={{ backgroundImage: "url(/image.jpeg)" }}
>
  {/* overlay */}
  <div className="absolute inset-0 bg-black/50"></div>

  <div className="relative max-w-7xl mx-auto px-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl lg:text-6xl mb-6">About Us</h1>

      <p className="text-xl text-white/90 max-w-3xl mx-auto">
        Empowering farmers and connecting communities with fresh,
        high-quality agricultural products.
      </p>
    </motion.div>
  </div>
</section>

      {/* About Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12">

          <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            src="/produce.jpg"
            alt="about"
            className="rounded-xl shadow-lg"
          />

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">
              Let Tomorrow Grow Together
            </h2>

            <p className="text-gray-600 mb-4">
              Agrowmart is a digital agricultural marketplace that connects
              farmers, vendors, and consumers. Our platform ensures easy access
              to fresh produce, fertilizers, seeds, and essential agricultural
              products.
            </p>

            <p className="text-gray-600 mb-4">
              By combining technology with agriculture, we empower farmers,
              simplify supply chains, and ensure customers receive high-quality
              products.
            </p>

            <p className="text-gray-600">
              Our mission is to build a sustainable ecosystem where farmers,
              vendors, and customers thrive together.
            </p>
          </motion.div>

        </div>
      </section>

      {/* Stats Section */}
     <section className="bg-gray-100 py-14">

  <div className="max-w-7xl mx-auto px-4">

    <div className="grid md:grid-cols-4 gap-8 text-center">

     {stats.map((item, index) => (
  <motion.div
    key={item.label}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ y: -10 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-xl shadow-md p-8 cursor-pointer"
  >
    <h3 className="text-3xl font-bold text-[#689110]">
      {item.number}
    </h3>

    <p className="text-gray-600 mt-2">
      {item.label}
    </p>
  </motion.div>
))}
    </div>

  </div>

</section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">

          <h2 className="text-3xl text-center font-semibold text-gray-900 mb-12">
            Why Choose Us
          </h2>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">

  {features.map((feature, index) => (
    <motion.div
      key={feature.title}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
     <Card className="relative p-6 text-center h-[220px] flex flex-col justify-center overflow-hidden bg-white hover:shadow-2xl transition">

  {/* inner decorative gradients */}
  <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-green-400 to-orange-400 rounded-full blur-3xl opacity-20"></div>

  <div className="absolute bottom-[-20px] right-[-20px] w-36 h-36 bg-gradient-to-tr from-gray-400 to-green-500 rounded-full blur-2xl opacity-20"></div>

  {/* content */}
  <div className="relative z-10">

    <div className="w-14 h-14 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
      <feature.icon className="text-[#efad23]" size={26} />
    </div>

    <h3 className="text-gray-900 font-semibold mb-2">
      {feature.title}
    </h3>

    <p className="text-gray-600 text-sm">
      {feature.desc}
    </p>

  </div>

</Card>
    </motion.div>
  ))}

</div> 
 </div>
      </section>

    </div>
  );
}