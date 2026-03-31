import { Briefcase, Check, Home, MapPin, X } from "lucide-react";
import React, { useState } from "react";

const LABEL_OPTIONS = ["Home", "Work", "Other"];

export default function AddressFormModal({ initial = EMPTY_FORM, onSave, onClose, title = "Add New Address" }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  function set(field, val) {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.name.trim())    e.name    = "Full name is required";
    if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit number";
    if (!/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    if (!form.city.trim())    e.city    = "City is required";
    if (!form.state.trim())   e.state   = "State is required";
    if (!form.line1.trim())   e.line1   = "Address line 1 is required";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-lime-50 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-lime-600" />
          </div>
          <h2 className="text-base font-black text-gray-800 flex-1">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Label selector */}
          <div>
            <label className="text-xs font-black text-gray-600 uppercase tracking-wide mb-2 block">Save As</label>
            <div className="flex gap-2">
              {LABEL_OPTIONS.map((l) => (
                <button
                  key={l}
                  onClick={() => set("label", l)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 text-xs font-black transition-all ${
                    form.label === l
                      ? "border-lime-500 bg-lime-50 text-lime-700"
                      : "border-gray-200 text-gray-500 hover:border-lime-200"
                  }`}
                >
                  {l === "Home" && <Home className="w-3 h-3" />}
                  {l === "Work" && <Briefcase className="w-3 h-3" />}
                  {l === "Other" && <MapPin className="w-3 h-3" />}
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Full name & phone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-black text-gray-600 mb-1 block">Full Name *</label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="John Doe"
                className={`w-full border-2 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none transition-colors ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-lime-400"}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.name}</p>}
            </div>
            <div>
              <label className="text-xs font-black text-gray-600 mb-1 block">Phone *</label>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="xxxxxxxxxx"
                className={`w-full border-2 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none transition-colors ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-lime-400"}`}
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.phone}</p>}
            </div>
          </div>

          {/* Address line 1 */}
          <div>
            <label className="text-xs font-black text-gray-600 mb-1 block">Address Line 1 *</label>
            <input
              value={form.line1}
              onChange={(e) => set("line1", e.target.value)}
              placeholder="House / Flat No., Building Name"
              className={`w-full border-2 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none transition-colors ${errors.line1 ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-lime-400"}`}
            />
            {errors.line1 && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.line1}</p>}
          </div>

          {/* Address line 2 */}
          <div>
            <label className="text-xs font-black text-gray-600 mb-1 block">Address Line 2 <span className="text-gray-400 font-semibold">(Optional)</span></label>
            <input
              value={form.line2}
              onChange={(e) => set("line2", e.target.value)}
              placeholder="Street, Area, Landmark"
              className="w-full border-2 border-gray-200 focus:border-lime-400 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none transition-colors"
            />
          </div>

          {/* Pincode, City, State */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-black text-gray-600 mb-1 block">Pincode *</label>
              <input
                value={form.pincode}
                onChange={(e) => set("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="411052"
                className={`w-full border-2 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none transition-colors ${errors.pincode ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-lime-400"}`}
              />
              {errors.pincode && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.pincode}</p>}
            </div>
            <div>
              <label className="text-xs font-black text-gray-600 mb-1 block">City *</label>
              <input
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                placeholder="Pune"
                className={`w-full border-2 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none transition-colors ${errors.city ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-lime-400"}`}
              />
              {errors.city && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.city}</p>}
            </div>
            <div>
              <label className="text-xs font-black text-gray-600 mb-1 block">State *</label>
              <input
                value={form.state}
                onChange={(e) => set("state", e.target.value)}
                placeholder="Maharashtra"
                className={`w-full border-2 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none transition-colors ${errors.state ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-lime-400"}`}
              />
              {errors.state && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.state}</p>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-sm font-black text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 bg-lime-500 hover:bg-lime-600 rounded-xl text-sm font-black text-white transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> Save Address
          </button>
        </div>
      </div>
    </div>
  );
}