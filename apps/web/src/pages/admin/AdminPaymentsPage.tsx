import { useEffect, useState } from "react";
import {
  getAdminContentPayments,
  getAdminTripPayments,
  getAdminCoursePayments,
} from "../../services/adminService";
import { AdminBadge, AdminHeader, AdminLoading } from "./AdminShared";

export default function AdminPaymentsPage() {
  const [tab, setTab] = useState<"content" | "trips" | "courses">("content");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, [tab]);

  const loadPayments = async () => {
    try {
      setLoading(true);

      const res =
        tab === "content"
          ? await getAdminContentPayments()
          : tab === "trips"
            ? await getAdminTripPayments()
            : await getAdminCoursePayments();

      setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminHeader title="Payments" text="View content, trip and course payments." />

      <div className="mb-6 flex flex-wrap gap-2 rounded-3xl border border-orange-100 bg-white p-4 shadow-sm">
        {["content", "trips", "courses"].map((item) => (
          <button
            key={item}
            onClick={() => setTab(item as any)}
            className={`rounded-full px-5 py-2 text-sm font-black ${
              tab === item
                ? "bg-orange-600 text-white"
                : "bg-orange-50 text-orange-700"
            }`}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? <AdminLoading /> : (
        <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-sm">
          {items.map((payment) => (
            <div key={payment.uuid} className="border-b border-orange-100 p-5 last:border-b-0">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <AdminBadge text={payment.payment_status} type={payment.payment_status === "success" ? "green" : "yellow"} />
                    <AdminBadge text={payment.provider} />
                  </div>

                  <h2 className="text-lg font-black text-slate-900">
                    ₹{payment.amount} {payment.currency || "INR"}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Order: {payment.provider_order_id || "-"} • Payment: {payment.provider_payment_id || "-"}
                  </p>
                </div>

                <p className="text-sm font-bold text-slate-500">
                  {payment.paid_at ? new Date(payment.paid_at).toLocaleString("en-IN") : "-"}
                </p>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="p-10 text-center font-bold text-slate-500">
              No payments found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}