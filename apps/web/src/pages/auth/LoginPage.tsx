import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../api/client";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("sagar@test.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    try {
      setLoading(true);

      await api.post("/auth/send-otp", {
        email,
        purpose: "login",
      });

      navigate("/verify-otp", {
        state: {
          email,
          mode: "login",
          password,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdfaf5] px-5">
      <div className="w-full max-w-md rounded-3xl border border-[#ede0c8] bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <img
            src="https://iskconahmedabad.com/images/logo.png"
            className="mx-auto h-20 w-20 object-contain"
          />
          <h1 className="mt-4 text-3xl font-black text-slate-900">
            Welcome Back
          </h1>
          <p className="mt-2 font-bold text-slate-500">
            Login as seeker, devotee or admin
          </p>
        </div>

        <label className="text-sm font-black text-slate-700">Email</label>
        <input
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold outline-none focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="mt-4 block text-sm font-black text-slate-700">
          Password
        </label>
        <input
          type="password"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold outline-none focus:border-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link to="/forgot-password" className="text-[#8b6914]">
          Forgot password?
        </Link>

        <button
          onClick={sendOtp}
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-[#c8902a] py-3 font-black text-[#1a0a00] hover:bg-[#d4a853] disabled:opacity-60"
        >
          {loading ? "Sending OTP..." : "Login with OTP"}
        </button>

        <div className="mt-6 flex justify-between text-sm font-bold">
          <Link to="/register/seeker" className="text-[#8b6914]">
            Register Seeker
          </Link>
          <Link to="/register/devotee" className="text-[#8b6914]">
            Register Devotee
          </Link>
        </div>
      </div>
    </div>
  );
}