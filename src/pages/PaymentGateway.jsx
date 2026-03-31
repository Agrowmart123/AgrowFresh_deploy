import React, { useState } from "react";
import {
  CreditCard,
  Smartphone,
  Banknote,
  Gift,
  BarChart2,
  ShieldCheck,
  ChevronRight,
  Check,
  Lock,
  ArrowLeft,
  Zap,
  Tag,
} from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const PAYMENT_METHODS = [
  {
    id: "card",
    label: "Credit / Debit Card",
    sub: "Visa, Mastercard, RuPay & more",
    icon: CreditCard,
  },
  {
    id: "upi",
    label: "UPI",
    sub: "GPay, PhonePe, Paytm & more",
    icon: Smartphone,
  },
  {
    id: "gift",
    label: "Gift Card",
    sub: "Redeem your gift voucher",
    icon: Gift,
  },
];

const UPI_APPS = [
  {
    id: "gpay",
    name: "Google Pay",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg",
  },
  {
    id: "phonepe",
    name: "PhonePe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png",
  },
  {
    id: "paytm",
    name: "Paytm",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Paytm_Logo_%28standalone%29.svg",
  },
];

const BILL = {
  mrp: 14479,
  itemDiscount: 9268,
  coupon: 160,
  savingsExtra: 100,
  platform: 7,
  delivery: 0,
  total: 4958,
  advance: 247,
};

