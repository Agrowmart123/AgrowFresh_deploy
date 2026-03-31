import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Package, Truck,
  Tag, ShieldCheck, Clock, CheckCircle2,
  PackageCheck, Home, Box, RotateCcw, AlertTriangle
} from "lucide-react";
import { getOrderById } from "../services/ordersApi";

const RETURN_WINDOW_DAYS = 7;

// ─── Helpers ─────────────────────────────────────────────────────
const getReturnDaysLeft = (deliveryDate) => {
  if (!deliveryDate) return 0;
  const delivery  = new Date(deliveryDate);
  delivery.setHours(0, 0, 0, 0); // normalize to start of day
  const windowEnd = new Date(delivery);
  windowEnd.setDate(windowEnd.getDate() + RETURN_WINDOW_DAYS);
  const msLeft    = windowEnd.getTime() - Date.now();
  return Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
};
const isReturnEligible = (order) => {
  if (order?.status !== "Delivered") return false;
  return getReturnDaysLeft(order?.deliveryDate) > 0;
};

// ─── Status Badge ─────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Delivered:          { bg: "bg-[#f0f7e6]", text: "text-[#68911a]", dot: "bg-[#68911a]" },
    "Out for Delivery": { bg: "bg-amber-50",  text: "text-amber-600",  dot: "bg-amber-400" },
    Preparing:          { bg: "bg-blue-50",   text: "text-blue-500",   dot: "bg-blue-400"  },
  };
  const s = map[status] || map["Preparing"];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

// ─── Order Tracker ────────────────────────────────────────────────
const STEPS = [
  { key: "Placed",            label: "Order Placed",    sub: "We've received your order",    icon: CheckCircle2 },
  { key: "Packing",           label: "Packing",         sub: "Your items are being packed",  icon: Box          },
  { key: "Out for Delivery",  label: "Out for Delivery",sub: "On the way to your location",  icon: Truck        },
  { key: "Delivered",         label: "Delivered",       sub: "Order delivered successfully", icon: Home         },
];

const STATUS_INDEX = {
  Placed: 0, Preparing: 1, "Out for Delivery": 2, Delivered: 3,
};

