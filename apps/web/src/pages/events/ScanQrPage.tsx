import { useState } from "react";
import { scanEventQr } from "../../services/eventService";

export default function ScanQrPage() {
  const [qrToken, setQrToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastScanned, setLastScanned] = useState<any>(null);
  const [error, setError] = useState("");

  const scan = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await scanEventQr(qrToken.trim());
      setLastScanned(res.data);
      setQrToken("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0e8d8] p-5">
      <div className="mx-auto max-w-md text-center">
        <h1 className="font-serif text-4xl font-black text-[#1a0a00]">Scan QR</h1>
        <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
          Paste attendee QR token to mark attendance.
        </p>

        <div className="mt-6 rounded-2xl border-2 border-[#f5e8c8] bg-white p-6">
          <div className="mx-auto mb-5 flex h-72 w-72 items-center justify-center rounded-2xl border-4 border-[#c8902a] bg-[#fdfaf5]">
            <div>
              <div className="text-5xl">📷</div>
              <p className="mt-3 text-sm font-black text-[#9a7a4a]">
                Camera feed here later
              </p>
            </div>
          </div>

          <textarea
            value={qrToken}
            onChange={(e) => setQrToken(e.target.value)}
            placeholder="Paste qr_token here..."
            className="min-h-24 w-full rounded-xl border border-[#ede0c8] px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
          />

          {error && (
            <div className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-black text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={scan}
            disabled={loading || !qrToken.trim()}
            className="mt-4 w-full rounded-xl bg-[#c8902a] px-5 py-3 font-black text-[#1a0a00] disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Mark Attendance"}
          </button>
        </div>

        {lastScanned && (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-left">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-700">
              ✓ Last Scanned
            </p>
            <h2 className="mt-2 text-xl font-black text-[#1a0a00]">
              {lastScanned.seeker?.first_name || "Seeker"}
            </h2>
            <p className="mt-1 text-sm font-bold text-[#5c3d1a]">
              Attendance marked for {lastScanned.event?.title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}