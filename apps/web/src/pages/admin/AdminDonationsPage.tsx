import { useEffect, useState } from "react";
import { HeartHandshake } from "lucide-react";
import { getAdminDonations } from "../../services/adminService";
import { AdminBadge, AdminHeader, AdminLoading } from "./AdminShared";

export default function AdminDonationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDonations().then((res) => setItems(res.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminHeader title="Donations" text="View all donations received." />
      {loading ? <AdminLoading /> : (
        <div className="grid gap-5">
          {items.map((donation) => (
            <div key={donation.uuid || donation.id} className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-green-100 p-3 text-green-700">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <AdminBadge text={donation.payment_status || donation.status} type="green" />
                    <AdminBadge text={donation.payment_method || donation.provider} />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">
                    ₹{donation.amount} {donation.currency || "INR"}
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-slate-500">
                    {donation.donor_name || donation.name || "Anonymous"} • {donation.email || donation.phone || "-"}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="rounded-[2rem] bg-white p-10 text-center font-bold text-slate-500">
              No donations found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}