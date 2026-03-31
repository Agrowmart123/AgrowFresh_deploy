import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  MapPin, ChevronRight, Tag, Package, Truck, Gift, Star,
  ShieldCheck, Clock, ChevronDown, ChevronUp, Plus, Check,
  Zap, ArrowLeft, Info,
} from "lucide-react";
import ChangeAddressModal from "../components/ChangeAddress";
import AddressFormModal from "../components/AddressForm";

const RELATED_PRODUCTS = [
  { id: 101, name: "Chicken Wings (500g)", price: 100, mrp: 130, image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=120&q=80" },
  { id: 102, name: "Red Apples (1kg)", price: 120, mrp: 150, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=120&q=80" },
  { id: 103, name: "Prawns (250g)", price: 180, mrp: 220, image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=120&q=80" },
  { id: 104, name: "Broccoli (1pc)", price: 50, mrp: 65, image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=120&q=80" },
  { id: 105, name: "Mutton Chops (500g)", price: 320, mrp: 380, image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=120&q=80" },
  { id: 106, name: "Spinach Bunch", price: 15, mrp: 20, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=120&q=80" },
];

const DEALS = [
  { id: "d1", code: "FRESH10", label: "10% off on fresh produce", savings: "Save ₹35" },
  { id: "d2", code: "FIRST50", label: "₹50 off on first order", savings: "Save ₹50" },
  { id: "d3", code: "MEAT15", label: "15% off on meat orders", savings: "Save ₹63" },
];

const FREE_DELIVERY_THRESHOLD = 499;

const EMPTY_FORM = {
  name: "", phone: "", pincode: "", city: "",
  state: "", line1: "", line2: "", label: "Home",
};

function ProgressBar({ value, max }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-[#68911a] transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function Checkout() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Read selectedIds passed from Cart via navigate("/checkout", { state: { selectedIds } })
  // Fallback: if no selectedIds in state (e.g. direct URL visit), show all cart items
  const passedIds = location.state?.selectedIds;
  const selectedIds = passedIds && passedIds.length > 0 ? passedIds : cartItems.map((i) => i.id);

  const checkoutItems =cartItems.filter((item) => selectedIds.includes(item.id))

  const [appliedDeal, setAppliedDeal] = useState(null);
  const [showAllRelated, setShowAllRelated] = useState(false);
  const [addedRelated, setAddedRelated] = useState([]);
  const [showItemsExpanded, setShowItemsExpanded] = useState(true);
  // const [locationState] = useState({ address: "142 Elm Street, Karve Nagar, Pune 411052", label: "Home" });
  const [customCode, setCustomCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);

  const subtotal = checkoutItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const mrpTotal = checkoutItems.reduce((s, i) => s + (i.oldPrice ?? i.price) * i.quantity, 0);
  const itemDiscount = mrpTotal - subtotal;

  const [addresses, setAddresses] = useState([
    {
      id: "a1", label: "Home", name: "John Doe", phone: "9876543210",
      line1: "142 Elm Street", line2: "Karve Nagar",
      city: "Pune", state: "Maharashtra", pincode: "411052",
    },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState("a1");

  // Modal states
  const [showChangeModal, setShowChangeModal]   = useState(false);
  const [showAddForm, setShowAddForm]           = useState(false);
  const [editingAddress, setEditingAddress]     = useState(null); // null = add, object = edit

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];

  function formatAddress(a) {
    return [a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(", ");
  }

  function handleSaveAddress(form) {
    if (editingAddress) {
      // Update existing
      setAddresses((prev) =>
        prev.map((a) => a.id === editingAddress.id ? { ...a, ...form } : a)
      );
    } else {
      // Add new
      const newAddr = { ...form, id: `a${Date.now()}` };
      setAddresses((prev) => [...prev, newAddr]);
      setSelectedAddressId(newAddr.id);
    }
    setShowAddForm(false);
    setEditingAddress(null);
  }

  function handleEditAddress(addr) {
    setEditingAddress(addr);
    setShowAddForm(true);
  }

  function handleAddNew() {
    setEditingAddress(null);
    setShowAddForm(true);
    setShowChangeModal(false);
  }

  function handleDeleteAddress(id) {
    setAddresses((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      // If deleted the selected one, fallback to first
      if (selectedAddressId === id && updated.length > 0) {
        setSelectedAddressId(updated[0].id);
      }
      return updated;
    });
  }

  const dealDiscount = appliedDeal
    ? appliedDeal.id === "d2" ? 50
    : appliedDeal.id === "d1" ? Math.round(subtotal * 0.1)
    : Math.round(subtotal * 0.15)
    : 0;

  const toFreeDelivery = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 40;
  const total = subtotal - dealDiscount + deliveryFee;

  const relatedVisible = showAllRelated ? RELATED_PRODUCTS : RELATED_PRODUCTS.slice(0, 4);

  // Empty state
  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-lime-50 flex flex-col items-center justify-center gap-4 px-4">
        <Package className="w-16 h-16 text-gray-300" />
        <p className="text-gray-500 font-semibold text-lg">No items selected for checkout</p>
        <button
          onClick={() => navigate("/cart")}
          className="px-6 py-3 bg-[#68911a] text-white font-bold rounded-full hover:bg-lime-600 transition-colors"
        >
          Back to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f7f0]" style={{ fontFamily: "Nunito, sans-serif" }} >
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-black text-gray-800 tracking-tight">Checkout</h1>
          <span className="ml-auto text-sm font-bold text-[#68911a]">
            {checkoutItems.length} {checkoutItems.length === 1 ? "item" : "items"}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-4 pb-32">

        {/* ── 1. DELIVERY ADDRESS ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#68911a]" />
            <span className="text-sm font-black text-gray-700 uppercase tracking-wide">Delivery Address</span>
          </div>
          <div className="p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-lime-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-[#68911a]" />
            </div>
            <div className="flex-1">
              {/* <span className="text-xs font-black bg-lime-100 text-lime-700 px-2 py-0.5 rounded-full">{locationState.label}</span>
              <p className="text-sm font-semibold text-gray-800 mt-1">{locationState.address}</p> */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black bg-lime-100 text-lime-700 px-2 py-0.5 rounded-full">
                  {selectedAddress?.label}
                </span>
                <span className="text-sm font-black text-gray-800">{selectedAddress?.name}</span>
                <span className="text-xs text-gray-400">{selectedAddress?.phone}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Delivery in 2–7 business days
              </p>
            </div>
            <button onClick={() => setShowChangeModal(true)} className="text-xs font-bold text-[#68911a] hover:underline flex-shrink-0 flex items-center gap-1">
              Change <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="px-4 pb-4">
            <button onClick={handleAddNew} className="w-full border-2 border-dashed border-gray-200 rounded-xl py-2.5 text-sm font-bold text-gray-400 hover:border-[#68911a] hover:text-[#68911a] transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add new address
            </button>
          </div>
        </section>

        {/* ── 2. FREE DELIVERY BAR ── */}
        {toFreeDelivery > 0 ? (
          <section className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                <Truck className="w-4 h-4 text-[#68911a]" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-black">
                  Add items worth <span className="bg-white/25 px-1.5 py-0.5 rounded-lg">₹{toFreeDelivery}</span> more for FREE delivery!
                </p>
                <p className="text-xs text-black/80 mt-0.5">Currently paying ₹{deliveryFee} delivery fee</p>
                <div className="mt-2">
                  <ProgressBar value={subtotal} max={FREE_DELIVERY_THRESHOLD} />
                  <div className="flex justify-between text-xs text-black/70 mt-1">
                    <span>₹{subtotal}</span>
                    <span>₹{FREE_DELIVERY_THRESHOLD} → Free delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/30 flex items-center justify-center">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-black text-white flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> You've unlocked FREE delivery!
                </p>
                <p className="text-xs text-white/80">Great savings on this order</p>
              </div>
            </div>
          </section>
        )}

        {/* ── 3. DEALS ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#68911a]" />
            <span className="text-sm font-black text-gray-700 uppercase tracking-wide">Special Deals</span>
            {appliedDeal && (
              <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                Saving ₹{dealDiscount}
              </span>
            )}
          </div>
          <div className="p-4 space-y-3">
            {DEALS.map((deal) => {
              const active = appliedDeal?.id === deal.id;
              return (
                <div
                  key={deal.id}
                  onClick={() => setAppliedDeal(active ? null : deal)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${active ? "border-lime-400 bg-lime-50" : "border-gray-100 hover:border-lime-200"}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? "bg-lime-400" : "bg-gray-100"}`}>
                    <Gift className={`w-4 h-4 ${active ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-gray-800">{deal.code}</p>
                    <p className="text-xs text-gray-500">{deal.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#68911a]">{deal.savings}</p>
                    <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ml-auto ${active ? "border-lime-500 bg-lime-500" : "border-gray-300"}`}>
                      {active && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => setShowCouponInput((v) => !v)}
              className="w-full text-sm font-bold text-[#68911a] flex items-center justify-center gap-1.5 py-1 hover:underline"
            >
              <Tag className="w-3.5 h-3.5" /> Enter coupon code
            </button>
            {showCouponInput && (
              <div className="flex gap-2">
                <input
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  placeholder="Enter code..."
                  className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm font-semibold focus:border-lime-400 outline-none"
                />
                <button className="px-4 py-2 bg-[#68911a] text-white text-sm font-bold rounded-xl hover:bg-lime-600 transition-colors">
                  Apply
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── 4. SELECTED ITEMS LIST ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowItemsExpanded((v) => !v)}
            className="w-full px-4 py-3 border-b border-gray-100 flex items-center gap-2"
          >
            <Package className="w-4 h-4 text-[#68911a]" />
            <span className="text-sm font-black text-gray-700 uppercase tracking-wide">
              Your Items ({checkoutItems.length})
            </span>
            <span className="ml-auto text-xs text-gray-400 flex items-center gap-1">
              {showItemsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </button>

          {showItemsExpanded && (
            <>
              <div className="divide-y divide-gray-50">
                {/* ✅ Shows only the items the user selected in Cart */}
                {checkoutItems.map((item) => {
                  const mrp = item.oldPrice ?? item.price;
                  const saving = (mrp - item.price) * item.quantity;
                  const discPct = mrp > item.price ? Math.round((1 - item.price / mrp) * 100) : 0;
                  return (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</p>
                        {item.shop && <p className="text-xs text-gray-400 mt-0.5">{item.shop}</p>}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm font-black text-[#68911a]">₹{item.price}</span>
                          {mrp > item.price && (
                            <>
                              <span className="text-xs line-through text-gray-300">₹{mrp}</span>
                              <span className="text-xs bg-lime-50 text-[#68911a] font-bold px-1.5 rounded">-{discPct}%</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-black text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                        {saving > 0 && <p className="text-xs text-[#68911a] font-bold">Save ₹{saving.toFixed(2)}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mx-4 mb-4 mt-1 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <p className="text-xs font-semibold text-blue-700">
                  Estimated delivery between <strong>2 to 7 business days</strong> after order confirmation
                </p>
              </div>
            </>
          )}
        </section>

        {/* ── 5. YOU MIGHT ALSO LIKE ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-black text-gray-700 uppercase tracking-wide">You Might Also Like</span>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {relatedVisible.map((p) => {
              const added = addedRelated.includes(p.id);
              const disc = Math.round((1 - p.price / p.mrp) * 100);
              return (
                <div key={p.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img src={p.image} alt={p.name} className="w-full h-24 object-cover" />
                    {disc > 0 && (
                      <span className="absolute top-1.5 left-1.5 text-[10px] font-black bg-lime-500 text-white px-1.5 py-0.5 rounded-full">
                        {disc}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-bold text-gray-800 line-clamp-1">{p.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-sm font-black text-[#68911a]">₹{p.price}</span>
                      <span className="text-xs line-through text-gray-300">₹{p.mrp}</span>
                    </div>
                    <button
                      onClick={() => setAddedRelated((prev) => [...prev, p.id])}
                      disabled={added}
                      className={`w-full mt-2 py-1.5 rounded-lg text-xs font-black transition-all ${added ? "bg-emerald-100 text-emerald-600" : "bg-[#68911a] text-white hover:bg-lime-600"}`}
                    >
                      {added
                        ? <span className="flex items-center justify-center gap-1"><Check className="w-3 h-3" /> Added</span>
                        : <span className="flex items-center justify-center gap-1"><Plus className="w-3 h-3" /> Add</span>
                      }
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setShowAllRelated((v) => !v)}
            className="w-full py-3 border-t border-gray-100 text-sm font-bold text-[#68911a] flex items-center justify-center gap-1.5 hover:bg-lime-50 transition-colors"
          >
            {showAllRelated ? <><ChevronUp className="w-4 h-4" /> Show Less</> : <><ChevronDown className="w-4 h-4" /> See More Products</>}
          </button>
        </section>

        {/* ── 6. BILL DETAILS ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#68911a]" />
            <span className="text-sm font-black text-gray-700 uppercase tracking-wide">Bill Details</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-semibold">MRP Total</span>
              <span className="text-gray-400 line-through">₹{mrpTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-semibold">Item Discount</span>
              <span className="text-[#68911a] font-bold">− ₹{itemDiscount.toFixed(2)}</span>
            </div>
            {dealDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-semibold flex items-center gap-1">
                  Coupon ({appliedDeal?.code})
                  <button onClick={() => setAppliedDeal(null)} className="text-red-400 text-xs font-bold hover:underline ml-1">remove</button>
                </span>
                <span className="text-[#68911a] font-bold">− ₹{dealDiscount}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-semibold flex items-center gap-1">
                Delivery Fee
                {deliveryFee === 0 && <span className="text-xs bg-emerald-100 text-emerald-600 font-bold px-1.5 rounded-full">FREE</span>}
              </span>
              {deliveryFee === 0
                ? <span className="text-gray-300 line-through font-bold">₹40</span>
                : <span className="font-bold text-gray-700">₹{deliveryFee}</span>
              }
            </div>
            <div className="border-t-2 border-dashed border-gray-200 pt-3 flex justify-between">
              <span className="font-black text-gray-800 text-base">To Pay</span>
              <div className="text-right">
                <span className="font-black text-gray-900 text-xl">₹{total.toFixed(2)}</span>
                {itemDiscount + dealDiscount > 0 && (
                  <p className="text-xs text-[#68911a] font-bold">
                    You save ₹{(itemDiscount + dealDiscount + (deliveryFee === 0 ? 40 : 0)).toFixed(2)} total!
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="px-4 pb-4">
            <div className="bg-gray-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <p className="text-xs text-gray-400 font-semibold">Safe & secure checkout · All prices include GST</p>
            </div>
          </div>
          <div className="max-w-2xl mx-auto flex items-center gap-4 py-3">
          <button
            onClick={() => navigate("/payment", { state: { selectedIds, mrpTotal, itemDiscount, dealDiscount,total, deliveryFee, } })}
            className="flex-1 py-4 bg-[#68911a] hover:bg-lime-600 active:scale-[0.98] text-white font-black text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Package className="w-5 h-5" />
            Pay Now
          </button>
        </div>
        </section>

        <div className="flex items-center gap-2 px-1">
          <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <p className="text-xs text-gray-400 font-semibold">Payment will be collected on delivery (UPI)</p>
        </div>
      </main>

      {showChangeModal && (
        <ChangeAddressModal
          addresses={addresses}
          selectedId={selectedAddressId}
          onSelect={(id) => setSelectedAddressId(id)}
          onAdd={handleAddNew}
          onEdit={handleEditAddress}
          onDelete={handleDeleteAddress}
          onClose={() => setShowChangeModal(false)}
        />
      )}

      {showAddForm && (
        <AddressFormModal
          title={editingAddress ? "Edit Address" : "Add New Address"}
          initial={editingAddress ? {
            name: editingAddress.name, phone: editingAddress.phone,
            pincode: editingAddress.pincode, city: editingAddress.city,
            state: editingAddress.state, line1: editingAddress.line1,
            line2: editingAddress.line2 ?? "", label: editingAddress.label,
          } : EMPTY_FORM}
          onSave={handleSaveAddress}
          onClose={() => { setShowAddForm(false); setEditingAddress(null); }}
        />
      )}
    </div>
  );
}