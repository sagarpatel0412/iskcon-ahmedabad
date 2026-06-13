import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../services/authPasswordService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      await forgotPassword(email);
      setSent(true);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdfaf5] px-5">
      <div className="w-full max-w-md rounded-3xl border border-[#ede0c8] bg-white p-8 shadow-xl">
        <img
          src="https://iskconahmedabad.com/images/logo.png"
          className="mx-auto h-20 w-20 object-contain"
        />

        <h1 className="mt-5 text-center font-serif text-4xl font-black text-[#1a0a00]">
          Forgot Password
        </h1>

        <p className="mt-2 text-center text-sm font-bold text-[#9a7a4a]">
          Enter your email and we’ll send a reset link.
        </p>

        {sent ? (
          <div className="mt-6 rounded-2xl bg-[#f5e8c8] p-5 text-center font-bold text-[#5c3d1a]">
            If this email exists, reset link has been sent.
          </div>
        ) : (
          <>
            <label className="mt-6 block text-sm font-black text-[#5c3d1a]">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] px-4 py-3 font-bold outline-none focus:border-[#c8902a]"
            />

            <button
              onClick={submit}
              disabled={loading}
              className="mt-6 w-full rounded-2xl bg-[#c8902a] py-4 font-black text-[#1a0a00] hover:bg-[#d4a853] disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </>
        )}

        <Link
          to="/login"
          className="mt-5 block text-center text-sm font-black text-[#8b6914]"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}