import React, { useState, useCallback } from "react";
import { Plus, MoreVertical, LocateFixed } from "lucide-react";
import { addAddress } from "../services/api";

const EMPTY_FORM = {
  name: "",
  phone: "",
  pincode: "",
  locality: "",
  address: "",
  city: "",
  state: "Maharashtra",
  landmark: "",
  alternatePhone: "",
  type: "HOME",
};

const TOAST_DURATION = 3000;

const validate = (formData) => {
  const errors = {};
  if (!formData.name.trim()) errors.name = "Name is required";
  if (!/^\d{10}$/.test(formData.phone)) errors.phone = "Enter valid 10-digit mobile number";
  if (!/^\d{6}$/.test(formData.pincode)) errors.pincode = "Enter valid 6-digit pincode";
  if (!formData.address.trim()) errors.address = "Address is required";
  if (!formData.city.trim()) errors.city = "City is required";
  if (!formData.state.trim()) errors.state = "State is required";
  return errors;
};

export default function Address() {
  const [showForm, setShowForm] = useState(false);
  const [showMenu, setShowMenu] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [errors, setErrors] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), TOAST_DURATION);
  }, []);

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  }, []);

  const resetForm = useCallback(() => {
    setShowForm(false);
    setEditingAddress(null);
    setFormData(EMPTY_FORM);
    setErrors({});
  }, []);

  const handleSave = async () => {
    const newErrors = validate(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await addAddress({
        addressLine: formData.address,
        areaDetails: formData.locality,
        landmark: formData.landmark,
        pincode: formData.pincode,
        townCity: formData.city,
        state: formData.state,
        latitude: coords.latitude,
        longitude: coords.longitude,
        addressType: formData.type,
        isDefault: addresses.length === 0,
        fullName: formData.name,
        phoneNumber: formData.phone,
        email: "",
      });

      if (editingAddress) {
        setAddresses((prev) =>
          prev.map((addr) => (addr.id === editingAddress.id ? { ...addr, ...formData } : addr))
        );
        showToast("Address updated successfully..");
      } else {
        setAddresses((prev) => [...prev, { id: Date.now(), ...formData }]);
        showToast("New address added successfully..");
      }

      resetForm();
    } catch (error) {
      showToast(error?.response?.data?.message || "Failed to save address", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = useCallback((id) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
    setShowMenu(null);
    showToast("Address deleted successfully..", "error");
  }, [showToast]);

  const handleEdit = useCallback((item) => {
    setEditingAddress(item);
    setFormData({ ...EMPTY_FORM, ...item });
    setShowForm(true);
    setShowMenu(null);
  }, []);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        setCoords({ latitude, longitude });
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const { address, display_name } = await res.json();
          setFormData((prev) => ({
            ...prev,
            address: display_name || "",
            city: address.city || address.town || address.village || "",
            state: address.state || "",
            pincode: address.postcode || "",
          }));
          showToast("Location fetched successfully 📍");
        } catch {
          showToast("Unable to fetch address", "error");
        }
      },
      () => showToast("Permission denied or location unavailable", "error")
    );
  };

  const inputClass = (field) =>
    `border p-2 rounded w-full ${errors[field] ? "border-red-500" : ""}`;

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
            onClick={() => { setEditingAddress(null); setFormData(EMPTY_FORM); setShowForm(true); }}
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

            <button
              onClick={handleUseCurrentLocation}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow"
            >
              <LocateFixed size={16} />
              Use my current location
            </button>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  className={inputClass("name")}
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  className={inputClass("phone")}
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  className={inputClass("pincode")}
                  placeholder="Pincode"
                  value={formData.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
              </div>
              <input
                className="border p-2 rounded"
                placeholder="Locality"
                value={formData.locality}
                onChange={(e) => handleChange("locality", e.target.value)}
              />
            </div>

            <div>
              <textarea
                className={inputClass("address")}
                placeholder="Address (Area and Street)"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  className={inputClass("city")}
                  placeholder="City/District/Town"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
              <select
                className="border p-2 rounded"
                value={formData.state}
                onChange={(e) => handleChange("state", e.target.value)}
              >
                <option>Maharashtra</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                className="border p-2 rounded"
                placeholder="Landmark (Optional)"
                value={formData.landmark}
                onChange={(e) => handleChange("landmark", e.target.value)}
              />
              <input
                className="border p-2 rounded"
                placeholder="Alternate Phone (Optional)"
                value={formData.alternatePhone}
                onChange={(e) => handleChange("alternatePhone", e.target.value)}
              />
            </div>

            <div>
              <p className="text-sm mb-2">Address Type</p>
              <div className="flex gap-6">
                {["HOME", "WORK"].map((type) => (
                  <label key={type} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={formData.type === type}
                      onChange={() => handleChange("type", type)}
                    />
                    {type.charAt(0) + type.slice(1).toLowerCase()}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-60"
              >
                {isSubmitting ? "SAVING..." : "SAVE"}
              </button>
              <button onClick={resetForm} className="text-green-600 font-medium">
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Address List */}
        <div className="p-5 space-y-4">
          {addresses
            .filter((item) => !editingAddress || item.id !== editingAddress.id)
            .map((item) => (
              <div
                key={item.id}
                className="border p-4 flex justify-between items-start hover:shadow-sm transition relative"
              >
                <div className="space-y-2">
                  <span className="bg-gray-200 text-xs px-2 py-1 rounded font-semibold">
                    {item.type}
                  </span>
                  <p className="font-medium text-gray-800">
                    {item.name}&nbsp;
                    <span className="text-gray-700">{item.phone}</span>
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.address} - <span className="font-medium">{item.pincode}</span>
                  </p>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowMenu(showMenu === item.id ? null : item.id)}
                    className="text-gray-500 hover:text-black"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {showMenu === item.id && (
                    <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-md z-10">
                      <button
                        onClick={() => handleEdit(item)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Edit
                      </button>
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
            ))}
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
