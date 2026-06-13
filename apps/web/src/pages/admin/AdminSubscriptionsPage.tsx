import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import { getAdminSubscriptions } from "../../services/adminService";
import { AdminBadge, AdminHeader, AdminLoading } from "./AdminShared";

export default function AdminSubscriptionsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminSubscriptions().then((res) => setItems(res.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminHeader title="Subscriptions" text="View all active, cancelled and expired subscriptions." />
      {loading ? <AdminLoading /> : (
        <div className="grid gap-5">
          {items.map((sub) => (
            <div key={sub.uuid} className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-yellow-100 p-3 text-yellow-700">
                  <Crown className="h-6 w-6" />
                </div>
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <AdminBadge text={sub.status} type={sub.status === "active" ? "green" : "yellow"} />
                    <AdminBadge text={sub.plan_type || sub.plan_name} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">{sub.plan_name || "Subscription"}</h2>
                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    ₹{sub.amount} • {sub.start_date || "-"} to {sub.end_date || "-"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}