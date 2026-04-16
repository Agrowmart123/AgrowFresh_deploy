import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Package, AlertTriangle, RefreshCw, XCircle,
  ChevronRight, CheckCircle2, Clock, Truck, ShieldCheck,
  Camera, X, FileText, Ban, RotateCcw, Star, MapPin,
} from "lucide-react";

// ── Constants ──────────────────────────────────────────────────
const RETURN_WINDOW_DAYS = 7;

const DELIVERED_ORDERS = [
  {
    id: "ORD1234", date: "Mar 3, 2026",
    deliveryDate: new Date(Date.now() - 2 * 86400000),
    totalAmount: 240, paymentMethod: "UPI",
    items: [
      { id: 1, name: "Alphonso Mango", qty: 2, price: 80,  returnable: true  },
      { id: 2, name: "Fresh Milk",     qty: 1, price: 80,  returnable: false },
    ],
  },
  {
    id: "ORD5678", date: "Feb 20, 2026",
    deliveryDate: new Date(Date.now() - 20 * 86400000),
    totalAmount: 150, paymentMethod: "COD",
    items: [
      { id: 1, name: "Tomatoes", qty: 2, price: 40, returnable: true },
      { id: 2, name: "Potatoes", qty: 3, price: 30, returnable: true },
    ],
  },
];

const RETURN_REASONS = [
  "Damaged / broken product",
  "Wrong item delivered",
  "Product not as described",
  "Spoiled / rotten product",
  "Missing items in order",
  "Expired product delivered",
  "Poor quality product",
  "Contaminated product",
];

const REFUND_METHOD_MAP = {
  UPI:  { label: "UPI Refund",     icon: "📲", sub: "Refunded to your UPI ID"           },
  COD:  { label: "Bank / Wallet",  icon: "🏦", sub: "Transferred to bank or wallet"      },
  CARD: { label: "Card Reversal",  icon: "💳", sub: "Reversed to your credit/debit card" },
};

const STATUS_FLOW = [
  { key: "RETURN_REQUESTED", label: "Requested",    icon: RotateCcw    },
  { key: "RETURN_APPROVED",  label: "Approved",     icon: CheckCircle2 },
  { key: "PICKUP_SCHEDULED", label: "Pickup Set",   icon: Clock        },
  { key: "PICKED_UP",        label: "Picked Up",    icon: Truck        },
  { key: "QUALITY_CHECK",    label: "QC Check",     icon: Star         },
  { key: "REFUND_INITIATED", label: "Refund Sent",  icon: RefreshCw    },
  { key: "REFUND_COMPLETED", label: "Completed",    icon: CheckCircle2 },
];

const STEPS = ["Order", "Items", "Reason", "Review"];

// ── Helpers ────────────────────────────────────────────────────
const daysLeft = (deliveryDate) =>
  Math.max(0, RETURN_WINDOW_DAYS - Math.floor((Date.now() - new Date(deliveryDate)) / 86400000));

const isWindowOpen = (deliveryDate) => daysLeft(deliveryDate) > 0;

