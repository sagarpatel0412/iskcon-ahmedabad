import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/authPasswordService";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!token) {
      alert("Reset token missing");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, password);

      alert("Password reset successfully");
      navigate("/login", { replace: true });
    } catch (error: any) {
      alert(error?.response?.data?.message || "Reset failed");
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
          Reset Password
        </h1>

        <p className="mt-2 text-center text-sm font-bold text-[#9a7a4a]">
          Create your new password.
        </p>

        <label className="mt-6 block text-sm font-black text-[#5c3d1a]">
          New Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] px-4 py-3 font-bold outline-none focus:border-[#c8902a]"
        />

        <label className="mt-4 block text-sm font-black text-[#5c3d1a]">
          Confirm Password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] px-4 py-3 font-bold outline-none focus:border-[#c8902a]"
        />

        <button
          onClick={submit}
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-[#c8902a] py-4 font-black text-[#1a0a00] hover:bg-[#d4a853] disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>

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