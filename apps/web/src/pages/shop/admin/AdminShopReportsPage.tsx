import { useEffect, useState } from "react";
import {
  CheckCircle,
  IndianRupee,
  Loader2,
  PackageCheck,
  RotateCcw,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { getShopReportsSummary } from "../../../services/shopService";

export default function AdminShopReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getShopReportsSummary();
      setSummary(res.data);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfaf5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#c8902a]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdfaf5] p-5">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
          Shop Reports
        </h1>
        <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
          Revenue, orders and refund overview.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ReportCard
          icon={IndianRupee}
          title="Total Revenue"
          value={`₹${summary?.total_revenue || 0}`}
        />

        <ReportCard
          icon={ShoppingBag}
          title="Total Orders"
          value={summary?.total_orders || 0}
        />

        <ReportCard
          icon={CheckCircle}
          title="Successful Orders"
          value={summary?.successful_orders || 0}
        />

        <ReportCard
          icon={Truck}
          title="Pending Orders"
          value={summary?.pending_orders || 0}
        />

        <ReportCard
          icon={PackageCheck}
          title="Delivered Orders"
          value={summary?.delivered_orders || 0}
        />

        <ReportCard
          icon={RotateCcw}
          title="Refunded Orders"
          value={summary?.refunded_orders || 0}
        />
      </div>
    </main>
  );
}

function ReportCard({ icon: Icon, title, value }: any) {
  return (
    <div className="rounded-3xl border border-[#ede0c8] bg-white p-6 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5e8c8] text-[#8b6914]">
        <Icon className="h-7 w-7" />
      </div>

      <p className="mt-5 text-sm font-black uppercase tracking-wider text-[#9a7a4a]">
        {title}
      </p>

      <h3 className="mt-2 text-4xl font-black text-[#1a0a00]">{value}</h3>
    </div>
  );
}