const OrderTracker = ({ status }) => {
  const current = STATUS_INDEX[status] ?? 1;
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <PackageCheck className="w-4 h-4" style={{ color: "#68911a" }} />
        <span className="text-xs font-bold text-black uppercase tracking-wider">Order Tracker</span>
      </div>
      <div className="px-4 py-5">
        <div className="relative flex items-start justify-between">
          <div className="absolute top-[17px] left-[17px] right-[17px] h-0.5 bg-gray-100 z-0" />
          <div
            className="absolute top-[17px] left-[17px] h-0.5 z-0 transition-all duration-700"
            style={{ background: "#68911a", width: `${(current / (STEPS.length - 1)) * (100 - 34 / 4)}%` }}
          />
          {STEPS.map((step, i) => {
            const done = i < current, active = i === current, pending = i > current;
            const Icon = step.icon;
            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center gap-2" style={{ width: "25%" }}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${done    ? "border-[#68911a] bg-[#68911a]" : ""}
                  ${active  ? "border-[#68911a] bg-[#f0f7e6]" : ""}
                  ${pending ? "border-gray-200  bg-white"      : ""}
                `}>
                  <Icon className="w-4 h-4" style={{ color: done ? "#fff" : active ? "#68911a" : "#d1d5db" }} />
                </div>
                <div className="text-center px-1">
                  <p className={`text-[11px] font-bold leading-tight ${pending ? "text-gray-300" : "text-black"}`}>
                    {step.label}
                  </p>
                  {active && (
                    <span className="inline-flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#68911a] animate-pulse inline-block" />
                      <span className="text-[10px] text-gray-400">Now</span>
                    </span>
                  )}
                  {done && <span className="text-[10px]" style={{ color: "#68911a" }}>Done</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─── Return / Refund Banner ───────────────────────────────────────
const ReturnRefundBanner = ({ order, navigate }) => {
  const eligible  = isReturnEligible(order);
  const daysLeft  = getReturnDaysLeft(order?.deliveryDate);
  const isExpired = order?.status === "Delivered" && daysLeft === 0;

  // Not delivered yet — show nothing
  if (order?.status !== "Delivered") return null;

  if (eligible) {
    return (
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <RotateCcw className="w-4 h-4" style={{ color: "#68911a" }} />
          <span className="text-xs font-bold text-black uppercase tracking-wider">Return & Refund</span>
        </div>
        <div className="p-4">
          {/* Window indicator */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#f0f7e6] flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" style={{ color: "#68911a" }} />
              </div>
              <div>
                <p className="text-xs font-bold text-black">Return Window Open</p>
                <p className="text-[11px] text-gray-400">Valid for {RETURN_WINDOW_DAYS} days from delivery</p>
              </div>
            </div>
            {/* Days left pill */}
            <div className={`flex flex-col items-center px-3 py-1.5 rounded-xl shrink-0
              ${daysLeft <= 2 ? "bg-red-50" : "bg-[#f0f7e6]"}
            `}>
              <span className={`text-lg font-bold leading-tight ${daysLeft <= 2 ? "text-red-500" : ""}`}
                style={daysLeft > 2 ? { color: "#68911a" } : {}}>
                {daysLeft}
              </span>
              <span className={`text-[9px] font-bold uppercase ${daysLeft <= 2 ? "text-red-400" : "text-gray-400"}`}>
                days left
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-gray-100 rounded-full mb-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(daysLeft / RETURN_WINDOW_DAYS) * 100}%`,
                background: daysLeft <= 2 ? "#ef4444" : "#68911a",
              }}
            />
          </div>

          {daysLeft <= 2 && (
            <div className="flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2 mb-3">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <p className="text-xs text-red-500 font-semibold">
                Hurry! Return window expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/refund")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-xs font-bold hover:opacity-90 transition-opacity"
              style={{ background: "#68911a" }}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Return & Refund
            </button>
            <button
              onClick={() => navigate("/return-refund")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border-2 hover:bg-[#f0f7e6] transition-colors"
              style={{ borderColor: "#68911a", color: "#68911a" }}
            >
              <Package className="w-3.5 h-3.5" /> Replace Item
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Window expired
  if (isExpired) {
    return (
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-gray-300" />
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Return & Refund</span>
        </div>
        <div className="p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-gray-300" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-400">Return Window Closed</p>
            <p className="text-xs text-gray-300 mt-0.5">
              The 7-day return window for this order has expired.
            </p>
          </div>
          <span className="text-[11px] font-bold bg-gray-100 text-gray-400 px-2 py-1 rounded-full shrink-0">Expired</span>
        </div>
      </section>
    );
  }

  return null;
};

// ─── Main Component ───────────────────────────────────────────────
export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setOrder(getOrderById(id));
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4 animate-pulse">
        <div className="h-5 w-28 bg-gray-100 rounded-lg" />
        <div className="h-7 w-44 bg-gray-100 rounded-lg" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <div className="h-4 w-32 bg-gray-100 rounded" />
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-2/3 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-5xl mb-4">🔍</p>
        <p className="text-black font-bold text-lg mb-1">Order not found</p>
        <p className="text-sm text-gray-400 mb-6">We couldn't find this order.</p>
        <button
          onClick={() => navigate("/")}
          className="text-sm font-semibold px-5 py-2 rounded-full text-white"
          style={{ background: "#68911a" }}
        >
          ← Back to orders
        </button>
      </div>
    );
  }

  const { bill, address, items } = order;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-black tracking-tight">Order #{order.id}</h1>
            <p className="text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "short", year: "numeric",
              })}
            </p>
          </div>
          <StatusBadge status={order.status} />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-3 pb-16">

        {/* ORDER TRACKER */}
        <OrderTracker status={order.status} />

        {/* ── RETURN / REFUND BANNER ── */}
        <ReturnRefundBanner order={order} navigate={navigate} />

        {/* DELIVERY ADDRESS */}
        {address && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: "#68911a" }} />
              <span className="text-xs font-bold text-black uppercase tracking-wider">Delivery Address</span>
            </div>
            <div className="p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f0f7e6] flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" style={{ color: "#68911a" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[11px] font-bold bg-[#f0f7e6] text-[#68911a] px-2 py-0.5 rounded-full">
                    {address.label}
                  </span>
                  <span className="text-sm font-bold text-black">{address.name}</span>
                  <span className="text-xs text-gray-400">{address.phone}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {[address.line1, address.line2, address.city, address.state, address.pincode]
                    .filter(Boolean).join(", ")}
                </p>
                <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Estimated delivery: 2–7 business days
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ITEMS */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Package className="w-4 h-4" style={{ color: "#68911a" }} />
            <span className="text-xs font-bold text-black uppercase tracking-wider">
              Items Ordered ({items.length})
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map((item, i) => {
              const lineTotal = item.price * item.quantity;
              const saving    = item.mrp > item.price ? (item.mrp - item.price) * item.quantity : 0;
              const discPct   = item.mrp > item.price ? Math.round((1 - item.price / item.mrp) * 100) : 0;
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                  {item.image && (
                    <img src={item.image} alt={item.productName}
                      className="w-14 h-14 rounded-xl object-cover bg-gray-50 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-black line-clamp-1">{item.productName}</p>
                    {item.shop && <p className="text-xs text-gray-400">{item.shop}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold" style={{ color: "#68911a" }}>₹{item.price}</span>
                      {item.mrp > item.price && (
                        <>
                          <span className="text-xs line-through text-gray-300">₹{item.mrp}</span>
                          <span className="text-[11px] font-bold bg-[#f0f7e6] text-[#68911a] px-1.5 py-0.5 rounded">
                            -{discPct}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-black">₹{lineTotal.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    {saving > 0 && (
                      <p className="text-xs font-semibold" style={{ color: "#68911a" }}>
                        Save ₹{saving.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* BILL DETAILS */}
        {bill && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Tag className="w-4 h-4" style={{ color: "#68911a" }} />
              <span className="text-xs font-bold text-black uppercase tracking-wider">Bill Details</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">MRP Total</span>
                <span className="text-gray-300 line-through">₹{Number(bill.mrpTotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Item Discount</span>
                <span className="font-semibold" style={{ color: "#68911a" }}>
                  − ₹{Number(bill.itemDiscount).toFixed(2)}
                </span>
              </div>
              {bill.couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    Coupon
                    {bill.couponCode && (
                      <span className="text-[11px] font-bold bg-[#f0f7e6] text-[#68911a] px-2 py-0.5 rounded-full">
                        {bill.couponCode}
                      </span>
                    )}
                  </span>
                  <span className="font-semibold" style={{ color: "#68911a" }}>
                    − ₹{bill.couponDiscount}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1.5">
                  Delivery Fee
                  {bill.deliveryFee === 0 && (
                    <span className="text-[11px] font-bold bg-[#f0f7e6] text-[#68911a] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Truck className="w-3 h-3" /> FREE
                    </span>
                  )}
                </span>
                {bill.deliveryFee === 0
                  ? <span className="text-gray-300 line-through">₹40</span>
                  : <span className="font-semibold text-black">₹{bill.deliveryFee}</span>}
              </div>
              <div className="border-t-2 border-dashed border-gray-100 pt-3 flex justify-between items-end">
                <span className="font-bold text-black text-sm">Total Paid</span>
                <div className="text-right">
                  <p className="font-bold text-black text-2xl tracking-tight">
                    ₹{Number(bill.totalAmount).toFixed(2)}
                  </p>
                  {(bill.itemDiscount + bill.couponDiscount) > 0 && (
                    <p className="text-xs font-semibold mt-0.5" style={{ color: "#68911a" }}>
                      You saved ₹{(
                        bill.itemDiscount + bill.couponDiscount +
                        (bill.deliveryFee === 0 ? 40 : 0)
                      ).toFixed(2)}!
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="px-4 pb-4">
              <div className="bg-gray-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-300 shrink-0" />
                <p className="text-xs text-gray-400">
                  Payment on delivery (UPI) · All prices include GST
                </p>
              </div>
            </div>
          </section>
        )}

        <p className="text-center text-xs text-gray-300 pb-4">
          Placed on{" "}
          {new Date(order.createdAt).toLocaleDateString("en-IN", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
          })}
        </p>
      </main>
    </div>
  );
}