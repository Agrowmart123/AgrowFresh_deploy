import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Check,
  Clock,
  Package,
  Truck,
  ShieldCheck,
  X,
  ChevronRight,
  Copy,
  CheckCheck,
  AlertTriangle,
  RefreshCw,
  MapPin,
  Phone,
} from "lucide-react";

// ── Simulate vendor confirmation after 15 seconds ─────────────────────────
const VENDOR_CONFIRM_DELAY_MS = 15_000;

function generateOrderId() {
  return "ORD-" + Date.now().toString().slice(-6);
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const CANCEL_REASONS = [
  "I changed my mind",
  "I ordered by mistake",
  "Delivery time is too long",
  "I found a better price elsewhere",
  "I want to change the delivery address",
  "Other",
];

// ── Step indicator ─────────────────────────────────────────────────────────
function StepDot({ done, active, label, icon: Icon }) {
  return (
    <div className="flex flex-col items-center gap-1.5 flex-1">
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
          done
            ? "bg-[#68911a]"
            : active
              ? "bg-lime-500 border-lime-500 animate-pulse"
              : "bg-white border-gray-200"
        }`}
      >
        {done ? (
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        ) : (
          <Icon
            className={`w-4 h-4 ${active ? "text-white" : "text-gray-300"}`}
          />
        )}
      </div>
      <p
        className={`text-[10px] font-black text-center leading-tight ${done ? "text-[#68911a]" : active ? "text-lime-600" : "text-gray-300"}`}
      >
        {label}
      </p>
    </div>
  );
}

function StepLine({ done }) {
  return (
    <div className="flex-1 h-0.5 mb-5 mx-1 rounded-full overflow-hidden bg-gray-200">
      <div
        className={`h-full rounded-full transition-all duration-700 ${done ? "bg-[#68911a] w-full" : "w-0"}`}
      />
    </div>
  );
}

// ── OTP Card ──────────────────────────────────────────────────────────────
function OTPCard({ otp }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard?.writeText(otp).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className="bg-[#68911a] rounded-2xl p-5 shadow-lg">
      <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
        Delivery Confirmation Code
      </p>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {otp.split("").map((d, i) => (
            <div
              key={i}
              className="w-10 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white text-xl font-black backdrop-blur-sm border border-white/30"
            >
              {d}
            </div>
          ))}
        </div>
        <button
          onClick={copy}
          className="ml-3 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
        >
          {copied ? (
            <CheckCheck className="w-4 h-4 text-white" />
          ) : (
            <Copy className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
      <p className="text-white/70 text-xs font-semibold mt-3 leading-relaxed">
        Share this 6-digit code{" "}
        <strong className="text-white">only with the delivery person</strong>{" "}
        when your order arrives. Do not share with anyone else.
      </p>
    </div>
  );
}

// ── Cancel confirm modal ──────────────────────────────────────────────────
function CancelModal({ onConfirm, onClose }) {
  const [selected, setSelected] = useState(null);
  const [otherText, setOtherText] = useState("");
  const [error, setError] = useState("");

  function handleConfirm() {
  if (!selected) return;
  if (selected === "Other" && !otherText.trim()) return;
  onConfirm(selected === "Other" ? otherText.trim() : selected);
}

return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl max-h-[95vh] overflow-hidden">
        <div className="p-6 pb-4 flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-lg font-black text-gray-800 text-center">
            Cancel Order?
          </h3>
          <p className="text-sm text-gray-500 text-center mt-1.5 font-semibold">
            Please tell us why you're cancelling. A full refund will be
            initiated within 3–5 business days.
          </p>
        </div>

        <div
          className="px-6 overflow-y-auto space-y-2 pb-2"
          style={{ maxHeight: "340px" }}
        >
          {CANCEL_REASONS.map((reason) => (
            <button
              key={reason}
              onClick={() => {
                setSelected(reason);
                setError("");
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                selected === reason
                  ? "border-red-400 bg-red-50"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  selected === reason
                    ? "border-red-500 bg-red-500"
                    : "border-gray-300"
                }`}
              >
                {selected === reason && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span
                className={`text-sm font-bold ${selected === reason ? "text-red-700" : "text-gray-700"}`}
              >
                {reason}
              </span>
            </button>
          ))}

          {selected === "Other" && (
            <textarea
              value={otherText}
              onChange={(e) => {
                setOtherText(e.target.value);
                setError("");
              }}
              placeholder="Please describe your reason…"
              rows={3}
              className="w-full border-2 border-gray-200 focus:border-red-400 rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-colors resize-none mt-1"
            />
          )}

          {/* {error && (
            <p className="text-xs text-red-500 font-bold px-1">{error}</p>
          )} */}
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-black text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Keep Order
          </button>
          <button
            onClick={onConfirm}
            disabled={!selected || (selected === "Other" && !otherText.trim())}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-black text-white transition-colors"
          >
            Yes, Cancel
          </button>
        </div>
        {!selected && (
          <p className="text-xs text-red-400 font-bold px-1 py-1 text-center">
            ⚠ Please select a reason to cancel your order.
          </p>
        )}
        {selected === "Other" && !otherText.trim() && (
          <p className="text-xs text-red-400 font-bold px-1 py-1 text-center">
            ⚠ Please describe your reason before cancelling.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────
export default function OrderStatus() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const billTotal = Number(state.total ?? 0);

  // Persisted order identity
  const [orderId] = useState(generateOrderId);
  const [otp] = useState(generateOTP);

  // Flow state
  // "pending"   → order placed, waiting vendor
  // "confirmed" → vendor confirmed
  // "cancelled" → user cancelled
  const [status, setStatus] = useState("pending");
  const [showCancel, setShowCancel] = useState(false);
  const [countdown, setCountdown] = useState(
    Math.ceil(VENDOR_CONFIRM_DELAY_MS / 1000),
  );

  // Simulate vendor confirming after delay
  useEffect(() => {
    if (status !== "pending") return;

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          setStatus("confirmed");
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  function handleCancel() {
    setStatus("cancelled");
    setShowCancel(false);
  }

  const isConfirmed = status === "confirmed";
  const isCancelled = status === "cancelled";
  const isPending = status === "pending";

  return (
    <div
      className="min-h-screen bg-[#f3f7f0]"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <h1 className="text-lg font-black text-gray-800">Order Status</h1>
          <span className="ml-auto text-xs font-bold text-gray-400">
            {orderId}
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4 pb-28">
        {/* ── Step progress bar ── */}
        {!isCancelled && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-5">
            <div className="flex items-end">
              <StepDot done={true} active={false} label="Placed" icon={Check} />
              <StepLine done={true} />
              <StepDot
                done={isConfirmed}
                active={isPending}
                label="Confirmed"
                icon={RefreshCw}
              />
              <StepLine done={isConfirmed} />
              <StepDot
                done={false}
                active={isConfirmed}
                label="Shipped"
                icon={Truck}
              />
              <StepLine done={false} />
              <StepDot
                done={false}
                active={false}
                label="Delivered"
                icon={Package}
              />
            </div>
          </div>
        )}

        {/* ── Status card ── */}
        {isCancelled ? (
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-500 px-5 py-6 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <X className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-black text-white">
                  Order Cancelled
                </h2>
                <p className="text-white/80 text-sm mt-1 font-semibold">
                  Your order has been successfully cancelled.
                </p>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                <p className="text-sm font-black text-red-800 mb-1">
                  Refund Information
                </p>
                <p className="text-xs font-semibold text-red-700">
                  ₹{billTotal.toLocaleString()} will be refunded to your
                  original payment method within{" "}
                  <strong>3–5 business days</strong>.
                </p>
              </div>
              <button
                onClick={() => navigate("/")}
                className="w-full py-3.5 bg-gray-800 hover:bg-gray-900 text-white font-black rounded-xl transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : isPending ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 to-orange-400 px-5 py-6 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Clock
                  className="w-8 h-8 text-white animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-black text-white">Order Placed!</h2>
                <p className="text-white/90 text-sm mt-1 font-semibold">
                  Your order has been placed successfully.
                </p>
                <p className="text-white/70 text-xs mt-1">
                  Waiting for vendor confirmation…
                </p>
              </div>
              {/* Countdown pill */}
              <div className="bg-white/20 border border-white/30 rounded-full px-4 py-1.5 flex items-center gap-2">
                <RefreshCw className="w-3 h-3 text-white animate-spin" />
                <p className="text-white text-xs font-black">
                  Confirming in {countdown}s
                </p>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                <p className="text-sm font-black text-amber-800 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> Confirmation Pending
                </p>
                <p className="text-xs font-semibold text-amber-700 mt-1">
                  The vendor is reviewing your order. You'll receive
                  confirmation shortly. You can cancel your order while it's
                  pending.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-semibold">
                    Amount Paid
                  </p>
                  <p className="text-xl font-black text-gray-900">
                    ₹{billTotal.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-semibold">
                    Order ID
                  </p>
                  <p className="text-sm font-black text-gray-700">{orderId}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ── CONFIRMED ── */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-[#68911a] px-5 py-6 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-black text-white">
                  Order Confirmed! 🎉
                </h2>
                <p className="text-white/90 text-sm mt-1 font-semibold">
                  Your order has been confirmed by the vendor.
                </p>
                <p className="text-white/70 text-xs mt-1">
                  Estimated delivery: 2–7 business days
                </p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-semibold">
                    Amount Paid
                  </p>
                  <p className="text-xl font-black text-gray-900">
                    ₹{billTotal.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 font-semibold">
                    Order ID
                  </p>
                  <p className="text-sm font-black text-gray-700">{orderId}</p>
                </div>
              </div>

              {/* OTP */}
              <OTPCard otp={otp} />

              {/* Delivery info */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <Truck className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-blue-700">
                  Your delivery person will ask for the 6-digit code above when
                  they arrive. Only share it at the time of delivery.
                </p>
              </div>

              {/* Delivery address */}
              <div className="border border-gray-100 rounded-xl p-4 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-lime-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-black text-gray-600 uppercase tracking-wide mb-0.5">
                    Delivering to
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    142 Elm Street, Karve Nagar, Pune 411052
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Cancel section (only when pending) ── */}
        {isPending && (
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm font-black text-gray-700 mb-1">
              Need to cancel?
            </p>
            <p className="text-xs text-gray-400 font-semibold mb-4">
              You can cancel your order until the vendor confirms it. Once
              confirmed, cancellation is disabled.
            </p>
            <button
              onClick={() => setShowCancel(true)}
              className="w-full py-3 border-2 border-red-200 text-red-500 font-black text-sm rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" /> Cancel Order
            </button>
          </section>
        )}

        {/* ── Cancellation disabled notice (confirmed) ── */}
        {isConfirmed && (
          <section className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <p className="text-xs font-semibold text-gray-400">
              Cancellation is no longer available as the vendor has confirmed
              your order.
            </p>
          </section>
        )}

        {/* ── Back to home ── */}
        {!isCancelled && (
          <button
            onClick={() => navigate("/")}
            className="w-full py-3.5 bg-[#68911a] hover:bg-lime-600 text-white font-black rounded-2xl shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" /> Continue Shopping
          </button>
        )}
      </main>

      {/* Cancel modal */}
      {showCancel && (
        <CancelModal
          onConfirm={handleCancel}
          onClose={() => setShowCancel(false)}
        />
      )}
    </div>
  );
}