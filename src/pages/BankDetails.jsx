import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CreditCard,
  User,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  AlertCircle,
  RefreshCw,
  Edit2,
} from "lucide-react";
import {
  getBankDetails,
  addBankDetails,
  updateBankDetail,
  deleteBankDetail,
} from "../services/api";

// ─── Theme constants ──────────────────────────────────────────────────────────

const G    = "#68911a";
const G_LT = "#f0f7e6";
const G_BD = "#c8e09a";

const BANK_THEMES = {
  "State Bank of India":  { bg: "#e3f2fd", color: "#1565c0", emoji: "🏦" },
  "HDFC Bank":            { bg: "#fdecea", color: "#c62828", emoji: "🏧" },
  "ICICI Bank":           { bg: "#fff3e0", color: "#e65100", emoji: "🏛️" },
  "Axis Bank":            { bg: "#f3e5f5", color: "#6a1b9a", emoji: "🔷" },
  "Kotak Mahindra Bank":  { bg: "#e8f5e9", color: "#2e7d32", emoji: "💳" },
  "Punjab National Bank": { bg: "#e8f4fd", color: "#1976d2", emoji: "🏦" },
  "Bank of Baroda":       { bg: "#fce4ec", color: "#880e4f", emoji: "🏧" },
  "Canara Bank":          { bg: "#e0f2f1", color: "#00695c", emoji: "🏦" },
  default:                { bg: G_LT,      color: "#386209", emoji: "🏦" },
};

// ─── AccountType enum values (must match Java enum exactly) ──────────────────
// Java: public enum AccountType { SAVINGS, CURRENT }
// We send "SAVINGS" or "CURRENT" as the accountType field in every request.
const ACCOUNT_TYPES = [
  { label: "Savings", value: "SAVINGS" },
  { label: "Current", value: "CURRENT" },
];

// ─── Validation ───────────────────────────────────────────────────────────────

const RULES = {
  bankName: {
    test: (v) => /^[A-Za-z][A-Za-z\s]{1,99}$/.test(v.trim()),
    msg: "Enter a valid bank name (letters only, min 2 chars)",
  },
  accountHolder: {
    test: (v) => /^[A-Za-z][A-Za-z\s]{1,99}$/.test(v.trim()),
    msg: "Enter the account holder name (letters only)",
  },
  accountNumber: {
    test: (v) => /^\d{9,18}$/.test(v.trim()),
    msg: "Account number must be 9–18 digits",
  },
  confirmAccountNumber: {
    test: (v, f) => v.trim() !== "" && v.trim() === f.accountNumber.trim(),
    msg: "Account numbers do not match",
  },
  ifsc: {
    test: (v) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v.trim()),
    msg: "Invalid IFSC — example: SBIN0001234",
  },
};

const validateField = (key, value, form) => {
  const r = RULES[key];
  if (!r) return "";
  return r.test(value ?? "", form) ? "" : r.msg;
};

const validateAll = (form) =>
  Object.keys(RULES).reduce((acc, key) => {
    const msg = validateField(key, form[key] ?? "", form);
    if (msg) acc[key] = msg;
    return acc;
  }, {});

// ─── Normalise single API response object → UI shape ─────────────────────────
// IMPORTANT: Backend has @OneToOne — one customer has at most ONE bank record.
// GET /bank-details returns a single CustomerBankDetailsResponseDTO (not an array).
// Fields: id, bankName, accountHolderName, accountNumber, ifscCode, upiNumber, accountType

const toUI = (b) => ({
  id:               b.id,
  bankName:         b.bankName          ?? "",
  accountHolder:    b.accountHolderName ?? "",
  // Mask last 4 digits for display; keep raw digits separately for API write calls
  accountNumber:    b.accountNumber
    ? `XXXX XXXX ${String(b.accountNumber).slice(-4)}`
    : "",
  rawAccountNumber: b.accountNumber ? String(b.accountNumber) : "",
  ifsc:             b.ifscCode         ?? "",
  // accountType comes back as Java enum string: "SAVINGS" or "CURRENT"
  type:             b.accountType      ?? "SAVINGS",
  upiNumber:        b.upiNumber        ?? "",
});

