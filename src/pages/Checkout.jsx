import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  MapPin,
  ChevronRight,
  Tag,
  Package,
  Truck,
  Gift,
  Star,
  ShieldCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
  Zap,
  ArrowLeft,
  Info,
} from "lucide-react";
import ChangeAddressModal from "../components/ChangeAddress";
import AddressFormModal from "../components/AddressForm";
import {
  addAddress,
  getAllAddresses,
  deleteAddress,
  updateAddress,      
  getRecentlyViewedProducts
} from "../services/api";

const DEALS = [
  {
    id: "d1",
    code: "FRESH10",
    label: "10% off on fresh produce",
    savings: "Save ₹35",
  },
  {
    id: "d2",
    code: "FIRST50",
    label: "₹50 off on first order",
    savings: "Save ₹50",
  },
  {
    id: "d3",
    code: "MEAT15",
    label: "15% off on meat orders",
    savings: "Save ₹63",
  },
];

const FREE_DELIVERY_THRESHOLD = 499;
const EMPTY_FORM = {
  name: "",
  phone: "",
  pincode: "",
  city: "",
  state: "",
  line1: "",
  line2: "",
  label: "Home",
};

function ProgressBar({ value, max }) {
  const pct = Math.min(((Number(value) || 0) / (Number(max) || 1)) * 100, 100);
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

  const passedIds = location.state?.selectedIds;
  const selectedIds =
    passedIds && passedIds.length > 0 ? passedIds : cartItems.map((i) => i.id);
  const checkoutItems = cartItems.filter((item) =>
    selectedIds.includes(item.id),
  );

  // --- Backend States ---
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [appliedDeal, setAppliedDeal] = useState(null);
  const [showAllRelated, setShowAllRelated] = useState(false);
  const [addedRelated, setAddedRelated] = useState([]);
  const [showItemsExpanded, setShowItemsExpanded] = useState(true);
  const [customCode, setCustomCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  // Modal states
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

 useEffect(() => {
  fetchAddresses();
  fetchRelatedProducts(); // ✅ working now
}, []);
const fetchAddresses = async () => {
  try {
    setLoading(true);

    const addrList = await getAllAddresses();

    console.log("FETCHED ADDRESSES:", addrList);

    if (!Array.isArray(addrList)) {
      setAddresses([]);
      return;
    }

    setAddresses(addrList);

    const defaultAddr =
      addrList.find((a) => a.defaultAddress === true) ||
      addrList[0];

    if (defaultAddr) {
      setSelectedAddressId(defaultAddr.id);
    }

  } catch (err) {
    console.error("FETCH ERROR:", err);
  } finally {
    setLoading(false);
  }
};
const fetchRelatedProducts = async () => {
  try {
    const res = await getRecentlyViewedProducts();

    console.log("RELATED API:", res);

    const products = res?.products || [];

    const formatted = products.map((item, index) => {
  const data = item.data || {};

  // 🔥 TYPE BASED PRICE FIX
  let price = 0;

  if (item.type === "regular") {
    price =data.minPrice ||  data.sellingPrice || data.mrp;
  } else if (item.type === "women") {
    price = data.price || data.sellingPrice || data.mrp;
  } else if (item.type === "farmer") {
    price = data.minPrice || data.pricePerUnit || data.price || data.sellingPrice;
  } else if (item.type === "agri") {
    price = data.minPrice || data.sellingPrice;
  }

  return {
    id: data.id || index,
    name:
      data.productName ||
      data.name ||
      data.AgriproductName ||
      "Product",
    price: price || 0,
    image:
      data.imageUrls?.[0] ||
      data.image ||
      data.imageUrl ||
      "https://via.placeholder.com/100",
  };
});

    setRelatedProducts(formatted);
  } catch (err) {
    console.error("RELATED ERROR:", err);
  }
};
  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) || null;
console.log("SELECTED ADDRESS 👉", selectedAddress);
  // --- Calculations ---
  const subtotal = checkoutItems.reduce(
    (s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 0),
    0,
  );
  const mrpTotal = checkoutItems.reduce(
    (s, i) =>
      s + (Number(i.oldPrice ?? i.price) || 0) * (Number(i.quantity) || 0),
    0,
  );
  const itemDiscount = Math.max(0, mrpTotal - subtotal);

  const dealDiscount = appliedDeal
    ? appliedDeal.id === "d2"
      ? 50
      : appliedDeal.id === "d1"
        ? Math.round(subtotal * 0.1)
        : Math.round(subtotal * 0.15)
    : 0;

  const toFreeDelivery = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 40;
  const total = Math.max(0, subtotal - dealDiscount + deliveryFee);
const relatedVisible = showAllRelated
  ? relatedProducts
  : relatedProducts.slice(0, 4);

async function handleSaveAddress(form) {
  try {
    const payload = {
      fullName: form.name,
      phoneNumber: form.phone,
      addressLine: form.line1,
      areaDetails: form.line2 || "",
      pincode: form.pincode,
      townCity: form.city,
      state: form.state,
      addressType: form.label.toUpperCase(),
    };

    console.log("FORM DATA:", form);

    if (form.id) {
      console.log("UPDATE API CALL");
      await updateAddress(form.id, payload);
      setSelectedAddressId(form.id);
    } else {
      console.log("ADD API CALL");
      const res = await addAddress(payload);
      if (res?.data?.id) {
        setSelectedAddressId(res.data.id);
      }
    }

    await fetchAddresses();
    setShowAddForm(false);
    setEditingAddress(null);

  } catch (err) {
    console.error("ERROR:", err?.response || err);
  }
}
 async function handleDeleteAddress(id) {
  if (window.confirm("Delete address?")) {
    await deleteAddress(id); // ✅ FIXED
    fetchAddresses();
  }
}

  const handleEditAddress = (addr) => {
     console.log("EDIT CLICK:", addr); 
    setEditingAddress(addr);
    setShowAddForm(true);
  };
  const handleAddNew = () => {
    setEditingAddress(null);
    setShowAddForm(true);
    setShowChangeModal(false);
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-lime-50 flex flex-col items-center justify-center gap-4 px-4">
        <Package className="w-16 h-16 text-gray-300" />
        <p className="text-gray-500 font-semibold text-lg">
          No items selected for checkout
        </p>
        <button
          onClick={() => navigate("/cart")}
          className="px-6 py-3 bg-[#68911a] text-white font-bold rounded-full"
        >
          Back to Cart
        </button>
      </div>
    );
  }

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
        <div className="max-w-3xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-black text-gray-800 tracking-tight">
            Checkout
          </h1>
          <span className="ml-auto text-sm font-bold text-[#68911a]">
            {checkoutItems.length} items
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-5 space-y-4 pb-32">
        {/* 1. DELIVERY ADDRESS */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#68911a]" />
            <span className="text-sm font-black text-gray-700 uppercase tracking-wide">
              Delivery Address
            </span>
          </div>
          <div className="p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-lime-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-[#68911a]" />
            </div>
            <div className="flex-1">
              {selectedAddress ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black bg-lime-100 text-lime-700 px-2 py-0.5 rounded-full">
                      {selectedAddress.addressType || "Address"}
                    </span>
                    <span className="text-sm font-black text-gray-800">
                      {selectedAddress.fullName}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {selectedAddress.addressLine}, {selectedAddress.townCity}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400 font-bold">
                  Please add an address
                </p>
              )}
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Delivery in 2–7 business days
              </p>
            </div>
            <button
              onClick={() => setShowChangeModal(true)}
              className="text-xs font-bold text-[#68911a] hover:underline flex items-center gap-1"
            >
              Change <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="px-4 pb-4">
            <button
              onClick={handleAddNew}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl py-2.5 text-sm font-bold text-gray-400 hover:text-[#68911a] flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add new address
            </button>
          </div>
        </section>

    
        {/* 4. SELECTED ITEMS LIST */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setShowItemsExpanded(!showItemsExpanded)}
            className="w-full px-4 py-3 border-b flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#68911a]" />
              <span className="text-sm font-black text-gray-700 uppercase">
                Your Items ({checkoutItems.length})
              </span>
            </div>
            {showItemsExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {showItemsExpanded && (
            <div className="divide-y divide-gray-50">
              {checkoutItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-3.5"
                >
                  <img
                    src={item.image}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover bg-gray-100"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-black text-[#68911a]">
                        ₹{item.price}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-800">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. YOU MIGHT ALSO LIKE */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-black text-gray-700 uppercase">
              You Might Also Like
            </span>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {relatedVisible.map((p) => {
              const added = addedRelated.includes(p.id);
              return (
                <div
                  key={p.id}
                  className="border border-gray-100 rounded-xl overflow-hidden"
                >
                  <img
                    src={p.image}
                    alt=""
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-2.5">
                    <p className="text-xs font-bold text-gray-800 truncate">
                      {p.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-sm font-black text-[#68911a]">
                        ₹{p.price}
                      </span>
                    </div>
                    <button
                      onClick={() => setAddedRelated([...addedRelated, p.id])}
                      disabled={added}
                      className={`w-full mt-2 py-1.5 rounded-lg text-xs font-black ${added ? "bg-emerald-100 text-emerald-600" : "bg-[#68911a] text-white"}`}
                    >
                      {added ? "Added" : "Add"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            onClick={() => setShowAllRelated(!showAllRelated)}
            className="w-full py-3 border-t text-sm font-bold text-[#68911a] flex items-center justify-center gap-1.5 hover:bg-lime-50"
          >
            {showAllRelated ? "Show Less" : "See More Products"}
          </button>
        </section>

        {/* 6. BILL DETAILS */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#68911a]" />
            <span className="text-sm font-black text-gray-700 uppercase">
              Bill Details
            </span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-semibold">MRP Total</span>
              <span className="text-gray-400 line-through">
                ₹{(mrpTotal || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-semibold">Item Discount</span>
              <span className="text-[#68911a] font-bold">
                − ₹{(itemDiscount || 0).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-dashed pt-3 font-black text-gray-800 text-base">
              <span>To Pay</span>
              <span className="text-xl">₹{(total || 0).toFixed(2)}</span>
            </div>
          </div>
          <div className="px-4 pb-4">
            <button
              onClick={() => {
  console.log("NAVIGATING WITH ADDRESS 👉", selectedAddress?.id);

  navigate("/payment", {
    state: {
      total,
      addressId: selectedAddress?.id,
    },
  });
}}
className="w-full py-4 bg-[#68911a] text-white font-black text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:bg-lime-600"
            >
              <Package className="w-5 h-5" /> Pay Now
            </button>
          </div>
        </section>

        <div className="flex items-center gap-2 px-1 text-gray-400">
          <ShieldCheck className="w-4 h-4" />
          <p className="text-xs font-semibold">100% Safe & Secure Checkout</p>
        </div>
      </main>

      {/* Modals */}
      {showChangeModal && (
        <ChangeAddressModal
          addresses={addresses}
          selectedId={selectedAddressId}
          onSelect={setSelectedAddressId}
          onAdd={handleAddNew}
          onEdit={handleEditAddress}
          onDelete={handleDeleteAddress}
          onClose={() => setShowChangeModal(false)}
        />
      )}
      {showAddForm && (
        <AddressFormModal
          title={editingAddress ? "Edit Address" : "Add New Address"}
          initial={
            editingAddress
              ? {
                id: editingAddress.id, 
                  name: editingAddress.fullName,
                  phone: editingAddress.phoneNumber,
                  pincode: editingAddress.pincode,
                  city: editingAddress.townCity,
                  state: editingAddress.state,
                  line1: editingAddress.addressLine,
                  line2: editingAddress.areaDetails,
                  label: editingAddress.addressType,
                }
              : EMPTY_FORM
          }
          onSave={handleSaveAddress}
          onClose={() => {
            setShowAddForm(false);
            setEditingAddress(null);
          }}
        />
      )}
    </div>
  );
}