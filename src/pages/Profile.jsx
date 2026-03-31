import React, { useEffect, useState } from "react";
import { IMAGES } from "../data/images";
import { useToast } from "../context/ToastContext";
import { Camera, Pencil } from "lucide-react";
import {
  getCustomerProfile,
  updateCustomerProfile,
  uploadProfilePhoto,
} from "../services/api";

// ─── Gender options ────────────────────────────────────────────────────────────
// Backend validates: Set.of("MALE", "FEMALE", "OTHER") — must be ALL CAPS exactly.
// We store internally as uppercase ("MALE" | "FEMALE" | "OTHER" | "")
// and display as capitalised labels.
const GENDER_OPTIONS = [
  { value: "MALE",   label: "Male"   },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER",  label: "Other"  },
];

// Normalise whatever the backend sends → one of our internal uppercase values
// Backend may return "Male", "MALE", "male", "OTHER", etc.
const normaliseGender = (raw) => {
  if (!raw) return "";
  const up = String(raw).trim().toUpperCase();
  return GENDER_OPTIONS.some((g) => g.value === up) ? up : "";
};

export default function Profile() {
  const { showToast } = useToast();

  // ── Profile photo ──────────────────────────────────────────────────────────
  const [profilePhoto,      setProfilePhoto]      = useState(IMAGES.defaultProfile);
  const [savedProfilePhoto, setSavedProfilePhoto] = useState(IMAGES.defaultProfile);
  const [pendingPhotoFile,  setPendingPhotoFile]  = useState(null); // raw File for upload
  const [isEditingPhoto,    setIsEditingPhoto]    = useState(false);
  const [showPhotoOptions,  setShowPhotoOptions]  = useState(false);
  const [photoSaving,       setPhotoSaving]       = useState(false);

  // ── Profile fields (saved / display values) ───────────────────────────────
  const [fullName, setFullName] = useState("");
  const [gender,   setGender]   = useState(""); // uppercase: "MALE" | "FEMALE" | "OTHER" | ""
  const [dob,      setDob]      = useState(""); // ISO yyyy-MM-dd
  const [email,    setEmail]    = useState("");
  const [mobile,   setMobile]   = useState(""); // read-only — backend bug blocks phone update

  // ── Page state ─────────────────────────────────────────────────────────────
  const [loading,   setLoading]   = useState(true);
  const [loadError, setLoadError] = useState("");

  // ── Edit mode ──────────────────────────────────────────────────────────────
  const [isPersonalEditMode, setIsPersonalEditMode] = useState(false);
  const [saving,             setSaving]             = useState(false);

  // Temp edit values — set when entering edit mode, discarded on cancel
  const [editFullName, setEditFullName] = useState("");
  const [editGender,   setEditGender]   = useState(""); // uppercase
  const [editDob,      setEditDob]      = useState("");
  const [editEmail,    setEditEmail]    = useState("");

  // ── Delete account dialog ──────────────────────────────────────────────────
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ── Fetch profile on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "/login"; return; }

    let mounted = true;
    const fetchProfile = async () => {
      setLoading(true);
      setLoadError("");
      try {
        const response = await getCustomerProfile();
        const data = response?.data?.data ?? response?.data ?? {};
        if (!mounted) return;

        setFullName(data.fullName    ?? "");
        setEmail(data.email          ?? "");
        setMobile(data.phone         ?? "");
        setDob(data.dateOfBirth ? String(data.dateOfBirth).slice(0, 10) : "");
        setGender(normaliseGender(data.gender));

        if (data.profileImage) {
          setProfilePhoto(data.profileImage);
          setSavedProfilePhoto(data.profileImage);
        }
      } catch (error) {
        if (!mounted) return;
        setLoadError(
          error?.response?.data?.message ?? "Failed to load profile details."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => { mounted = false; };
  }, []);

  // ── Photo handlers ─────────────────────────────────────────────────────────

  const handlePhotoFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPendingPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setProfilePhoto(reader.result);
      setIsEditingPhoto(true);
      setShowPhotoOptions(false);
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // allow re-selecting same file
  };

  // POST /customer/auth/upload-photo — multipart, field name "photo"
  const handlePhotoSave = async () => {
    if (!pendingPhotoFile) return;
    setPhotoSaving(true);
    try {
      await uploadProfilePhoto(pendingPhotoFile);
      setSavedProfilePhoto(profilePhoto);
      setPendingPhotoFile(null);
      setIsEditingPhoto(false);
      showToast("Profile photo updated successfully", "success");
    } catch (err) {
      showToast(
        err?.response?.data?.message ?? "Failed to upload photo. Try again.",
        "error"
      );
    } finally {
      setPhotoSaving(false);
    }
  };

  const handlePhotoCancel = () => {
    setProfilePhoto(savedProfilePhoto);
    setPendingPhotoFile(null);
    setIsEditingPhoto(false);
  };

  const handlePhotoRemove = () => {
    setProfilePhoto(IMAGES.defaultProfile);
    setSavedProfilePhoto(IMAGES.defaultProfile);
    setPendingPhotoFile(null);
    setShowPhotoOptions(false);
    showToast("Profile photo removed", "success");
  };

  // ── Personal info handlers ─────────────────────────────────────────────────

  const handleEditPersonal = () => {
    setEditFullName(fullName);
    setEditGender(gender);   // already uppercase
    setEditDob(dob);
    setEditEmail(email);
    setIsPersonalEditMode(true);
  };

  const handleCancelPersonal = () => {
    setIsPersonalEditMode(false);
  };

 const handleSavePersonal = async () => {
  if (!editEmail || !editEmail.includes("@") || !editEmail.includes(".")) {
    showToast("Please enter a valid email address", "error");
    return;
  }

  const hasChanged =
    editFullName !== fullName ||
    editGender   !== gender   ||
    editDob      !== dob      ||
    editEmail    !== email;

  if (!hasChanged) {
    showToast("No changes were made", "info");
    setIsPersonalEditMode(false);
    return;
  }

  setSaving(true);
  try {
    await updateCustomerProfile({
      fullName: editFullName || undefined,
      email: editEmail || undefined,
      gender: editGender || undefined,
      dateOfBirth: editDob || undefined,
      agreeTerms: true, //  FIX (MANDATORY)
    });

    setFullName(editFullName);
    setEmail(editEmail);
    setGender(editGender);
    setDob(editDob);
    setIsPersonalEditMode(false);

    showToast("Personal information updated successfully", "success");
  } catch (err) {
    const msg =
      (err?.response?.data?.message ??
        (typeof err?.response?.data === "string"
          ? err.response.data
          : "")) ||
      "Failed to update profile. Try again.";

    showToast(msg, "error");
  } finally {
    setSaving(false);
  }
};

  // ── Avatar URL ─────────────────────────────────────────────────────────────
  const avatarUrl =
    profilePhoto && profilePhoto !== IMAGES.defaultProfile
      ? profilePhoto
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
          fullName?.charAt(0) || "U"
        )}&background=fff&color=68911a&size=128&rounded=true&bold=true`;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-9 h-9 rounded-full border-4 border-green-100 border-t-[#68911a] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="w-full max-w-3xl bg-white/20 backdrop-blur-md border border-white/30 shadow-lg rounded-xl p-6">

        {loadError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
            {loadError}
          </div>
        )}

        {/* ──────────────── Personal Information ──────────────── */}
        <div className="mb-8">

          {/* ──────────────── Profile Photo ──────────────── */}
          <div className="mb-8 relative w-full h-40 rounded-xl">
            {/* Cover gradient */}
            <div
              className="w-full h-full rounded-xl"
              style={{ background: "linear-gradient(135deg, #68911a 0%, #efad23 100%)" }}
            />

            {/* Profile photo container */}
            <div className="absolute -bottom-12 left-6">
              <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg">
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />

                {/* Hidden file input */}
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoFileChange}
                />

                {/* Photo action buttons */}
                {!isEditingPhoto ? (
                  profilePhoto !== IMAGES.defaultProfile && !showPhotoOptions ? (
                    // Has photo — pencil to open options
                    <button
                      onClick={() => setShowPhotoOptions(true)}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors border-2 border-white shadow-md"
                      title="Photo options"
                    >
                      <Pencil size={16} className="text-white" />
                    </button>
                  ) : showPhotoOptions ? (
                    // Options: Change / Remove / Cancel
                    <div className="absolute -bottom-2 left-28 flex flex-row gap-2">
                      <button
                        onClick={() => document.getElementById("profile-photo-upload").click()}
                        className="text-[#68911a] px-2 py-2 hover:text-blue-700 text-sm font-medium transition-colors hover:underline whitespace-nowrap"
                      >
                        Change
                      </button>
                      <button
                        onClick={handlePhotoRemove}
                        className="text-[#68911a] px-2 py-2 hover:text-red-700 text-sm font-medium transition-colors hover:underline whitespace-nowrap"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => setShowPhotoOptions(false)}
                        className="text-gray-800 px-2 py-2 hover:text-gray-600 text-sm font-medium transition-colors hover:underline whitespace-nowrap"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    // No photo — camera to add
                    <button
                      onClick={() => document.getElementById("profile-photo-upload").click()}
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/80 transition-colors border-2 border-white shadow-md"
                      title="Add photo"
                    >
                      <Camera size={20} className="text-white" />
                    </button>
                  )
                ) : (
                  // Photo chosen — Save / Cancel
                  <div className="absolute bottom-0 left-14 translate-x-1/4 translate-y-1/4 flex flex-row gap-2">
                    <button
                      onClick={handlePhotoSave}
                      disabled={photoSaving}
                      className="text-[#68911a] px-4 py-2 hover:text-[#68911a]/80 text-sm font-medium hover:underline transition-colors disabled:opacity-60"
                    >
                      {photoSaving ? "Saving…" : "Save"}
                    </button>
                    <button
                      onClick={handlePhotoCancel}
                      disabled={photoSaving}
                      className="text-gray-800 px-4 py-2 hover:text-gray-600 text-sm font-medium transition-colors hover:underline disabled:opacity-60"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section header + Edit/Save/Cancel */}
          <div className="flex justify-between items-center mb-4 mt-16">
            <h2 className="text-lg font-semibold">Personal Information</h2>
            {!isPersonalEditMode ? (
              <button
                onClick={handleEditPersonal}
                className="text-[#68911a] text-sm font-medium hover:underline"
              >
                Edit
              </button>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={handleCancelPersonal}
                  disabled={saving}
                  className="text-gray-600 text-sm font-medium hover:underline disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePersonal}
                  disabled={saving}
                  className="bg-[#68911a] text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-[#5a7d15] disabled:opacity-60 flex items-center gap-2"
                >
                  {saving && (
                    <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  )}
                  {saving ? "Saving…" : "Save"}
                </button>
              </div>
            )}
          </div>

          {/* Form fields */}
          <div className="grid md:grid-cols-2 gap-4">

            {/* Full name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={isPersonalEditMode ? editFullName : fullName}
                onChange={(e) => isPersonalEditMode && setEditFullName(e.target.value)}
                disabled={!isPersonalEditMode}
                className={`border p-2 rounded w-full ${
                  isPersonalEditMode
                    ? "bg-white border-[#68911a] focus:outline-none focus:ring-2 focus:ring-[#68911a]/50"
                    : "bg-gray-50 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Date of birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={isPersonalEditMode ? editDob : dob}
                onChange={(e) => isPersonalEditMode && setEditDob(e.target.value)}
                disabled={!isPersonalEditMode}
                className={`border p-2 rounded w-full ${
                  isPersonalEditMode
                    ? "bg-white border-[#68911a] focus:outline-none focus:ring-2 focus:ring-[#68911a]/50"
                    : "bg-gray-50 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={isPersonalEditMode ? editEmail : email}
                onChange={(e) => isPersonalEditMode && setEditEmail(e.target.value)}
                disabled={!isPersonalEditMode}
                placeholder="Enter Email"
                className={`border p-2 rounded w-full ${
                  isPersonalEditMode
                    ? "bg-white border-[#68911a] focus:outline-none focus:ring-2 focus:ring-[#68911a]/50"
                    : "bg-gray-50 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Mobile — always read-only: backend bug blocks phone update via this endpoint */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  +91
                </span>
                <input
                  type="tel"
                  value={mobile}
                  disabled
                  placeholder="Mobile Number"
                  className="border p-2 pl-12 rounded w-full bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Gender — 3 options: Male / Female / Other */}
          {/* Sent as "MALE" | "FEMALE" | "OTHER" — backend validates this exact set */}
          <div className="mt-6">
            <p className="mb-2 font-medium">Your Gender</p>
            <div className="flex gap-6">
              {GENDER_OPTIONS.map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={value}
                    checked={
                      isPersonalEditMode ? editGender === value : gender === value
                    }
                    onChange={() => isPersonalEditMode && setEditGender(value)}
                    disabled={!isPersonalEditMode}
                    className="accent-[#68911a]"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ──────────────── Delete Account ──────────────── */}
        {/* NOTE: DELETE /customer/auth/delete endpoint does not exist on the backend yet. */}
        {/* The button shows a "coming soon" notice until the backend adds the endpoint.   */}
        <div className="mt-8 flex flex-col gap-2">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-500 text-left hover:underline text-sm w-fit"
            >
              Delete Account
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-red-700 mb-1">
                Delete your account?
              </p>
              <p className="text-xs text-red-500 mb-3">
                Account deletion is not yet available. Please contact support to
                request account deletion.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-xs font-medium text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