// ─── JSON payload for POST /bank-details and PUT /bank-details/{id} ──────────
// Maps frontend form fields → CustomerBankDetailsDTO field names exactly.
// confirmAccountNumber is @NotBlank — must always be present and non-empty.
// accountType must be enum string "SAVINGS" or "CURRENT".

const toPayload = (form) => ({
  bankName:             form.bankName.trim(),
  accountHolderName:    form.accountHolder.trim(),
  accountNumber:        form.accountNumber.trim(),
  ifscCode:             form.ifsc.trim().toUpperCase(),
  confirmAccountNumber: form.confirmAccountNumber.trim(),
  upiNumber:            form.upiNumber?.trim() ?? "",
  accountType:          form.type,   // "SAVINGS" | "CURRENT"
});

// ─── Blank / initial form state ───────────────────────────────────────────────

const BLANK = {
  bankName: "", accountHolder: "", accountNumber: "",
  confirmAccountNumber: "", ifsc: "", type: "SAVINGS", upiNumber: "",
};

// Pre-fill edit form from existing bank record.
// accountNumber / confirmAccountNumber are intentionally blank —
// we only store the masked display value so user must re-enter them.
const toEditForm = (bank) => ({
  bankName:             bank.bankName,
  accountHolder:        bank.accountHolder,
  accountNumber:        "",
  confirmAccountNumber: "",
  ifsc:                 bank.ifsc,
  type:                 bank.type,
  upiNumber:            bank.upiNumber ?? "",
});

// ─── Error extraction helper ──────────────────────────────────────────────────

const extractError = (e, fallback = "Something went wrong. Please try again.") => {
  const data = e?.response?.data;
  if (!data) return e?.message || fallback;
  if (typeof data === "string") return data;
  return data.message ?? data.error ?? data.msg ?? fallback;
};

// ─── Reusable field wrapper ───────────────────────────────────────────────────

