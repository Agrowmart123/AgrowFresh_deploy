import { Check, Edit2, MapPin, Plus, Trash2, X } from "lucide-react";
import React from "react";

export default function ChangeAddressModal({ addresses, selectedId, onSelect, onAdd, onEdit, onDelete, onClose }) {
  function formatAddress(a) {
    return [a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(", ");
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl bg-lime-50 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-lime-600" />
          </div>
          <h2 className="text-base font-black text-gray-800 flex-1">Select Delivery Address</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Address list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {addresses.map((addr) => {
            const active = addr.id === selectedId;
            return (
              <div
                key={addr.id}
                onClick={() => onSelect(addr.id)}
                className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  active ? "border-lime-500 bg-lime-50" : "border-gray-100 hover:border-lime-200 bg-white"
                }`}
              >
                {/* Radio */}
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${active ? "border-lime-500 bg-lime-500" : "border-gray-300"}`}>
                    {active && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full ${active ? "bg-lime-200 text-lime-800" : "bg-gray-100 text-gray-600"}`}>
                        {addr.label}
                      </span>
                      <span className="text-sm font-black text-gray-800">{addr.name}</span>
                      <span className="text-xs text-gray-400 font-semibold">{addr.phone}</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-600 leading-relaxed">
                      {formatAddress(addr)}
                    </p>
                  </div>
                </div>

                {/* Edit / Delete */}
                <div className="flex gap-2 mt-3 ml-8">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(addr); }}
                    className="flex items-center gap-1 text-xs font-black text-lime-600 hover:text-lime-700 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <span className="text-gray-200">|</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(addr.id); }}
                    className="flex items-center gap-1 text-xs font-black text-red-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add new */}
          <button
            onClick={onAdd}
            className="w-full border-2 border-dashed border-gray-200 rounded-2xl py-4 text-sm font-bold text-gray-400 hover:border-lime-400 hover:text-lime-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Address
          </button>
        </div>

        {/* Confirm button */}
        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-lime-500 hover:bg-lime-600 rounded-xl text-sm font-black text-white transition-colors flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" /> Deliver Here
          </button>
        </div>
      </div>
    </div>
  );
}