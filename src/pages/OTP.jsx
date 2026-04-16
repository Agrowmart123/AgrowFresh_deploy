import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OTP() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const verifyOTP = () => {
    if (otp === "1234") {
      localStorage.setItem("token", "demo-token");
      localStorage.setItem("name", "Prajakta"); // login user name

      navigate("/shops");

      window.location.reload(); // Navbar refresh
    } else {
      alert("Demo OTP is 1234");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h1 className="text-xl font-bold mb-4 text-center">Enter OTP</h1>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
          placeholder="Enter OTP"
        />

        <button
          onClick={verifyOTP}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}