export default function PaymentGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedTotal = location.state?.total;
  const state = location.state || {};
  const total = Number(state.total ?? 0);
  const mrpTotal = Number(state.mrpTotal ?? 0);
  const itemDiscount = Number(state.itemDiscount ?? 0);
  const dealDiscount = Number(state.dealDiscount ?? 0);
  const deliveryFee = Number(state.deliveryFee ?? 0);

  const billTotal = total;
  const [method, setMethod] = useState("card");
  const [upiApp, setUpiApp] = useState(null);
  const [upiId, setUpiId] = useState("");
  const [cardNo, setCardNo] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [paid, setPaid] = useState(false);
  const [emiBank, setEmiBank] = useState(null);
  const [giftCode, setGiftCode] = useState("");
  const [giftPin, setGiftPin] = useState("");

  function formatCard(val) {
    return val
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  }
  function formatExpiry(val) {
    const clean = val.replace(/\D/g, "").slice(0, 4);
    return clean.length >= 3 ? clean.slice(0, 2) + "/" + clean.slice(2) : clean;
  }

  const savings =
    BILL.itemDiscount +
    BILL.coupon +
    BILL.savingsExtra +
    (BILL.delivery === 0 ? 40 : 0);

  if (paid) {
    return (
      <div className="min-h-screen bg-lime-50 flex flex-col items-center justify-center gap-5 px-4 font-[Nunito,sans-serif]">
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
          <Check className="w-10 h-10 text-emerald-500" strokeWidth={3} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-800">
            Payment Successful!
          </h2>
          <p className="text-gray-500 mt-1.5 text-sm">
            Your order has been placed.
          </p>
          <p className="text-lime-600 font-bold mt-1 text-sm">
            Order #ORD-{Date.now().toString().slice(-6)}
          </p>
        </div>
        <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100 text-center">
          <p className="text-sm text-gray-500">Amount Paid</p>
          <p className="text-3xl font-black text-gray-900 mt-1">
            ₹{billTotal.toLocaleString()}
          </p>
          {itemDiscount + dealDiscount > 0 && (
            <p className="text-xs font-black text-lime-700">
              🎉 You save ₹
              {(
                itemDiscount +
                dealDiscount +
                (deliveryFee === 0 ? 40 : 0)
              ).toLocaleString()}{" "}
              on this order!
            </p>
          )}
        </div>
        <button
          onClick={() => setPaid(false)}
          className="px-8 py-3 bg-lime-500 text-white font-black rounded-full shadow-lg hover:bg-lime-600 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f7f0] font-[Nunito,sans-serif]">
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-black text-gray-800">Complete Payment</h1>
          <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-gray-400">
            <Lock className="w-3.5 h-3.5 text-[#68911a]" /> 100% Secure
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="grid lg:grid-cols-3 gap-5">
          {/* ── LEFT: Method list + form ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Instant discount banner */}
            <div className="bg-[#68911a] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
              <Zap className="w-5 h-5 text-white flex-shrink-0" />
              <div>
                <p className="text-white font-black text-sm">
                  10% instant discount available!
                </p>
                <p className="text-white/80 text-xs">
                  Use select cards or UPI to claim this offer
                </p>
              </div>
            </div>

            {/* Method selector + form panel */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex">
                {/* Method tabs */}
                <div className="w-44 flex-shrink-0 border-r border-gray-100">
                  {PAYMENT_METHODS.map((m) => {
                    const Icon = m.icon;
                    const active = method === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        className={`w-full text-left px-3 py-3.5 border-b border-gray-50 transition-all flex items-start gap-2.5 ${
                          active
                            ? "bg-lime-50 border-l-4 border-l-[#68911a]"
                            : "hover:bg-gray-50 border-l-4 border-l-transparent"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${active ? "text-[#68911a]" : "text-gray-400"}`}
                        />
                        <div>
                          <p
                            className={`text-xs font-black leading-tight ${active ? "text-[#68911a]" : "text-gray-700"}`}
                          >
                            {m.label}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">
                            {m.sub}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Form panel */}
                <div className="flex-1 p-5">
                  {/* ── CARD ── */}
                  {method === "card" && (
                    <div className="space-y-4">
                      <p className="text-xs text-gray-400 font-semibold">
                        Secured by RBI guidelines · 256-bit encryption
                      </p>

                      {/* Card preview */}
                      <div className="h-32 rounded-2xl bg-[#68911a] p-4 shadow-lg flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                            Debit Card
                          </p>
                          <CreditCard className="w-5 h-5 text-white/70" />
                        </div>
                        <div>
                          <p className="text-white font-black tracking-[0.15em] text-sm">
                            {cardNo || "XXXX XXXX XXXX XXXX"}
                          </p>
                          <div className="flex gap-6 mt-1">
                            <p className="text-white/70 text-xs">
                              {cardName || "CARD HOLDER"}
                            </p>
                            <p className="text-white/70 text-xs">
                              {expiry || "MM/YY"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <input
                        value={cardNo}
                        onChange={(e) => setCardNo(formatCard(e.target.value))}
                        placeholder="Card Number"
                        className="w-full border-2 border-gray-200 focus:border-lime-400 rounded-xl px-4 py-3 text-sm font-bold outline-none transition-colors tracking-widest"
                      />
                      <input
                        value={cardName}
                        onChange={(e) =>
                          setCardName(e.target.value.toUpperCase())
                        }
                        placeholder="Name on Card"
                        className="w-full border-2 border-gray-200 focus:border-lime-400 rounded-xl px-4 py-3 text-sm font-bold outline-none transition-colors"
                      />
                      <div className="flex gap-3">
                        <input
                          value={expiry}
                          onChange={(e) =>
                            setExpiry(formatExpiry(e.target.value))
                          }
                          placeholder="MM / YY"
                          className="flex-1 border-2 border-gray-200 focus:border-lime-400 rounded-xl px-4 py-3 text-sm font-bold outline-none transition-colors"
                        />
                        <input
                          value={cvv}
                          onChange={(e) =>
                            setCvv(
                              e.target.value.replace(/\D/g, "").slice(0, 3),
                            )
                          }
                          placeholder="CVV"
                          type="password"
                          className="flex-1 border-2 border-gray-200 focus:border-lime-400 rounded-xl px-4 py-3 text-sm font-bold outline-none transition-colors"
                        />
                      </div>
                      <button
                        // onClick={() => setPaid(true)}
                        // Replace: onClick={() => setPaid(true)}
                        onClick={() =>
                          navigate("/order-status", {
                            state: { total: billTotal },
                          })
                        }
                        className="w-full py-3.5 bg-[#68911a] hover:bg-lime-600 active:scale-[0.98] text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Lock className="w-4 h-4" /> Pay ₹
                        {billTotal.toLocaleString()}
                      </button>
                    </div>
                  )}

                  {/* ── UPI ── */}
                  {method === "upi" && (
                    <div className="space-y-4">
                      <p className="text-sm font-black text-gray-700">
                        Choose UPI App
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {UPI_APPS.map((app) => (
                          <button
                            key={app.id}
                            onClick={() => setUpiApp(app.id)}
                            className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                              upiApp === app.id
                                ? "border-lime-400 bg-lime-50"
                                : "border-gray-100 hover:border-lime-200"
                            }`}
                          >
                            <img
                              src={app.logo}
                              alt={app.name}
                              className="h-8 object-contain"
                            />
                            {/* <p className="text-xs font-bold text-gray-700">{app.name}</p> */}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200" />
                        <p className="text-xs text-gray-400 font-bold">OR</p>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      <div>
                        <label className="text-xs font-black text-gray-600 mb-1.5 block">
                          Enter UPI ID
                        </label>
                        <div className="flex gap-2">
                          <input
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="yourname@upi"
                            className="flex-1 border-2 border-gray-200 focus:border-lime-400 rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-colors"
                          />
                          <button className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-black rounded-xl transition-colors">
                            Verify
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => setPaid(true)}
                        className="w-full py-3.5 bg-[#68911a] hover:bg-lime-600 text-white font-black rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Lock className="w-4 h-4" /> Pay ₹
                        {billTotal.toLocaleString()}
                      </button>
                    </div>
                  )}

                  {/* ── GIFT CARD ── */}
                  {method === "gift" && (
                    <div className="space-y-4">
                      <div className="bg-pink-50 border border-pink-100 rounded-xl p-3 flex items-center gap-2">
                        <Gift className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <p className="text-xs font-semibold text-pink-700">
                          Up to 15 gift cards can be added per transaction
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-black text-gray-600 mb-1.5 block">
                          Voucher Number
                        </label>
                        <input
                          value={giftCode}
                          onChange={(e) =>
                            setGiftCode(e.target.value.toUpperCase())
                          }
                          placeholder="XXXX-XXXX-XXXX-XXXX"
                          className="w-full border-2 border-gray-200 focus:border-lime-400 rounded-xl px-4 py-3 text-sm font-bold outline-none transition-colors tracking-widest"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-gray-600 mb-1.5 block">
                          Voucher PIN
                        </label>
                        <input
                          value={giftPin}
                          onChange={(e) =>
                            setGiftPin(
                              e.target.value.replace(/\D/g, "").slice(0, 6),
                            )
                          }
                          placeholder="6-digit PIN"
                          type="password"
                          className="w-full border-2 border-gray-200 focus:border-lime-400 rounded-xl px-4 py-3 text-sm font-bold outline-none transition-colors"
                        />
                      </div>
                      <button
                        onClick={() => setPaid(true)}
                        className="w-full py-3.5 bg-[#68911a] hover:bg-lime-600 text-white font-black rounded-xl shadow-lg transition-all"
                      >
                        Redeem & Pay
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Price summary ── */}
          <div className="space-y-4">
            {/* Bill summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#68911a]" />
                <span className="text-sm font-black text-gray-700 uppercase tracking-wide">
                  Price Summary
                </span>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">MRP Total</span>
                  <span className="text-gray-400 line-through">
                    ₹{mrpTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">
                    Item Discount
                  </span>
                  <span className="text-[#68911a] font-bold">
                    − ₹{itemDiscount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">
                    Coupon Discount
                  </span>
                  <span className="text-[#68911a] font-bold">
                    − ₹{dealDiscount.toLocaleString()}
                  </span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">
                    Buy More Save More
                  </span>
                  <span className="text-[#68911a] font-bold">
                    − ₹{BILL.savingsExtra}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">
                    Platform Fee
                  </span>
                  <span className="text-gray-700 font-bold">
                    ₹{BILL.platform}
                  </span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-gray-500 font-semibold">Delivery</span>
                  <span className="text-[#68911a] font-bold">
                    ₹{deliveryFee}
                  </span>
                </div>
                <div className="border-t-2 border-dashed border-gray-200 pt-3 flex justify-between">
                  <span className="font-black text-gray-800">Total</span>
                  <span className="font-black text-gray-900 text-xl">
                    ₹{billTotal.toLocaleString()}
                  </span>
                </div>
                {itemDiscount + dealDiscount > 0 && (
                  <div className="bg-lime-50 border border-lime-100 rounded-xl px-3 py-2 text-center">
                    <p className="text-xs font-black text-[#68911a]">
                      🎉 You save ₹
                      {(
                        itemDiscount +
                        dealDiscount +
                        (deliveryFee === 0 ? 40 : 0)
                      ).toLocaleString()}{" "}
                      on this order!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Security badge */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-[#68911a] flex-shrink-0" />
              <div>
                <p className="text-sm font-black text-gray-800">
                  Safe & Secure Payments
                </p>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                  256-bit SSL encryption · PCI-DSS compliant
                </p>
              </div>
            </div>

            {/* Instant discount offer */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-sm font-black text-amber-800 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" /> 10% Instant Discount
              </p>
              <p className="text-xs text-amber-700 mt-1 font-semibold">
                Available on select credit cards & UPI payments. Applied
                automatically at checkout.
              </p>
              <button className="mt-2 text-xs font-black text-amber-600 flex items-center gap-1 hover:underline">
                View eligible cards <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}