// ── Sub-components ─────────────────────────────────────────────
const StepBar = ({ current }) => (
  <div className="flex items-center mb-6">
    {STEPS.map((label, i) => {
      const done = i < current, active = i === current;
      return (
        <div key={label} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
              ${done   ? "border-[#68911a] bg-[#68911a] text-white"       : ""}
              ${active ? "border-[#68911a] bg-[#f0f7e6] text-[#68911a]"   : ""}
              ${!done && !active ? "border-gray-200 bg-white text-gray-300" : ""}
            `}>
              {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className={`text-[9px] font-bold ${active ? "text-[#68911a]" : done ? "text-gray-400" : "text-gray-200"}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-4 ${done ? "bg-[#68911a]" : "bg-gray-100"}`} />
          )}
        </div>
      );
    })}
  </div>
);

const HorizontalTracker = ({ currentStatus }) => {
  const idx = STATUS_FLOW.findIndex(s => s.key === currentStatus);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
        <RefreshCw className="w-4 h-4" style={{ color: "#68911a" }} />
        <span className="text-xs font-bold text-black uppercase tracking-wider">Return Status</span>
      </div>
      <div className="px-4 py-5 overflow-x-auto">
        <div className="relative flex justify-between min-w-[520px]">
          <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-gray-100 z-0" />
          <div
            className="absolute top-3.5 left-4 h-0.5 z-0 transition-all duration-700"
            style={{ background: "#68911a", width: `calc(${(idx / (STATUS_FLOW.length - 1)) * 100}% - 2rem)` }}
          />
          {STATUS_FLOW.map((s, i) => {
            const done = i < idx, active = i === idx;
            const Icon = s.icon;
            return (
              <div key={s.key} className="relative z-10 flex flex-col items-center gap-1.5" style={{ width: `${100 / STATUS_FLOW.length}%` }}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all
                  ${done   ? "bg-[#68911a] border-[#68911a]"    : ""}
                  ${active ? "bg-[#f0f7e6] border-[#68911a]"    : ""}
                  ${!done && !active ? "bg-white border-gray-200" : ""}
                `}>
                  <Icon className="w-3 h-3" style={{ color: done ? "#fff" : active ? "#68911a" : "#d1d5db" }} />
                </div>
                <p className={`text-[8px] font-bold text-center leading-tight
                  ${done || active ? "text-black" : "text-gray-300"}
                `}>{s.label}</p>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-[#68911a] animate-pulse" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, title }) => (
  <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
    <Icon className="w-4 h-4" style={{ color: "#68911a" }} />
    <span className="text-xs font-bold text-black uppercase tracking-wider">{title}</span>
  </div>
);

const Row = ({ label, value, green }) => (
  <div className="flex justify-between text-sm gap-4">
    <span className="text-gray-400 shrink-0">{label}</span>
    <span className={`font-bold text-right ${green ? "" : "text-black"}`} style={green ? { color: "#68911a" } : {}}>
      {value}
    </span>
  </div>
);

// ── Page Shell ─────────────────────────────────────────────────
const Shell = ({ title, sub, onBack, children }) => (
  <div className="min-h-screen bg-white">
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center gap-3">
        <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </button>
        <div className="flex-1">
          <h1 className="text-base font-bold text-black tracking-tight">{title}</h1>
          <p className="text-xs text-gray-400">{sub}</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-[#f0f7e6] flex items-center justify-center">
          <RotateCcw className="w-4 h-4" style={{ color: "#68911a" }} />
        </div>
      </div>
    </header>
    <main className="max-w-3xl mx-auto px-4 py-5 pb-28 space-y-3">{children}</main>
  </div>
);

const GreenBtn = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full py-3.5 rounded-2xl text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
    style={{ background: "#68911a" }}
  >
    {children}
  </button>
);

// ── Main Component ─────────────────────────────────────────────
export default function RefundPage() {
  const navigate = useNavigate();

  // Views: "home" | "new" | "track"
  const [view, setView]                   = useState("home");
  const [step, setStep]                   = useState(0);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [returnType, setReturnType]       = useState("return");
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason]               = useState("");
  const [note, setNote]                   = useState("");
  const [photos, setPhotos]               = useState([]);
  const [submitted, setSubmitted]         = useState(false);

  const order        = DELIVERED_ORDERS.find(o => o.id === selectedOrderId);
  const refundAmount = selectedItems.length > 0
    ? order?.items.filter(i => selectedItems.includes(i.id)).reduce((s, i) => s + i.price * i.qty, 0)
    : order?.totalAmount || 0;

  const toggleItem = (id) =>
    setSelectedItems(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handlePhotos = (e) => {
    const urls = Array.from(e.target.files).map(f => URL.createObjectURL(f));
    setPhotos(p => [...p, ...urls].slice(0, 4));
  };

  const resetFlow = () => {
    setStep(0); setSelectedOrderId(null); setReturnType("return");
    setSelectedItems([]); setReason(""); setNote(""); setPhotos([]);
    setSubmitted(false);
  };

  // ── SUCCESS SCREEN ─────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 text-center gap-5">
        <div className="w-20 h-20 rounded-full bg-[#f0f7e6] flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" style={{ color: "#68911a" }} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-black">
            {returnType === "replace" ? "Replacement" : "Return"} Request Submitted!
          </h2>
          <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">
            A pickup will be scheduled after approval. We'll notify you at every step.
          </p>
        </div>

        <HorizontalTracker currentStatus="RETURN_REQUESTED" />

        <Card className="w-full max-w-xs">
          <div className="p-4 space-y-2.5">
            <Row label="Order"   value={`#${selectedOrderId}`} />
            <Row label="Type"    value={returnType === "replace" ? "Replacement" : "Return & Refund"} />
            {returnType === "return" && <Row label="Refund Amount" value={`₹${refundAmount}`} green />}
            {returnType === "return" && <Row label="Refund Via"    value={REFUND_METHOD_MAP[order?.paymentMethod || "UPI"]?.label} />}
            <Row label="Pickup"  value="Within 2 business days" />
            <div className="h-px bg-gray-100" />
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-400">Refund expected by <span className="font-bold text-black">Mar 15, 2026</span></span>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-2 w-full max-w-xs">
          <GreenBtn onClick={() => navigate("/orders")}>Back to Orders</GreenBtn>
          <button
            onClick={() => { resetFlow(); setView("track"); }}
            className="w-full py-3 rounded-2xl border-2 border-gray-100 text-sm font-bold text-gray-600"
          >
            Track Return
          </button>
        </div>
      </div>
    );
  }

  // ── HOME VIEW ──────────────────────────────────────────────
  if (view === "home") {
    return (
      <Shell title="Returns & Refunds" sub="Manage your return requests" onBack={() => navigate(-1)}>

        {/* Action Cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: RotateCcw, label: "New Return",   sub: "Request a return or refund",       bg: "bg-[#f0f7e6]", color: "#68911a", action: () => { resetFlow(); setView("new"); } },
            { icon: Clock,     label: "Track Return",  sub: "Check your active return",          bg: "bg-amber-50",  color: "#f59e0b", action: () => setView("track") },
          ].map(({ icon: Icon, label, sub, bg, color, action }) => (
            <button
              key={label}
              onClick={action}
              className="flex flex-col items-start gap-3 bg-white rounded-2xl border-2 border-gray-100 p-4 hover:border-[#68911a] hover:shadow-md transition-all text-left"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <p className="text-sm font-bold text-black">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Return Policy */}
        <Card>
          <CardHeader icon={ShieldCheck} title="Return Policy" />
          <div className="p-4 space-y-2.5">
            {[
              { icon: "📅", text: "7-day return window from delivery date" },
              { icon: "🥩", text: "Meat & dairy: return within 24 hours only" },
              { icon: "📦", text: "Item must be unused and in original condition" },
              { icon: "📸", text: "Photo proof required for damaged / spoiled items" },
              { icon: "🚚", text: "Free pickup scheduled for all approved returns" },
              { icon: "💰", text: "Refund processed within 3–5 business days" },
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-base shrink-0">{p.icon}</span>
                <p className="text-xs text-gray-600">{p.text}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Non-returnable */}
        <div className="flex items-start gap-2.5 bg-red-50 rounded-xl px-4 py-3">
          <Ban className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600">
            <span className="font-bold text-black">Non-returnable: </span>
            Opened beverages, cut fruits, loose spices, and customised orders.
          </p>
        </div>

        {/* Refund Methods */}
        <Card>
          <CardHeader icon={RefreshCw} title="Refund Methods" />
          <div className="divide-y divide-gray-50">
            {Object.values(REFUND_METHOD_MAP).map((m) => (
              <div key={m.label} className="flex items-center gap-3 px-4 py-3">
                <span className="text-xl">{m.icon}</span>
                <div>
                  <p className="text-sm font-bold text-black">{m.label}</p>
                  <p className="text-xs text-gray-400">{m.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </Shell>
    );
  }

  // ── TRACK VIEW ────────────────────────────────────────────
  if (view === "track") {
    const mock = { orderId: "ORD9999", status: "QUALITY_CHECK", amount: 200, paymentMethod: "UPI", date: "Mar 1, 2026" };
    const rInfo = REFUND_METHOD_MAP[mock.paymentMethod];
    return (
      <Shell title="Track Return" sub={`Order #${mock.orderId}`} onBack={() => setView("home")}>

        <HorizontalTracker currentStatus={mock.status} />

        <Card>
          <CardHeader icon={Package} title="Return Details" />
          <div className="p-4 space-y-2.5">
            <Row label="Order"         value={`#${mock.orderId}`} />
            <Row label="Requested On"  value={mock.date} />
            <Row label="Refund Amount" value={`₹${mock.amount}`} green />
            <div className="h-px bg-gray-100" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#f0f7e6] flex items-center justify-center text-base shrink-0">
                {rInfo.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-black">{rInfo.label}</p>
                <p className="text-[11px] text-gray-400">{rInfo.sub}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Pickup info */}
        <Card>
          <CardHeader icon={MapPin} title="Pickup Details" />
          <div className="p-4 space-y-2.5">
            <Row label="Agent"       value="Ravi Kumar" />
            <Row label="Pickup Date" value="Mar 8, 2026" />
            <Row label="Tracking ID" value="EKT928374651" />
            <Row label="Partner"     value="Ekart Logistics" />
          </div>
        </Card>

        {/* Status message */}
        <div className="bg-amber-50 rounded-xl px-4 py-3 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-black">Quality Check in Progress</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Your returned item is being inspected. Refund will be initiated once quality check passes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-[#f0f7e6] rounded-xl px-4 py-3">
          <ShieldCheck className="w-4 h-4 shrink-0" style={{ color: "#68911a" }} />
          <p className="text-xs text-gray-600">
            Refund expected by <span className="font-bold text-black">Mar 15, 2026</span> · Questions?{" "}
            <span className="font-bold text-black underline cursor-pointer">Contact support</span>
          </p>
        </div>

      </Shell>
    );
  }

  // ── NEW REQUEST WIZARD ─────────────────────────────────────
  return (
    <Shell
      title="New Return Request"
      sub={`Step ${step + 1} of ${STEPS.length}`}
      onBack={() => step > 0 ? setStep(s => s - 1) : setView("home")}
    >
      <StepBar current={step} />

      {/* ── STEP 0: SELECT ORDER ── */}
      {step === 0 && (
        <div className="space-y-3">
          <p className="text-sm font-bold text-black">Select the order to return</p>
          <p className="text-xs text-gray-400 -mt-1">Only delivered orders within the 7-day window are eligible</p>

          {DELIVERED_ORDERS.map(ord => {
            const open = isWindowOpen(ord.deliveryDate);
            const left = daysLeft(ord.deliveryDate);
            return (
              <button
                key={ord.id}
                onClick={() => { if (open) { setSelectedOrderId(ord.id); setStep(1); } }}
                className={`w-full text-left bg-white rounded-2xl border-2 p-4 transition-all
                  ${open ? "hover:border-[#68911a] hover:shadow-md border-gray-100" : "opacity-50 cursor-not-allowed border-gray-100"}
                  ${selectedOrderId === ord.id ? "border-[#68911a]" : ""}
                `}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#f0f7e6] flex items-center justify-center">
                      <Package className="w-4 h-4" style={{ color: "#68911a" }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-black">Order #{ord.id}</p>
                      <p className="text-xs text-gray-400">{ord.date} · ₹{ord.totalAmount} · {ord.paymentMethod}</p>
                    </div>
                  </div>
                  {open
                    ? <span className="text-[11px] font-bold bg-[#f0f7e6] text-[#68911a] px-2 py-0.5 rounded-full">{left}d left</span>
                    : <span className="text-[11px] font-bold bg-red-50 text-red-400 px-2 py-0.5 rounded-full">Window Closed</span>
                  }
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ord.items.map(item => (
                    <span key={item.id}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold
                        ${item.returnable ? "bg-gray-100 text-gray-500" : "bg-red-50 text-red-400"}`}
                    >
                      {!item.returnable && "🚫 "}{item.name}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── STEP 1: SELECT ITEMS ── */}
      {step === 1 && order && (
        <div className="space-y-4">
          <p className="text-sm font-bold text-black">What are you returning?</p>

          {/* Return / Replace toggle */}
          <div className="flex gap-2">
            {[
              { key: "return",  label: "Return & Refund", icon: RotateCcw },
              { key: "replace", label: "Replace Item",    icon: RefreshCw },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setReturnType(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold border-2 transition-all
                  ${returnType === key ? "border-[#68911a] bg-[#f0f7e6] text-[#68911a]" : "border-gray-100 text-gray-400"}`}
              >
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>

          {/* Items list */}
          <Card>
            <CardHeader icon={Package} title={`Items in Order #${order.id}`} />
            <div className="divide-y divide-gray-50">
              {order.items.map(item => {
                const checked = selectedItems.includes(item.id);
                const blocked = !item.returnable;
                return (
                  <button
                    key={item.id}
                    onClick={() => !blocked && toggleItem(item.id)}
                    disabled={blocked}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left last:rounded-b-2xl transition-colors
                      ${blocked ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all
                      ${checked ? "border-[#68911a] bg-[#68911a]" : blocked ? "border-gray-200 bg-gray-100" : "border-gray-200"}`}>
                      {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
                      {blocked  && <X className="w-2.5 h-2.5 text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-black">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        Qty: {item.qty}
                        {blocked && <span className="ml-2 text-red-400 font-semibold">Non-returnable</span>}
                      </p>
                    </div>
                    <span className="text-sm font-bold shrink-0" style={{ color: "#68911a" }}>₹{item.price * item.qty}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Refund preview */}
          {selectedItems.length > 0 && returnType === "return" && (
            <div className="flex items-center justify-between bg-[#f0f7e6] rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-black">Estimated Refund</span>
              <span className="text-base font-bold" style={{ color: "#68911a" }}>₹{refundAmount}</span>
            </div>
          )}

          <GreenBtn onClick={() => setStep(2)} disabled={selectedItems.length === 0}>
            Continue →
          </GreenBtn>
        </div>
      )}

      {/* ── STEP 2: REASON & PROOF ── */}
      {step === 2 && order && (
        <div className="space-y-4">
          <p className="text-sm font-bold text-black">Tell us what went wrong</p>

          {/* Reasons */}
          <Card>
            <CardHeader icon={FileText} title="Reason for Return" />
            <div className="p-3 flex flex-wrap gap-2">
              {RETURN_REASONS.map(r => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all
                    ${reason === r
                      ? "border-[#68911a] bg-[#f0f7e6] text-[#68911a]"
                      : "border-gray-100 text-gray-500 hover:border-gray-200"}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </Card>

          {/* Photos */}
          <Card>
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4" style={{ color: "#68911a" }} />
                <span className="text-xs font-bold text-black uppercase tracking-wider">Photo Evidence</span>
              </div>
              <span className="text-[11px] text-gray-400">Max 4 · Recommended</span>
            </div>
            <div className="p-4">
              <div className="flex gap-2 flex-wrap">
                {photos.map((url, i) => (
                  <div key={i} className="relative w-16 h-16">
                    <img src={url} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    <button
                      onClick={() => setPhotos(p => p.filter((_, j) => j !== i))}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                {photos.length < 4 && (
                  <label className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#68911a] hover:bg-[#f0f7e6] transition-all">
                    <Camera className="w-5 h-5 text-gray-300" />
                    <span className="text-[9px] text-gray-300 mt-0.5">Add</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
                  </label>
                )}
              </div>
              <p className="text-[11px] text-gray-400 mt-2.5 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                Photos of damaged items speed up approval
              </p>
            </div>
          </Card>

          {/* Note */}
          <Card>
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-bold text-black uppercase tracking-wider">Additional Note</span>
              <span className="text-[11px] text-gray-300 ml-auto">Optional</span>
            </div>
            <div className="p-4">
              <textarea
                rows={3}
                placeholder="Describe the issue in detail..."
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full text-sm text-black placeholder-gray-300 border border-gray-100 rounded-xl px-3.5 py-2.5 resize-none focus:outline-none focus:border-[#68911a] transition-colors"
              />
            </div>
          </Card>

          <GreenBtn onClick={() => setStep(3)} disabled={!reason}>
            Review Request →
          </GreenBtn>
        </div>
      )}

      {/* ── STEP 3: REVIEW ── */}
      {step === 3 && order && (
        <div className="space-y-4">
          <p className="text-sm font-bold text-black">Review before submitting</p>

          {/* Summary */}
          <Card>
            <div className={`px-4 py-3 flex items-center gap-2 ${returnType === "replace" ? "bg-blue-50" : "bg-[#f0f7e6]"}`}>
              <RotateCcw className="w-4 h-4" style={{ color: "#68911a" }} />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#68911a" }}>
                {returnType === "replace" ? "Replacement Request" : "Return & Refund"}
              </span>
            </div>
            <div className="p-4 space-y-3">
              <Row label="Order"  value={`#${order.id}`} />
              <Row label="Items"  value={order.items.filter(i => selectedItems.includes(i.id)).map(i => i.name).join(", ")} />
              <Row label="Reason" value={reason} />
              {note && <Row label="Note"   value={note} />}
              {photos.length > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Photos</span>
                  <div className="flex gap-1">
                    {photos.map((url, i) => <img key={i} src={url} alt="" className="w-8 h-8 rounded-lg object-cover" />)}
                  </div>
                </div>
              )}
              {returnType === "return" && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-black text-sm">Refund Amount</span>
                    <span className="text-xl font-bold" style={{ color: "#68911a" }}>₹{refundAmount}</span>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Refund method */}
          {returnType === "return" && (
            <Card>
              <CardHeader icon={RefreshCw} title="Refund Method" />
              <div className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#f0f7e6] flex items-center justify-center text-xl shrink-0">
                  {REFUND_METHOD_MAP[order.paymentMethod]?.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-black">{REFUND_METHOD_MAP[order.paymentMethod]?.label}</p>
                  <p className="text-xs text-gray-400">{REFUND_METHOD_MAP[order.paymentMethod]?.sub}</p>
                </div>
                <span className="text-[11px] font-bold bg-[#f0f7e6] text-[#68911a] px-2 py-1 rounded-full">
                  {order.paymentMethod}
                </span>
              </div>
            </Card>
          )}

          {/* What happens next */}
          <Card>
            <CardHeader icon={Clock} title="What Happens Next" />
            <div className="p-4 space-y-3">
              {[
                { icon: CheckCircle2, label: "Request submitted & under review",              time: "Now"      },
                { icon: Truck,        label: "Free pickup scheduled at your address",         time: "1–2 days" },
                { icon: Star,         label: "Quality check at warehouse",                    time: "2–3 days" },
                { icon: RefreshCw,    label: returnType === "replace" ? "Replacement dispatched" : "Refund credited to your account", time: "3–5 days" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#f0f7e6] flex items-center justify-center shrink-0">
                    <s.icon className="w-3.5 h-3.5" style={{ color: "#68911a" }} />
                  </div>
                  <p className="flex-1 text-xs text-gray-600">{s.label}</p>
                  <span className="text-[11px] text-gray-400 shrink-0">{s.time}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Fraud warning */}
          <div className="flex items-start gap-2.5 bg-amber-50 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600">
              <span className="font-bold text-black">Note: </span>
              False claims may result in account review or suspension per our return policy.
            </p>
          </div>

          <GreenBtn onClick={() => setSubmitted(true)}>
            Submit {returnType === "replace" ? "Replacement" : "Return"} Request ✓
          </GreenBtn>
        </div>
      )}
    </Shell>
  );
}