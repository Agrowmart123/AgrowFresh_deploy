import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, MoreVertical, LocateFixed, Loader2 } from "lucide-react";
import {
  getAllAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/api";

export default function Address() {
  const [showForm, setShowForm]         = useState(false);
  const [showMenu, setShowMenu]         = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [errors, setErrors]             = useState({});
  const [loading, setLoading]           = useState(false);
  const [saving, setSaving]             = useState(false);
  const [addresses, setAddresses]       = useState([]);
  const [toast, setToast]               = useState({ show: false, message: "", type: "success" });

  // ── Auth — user object from AuthContext ─────────────────────────
  const { user } = useAuth();
  const fullName    = user?.fullName    || user?.name  || "";
  const phoneNumber = user?.phoneNumber || user?.phone || "";
  const email       = user?.email       || "";

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ── Form state — NO name / phone / email (comes from auth) ───
  const emptyForm = {
    fullName: fullName,
    phoneNumber: phoneNumber,
    email: email,
    addressLine: "",
    areaDetails: "",
    landmark:    "",
    pincode:     "",
    townCity:    "",
    state:       "Maharashtra",
    latitude:    null,
    longitude:   null,
    addressType: "HOME",
    isDefault:   false,
  };

  const [formData, setFormData] = useState(emptyForm);

  // ── Fetch on mount ────────────────────────────────────────────
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await getAllAddresses();
      setAddresses(data || []);
    } catch (err) {
      showToast(err.message || "Failed to load addresses", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── Validation ────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!formData.addressLine.trim()) e.addressLine = "Address is required";
    if (!/^\d{6}$/.test(formData.pincode)) e.pincode = "Enter valid 6-digit pincode";
    if (!formData.townCity.trim())    e.townCity    = "City is required";
    if (!formData.state.trim())       e.state       = "State is required";
    return e;
  };

  // ── Build payload — merge form + logged-in user fields ───────
  const buildPayload = () => ({
    ...formData,
    fullName,
    phoneNumber,
    email,
  });

  // ── Save (Add / Update) ───────────────────────────────────────
  const handleSave = async () => {
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSaving(true);
    try {
      const payload = buildPayload();
      if (editingAddress) {
        const updated = await updateAddress(editingAddress.id, payload);
        setAddresses((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        showToast("Address updated successfully.");
      } else {
        const created = await addAddress(payload);
        setAddresses((prev) => [...prev, created]);
        showToast("New address added successfully.");
      }
      resetForm();
    } catch (err) {
      showToast(err.message || "Failed to save address", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setShowMenu(null);
    try {
      await deleteAddress(id);
      await fetchAddresses();
      // setAddresses((prev) => prev.filter((a) => a.id !== id));
      showToast("Address deleted successfully.", "error");
    } catch (err) {
      showToast(err.message || "Failed to delete address", "error");
    }
  };


  // ── Set Default ───────────────────────────────────────────────
  const handleSetDefault = async (id) => {
    setShowMenu(null);
    try {
      const updatedList = await setDefaultAddress(id);
      setAddresses(updatedList || []);
      showToast("Default address updated.");
    } catch (err) {
      showToast(err.message || "Failed to set default", "error");
    }
  };

  // ── Current Location (Reverse Geocoding) ─────────────────────
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation not supported by your browser", "error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        try {
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const addr = data.address;
          setFormData((prev) => ({
            ...prev,
            addressLine: data.display_name || "",
            townCity:    addr.city || addr.town || addr.village || "",
            state:       addr.state   || "",
            pincode:     addr.postcode || "",
            latitude,
            longitude,
          }));
          showToast("Location fetched successfully 📍");
        } catch {
          showToast("Unable to fetch address", "error");
        }
      },
      () => showToast("Permission denied or location unavailable", "error")
    );
  };

  // ── Helpers ───────────────────────────────────────────────────
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingAddress(null);
    setFormData(emptyForm);
    setErrors({});
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl bg-white rounded shadow-sm">

        {/* Heading */}
        <div className="p-5">
          <h2 className="text-lg font-semibold">Manage Addresses</h2>
        </div>

        {/* Add Address Button */}
        <div className="p-5">
          <button
            onClick={() => { setEditingAddress(null); setFormData(emptyForm); setShowForm(true); }}
            className="w-full flex items-center gap-2 border border-gray-300 p-4 text-green-600 font-medium hover:bg-gray-50 transition"
          >
            <Plus size={18} />
            ADD A NEW ADDRESS
          </button>
        </div>

        {/* Address Form */}
        {showForm && (
          <div className="border m-5 p-6 bg-gray-50 space-y-4">
            <p className="text-green-600 font-medium">
              {editingAddress ? "EDIT ADDRESS" : "ADD A NEW ADDRESS"}
            </p>

            {/* Read-only user info banner */}
            <div className="bg-white border rounded p-3 text-sm text-gray-600 space-y-1">
              <p><span className="font-medium text-gray-800">{fullName}</span></p>
              <p>{phoneNumber} · {email}</p>
            </div>

            {/* Location Button */}
            <button
              onClick={handleUseCurrentLocation}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow"
            >
              <LocateFixed size={16} />
              Use my current location
            </button>

            {/* Row 1 — pincode + areaDetails */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  className={`border p-2 rounded w-full ${errors.pincode ? "border-red-500" : ""}`}
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
              </div>
              <input
                className="border p-2 rounded"
                placeholder="Area / Locality"
                value={formData.areaDetails}
                onChange={(e) => handleChange("areaDetails", e.target.value)}
              />
            </div>

            {/* Row 2 — addressLine */}
            <div>
              <textarea
                className={`border p-2 rounded w-full ${errors.addressLine ? "border-red-500" : ""}`}
                placeholder="Flat / House No. / Building / Street"
                value={formData.addressLine}
                onChange={(e) => handleChange("addressLine", e.target.value)}
              />
              {errors.addressLine && <p className="text-red-500 text-sm mt-1">{errors.addressLine}</p>}
            </div>

            {/* Row 3 — townCity + state */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  className={`border p-2 rounded w-full ${errors.townCity ? "border-red-500" : ""}`}
                  placeholder="City / District / Town"
                  value={formData.townCity}
                  onChange={(e) => handleChange("townCity", e.target.value)}
                />
                {errors.townCity && <p className="text-red-500 text-sm mt-1">{errors.townCity}</p>}
              </div>
              <select
                className="border p-2 rounded"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
              >
                <option>Maharashtra</option>
              </select>
            </div>

            {/* Row 4 — landmark */}
            <input
              className="border p-2 rounded w-full"
              placeholder="Landmark (Optional)"
              value={formData.landmark}
              onChange={(e) => handleChange("landmark", e.target.value)}
            />

            {/* Address Type */}
            <div>
              <p className="text-sm mb-2">Address Type</p>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={formData.addressType === "HOME"}
                    onChange={() => handleChange("addressType", "HOME")} />
                  Home
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={formData.addressType === "WORK"}
                    onChange={() => handleChange("addressType", "WORK")} />
                  Work
                </label>
              </div>
            </div>

            {/* Set as Default */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => handleChange("isDefault", e.target.checked)}
              />
              Set as default address
            </label>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-6 py-2 rounded flex items-center gap-2 disabled:opacity-70"
              >
                {saving && <Loader2 size={16} className="animate-spin" />}
                SAVE
              </button>
              <button onClick={resetForm} className="text-green-600 font-medium">
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Address List */}
        <div className="p-5 space-y-4">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={28} className="animate-spin text-green-600" />
            </div>
          ) : addresses.length === 0 ? (
            <p className="text-gray-400 text-center py-6">No addresses saved yet.</p>
          ) : (
            addresses
              .filter((item) => !editingAddress || item.id !== editingAddress.id)
              .map((item) => (
                <div
                  key={item.id}
                  className="border p-4 flex justify-between items-start hover:shadow-sm transition relative"
                >
                  <div className="space-y-2">
                    {/* Type + Default badge */}
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-200 text-xs px-2 py-1 rounded font-semibold">
                        {item.addressType}
                      </span>
                      {item.isDefault && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-semibold">
                          DEFAULT
                        </span>
                      )}
                    </div>

                    {/* Name + Phone (from response, read-only) */}
                    <p className="font-medium text-gray-800">
                      {item.fullName}&nbsp;
                      <span className="text-gray-700">{item.phoneNumber}</span>
                    </p>

                    {/* Address lines */}
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.addressLine}
                      {item.areaDetails && `, ${item.areaDetails}`}
                      {item.landmark    && `, Near ${item.landmark}`}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {item.townCity}, {item.state} —{" "}
                      <span className="font-medium">{item.pincode}</span>
                    </p>
                  </div>

                  {/* Action Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(showMenu === item.id ? null : item.id)}
                      className="text-gray-500 hover:text-black"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {showMenu === item.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-md z-10">
                        <button
                          onClick={() => {
                            setEditingAddress(item);
                            setFormData({
                              addressLine: item.addressLine || "",
                              areaDetails: item.areaDetails || "",
                              landmark:    item.landmark    || "",
                              pincode:     item.pincode     || "",
                              townCity:    item.townCity    || "",
                              state:       item.state       || "Maharashtra",
                              latitude:    item.latitude    ?? null,
                              longitude:   item.longitude   ?? null,
                              addressType: item.addressType || "HOME",
                              isDefault:   item.isDefault   || false,
                            });
                            setShowForm(true);
                            setShowMenu(null);
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Edit
                        </button>

                        {!item.isDefault && (
                          <button
                            onClick={() => handleSetDefault(item.id)}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-green-600"
                          >
                            Set as Default
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <div
          className={`fixed bottom-5 right-5 px-6 py-3 rounded shadow-lg text-white transition-all duration-300 ${
            toast.type === "error" ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}