const Field = ({ label, required, error, hint, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {hint && !error && <span className="text-[11px] text-gray-400">{hint}</span>}
    {error && (
      <span className="flex items-center gap-1 text-[11px] text-red-500 font-medium">
        <AlertCircle size={10} />{error}
      </span>
    )}
  </div>
);

// ─── Bank Form (shared by Add and Edit modes) ─────────────────────────────────

function BankForm({ initialForm = BLANK, submitLabel = "Save Bank Account", isEdit = false, onCancel, onSave }) {
  const [form,   setForm]   = useState(initialForm);
  const [errs,   setErrs]   = useState({});
  const [saving, setSaving] = useState(false);
  const [apiErr, setApiErr] = useState("");

  const set = (key, value) => {
    const next = { ...form, [key]: value };
    setForm(next);
    // Live-clear the field's own error
    if (errs[key]) setErrs((p) => ({ ...p, [key]: validateField(key, value, next) }));
    // When accountNumber changes, re-validate confirmAccountNumber too
    if (key === "accountNumber" && form.confirmAccountNumber) {
      setErrs((p) => ({
        ...p,
        confirmAccountNumber: validateField("confirmAccountNumber", form.confirmAccountNumber, next),
      }));
    }
  };

  const submit = async () => {
    const found = validateAll(form);
    if (Object.keys(found).length) { setErrs(found); return; }
    setSaving(true);
    setApiErr("");
    try {
      await onSave(form);
    } catch (e) {
      setApiErr(extractError(e, "Failed to save. Please check the details and try again."));
    } finally {
      setSaving(false);
    }
  };

  const inp = (key) =>
    `w-full border rounded-xl px-3 py-2.5 text-sm bg-white text-gray-800 outline-none transition-all
     focus:ring-2 focus:ring-[#68911a]/20 focus:border-[#68911a]
     ${errs[key] ? "border-red-400 bg-red-50/30" : "border-gray-200 hover:border-gray-300"}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-5">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100"
           style={{ background: G_LT }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
               style={{ background: G }}>
            {isEdit ? <Edit2 size={15} className="text-white" /> : <Plus size={15} className="text-white" />}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">
              {isEdit ? "Edit Bank Account" : "Add Bank Account"}
            </p>
            <p className="text-[11px] text-gray-500">All fields marked * are required</p>
          </div>
        </div>
        <button onClick={onCancel}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/80 transition-colors"
          style={{ color: G }}>
          <X size={16} />
        </button>
      </div>

      <div className="p-5 space-y-4">

        {/* API error banner */}
        {apiErr && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3">
            <AlertCircle size={15} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-600 font-medium">{apiErr}</p>
          </div>
        )}

        {/* Edit mode notice */}
        {isEdit && (
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-3">
            <AlertCircle size={15} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700 font-medium">
              For security, please re-enter your account number to confirm changes.
            </p>
          </div>
        )}

        {/* Bank name + Account holder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Bank Name" required error={errs.bankName}>
            <input className={inp("bankName")} placeholder="e.g. HDFC Bank"
              value={form.bankName}
              onChange={(e) => set("bankName", e.target.value)} />
          </Field>
          <Field label="Account Holder Name" required error={errs.accountHolder}>
            <input className={inp("accountHolder")} placeholder="As per bank records"
              value={form.accountHolder}
              onChange={(e) => set("accountHolder", e.target.value)} />
          </Field>
        </div>

        {/* Account number + Confirm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Account Number" required error={errs.accountNumber}>
            <input className={inp("accountNumber")} placeholder="9–18 digit number"
              inputMode="numeric" maxLength={18}
              value={form.accountNumber}
              onChange={(e) => set("accountNumber", e.target.value.replace(/\D/g, ""))} />
          </Field>
          <Field label="Confirm Account Number" required error={errs.confirmAccountNumber}>
            <input className={inp("confirmAccountNumber")} placeholder="Re-enter account number"
              inputMode="numeric" maxLength={18}
              onPaste={(e) => e.preventDefault()}
              value={form.confirmAccountNumber}
              onChange={(e) => set("confirmAccountNumber", e.target.value.replace(/\D/g, ""))} />
          </Field>
        </div>

        {/* IFSC + UPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="IFSC Code" required error={errs.ifsc}
                 hint="11 characters — e.g. SBIN0001234">
            <input className={inp("ifsc")} placeholder="SBIN0001234"
              maxLength={11}
              value={form.ifsc}
              onChange={(e) => set("ifsc", e.target.value.toUpperCase())} />
          </Field>
          <Field label="UPI ID" hint="Optional — e.g. name@upi">
            <input className={inp("upiNumber")} placeholder="name@upi"
              value={form.upiNumber}
              onChange={(e) => set("upiNumber", e.target.value)} />
          </Field>
        </div>

        {/* Account type — sends Java enum string SAVINGS | CURRENT */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-2">
            Account Type <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            {ACCOUNT_TYPES.map(({ label, value }) => (
              <button key={value} type="button" onClick={() => set("type", value)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                  form.type === value
                    ? "text-white border-transparent"
                    : "border-gray-200 text-gray-500 bg-white hover:border-gray-300"
                }`}
                style={form.type === value ? { background: G, borderColor: G } : {}}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button type="button" onClick={submit} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{ background: G }}>
            {saving
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{isEdit ? "Updating…" : "Saving…"}</>
              : submitLabel}
          </button>
          <button type="button" onClick={onCancel}
            className="sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold text-gray-600 border-2 border-gray-200 bg-white hover:border-gray-300 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Bank Card ────────────────────────────────────────────────────────────────

