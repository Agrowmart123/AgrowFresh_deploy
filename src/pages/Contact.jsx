// src/pages/Contact.jsx
import React, { useState } from "react";
import { motion } from "framer-motion"; // motion/react replaced with framer-motion

import { toast } from "sonner";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Building,
  Send,
  MessageSquare,
} from "lucide-react";

import emailjs from "@emailjs/browser";

// Simple UI Components (for this page)

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded-lg font-medium transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-md ${className}`}>
    {children}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#809c1a] ${className}`}
    {...props}
  />
);

const Label = ({ children, ...props }) => (
  <label className="text-sm font-medium text-gray-700" {...props}>
    {children}
  </label>
);

const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#68911a] ${className}`}
    {...props}
  />
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const SERVICE_ID = "service_5y7y3q8";
    const TEMPLATE_ID = "template_2lbqt28";
    const PUBLIC_KEY = "c54tm_1y8VfEHgt9v";

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, formData, PUBLIC_KEY)
      .then(() => {
        toast.success(
          "Message sent successfully! We will get back to you soon."
        );
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      })
      .catch((error) => {
        console.error("Email send failed:", error);
        toast.error("Failed to send message. Please try again later.");
      });
  };

  const offices = [
    {
      type: "Corporate Office",
      address:
        "105-A, Raichandani 45 Baner Street, Opposite to Dmart Baner, Pune Maharashtra 411045.",
      phone: "+91 8007810076",
      email: "contact@agrowmartindia.com",
      hours: "Mon - Fri: 9:00 AM - 6:00 PM",
    },
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Available 24/7 for urgent queries",
      contact: "+91 8007810076",
      color: "bg-[#68911a] text-white",
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "We will respond within 24 hours",
      contact: "contact@agrowmartindia.com",
      color: "bg-[#68911a] text-white",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Start Chat",
      link: "https://mail.google.com/mail/?view=cm&fs=1&to=contact@agrowmartindia.com",
      color: "bg-[#68911a] text-white",
    },
  ];
  

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
     <section
  className="relative bg-cover bg-center bg-no-repeat text-white py-20 lg:py-32 text-center"
  style={{ backgroundImage: "url(/image.jpg)" }}
>
        {/* Overlay (behind the text) */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-70 z-0"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl lg:text-6xl mb-6">Get in Touch</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Have questions? We're here to help and answer any questions you
              might have
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 -mt-10 mb-12">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-all">
                  <div
                    className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <method.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {method.description}
                  </p>
                  {method.link ? (
                    <button
                      onClick={() => window.open(method.link, "_blank")}
                      className="text-[#68911a] hover:underline cursor-pointer"
                    >
                      {method.contact}
                    </button>
                  ) : (
                    <a href="#" className="text-[#68911a] hover:underline">
                      {method.contact}
                    </a>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 sm:p-8 border-0 shadow-lg">
                <h2 className="text-2xl text-gray-900 mb-2">
                  Send us a Message
                </h2>
                <p className="text-gray-600 mb-6">
                  Fill out the form and we will get back to you shortly
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Your name"
                      className="mt-2"
                    />
                  </div>

                  <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="you@example.com"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,10}$/.test(value)) {
                            setFormData({ ...formData, phone: value });
                          }
                        }}
                        placeholder="+91 9876543210"
                        className="mt-2"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="How can we help?"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell us more about your inquiry..."
                      className="mt-2 min-h-[150px]"
                    />
                  </div>

                 <Button type="submit" className="w-full bg-[#68911a] hover:bg-[#5a7d15] text-white gap-2">
                    <Send className="w-4 h-4" /> Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Office Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl text-gray-900 mb-2">Our Offices</h2>
                <p className="text-gray-600 mb-6">Visit us at our locations</p>
              </div>

              {offices.map((office, index) => (
                <motion.div
                  key={office.type}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#68911a] rounded-full flex items-center justify-center flex-shrink-0">
                        <Building className="w-6 h-6 text-[#68911a]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-4">{office.type}</h3>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 text-gray-600">
                            <MapPin className="w-5 h-5 text-[#68911a] flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{office.address}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <Phone className="w-5 h-5 text-[#68911a] flex-shrink-0" />
                            <span className="text-sm">{office.phone}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <Mail className="w-5 h-5 text-[#68911a] flex-shrink-0" />
                            <span className="text-sm">{office.email}</span>
                          </div>
                          <div className="flex items-center gap-3 text-gray-600">
                            <Clock className="w-5 h-5 text-[#68911a] flex-shrink-0" />
                            <span className="text-sm">{office.hours}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {/* Map */}
              <Card className="overflow-hidden border-0 shadow-lg">
                <div className="h-64 sm:h-80 md:h-96 w-full">
                  <iframe
                    src="https://maps.google.com/maps?q=Agrowmart%20Naturals%20India%20PVT.%20LTD%20105%20A&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    className="w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

    
    </div>
  );
}