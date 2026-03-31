import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { loginCustomer } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    emailOrMobile: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { emailOrMobile, password } = form;

    // Email or Mobile validation
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrMobile);
    const isMobile = /^\d{10}$/.test(emailOrMobile);

    if (!emailOrMobile) {
      showToast("Email or mobile is required", "error");
      return;
    }

    if (!isEmail && !isMobile) {
      showToast("Enter valid email or 10-digit mobile", "error");
      return;
    }

    if (!password) {
      showToast("Password is required", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await loginCustomer({
        login: emailOrMobile.trim(),
        password,
        fcmToken: "",
      });
      const token = response?.data?.token;
      if (!token) {
        throw new Error("Token missing in response");
      }
      localStorage.setItem("token", token);
      login({
        name: response?.data?.user?.fullName || "Customer",
        email: response?.data?.user?.email || emailOrMobile.trim(),
      });
      showToast("Login successful!", "success");
      navigate("/");
    } catch (error) {
      showToast(
        error?.response?.data?.message || "Invalid credentials",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-white items-center justify-center p-8 h-[600px]">
        {" "}
        <img
          src="/Login1.png"
          alt="Fresh produce"
          className="w-full h-full object-contain rounded-2xl"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-8 py-12 relative overflow-hidden">
        {/* Background PNG */}
        <img
          src="/login2.png"
          alt="background"
          className="absolute top-4 right-4 w-64 opacity-30 pointer-events-none"
        />

        <div className="w-full max-w-md">
          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </h1>

          {/* Signup Link */}
          <p className="text-gray-600 mb-8">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-[#68911a] font-semibold hover:text-[#567514]"
            >
              Sign Up
            </a>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email / Mobile Input */}
            <div>
              <input
                type="text"
                name="emailOrMobile"
                value={form.emailOrMobile}
                onChange={handleChange}
                placeholder="Enter Email or Mobile Number"
                className="w-full bg-white border border-[#68911a] rounded-xl px-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#68911a]"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter Password"
                autoComplete="off"
                className="w-full bg-white border border-[#68911a] rounded-xl px-4 py-3 pr-12 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-[#68911a] hide-password-toggle"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-[#68911a] font-semibold hover:text-[#567514]"
              >
                Forgot your password?
              </a>
            </div>

            {/* Terms Text */}
            <p className="text-xs text-gray-600">
              By continuing, you agree to our{" "}
              <a
                href="/terms"
                className="text-[#68911a] font-medium hover:underline"
              >
                Terms of Use
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="text-[#68911a] font-medium hover:underline"
              >
                Privacy Policy
              </a>
              .
            </p>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#68911a] text-white font-bold py-3 rounded-xl hover:bg-[#5f8217] transition"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}
