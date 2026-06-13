import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { saveToken, saveUser } from "../../services/authService";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, mode, registerData, password } = location.state || {};

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    try {
      setLoading(true);

      const verifyRes = await api.post("/auth/verify-otp", {
        email,
        otp,
        purpose: mode === "devotee_register" ? "register" : mode,
      });

      if (mode === "register") {
        await api.post("/auth/register", registerData);
        navigate("/login", { replace: true });
        return;
      }

      if (mode === "devotee_register") {
        await api.post("/devotee-requests/register", registerData);
        navigate("/login", { replace: true });
        return;
      }

      if (mode === "login") {
        const token = verifyRes.data.token;

        if (token) {
          saveToken(token);
          saveUser(verifyRes.data.user);
          navigate("/", { replace: true });
          return;
        }

        const loginRes = await api.post("/auth/login", {
          email,
          password,
          device_type: "web",
          device_name: "Browser",
        });

        saveToken(loginRes.data.token);
        saveUser(loginRes.data.user);

        navigate("/", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdfaf5] px-5">
      <div className="w-full max-w-md rounded-3xl border border-blue-100 bg-white p-8 shadow-xl">
        <img
            src="https://iskconahmedabad.com/images/logo.png"
            className="mx-auto h-20 w-20 object-contain"
        />
        <br/>
        <h1 className="text-center text-3xl font-black text-slate-900">
          Verify OTP
        </h1>

        <p className="mt-2 text-center font-bold text-slate-500">
          Enter OTP sent to {email}
        </p>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="mt-8 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-2xl font-black tracking-[0.4em] outline-none focus:border-blue-500"
          maxLength={6}
        />

        <button
          onClick={verify}
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-[#c8902a] py-3 font-black text-[#1a0a00] hover:bg-[#d4a853] disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}