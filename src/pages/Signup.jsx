import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { registerCustomer } from "../services/api";

const PRIMARY = "#68911a";

export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { login } = useAuth();

  const [form, setForm] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = getPasswordStrength(form.password);

  function getPasswordStrength(password) {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { score: 1, label: "Weak", color: "#ef4444" },
      { score: 2, label: "Fair", color: "#f97316" },
      { score: 3, label: "Good", color: "#eab308" },
      { score: 4, label: "Strong", color: PRIMARY },
    ];

    return levels[score - 1] || { score: 0, label: "", color: "" };
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formatted = value;

    if (name === "mobile") {
      const digits = value.replace(/\D/g, "").slice(0, 10);

      setForm((prev) => ({
        ...prev,
        mobile: digits,
      }));

      if (errors.mobile) {
        setErrors((prev) => ({ ...prev, mobile: "" }));
      }

      return;
    }

    if (name === "confirmPassword") {
      if (form.password !== value) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
      }
    }

    if (name === "password" && form.confirmPassword) {
      if (value !== form.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
      }
    }

    if (name === "fullName") {
      const parts = value.trim().split(" ");

      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || "";

      setForm((prev) => ({
        ...prev,
        fullName: value,
        firstName,
        lastName,
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: formatted }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) {
      e.fullName = "Full name is required";
    } else {
      const parts = form.fullName.trim().split(" ");
      if (parts.length < 2) {
        e.fullName = "Enter first and last name";
      }
    }

    if (!form.mobile) {
      e.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(form.mobile)) {
      e.mobile = "Enter valid 10-digit mobile number";
    }
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email)) {
      e.email = "Enter a valid mail (example@gmail.com)";
    }

    if (!form.dob) {
      e.dob = "Date of birth is required";
    } else {
      const today = new Date();
      const dob = new Date(form.dob);

      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        e.dob = "You must be at least 18 years old";
      }
    }

    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters";

    if (!form.confirmPassword) e.confirmPassword = "Please confirm password";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    if (!agreed) e.terms = "You must agree to the Terms & Privacy Policy";

    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    try {
      await registerCustomer({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.mobile.trim(),
        password: form.password,
        dateOfBirth: form.dob,
        agreeTerms: agreed,
      });
      showToast("Registration successful!", "success");
      navigate("/login");
    } catch (error) {
      const apiErrors = error?.response?.data?.errors;
      const message =
        error?.response?.data?.message || "Registration failed. Please try again.";

      if (apiErrors && typeof apiErrors === "object") {
        const mapped = {};
        Object.entries(apiErrors).forEach(([k, v]) => {
          const val = Array.isArray(v) ? v[0] : v;
          if (k.toLowerCase().includes("phone")) mapped.mobile = val;
          else if (k.toLowerCase().includes("date")) mapped.dob = val;
          else if (k.toLowerCase().includes("term")) mapped.terms = val;
          else mapped[k] = val;
        });
        setErrors((prev) => ({ ...prev, ...mapped }));
      } else {
        showToast(message, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordRules = [
    { met: form.password.length >= 8, text: "≥ 8 characters" },
    { met: /[A-Z]/.test(form.password), text: "1 uppercase" },
    { met: /[0-9]/.test(form.password), text: "1 number" },
    { met: /[^A-Za-z0-9]/.test(form.password), text: "1 special char" },
  ];

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-white items-center justify-center p-8">
        <img
          src="/signup1.png"
          alt="Fresh produce"
          className="max-w-md h-auto object-contain rounded-2xl"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-8 py-12 relative overflow-hidden">
        {/* Background decoration */}
        <img
          src="/login2.png"
          alt="decoration"
          className="absolute top-4 right-4 w-64 opacity-30 pointer-events-none"
        />

        <div className="w-full max-w-md space-y-8">
          {/* Title */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-2">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-[#68911a] font-semibold hover:text-[#567514]"
              >
                Sign In
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className={`w-full bg-white border-2 ${errors.fullName ? "border-red-400" : "border-[#68911a]"} rounded-xl pl-12 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#567514]`}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div className="relative flex items-center">
              <Phone className="absolute left-4 text-gray-400" size={20} />

              {/* Static +91 */}
              <span className="absolute left-12 text-gray-700 font-medium">
                +91
              </span>

              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="0000000000"
                className={`w-full bg-white border-2 ${
                  errors.mobile ? "border-red-400" : "border-[#68911a]"
                } rounded-xl pl-20 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#567514]`}
              />
            </div>
            {errors.mobile && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.mobile}
              </p>
            )}

            {/* Email */}
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={`w-full bg-white border-2 ${errors.email ? "border-red-400" : "border-[#68911a]"} rounded-xl pl-12 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#567514]`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.email}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="relative">
              <Calendar
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                max={
                  new Date(
                    new Date().setFullYear(new Date().getFullYear() - 18),
                  )
                    .toISOString()
                    .split("T")[0]
                }
                className={`w-full bg-white border-2 ${
                  errors.dob ? "border-red-400" : "border-[#68911a]"
                } rounded-xl pl-12 pr-4 py-3 text-gray-800 focus:outline-none focus:border-[#567514]`}
              />

              {errors.dob && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.dob}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className={`w-full bg-white border-2 ${errors.password ? "border-red-400" : "border-[#68911a]"} rounded-xl pl-12 pr-12 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#567514]`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.password}
                </p>
              )}
            </div>

            {/* Password strength */}
            {form.password && (
              <div className="space-y-2 px-1">
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden flex">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-full transition-all"
                        style={{
                          background:
                            i <= strength.score
                              ? strength.color
                              : "transparent",
                        }}
                      />
                    ))}
                  </div>
                  {strength.label && (
                    <span
                      className="text-xs font-semibold"
                      style={{ color: strength.color }}
                    >
                      {strength.label}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {passwordRules.map((rule) => (
                    <div key={rule.text} className="flex items-center gap-1.5">
                      {rule.met ? (
                        <CheckCircle2 size={14} style={{ color: PRIMARY }} />
                      ) : (
                        <AlertCircle size={14} className="text-gray-400" />
                      )}
                      <span
                        className={rule.met ? "text-gray-700" : "text-gray-400"}
                      >
                        {rule.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div>
              {/* Input Wrapper */}
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />

                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`w-full bg-white border-2 ${
                    errors.confirmPassword
                      ? "border-red-400"
                      : form.confirmPassword.length > 0
                        ? form.password === form.confirmPassword
                          ? "border-[#68911a]"
                          : "border-red-400"
                        : "border-[#68911a]"
                  } rounded-xl pl-12 pr-12 py-3 text-gray-800 focus:outline-none focus:border-[#567514]`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Message OUTSIDE */}
              <div className="mt-1 min-h-[20px]">
                {errors.confirmPassword ? (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.confirmPassword}
                  </p>
                ) : form.confirmPassword.length > 0 ? (
                  <p
                    className={`text-xs flex items-center gap-1 ${
                      form.password === form.confirmPassword
                        ? "text-[#68911a]"
                        : "text-red-500"
                    }`}
                  >
                    {form.password === form.confirmPassword ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <AlertCircle size={14} />
                    )}
                    {form.password === form.confirmPassword
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => {
                  setAgreed((prev) => {
                    const newValue = !prev;

                    if (newValue && errors.terms) {
                      setErrors((prevErr) => ({ ...prevErr, terms: "" }));
                    }

                    return newValue;
                  });
                }}
                className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${
                  agreed
                    ? "bg-[#68911a] border-[#68911a]"
                    : errors.terms
                      ? "border-red-400"
                      : "border-gray-400"
                }`}
              >
                {agreed && (
                  <Check size={14} className="text-white" strokeWidth={3} />
                )}
              </button>

              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <a
                  href="/terms"
                  className="text-[#68911a] font-medium hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy"
                  className="text-[#68911a] font-medium hover:underline"
                >
                  Privacy Policy
                </a>
              </span>
            </div>

            {/* ERROR BELOW */}
            {errors.terms && (
              <p className="text-xs text-red-500 flex items-center gap-1 mt-1 ml-8">
                <AlertCircle size={14} /> {errors.terms}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#68911a] text-white font-bold py-3 rounded-xl hover:bg-[#567514] transition mt-2"
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
