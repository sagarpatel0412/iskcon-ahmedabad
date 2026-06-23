import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  History,
  Loader2,
  Package,
} from "lucide-react";
import { getShopInventoryLogs } from "../../../services/shopService";

export default function AdminShopInventoryPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getShopInventoryLogs({
        page,
        limit: 20,
      });

      setLogs(res.data.items || []);
      setPagination(res.data.pagination || null);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load inventory logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  return (
    <main className="min-h-screen bg-[#fdfaf5] p-5">
      <div className="mb-6">
        <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
          Inventory History
        </h1>
        <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
          Track stock added, reduced, sold and manually adjusted.
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-[#ede0c8] bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#c8902a]" />
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#ede0c8] bg-white p-12 text-center">
          <History className="mx-auto h-12 w-12 text-[#c8902a]" />
          <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
            No inventory logs
          </h2>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm">
          <div className="grid grid-cols-[1.5fr_150px_120px_120px_180px] border-b border-[#ede0c8] bg-[#f7f0e4] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#8b6914]">
            <div>Product</div>
            <div>Type</div>
            <div>Change</div>
            <div>Stock</div>
            <div>Date</div>
          </div>

          {logs.map((log) => (
            <div
              key={log.uuid}
              className="grid grid-cols-[1.5fr_150px_120px_120px_180px] items-center border-b border-[#ede0c8] px-5 py-4 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5e8c8] text-[#8b6914]">
                  <Package size={20} />
                </div>

                <div>
                  <h3 className="font-black text-[#1a0a00]">
                    {log.product?.title || "Product"}
                  </h3>
                  <p className="text-xs font-bold text-[#9a7a4a]">
                    {log.note || "-"}
                  </p>
                </div>
              </div>

              <span className="w-fit rounded-full bg-[#f5e8c8] px-3 py-1 text-xs font-black text-[#8b6914]">
                {log.change_type}
              </span>

              <div
                className={`flex items-center gap-1 font-black ${
                  Number(log.quantity_change) < 0
                    ? "text-red-600"
                    : "text-emerald-700"
                }`}
              >
                {Number(log.quantity_change) < 0 ? (
                  <ArrowDown size={16} />
                ) : (
                  <ArrowUp size={16} />
                )}
                {log.quantity_change}
              </div>

              <div className="text-sm font-bold text-[#5c3d1a]">
                {log.previous_quantity} → {log.new_quantity}
              </div>

              <div className="text-xs font-bold text-[#9a7a4a]">
                {new Date(log.createdAt).toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl border border-[#ede0c8] bg-white px-4 py-2 font-black text-[#5c3d1a] disabled:opacity-50"
          >
            Previous
          </button>

          <span className="py-2 font-black text-[#8b6914]">
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl border border-[#ede0c8] bg-white px-4 py-2 font-black text-[#5c3d1a] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}