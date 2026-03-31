import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();

  const faqs = [
    {
      q: "How do I place an order?",
      a: "Browse nearby shops, add products to cart and complete checkout using secure payment options.",
    },
    {
      q: "Can I track my delivery?",
      a: "Yes, once order is confirmed you can track delivery status in real-time from Orders section.",
    },
    {
      q: "How can I contact seller?",
      a: "You can directly connect with Agrowmart seller via in-app.",
    },
    {
      q: "Is cancellation available?",
      a: "Orders can be cancelled before dispatch. After dispatch cancellation depends on seller policy.",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

        {/* LEFT INFO */}
        <div>
          <h1 className="text-3xl font-semibold mb-2 text-gray-800">
            Frequently Asked Questions
          </h1>

          <p className="text-gray-500 mb-6">
            Find answers to common questions about ordering, delivery,
            seller communication and platform usage.
          </p>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-lg mb-2 text-gray-800">
              Still Need Help?
            </h3>

            <p className="text-sm text-gray-500 mb-4">
              Our support team is always ready to assist you with any
              issues related to orders, payments or delivery.
            </p>

           <button
  onClick={() => navigate("/contact")}
  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition"
>
  Contact Support
</button>
          </div>
        </div>

        {/* RIGHT FAQ */}
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left px-6 py-4 flex justify-between items-center"
              >
                <span className="font-medium text-gray-800">
                  {item.q}
                </span>

                <span className="text-green-600 text-xl">
                  {open === i ? "−" : "+"}
                </span>
              </button>

              {open === i && (
                <div className="px-6 pb-5 text-sm text-gray-500">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}