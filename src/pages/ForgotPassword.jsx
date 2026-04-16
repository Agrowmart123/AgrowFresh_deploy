import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye, EyeOff, Lock, Mail, CheckCircle2, AlertCircle,
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import { forgotPassword, resetPassword } from "../services/api";

const PRIMARY = "#68911a";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);

  // step 1
  const [email,      setEmail]      = useState("");
  const [emailError, setEmailError] = useState("");

  // step 2
  const [otp,      setOtp]      = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const otpRefs = useRef([]);

  // step 3
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [passwordError,   setPasswordError]   = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── password strength (same as Register.jsx) ─────────────────────────────
  function getPasswordStrength(p) {
    if (!p) return { score: 0, label: "", color: "" };
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    const levels = [
      { score: 1, label: "Weak",   color: "#ef4444" },
      { score: 2, label: "Fair",   color: "#f97316" },
      { score: 3, label: "Good",   color: "#eab308" },
      { score: 4, label: "Strong", color: PRIMARY   },
    ];
    return levels[score - 1] || { score: 0, label: "", color: "" };
  }

  const strength = getPasswordStrength(newPassword);
  const passwordRules = [
    { met: newPassword.length >= 8,          text: "≥ 8 characters" },
    { met: /[A-Z]/.test(newPassword),        text: "1 uppercase"    },
    { met: /[0-9]/.test(newPassword),        text: "1 number"       },
    { met: /[^A-Za-z0-9]/.test(newPassword), text: "1 special char" },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 1 — send OTP to email
  // POST /customer/auth/forgot-password  { email }
  // ─────────────────────────────────────────────────────────────────────────
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setEmailError("");

    const trimmed = email.trim();
    if (!trimmed) { setEmailError("Email is required"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword({ email: trimmed });
      showToast("OTP sent to your email!", "success");
      setStep(2);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (error) {
      setEmailError(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Could not send OTP. Please check your email and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 2 — OTP verification (moves to step 3, no extra API call)
  // ─────────────────────────────────────────────────────────────────────────
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    setOtpError("");
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      otpRefs.current[index - 1]?.focus();
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.join("").length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }
    setOtpError("");
    setStep(3);
  };

  const handleResend = async () => {
    setOtpError("");
    setOtp(["", "", "", "", "", ""]);
    setIsSubmitting(true);
    try {
      await forgotPassword({ email: email.trim() });
      showToast("OTP resent to your email!", "success");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setOtpError("Could not resend OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // STEP 3 — reset password
  // POST /customer/auth/reset-password  { email, newPassword, code }
  // ─────────────────────────────────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (!newPassword)                         { setPasswordError("Password is required"); return; }
    if (newPassword.length < 8)               { setPasswordError("Minimum 8 characters required"); return; }
    if (!/[A-Z]/.test(newPassword))           { setPasswordError("Must include at least one uppercase letter"); return; }
    if (!/[0-9]/.test(newPassword))           { setPasswordError("Must include at least one number"); return; }
    if (!/[^A-Za-z0-9]/.test(newPassword))   { setPasswordError("Must include at least one special character"); return; }
    if (!confirmPassword)                     { setPasswordError("Please confirm your password"); return; }
    if (newPassword !== confirmPassword)      { setPasswordError("Passwords do not match"); return; }

    setIsSubmitting(true);
    try {
      await resetPassword({
        email:       email.trim(),
        newPassword: newPassword,
        code:        otp.join(""),
      });
      showToast("Password reset successful! Please login.", "success");
      navigate("/login");
    } catch (error) {
      setPasswordError(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Invalid or expired OTP. Please start over."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-white">

      {/* Left image */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 h-[600px]">
        <img
          src="/FP1.png"
          alt="Forgot password"
          className="w-full h-full object-contain rounded-2xl"
        />
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-8 py-12 relative overflow-hidden">

        <img
          src="/login2.png"
          alt="bg"
          className="absolute top-4 right-4 w-64 opacity-30 pointer-events-none"
        />

        <div className="w-full max-w-md">

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "New Password"}
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 mb-8">
            {step === 1 && "Enter your registered email and we'll send you an OTP."}
            {step === 2 && (
              <>OTP sent to{" "}
                <span className="font-semibold text-gray-800">{email}</span>.
                {" "}Check your inbox.
              </>
            )}
            {step === 3 && "Create a strong new password for your account."}
          </p>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200"
                  style={{
                    background: step >= s ? PRIMARY : "#e5e7eb",
                    color:      step >= s ? "#fff"   : "#9ca3af",
                  }}
                >
                  {step > s ? <CheckCircle2 size={16} /> : s}
                </div>
                {s < 3 && (
                  <div
                    className="flex-1 h-1 rounded-full transition-all duration-300"
                    style={{ background: step > s ? PRIMARY : "#e5e7eb" }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* ══ STEP 1 — Email only ══ */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5" noValidate>

              <div>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    placeholder="Enter your registered email"
                    autoFocus
                    className={`w-full bg-white border-2 ${
                      emailError ? "border-red-400" : "border-[#68911a]"
                    } rounded-xl pl-12 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#567514]`}
                  />
                </div>
                {emailError && (
                  <p className="mt-1 text-red-500 text-sm flex items-center gap-1">
                    <AlertCircle size={14} /> {emailError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#68911a] text-white font-bold py-3 rounded-xl hover:bg-[#5f8217] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </button>

              <p className="text-center text-sm text-gray-600">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-[#68911a] font-semibold hover:text-[#567514]"
                >
                  Sign In
                </button>
              </p>

            </form>
          )}

          {/* ══ STEP 2 — OTP ══ */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5" noValidate>

              <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    className={`w-12 h-12 text-center text-lg font-semibold border-2 ${
                      otpError ? "border-red-400" : "border-[#68911a]"
                    } rounded-lg focus:outline-none focus:border-[#567514] transition`}
                  />
                ))}
              </div>

              {otpError && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} /> {otpError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#68911a] text-white font-bold py-3 rounded-xl hover:bg-[#5f8217] transition"
              >
                Verify OTP
              </button>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <button
                  type="button"
                  onClick={() => { setStep(1); setOtp(["","","","","",""]); setOtpError(""); }}
                  className="hover:text-[#68911a] transition"
                >
                  ← Change email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isSubmitting}
                  className="text-[#68911a] font-semibold hover:text-[#567514] disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Resend OTP"}
                </button>
              </div>

            </form>
          )}

          {/* ══ STEP 3 — New Password ══ */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5" noValidate>

              {/* New password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setPasswordError(""); }}
                  placeholder="New Password"
                  autoFocus
                  className={`w-full bg-white border-2 ${
                    passwordError ? "border-red-400" : "border-[#68911a]"
                  } rounded-xl pl-12 pr-12 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#567514]`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Strength bar */}
              {newPassword && (
                <div className="space-y-2 px-1">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full flex overflow-hidden">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="flex-1 h-full transition-all"
                          style={{ background: i <= strength.score ? strength.color : "transparent" }}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <span className="text-xs font-semibold" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {passwordRules.map((rule) => (
                      <div key={rule.text} className="flex items-center gap-1.5">
                        {rule.met
                          ? <CheckCircle2 size={14} color={PRIMARY} />
                          : <AlertCircle size={14} className="text-gray-400" />}
                        <span className={rule.met ? "text-gray-700" : "text-gray-400"}>
                          {rule.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(""); }}
                  placeholder="Confirm Password"
                  className={`w-full bg-white border-2 ${
                    confirmPassword.length > 0 && newPassword !== confirmPassword
                      ? "border-red-400"
                      : "border-[#68911a]"
                  } rounded-xl pl-12 pr-12 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#567514]`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Match indicator */}
              {confirmPassword.length > 0 && (
                <p className={`text-xs flex items-center gap-1 ${
                  newPassword === confirmPassword ? "text-[#68911a]" : "text-red-500"
                }`}>
                  {newPassword === confirmPassword
                    ? <CheckCircle2 size={14} />
                    : <AlertCircle size={14} />}
                  {newPassword === confirmPassword ? "Passwords match" : "Passwords do not match"}
                </p>
              )}

              {passwordError && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle size={14} /> {passwordError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#68911a] text-white font-bold py-3 rounded-xl hover:bg-[#5f8217] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>

              <button
                type="button"
                onClick={() => { setStep(2); setPasswordError(""); }}
                className="w-full text-sm text-gray-500 hover:text-[#68911a] transition"
              >
                ← Back to OTP
              </button>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
