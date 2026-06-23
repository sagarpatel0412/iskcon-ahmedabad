import { useEffect, useState } from "react";
import { ExternalLink, Loader2, PackageCheck, Truck } from "lucide-react";
import { getMyProductOrders } from "../../services/shopService";
import PageSeo from "../../components/seo/PageSeo";
import { Link } from "react-router-dom";

export default function MyShopOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getMyProductOrders();
      setOrders(res.data || []);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load orders");
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
    <>
      <PageSeo
        title="My Shop Orders | ISKCON Ahmedabad"
        description="View your shop orders."
      />

      <main className="min-h-screen bg-[#fdfaf5] px-5 py-10">
        <section className="mx-auto max-w-6xl">
          <h1 className="font-serif text-5xl font-black text-[#1a0a00]">
            My Orders
          </h1>

          {orders.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-[#ede0c8] bg-white p-12 text-center">
              <PackageCheck className="mx-auto h-14 w-14 text-[#c8902a]" />
              <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
                No orders yet
              </h2>
            </div>
          ) : (
            <div className="mt-8 space-y-5">
              {orders.map((order) => (
                <Link
                  key={order.uuid}
                  to={`/shop/orders/${order.uuid}`}
                  className="block rounded-3xl border border-[#ede0c8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
                        {order.order_number}
                      </h2>
                      <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
                        {new Date(order.createdAt).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge value={order.payment_status} />
                      <Badge value={order.order_status} />
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {(order.items || []).map((item: any) => (
                      <div
                        key={item.uuid}
                        className="flex justify-between rounded-2xl bg-[#fdfaf5] p-4 text-sm font-bold text-[#5c3d1a]"
                      >
                        <span>
                          {item.product_title} × {item.quantity}
                        </span>
                        <span>₹{item.total_amount}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#f5e8c8] p-4">
                    <p className="font-black text-[#1a0a00]">
                      Total: ₹{order.total_amount}
                    </p>

                    {order.courier_name && (
                      <div className="mt-3 text-sm font-bold text-[#5c3d1a]">
                        <p className="flex items-center gap-2">
                          <Truck size={16} />
                          {order.courier_name} · {order.tracking_number}
                        </p>

                        {order.tracking_url && (
                          <a
                            href={order.tracking_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2 inline-flex items-center gap-2 text-[#8b6914]"
                          >
                            Track Order <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function Badge({ value }: { value: string }) {
  const map: any = {
    success: "bg-emerald-50 text-emerald-700",
    confirmed: "bg-emerald-50 text-emerald-700",
    delivered: "bg-emerald-50 text-emerald-700",
    pending: "bg-yellow-50 text-yellow-700",
    packed: "bg-blue-50 text-blue-700",
    shipped: "bg-indigo-50 text-indigo-700",
    failed: "bg-red-50 text-red-700",
    refunded: "bg-purple-50 text-purple-700",
    cancelled: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
        map[value] || "bg-slate-100 text-slate-700"
      }`}
    >
      {value}
    </span>
  );
}