function BankCard({ bank, onEdit, onDelete }) {
  const t = BANK_THEMES[bank.bankName] ?? BANK_THEMES.default;
  const typeLabel = ACCOUNT_TYPES.find((a) => a.value === bank.type)?.label ?? bank.type;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

      {/* Primary banner */}
      <div className="flex items-center gap-1.5 px-4 py-1.5" style={{ background: G }}>
        <CheckCircle2 size={11} className="text-white" />
        <span className="text-[11px] font-bold text-white tracking-widest uppercase">
          Primary Account
        </span>
      </div>

      <div className="p-4">
        {/* Bank header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
               style={{ background: t.bg }}>
            {t.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm sm:text-[15px] truncate">
              {bank.bankName}
            </p>
            <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full mt-1"
                  style={{ background: t.bg, color: t.color }}>
              {typeLabel} Account
            </span>
          </div>
        </div>

        {/* Detail rows */}
        <div className="rounded-xl border border-gray-100 divide-y divide-gray-100 overflow-hidden mb-4">
          {[
            { Icon: User,       label: "Account Holder", value: bank.accountHolder, mono: false },
            { Icon: CreditCard, label: "Account Number",  value: bank.accountNumber, mono: true  },
            { Icon: Building2,  label: "IFSC Code",       value: bank.ifsc,          mono: true  },
          ].map(({ Icon, label, value, mono }) => (
            <div key={label} className="flex items-center gap-3 px-3 sm:px-4 py-3 bg-gray-50/60">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                   style={{ background: G_LT }}>
                <Icon size={13} style={{ color: G }} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                  {label}
                </p>
                <p className={`text-sm font-semibold text-gray-800 mt-0.5 truncate ${mono ? "tracking-wider font-mono" : ""}`}>
                  {value || "—"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={() => onEdit(bank)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold border-2 transition-all"
            style={{ borderColor: G, color: G }}
            onMouseEnter={(e) => { e.currentTarget.style.background = G; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = ""; e.currentTarget.style.color = G; }}>
            <Edit2 size={13} /> Edit Details
          </button>
          <button onClick={onDelete}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shrink-0">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({ bank, onCancel, onConfirm }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
            <Trash2 size={15} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-red-700">Remove bank account?</p>
            <p className="text-xs text-red-400 mt-0.5">
              {bank?.bankName
                ? `${bank.bankName} · ${bank.accountNumber} will be unlinked.`
                : "This account will be permanently unlinked."}
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={onCancel}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function BankDetails() {
  const navigate = useNavigate();

  // Backend @OneToOne — at most one bank record per customer
  const [bank,       setBank]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [fetchErr,   setFetchErr]   = useState("");
  const [mode,       setMode]       = useState("view"); // "view" | "add" | "edit"
  const [editForm,   setEditForm]   = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [actionErr,  setActionErr]  = useState("");

  // ── auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!localStorage.getItem("token")) { navigate("/login"); return; }
    loadBank();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── fetch ───────────────────────────────────────────────────────────────────
  // The service does: findByCustomerId(...).orElseThrow(RuntimeException("Bank details not found"))
  // Spring wraps unhandled RuntimeException as 500.
  // We detect the "not found" message in the 500 body and treat it as empty state.
  const loadBank = useCallback(async () => {
    setLoading(true);
    setFetchErr("");
    try {
      const res  = await getBankDetails();
      // Response is a single DTO: { id, bankName, accountHolderName, accountNumber, ifscCode, upiNumber, accountType }
      const data = res?.data;
      setBank(data && data.id ? toUI(data) : null);
    } catch (err) {
      const status  = err?.response?.status;
      const message = err?.response?.data?.message
        ?? err?.response?.data
        ?? "";

      // 401 is handled globally by axios interceptor (redirects to /login)
      if (status === 401) return;

      // Explicit "no record" statuses
      if (status === 404 || status === 204) {
        setBank(null);
        return;
      }

      // Backend throws RuntimeException("Bank details not found") → Spring 500
      // Detect by message content and treat as empty state (not a real server error)
      if (
        status === 500 &&
        typeof message === "string" &&
        message.toLowerCase().includes("not found")
      ) {
        setBank(null);
        return;
      }

      // Genuine server / network error — show retry banner
      setFetchErr(
        status === 500 || !status
          ? "Unable to reach the server right now. Please try again."
          : extractError(err, "Failed to load bank details. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ── add ─────────────────────────────────────────────────────────────────────
  // POST /bank-details — axios sends application/json by default (no FormData)
  // Backend saveBankDetails() does upsert: findByCustomerId().orElse(new Entity())
  const handleAdd = useCallback(async (form) => {
    await addBankDetails(toPayload(form));
    setMode("view");
    await loadBank();
  }, [loadBank]);

  // ── edit ─────────────────────────────────────────────────────────────────────
  // PUT /bank-details/{id} — same DTO as POST, user must re-enter account number
  const handleEdit = useCallback(async (form) => {
    if (!bank?.id) return;
    await updateBankDetail(bank.id, toPayload(form));
    setMode("view");
    setEditForm(null);
    await loadBank();
  }, [bank, loadBank]);

  const openEdit = useCallback((bankRecord) => {
    setEditForm(toEditForm(bankRecord));
    setMode("edit");
    setActionErr("");
  }, []);

  // ── delete ──────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async () => {
    if (!bank?.id) return;
    setActionErr("");
    try {
      await deleteBankDetail(bank.id);
      setShowDelete(false);
      setBank(null);   // immediately clear UI; don't need to refetch
    } catch (e) {
      setShowDelete(false);
      setActionErr(extractError(e, "Unable to delete. Try again."));
    }
  }, [bank]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 shrink-0">
            <ArrowLeft size={18} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-bold text-gray-900 truncate">Bank Details</h1>
            <p className="text-xs text-gray-400 hidden sm:block">
              Manage your linked bank account
            </p>
          </div>
          {/* Add button — only when no bank record exists and not in a form */}
          {!bank && mode === "view" && (
            <button
              onClick={() => { setMode("add"); setActionErr(""); }}
              className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full text-white hover:opacity-90 transition-opacity shrink-0"
              style={{ background: G }}>
              <Plus size={13} />
              <span className="hidden sm:inline">Add Account</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-5 pb-20">

        {/* Security badge */}
        <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 mb-5 border"
             style={{ background: G_LT, borderColor: G_BD }}>
          <ShieldCheck size={15} style={{ color: G }} className="shrink-0" />
          <p className="text-xs text-gray-600">
            Your bank details are{" "}
            <span className="font-bold text-gray-800">encrypted & secure</span>.
            {" "}We never store full account numbers.
          </p>
        </div>

        {/* Fetch error with retry */}
        {fetchErr && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5 mb-5">
            <div className="flex items-start gap-2 flex-1">
              <AlertCircle size={15} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-600">{fetchErr}</p>
            </div>
            <button onClick={loadBank}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-100 transition-colors shrink-0 self-start sm:self-center">
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        )}

        {/* Action error */}
        {actionErr && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
            <AlertCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
            <p className="text-xs text-red-600 font-medium">{actionErr}</p>
          </div>
        )}

        {/* Add form */}
        {mode === "add" && (
          <BankForm
            initialForm={BLANK}
            submitLabel="Save Bank Account"
            onCancel={() => setMode("view")}
            onSave={handleAdd}
          />
        )}

        {/* Edit form */}
        {mode === "edit" && editForm && (
          <BankForm
            initialForm={editForm}
            submitLabel="Update Bank Account"
            isEdit
            onCancel={() => { setMode("view"); setEditForm(null); }}
            onSave={handleEdit}
          />
        )}

        {/* Delete confirm */}
        {showDelete && bank && (
          <DeleteConfirm
            bank={bank}
            onCancel={() => setShowDelete(false)}
            onConfirm={handleDelete}
          />
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
                 style={{ borderColor: G_BD, borderTopColor: G }} />
            <p className="text-sm text-gray-400">Loading bank account…</p>
          </div>

        /* Empty state */
        ) : !fetchErr && !bank && mode === "view" ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
                 style={{ background: G_LT }}>
              🏦
            </div>
            <div>
              <p className="font-bold text-gray-800 text-base">No bank account linked</p>
              <p className="text-sm text-gray-400 mt-1">
                Add a bank account to receive payments seamlessly
              </p>
            </div>
            <button onClick={() => setMode("add")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-sm font-bold hover:opacity-90 transition-opacity"
              style={{ background: G }}>
              <Plus size={15} /> Add Bank Account
            </button>
          </div>

        /* Bank card */
        ) : bank && mode === "view" ? (
          <BankCard
            bank={bank}
            onEdit={openEdit}
            onDelete={() => { setShowDelete(true); setActionErr(""); }}
          />
        ) : null}
      </main>
    </div>
  );
}
