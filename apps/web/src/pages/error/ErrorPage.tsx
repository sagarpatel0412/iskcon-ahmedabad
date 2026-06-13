import { Link } from "react-router-dom";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdfaf5] px-5">
      <div className="max-w-2xl rounded-[2rem] border border-[#ede0c8] bg-white p-10 text-center shadow-xl">
        <AlertTriangle
          size={70}
          className="mx-auto text-red-500"
        />

        <p className="mt-6 text-xs font-black uppercase tracking-[0.35em] text-[#8b6914]">
          Something Went Wrong
        </p>

        <h1 className="mt-4 font-serif text-5xl font-black text-[#1a0a00]">
          Unexpected Error
        </h1>

        <p className="mt-6 leading-8 text-[#7a5c36]">
          An unexpected error occurred while loading this
          page. Please try again or return to the dashboard.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-2xl bg-[#c8902a] px-6 py-4 font-black text-[#1a0a00] hover:bg-[#d4a853]"
          >
            <RefreshCw size={18} />
            Reload Page
          </button>

          <Link
            to="/"
            className="rounded-2xl border border-[#c8902a] px-6 py-4 font-black text-[#8b6914] hover:bg-[#f5e8c8]"
          >
            Go Home
          </Link>
        </div>

        <div className="mt-10 rounded-2xl bg-[#fdfaf5] p-5 text-sm text-[#7a5c36]">
          If this issue persists, please contact the
          ISKCON Ahmedabad support team.
        </div>
      </div>
    </div>
  );
}