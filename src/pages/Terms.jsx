import React, { useState } from "react";

export default function Terms() {
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    setAccepted(true);
  };

  return (
   <div className="bg-gray-100 min-h-screen p-6 scroll-smooth">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-green-600">
          Terms and Conditions
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Agreement between user and AgrowMart
        </p>

       <div className="grid md:grid-cols-4 gap-6 h-[75vh]">
          {/* Sidebar */}
        <div className="bg-gray-50 border rounded-lg p-4 h-fit sticky top-24">
<h3 className="text-lg font-semibold mb-4">Quick Links</h3>  
      <ul className="space-y-3 text-lg font-medium">
  <li className="flex items-center gap-2">
    <span className="w-2.5 h-2.5 bg-green-600 rounded-full"></span>
    <a href="#intro" className="hover:text-green-600 transition">
      Introduction
    </a>
  </li>

  <li className="flex items-center gap-2">
    <span className="w-2.5 h-2.5 bg-green-600 rounded-full"></span>
    <a href="#acceptance" className="hover:text-green-600 transition">
      Acceptance of Terms
    </a>
  </li>

  <li className="flex items-center gap-2">
    <span className="w-2.5 h-2.5 bg-green-600 rounded-full"></span>
    <a href="#definitions" className="hover:text-green-600 transition">
      Definitions
    </a>
  </li>

  <li className="flex items-center gap-2">
    <span className="w-2.5 h-2.5 bg-green-600 rounded-full"></span>
    <a href="#eligibility" className="hover:text-green-600 transition">
      Eligibility
    </a>
  </li>

  <li className="flex items-center gap-2">
    <span className="w-2.5 h-2.5 bg-green-600 rounded-full"></span>
    <a href="#buyer" className="hover:text-green-600 transition">
      Buyer Terms
    </a>
  </li>
 <li className="flex items-center gap-2">
    <span className="w-2.5 h-2.5 bg-green-600 rounded-full"></span>
    <a href="#vendor" className="hover:text-green-600 transition">
      Vendor Terms and Conditions
    </a>
  </li>
  <li className="flex items-center gap-2">
    <span className="w-2.5 h-2.5 bg-green-600 rounded-full"></span>
    <a href="#general" className="hover:text-green-600 transition">
      General Terms
    </a>
  </li>
</ul> </div>

          {/* Main Content */}
        <div className="md:col-span-3 space-y-6 text-sm text-gray-600 overflow-y-auto pr-4">
            <section id="intro">
             <h2 className="font-semibold text-xl text-gray-900 mb-3">Introduction</h2>
              <p>
                This application is owned and operated by Agrowmart Naturals
                India Private Limited having its registered office at Baner,
                Pune, Maharashtra. The application operates as an online
                platform engaged in the sale and facilitation of agricultural
                products, natural products, farm inputs and allied services.
              </p>
            </section>

            <section id="acceptance">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">Acceptance of Terms</h2>
              <p>
                By accessing or using this application you agree to comply with
                these Terms and Conditions along with all related policies such
                as Privacy Policy, Payment Policy and Refund Policies.
              </p>
            </section>

            <section id="definitions">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">Definitions</h2>
              <p>
                Buyer means any person purchasing products. Vendor or Seller
                means any entity listing products for sale. Products refer to
                goods listed on the platform and Services include any services
                provided through the application.
              </p>
            </section>

            <section id="eligibility">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">Eligibility</h2>
              <p>
                Users must be at least 18 years of age and capable of entering
                into legally binding contracts under Indian law.
              </p>
            </section>

            <section id="buyer">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
  Buyer Terms
</h2>

              <h3 className="font-semibold mt-4">Buyer Account</h3>
              <p>
                Buyers may be required to create an account and are responsible
                for maintaining the confidentiality of their account details.
              </p>

              <h3 className="font-semibold mt-4">
                Product Information and Description
              </h3>
              <p>
                Agrowmart strives to provide accurate descriptions and images
                but actual products may vary.
              </p>

              <h3 className="font-semibold mt-4">Pricing and Taxes</h3>
              <p>
                Prices are displayed in Indian Rupees and may be subject to
                applicable taxes such as GST.
              </p>

              <h3 className="font-semibold mt-4">Orders and Payment</h3>
              <p>
                Orders are confirmed only after successful payment and dispatch
                confirmation.
              </p>

              <h3 className="font-semibold mt-4">Shipping and Delivery</h3>
              <p>
                Delivery timelines may vary depending on location and product
                availability.
              </p>

              <h3 className="font-semibold mt-4">
                Returns, Refunds and Replacements
              </h3>
              <p>
                Products are generally non-returnable unless delivered damaged
                or materially different from the description.
              </p>

              <h3 className="font-semibold mt-4"> Buyer Obligations</h3>
              <p>
                Buyers agree to use the platform lawfully and provide accurate
                information while placing orders.
              </p>
            </section>

            <section id="vendor">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
  Vendor Terms and Conditions
</h2>
              <h3 className="font-semibold mt-4">Vendor Registration</h3>
              <p>
                Vendors must provide accurate business information including
                PAN, GST details and bank information.
              </p>

              <h3 className="font-semibold mt-4">Vendor Responsibilities</h3>
              <p>
                Vendors are responsible for ensuring product quality, legality
                and compliance with applicable laws.
              </p>

              <h3 className="font-semibold mt-4">
                Product Listing and Pricing
              </h3>
              <p>
                Vendors must provide accurate product descriptions, pricing and
                images.
              </p>

              <h3 className="font-semibold mt-4">Order Fulfilment</h3>
              <p>
                Vendors must ensure timely packaging, dispatch and delivery of
                orders.
              </p>

              <h3 className="font-semibold mt-4">Vendor Payouts</h3>
              <p>
                Vendor payments will be settled after successful product
                delivery subject to applicable commissions and deductions.
              </p>

              <h3 className="font-semibold mt-4">
                Returns and Vendor Disputes
              </h3>
              <p>
                Vendors must cooperate with Agrowmart to resolve disputes and
                return claims.
              </p>
            </section>

            <section id="general">
             <h2 className="font-semibold text-xl text-gray-900 mb-3">General Terms</h2>

              <h3 className="font-semibold mt-4">Intellectual Property</h3>
              <p>
                All content including logos, text and software belongs to
                Agrowmart and is protected under intellectual property laws.
              </p>

              <h3 className="font-semibold mt-4">Third-Party Links</h3>
              <p>
                The application may contain links to third-party websites and
                Agrowmart is not responsible for their content.
              </p>

              <h3 className="font-semibold mt-4">Disclaimer of Warranties</h3>
              <p>
                The application is provided on an “as is” basis without any
                warranties.
              </p>

              <h3 className="font-semibold mt-4">Limitation of Liability</h3>
              <p>
                Agrowmart will not be liable for indirect or consequential
                damages arising from use of the application.
              </p>

              <h3 className="font-semibold mt-4">Indemnity</h3>
              <p>
                Users agree to indemnify Agrowmart from claims arising from
                misuse of the application.
              </p>

              <h3 className="font-semibold mt-4">
                Governing Law and Jurisdiction
              </h3>
              <p>
                These terms are governed by the laws of India and disputes will
                fall under the jurisdiction of Pune courts.
              </p>

              <h3 className="font-semibold mt-4">Force Majeure</h3>
              <p>
                Agrowmart shall not be liable for delays caused by events beyond
                reasonable control.
              </p>

              <h3 className="font-semibold mt-4">Termination</h3>
              <p>
                Agrowmart may suspend or terminate user access if these terms
                are violated.
              </p>

              <h3 className="font-semibold mt-4">Entire Agreement</h3>
              <p>
                These terms constitute the complete agreement between Agrowmart
                and the user.
              </p>
            </section>

            {/* Buttons */}
         <div className="flex gap-4 pt-6 items-center justify-center sticky bottom-0 bg-white py-4 border-t">
  <button
    onClick={handleAccept}
    disabled={accepted}
    className={`px-8 py-3 text-lg rounded-xl text-white font-medium shadow-md transition ${
      accepted ? "bg-green-700" : "bg-green-600 hover:bg-green-700"
    }`}
  >
    {accepted ? "✔ Accepted" : "Accept Terms"}
  </button>

  <button
    onClick={() => window.print()}
    className="px-8 py-3 text-lg rounded-xl border border-gray-300 font-medium hover:bg-gray-100 transition"
  >
    Print PDF
  </button>
</div>
          </div>
        </div>
      </div>
    </div>
  );
}