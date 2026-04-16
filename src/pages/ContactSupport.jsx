import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  Send,
  CheckCircle2,
  Clock,
  Package,
  RefreshCw,
  CreditCard,
  MapPin,
  ShoppingBag,
  Headphones,
} from "lucide-react";

const faqs = [
  {
    category: "Orders",
    icon: Package,
    color: "text-amber-500",
    bg: "bg-amber-50",
    items: [
      {
        q: "How do I track my order?",
        a: "Go to My Orders from your profile. Each order shows a real-time status — Processing, Shipped, or Delivered. You'll also receive SMS/push updates at every step.",
      },
      {
        q: "Can I cancel or modify my order?",
        a: "Orders can be cancelled within 10 minutes of placing them. After that, please contact our support team. Modifications (quantity, address) are possible only before dispatch.",
      },
      {
        q: "What if an item is missing from my order?",
        a: "Take a photo and raise a ticket via 'Report an Issue' below. We'll resolve it within 24 hours with a replacement or refund.",
      },
    ],
  },
  {
    category: "Payments & Wallet",
    icon: CreditCard,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    items: [
      {
        q: "How do I add money to my AgrowFresh wallet?",
        a: "Go to My Wallet → Add Money. We support UPI, debit/credit cards, and net banking. Money reflects instantly in most cases.",
      },
      {
        q: "My payment failed but money was deducted. What now?",
        a: "Don't worry — failed payment refunds are automatically processed within 5–7 business days back to your original payment method.",
      },
      {
        q: "How do cashback rewards work?",
        a: "Cashback is credited to your AgrowFresh wallet within 48 hours of a successful delivery. It can be used on your next order.",
      },
    ],
  },
  {
    category: "Delivery",
    icon: MapPin,
    color: "text-blue-500",
    bg: "bg-blue-50",
    items: [
      {
        q: "What are the delivery timings?",
        a: "We deliver 7 days a week, 7 AM – 9 PM. Express delivery slots (within 2 hours) are available in select areas.",
      },
      {
        q: "Why is my delivery delayed?",
        a: "Delays can occur due to high demand, weather, or traffic. You'll receive a notification if your order is delayed beyond the promised time.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    icon: RefreshCw,
    color: "text-rose-500",
    bg: "bg-rose-50",
    items: [
      {
        q: "Can I return fresh produce?",
        a: "Yes! If any item is damaged, spoiled, or not as described, raise a return request within 24 hours of delivery. We'll issue a full refund or replacement.",
      },
      {
        q: "How long does a refund take?",
        a: "Wallet refunds are instant. Bank/card refunds take 5–7 business days depending on your bank.",
      },
    ],
  },
];

const channels = [
  {
    icon: MessageCircle,
    label: "Live Chat",
    desc: "Chat with us right now",
    badge: "Online",
    badgeColor: "bg-emerald-100 text-emerald-700",
    action: "Start Chat",
    color: "from-emerald-500 to-green-600",
  },
  {
    icon: Phone,
    label: "Call Us",
    desc: "1800-123-AGROW (Toll Free)",
    badge: "9AM–9PM",
    badgeColor: "bg-blue-100 text-blue-700",
    action: "Call Now",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Mail,
    label: "Email",
    desc: "support@agrowfresh.in",
    badge: "~2hr reply",
    badgeColor: "bg-amber-100 text-amber-700",
    action: "Send Email",
    color: "from-amber-500 to-orange-500",
  },
];

const issueTypes = [
  { icon: Package, label: "Order Issue" },
  { icon: CreditCard, label: "Payment / Refund" },
  { icon: MapPin, label: "Delivery Problem" },
  { icon: ShoppingBag, label: "Product Quality" },
  { icon: RefreshCw, label: "Return Request" },
  { icon: Headphones, label: "Other" },
];

export default function ContactSupport() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [openCategory, setOpenCategory] = useState(0);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    orderId: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message || selectedIssue === null)
      return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-foreground leading-tight">
              Contact Support
            </h1>
            <p className="text-xs text-muted-foreground">
              We're here to help, 7 days a week
            </p>
          </div>
        </div>
      </header>

      <main className="container max-w-3xl mx-auto px-4 py-6 flex flex-col gap-8">
        {/* Hero banner */}
        <div
          className="relative rounded-2xl overflow-hidden p-6 text-white"
          style={{
            background:
              "linear-gradient(135deg, #14532d 0%, #16a34a 65%, #22c55e 100%)",
          }}
        >
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-16 w-24 h-24 rounded-full bg-orange-400/20" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Headphones className="w-5 h-5 text-green-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-green-300">
                24/7 Support
              </span>
            </div>
            <h2 className="text-2xl font-extrabold mb-1">
              How can we help you?
            </h2>
            <p className="text-sm text-white/70">
              Tell us your issue and we'll sort it out — fast.
            </p>
          </div>
        </div>

        {/* Quick contact channels */}
        <section>
          <h2 className="text-base font-extrabold text-foreground mb-3">
            Reach Us Instantly
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {channels.map((ch) => (
              <div
                key={ch.label}
                className="bg-card rounded-2xl border border-border p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ch.color} flex items-center justify-center shadow-sm`}
                  >
                    <ch.icon className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${ch.badgeColor}`}
                  >
                    {ch.badge}
                  </span>
                </div>
                <div>
                  <p className="font-extrabold text-sm text-foreground">
                    {ch.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {ch.desc}
                  </p>
                </div>
                <button
                  className={`w-full py-2 rounded-xl bg-gradient-to-r ${ch.color} text-white text-xs font-bold hover:opacity-90 transition-opacity`}
                >
                  {ch.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Response time banner */}
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-xs text-amber-800">
            <strong>Average response time:</strong> Live chat &lt;2 min · Phone
            &lt;5 min · Email &lt;2 hrs
          </p>
        </div>

        {/* Ticket form */}
        <section>
          <h2 className="text-base font-extrabold text-foreground mb-1">
            Raise a Support Ticket
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Can't find an answer? Submit a ticket and we'll get back to you.
          </p>

          {submitted ? (
            <div className="bg-card rounded-2xl border border-emerald-200 p-8 flex flex-col items-center gap-4 shadow-sm text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <div>
                <p className="font-extrabold text-foreground text-lg">
                  Ticket Raised!
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  We'll email you at <strong>{form.email}</strong> within 2
                  hours.
                </p>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", email: "", orderId: "", message: "" });
                  setSelectedIssue(null);
                }}
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity"
              >
                Raise Another
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-2xl border border-border p-5 shadow-sm flex flex-col gap-5"
            >
              {/* Issue type */}
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2 block">
                  Issue Type <span className="text-destructive">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {issueTypes.map((type, i) => (
                    <button
                      key={type.label}
                      type="button"
                      onClick={() => setSelectedIssue(i)}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-center transition-all duration-150 ${
                        selectedIssue === i
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      <type.icon className="w-4 h-4" />
                      <span className="text-xs font-bold leading-tight">
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Ravi Kumar"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Email <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="ravi@example.com"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Order ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Order ID{" "}
                  <span className="text-muted-foreground font-normal normal-case">
                    (optional)
                  </span>
                </label>
                <input
                  value={form.orderId}
                  onChange={(e) =>
                    setForm({ ...form, orderId: e.target.value })
                  }
                  placeholder="e.g. ORD-A1B2C3"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                  Describe your issue{" "}
                  <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Please describe what happened in as much detail as possible..."
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="self-end flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Ticket
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* Bottom note */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          AgrowFresh Support · Mon–Sun, 7 AM – 9 PM IST · support@agrowfresh.in
        </p>
      </main>
    </div>
  );
}
