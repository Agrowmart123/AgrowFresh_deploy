import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="bg-gray-100 min-h-screen p-6 scroll-smooth">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">

        {/* Header */}
        <h1 className="text-2xl font-bold text-green-600">
          Privacy Policy
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          Agrowmart Naturals India Private Limited
        </p>

        <div className="grid md:grid-cols-4 gap-6 h-[75vh]">

          {/* Sidebar */}
          <div className="bg-gray-50 border rounded-lg p-4 h-fit sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>

            <ul className="space-y-3 text-lg font-medium">

              {[
                ["intro", "Introduction"],
                ["definitions", "Definitions"],
                ["age", "Permissible Age"],
                ["data", "Personal Data Collected"],
                ["purpose", "Purpose of Processing"],
                ["sharing", "Disclosure"],
                ["storage", "Data Storage"],
                ["exports", "Export Operations"],
                ["growth", "Business Growth"],
                ["partnership", "Strategic Partnerships"],
                ["security", "Data Security"],
                ["rights", "Your Rights"],
                ["thirdparty", "Third-Party Services"],
                ["changes", "Policy Changes"],
                ["contact", "Contact Information"],
              ].map(([id, title]) => (
                <li key={id} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-600 rounded-full"></span>
                  <a href={`#${id}`} className="hover:text-green-600 transition">
                    {title}
                  </a>
                </li>
              ))}

            </ul>
          </div>

          {/* Scrollable Content */}
          <div className="md:col-span-3 space-y-6 text-sm text-gray-600 overflow-y-auto pr-4">

            {/* Introduction */}
            <section id="intro">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
                Introduction and Applicability
              </h2>

              <p>
                Agrowmart Naturals India Private Limited ("Agrowmart", "Company",
                "we", "us", or "our"), having its registered office at Baner,
                Pune, Maharashtra, India, respects your privacy and is committed
                to protecting your personal data.
              </p>

              <p className="mt-3">
                This Privacy Policy explains what information we collect, why we
                collect it, how we use it, how long we retain it, and the rights
                available to you when you access or use our websites,
                applications, mobile applications, platforms, products, and
                services.
              </p>

              <ul className="list-disc ml-6 mt-3 space-y-1">
                <li>Customers and end-users</li>
                <li>Business partners, dealers, distributors, and vendors</li>
                <li>Website and application visitors</li>
                <li>Individuals who communicate with us</li>
              </ul>
            </section>

            {/* Definitions */}
            <section id="definitions">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
                Definitions
              </h2>

              <ul className="list-disc ml-6 space-y-2">
                <li>
                  <b>Personal Data:</b> Data relating to an identifiable
                  individual.
                </li>
                <li>
                  <b>Sensitive Personal Data:</b> As defined under applicable
                  Indian law.
                </li>
                <li>
                  <b>Processing:</b> Collection, storage, use, disclosure or
                  deletion of personal data.
                </li>
                <li>
                  <b>User:</b> Any individual accessing our services.
                </li>
              </ul>
            </section>

            {/* Age */}
            <section id="age">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
                Permissible Age and Minors
              </h2>

              <p>
                Our services are intended only for individuals aged 18 years or
                above. If we discover that personal data belonging to a minor has
                been submitted without valid consent, we reserve the right to
                delete such information.
              </p>
            </section>

            {/* Personal Data */}
            <section id="data">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
                Categories of Personal Data Collected
              </h2>

              <h3 className="font-semibold mt-4">Information Provided by You</h3>
              <ul className="list-disc ml-6 space-y-1">
                <li>Name, email, phone number and address</li>
                <li>Login credentials and account information</li>
                <li>Business details like GST and PAN</li>
                <li>Feedback, reviews and communication</li>
              </ul>

              <h3 className="font-semibold mt-4">Transaction Information</h3>
              <p>
                Order details, billing information and payment transaction
                references. Payment information is processed through secure
                third-party gateways.
              </p>

              <h3 className="font-semibold mt-4">Automatically Collected Data</h3>
              <p>
                IP address, browser type, operating system, device identifiers
                and usage logs.
              </p>

              <h3 className="font-semibold mt-4">Cookies</h3>
              <p>
                Cookies help improve functionality, analytics and personalization.
              </p>
            </section>

            {/* Purpose */}
            <section id="purpose">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
                Purpose and Legal Basis of Processing
              </h2>

              <ul className="list-disc ml-6 space-y-1">
                <li>Operate and provide our services</li>
                <li>Process orders and transactions</li>
                <li>Improve platform performance</li>
                <li>Prevent fraud and misuse</li>
                <li>Comply with legal obligations</li>
                <li>Send marketing communications</li>
              </ul>
            </section>

            {/* Sharing */}
            <section id="sharing">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
                Disclosure and Sharing of Personal Data
              </h2>

              <p>
                We do not sell your personal data. Data may be shared with
                service providers, during corporate transactions, or where
                required by law.
              </p>
            </section>

            {/* Storage */}
            <section id="storage">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
                Data Storage and Retention
              </h2>

              <p>
                Personal data is stored on secure servers and retained only as
                long as necessary to fulfil the purposes described in this policy.
              </p>
            </section>

            {/* Export */}
            <section id="exports">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
                Export-Oriented Operations
              </h2>

              <p>
                Agrowmart may process limited personal or business data of
                international buyers and logistics partners for export
                documentation and regulatory compliance.
              </p>
            </section>

            {/* Growth */}
            <section id="growth">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
                Business Growth and Expansion
              </h2>

              <p>
                Personal data may be used for business planning, analytics,
                onboarding partners and scaling operations.
              </p>
            </section>

            {/* Partnerships */}
            <section id="partnership">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
                Strategic Partnerships and Investors
              </h2>

              <p>
                Limited information may be shared with investors, auditors,
                consultants and certification bodies subject to confidentiality
                obligations.
              </p>
            </section>

            {/* Security */}
            <section id="security">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
                Data Security Measures
              </h2>

              <p>
                We implement administrative, technical and physical safeguards
                to protect personal data from unauthorized access or disclosure.
              </p>
            </section>

            {/* Rights */}
            <section id="rights">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
                Your Rights
              </h2>

              <ul className="list-disc ml-6 space-y-1">
                <li>Access and review personal data</li>
                <li>Request correction or deletion</li>
                <li>Withdraw consent</li>
                <li>Opt out of marketing</li>
              </ul>
            </section>

            {/* Third Party */}
            <section id="thirdparty">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
                Third-Party Websites
              </h2>

              <p>
                Our services may contain links to third-party websites. We are
                not responsible for their privacy practices.
              </p>
            </section>

            {/* Changes */}
            <section id="changes">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
                Changes to This Privacy Policy
              </h2>

              <p>
                We may update this policy periodically. Continued use of our
                services indicates acceptance of updated terms.
              </p>
            </section>

            {/* Contact */}
            <section id="contact">
              <h2 className="font-semibold text-xl text-gray-900 mb-3">
                Grievance Redressal and Contact Information
              </h2>

              <p>
                <b>Agrowmart Naturals India Private Limited</b>
                <br />
              Email: 
<a 
  href="mailto:contact@agrowmartindia.com" 
  className="text-green-600 hover:underline"
>
  contact@agrowmartindia.com
</a>        </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}