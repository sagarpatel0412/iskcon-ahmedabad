import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ExternalLink,
  Loader2,
  PackageCheck,
  Truck,
} from "lucide-react";
import { getMyProductOrderByUuid } from "../../services/shopService";
import PageSeo from "../../components/seo/PageSeo";

export default function ShopOrderDetailsPage() {
  const { uuid } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await getMyProductOrderByUuid(uuid!);
      setOrder(res.data);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [uuid]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfaf5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#c8902a]" />
      </div>
    );
  }

  return (
    <>
      <PageSeo title="Order Details | Temple Shop" description="View order details." />

      <main className="min-h-screen bg-[#fdfaf5] px-5 py-10">
        <section className="mx-auto max-w-5xl">
          <Link to="/shop/my-orders" className="font-black text-[#8b6914]">
            ← Back to My Orders
          </Link>

          <div className="mt-6 rounded-3xl border border-[#ede0c8] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <PackageCheck className="h-10 w-10 text-[#c8902a]" />
                <h1 className="mt-3 font-serif text-4xl font-black text-[#1a0a00]">
                  {order.order_number}
                </h1>
                <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
                  {new Date(order.createdAt).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="flex gap-2">
                <Badge value={order.payment_status} />
                <Badge value={order.order_status} />
              </div>
            </div>

            <div className="mt-8 space-y-3">
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

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl border border-[#ede0c8] bg-[#fdfaf5] p-5">
                <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
                  Shipping Address
                </h2>

                <p className="mt-3 text-sm font-bold leading-7 text-[#5c3d1a]">
                  {order.shipping_address?.full_name}
                  <br />
                  {order.shipping_address?.phone}
                  <br />
                  {order.shipping_address?.address_line_1}
                  <br />
                  {order.shipping_address?.address_line_2}
                  <br />
                  {order.shipping_address?.city} -{" "}
                  {order.shipping_address?.postal_code}
                </p>
              </div>

              <div className="rounded-3xl border border-[#ede0c8] bg-[#fdfaf5] p-5">
                <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
                  Payment & Tracking
                </h2>

                <div className="mt-3 space-y-2 text-sm font-bold text-[#5c3d1a]">
                  <p>Subtotal: ₹{order.subtotal_amount}</p>
                  <p>Shipping: ₹{order.shipping_amount}</p>
                  <p className="text-xl font-black text-[#1a0a00]">
                    Total: ₹{order.total_amount}
                  </p>

                  {order.courier_name && (
                    <div className="mt-4 rounded-2xl bg-white p-4">
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
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function Badge({ value }: { value: string }) {
  return (
    <span className="rounded-full bg-[#f5e8c8] px-3 py-1 text-xs font-black uppercase text-[#8b6914]">
      {value}
    </span>
  );
}