import { useEffect, useState } from "react";
import {
  Loader2,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  getAllProductOrders,
  getShopRefunds,
  refundProductOrder,
} from "../../../services/shopService";

export default function AdminShopRefundsPage() {
  const [refundedOrders, setRefundedOrders] = useState<any[]>([]);
  const [successfulOrders, setSuccessfulOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [refundLoadingUuid, setRefundLoadingUuid] = useState<string | null>(null);

  const [page, setPage] = useState(1);

  const load = async () => {
    try {
      setLoading(true);

      const refundsRes = await getShopRefunds({
        page,
        limit: 10,
      });

      const successOrdersRes = await getAllProductOrders({
        page: 1,
        limit: 20,
        payment_status: "success",
      });

      setRefundedOrders(refundsRes.data.items || []);
      setPagination(refundsRes.data.pagination || null);
      setSuccessfulOrders(successOrdersRes.data.items || []);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load refunds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const processRefund = async (order: any) => {
    const reason = prompt(
      `Refund reason for ${order.order_number}`,
      "Customer refund requested",
    );

    if (!reason) return;

    try {
      setRefundLoadingUuid(order.uuid);

      await refundProductOrder(order.uuid, {
        reason,
      });

      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to refund order");
    } finally {
      setRefundLoadingUuid(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#fdfaf5] p-5">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
          Refund Management
        </h1>
        <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
          Process successful orders and view refunded orders.
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-[#ede0c8] bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#c8902a]" />
        </div>
      ) : (
        <div className="space-y-8">
          <section className="rounded-3xl border border-[#ede0c8] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
              Refund Eligible Orders
            </h2>

            <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
              Only successful paid orders can be refunded.
            </p>

            <div className="mt-5 space-y-3">
              {successfulOrders.length === 0 ? (
                <p className="rounded-2xl bg-[#fdfaf5] p-5 text-sm font-bold text-[#9a7a4a]">
                  No successful orders available for refund.
                </p>
              ) : (
                successfulOrders.map((order) => (
                  <div
                    key={order.uuid}
                    className="flex flex-wrap items-center gap-4 rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] p-4"
                  >
                    <div className="min-w-[220px] flex-1">
                      <h3 className="font-black text-[#1a0a00]">
                        {order.order_number}
                      </h3>
                      <p className="text-xs font-bold text-[#9a7a4a]">
                        {order.user?.first_name} {order.user?.last_name}
                      </p>
                    </div>

                    <span className="font-black text-[#1a0a00]">
                      ₹{order.total_amount}
                    </span>

                    <button
                      onClick={() => processRefund(order)}
                      disabled={refundLoadingUuid === order.uuid}
                      className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-5 py-3 font-black text-red-600 disabled:opacity-60"
                    >
                      {refundLoadingUuid === order.uuid ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <RotateCcw size={18} />
                      )}
                      Refund
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-[#ede0c8] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
              Refunded Orders
            </h2>

            <div className="mt-5 overflow-hidden rounded-3xl border border-[#ede0c8]">
              <div className="grid grid-cols-[1.2fr_1fr_120px_160px] bg-[#f7f0e4] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#8b6914]">
                <div>Order</div>
                <div>User</div>
                <div>Amount</div>
                <div>Status</div>
              </div>

              {refundedOrders.length === 0 ? (
                <div className="p-6 text-center text-sm font-bold text-[#9a7a4a]">
                  No refunded orders yet.
                </div>
              ) : (
                refundedOrders.map((order) => (
                  <div
                    key={order.uuid}
                    className="grid grid-cols-[1.2fr_1fr_120px_160px] items-center border-t border-[#ede0c8] px-5 py-4"
                  >
                    <div>
                      <h3 className="font-black text-[#1a0a00]">
                        {order.order_number}
                      </h3>
                      <p className="text-xs font-bold text-[#9a7a4a]">
                        {new Date(order.updatedAt).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="text-sm font-bold text-[#5c3d1a]">
                      {order.user?.first_name} {order.user?.last_name}
                    </div>

                    <div className="font-black text-[#1a0a00]">
                      ₹{order.total_amount}
                    </div>

                    <span className="w-fit rounded-full bg-purple-50 px-3 py-1 text-xs font-black uppercase text-purple-700">
                      refunded
                    </span>
                  </div>
                ))
              )}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-3">
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
          </section>
        </div>
      )}
    </main>
  );
}