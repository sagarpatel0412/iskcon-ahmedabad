import { useEffect, useState } from "react";
import {
  Loader2,
  PackageCheck,
  Search,
  Truck,
  X,
} from "lucide-react";
import {
  getAllProductOrders,
  updateProductOrderStatus,
} from "../../../services/shopService";

const statusOptions = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminShopOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [orderStatus, setOrderStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getAllProductOrders({
        page,
        limit: 10,
        order_status: orderStatus === "all" ? undefined : orderStatus,
        payment_status: paymentStatus === "all" ? undefined : paymentStatus,
      });

      setOrders(res.data.items || []);
      setPagination(res.data.pagination || null);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, orderStatus, paymentStatus]);

  const updateStatus = async (order: any, newStatus: string) => {
    try {
      await updateProductOrderStatus(order.uuid, {
        order_status: newStatus,
        note: `Order marked as ${newStatus}`,
      });

      await load();

      if (selected?.uuid === order.uuid) {
        setSelected((prev: any) => ({
          ...prev,
          order_status: newStatus,
        }));
      }
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to update order");
    }
  };

  return (
    <main className="min-h-screen bg-[#fdfaf5] p-5">
      <div className="mb-6">
        <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
          Shop Orders
        </h1>
        <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
          Manage product orders, packing, shipping and delivery.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-3 rounded-3xl border border-[#ede0c8] bg-white p-4">
        <select
          value={orderStatus}
          onChange={(e) => {
            setOrderStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] px-4 py-3 text-sm font-bold text-[#5c3d1a]"
        >
          <option value="all">All Order Status</option>
          {statusOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={paymentStatus}
          onChange={(e) => {
            setPaymentStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] px-4 py-3 text-sm font-bold text-[#5c3d1a]"
        >
          <option value="all">All Payment Status</option>
          <option value="pending">Pending</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        {pagination && (
          <span className="rounded-full bg-[#f5e8c8] px-4 py-3 text-sm font-black text-[#8b6914]">
            {pagination.total} orders
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-[#ede0c8] bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#c8902a]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#ede0c8] bg-white p-12 text-center">
          <PackageCheck className="mx-auto h-12 w-12 text-[#c8902a]" />
          <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
            No orders found
          </h2>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm">
          <div className="grid grid-cols-[1.2fr_1fr_120px_140px_140px_160px] border-b border-[#ede0c8] bg-[#f7f0e4] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#8b6914]">
            <div>Order</div>
            <div>User</div>
            <div>Total</div>
            <div>Payment</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {orders.map((order) => (
            <div
              key={order.uuid}
              className="grid grid-cols-[1.2fr_1fr_120px_140px_140px_160px] items-center border-b border-[#ede0c8] px-5 py-4 last:border-b-0"
            >
              <div>
                <h3 className="font-black text-[#1a0a00]">
                  {order.order_number}
                </h3>
                <p className="mt-1 text-xs font-bold text-[#9a7a4a]">
                  {new Date(order.createdAt).toLocaleString("en-IN")}
                </p>
              </div>

              <div className="text-sm font-bold text-[#5c3d1a]">
                {order.user?.first_name} {order.user?.last_name}
                <p className="text-xs text-[#9a7a4a]">{order.user?.phone}</p>
              </div>

              <div className="font-black text-[#1a0a00]">
                ₹{order.total_amount}
              </div>

              <Badge type="payment" value={order.payment_status} />

              <Badge type="order" value={order.order_status} />

              <button
                onClick={() => setSelected(order)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a0a00] px-4 py-3 text-sm font-black text-[#d4a853]"
              >
                <Truck size={16} />
                Manage
              </button>
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

      {selected && (
        <OrderModal
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={updateStatus}
        />
      )}
    </main>
  );
}

function OrderModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: any;
  onClose: () => void;
  onStatusChange: (order: any, status: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-[#fdfaf5] shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-[#ede0c8] bg-[#fdfaf5] p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#c8902a]">
              Order Details
            </p>
            <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
              {order.order_number}
            </h2>
          </div>

          <button onClick={onClose} className="rounded-xl bg-white p-3">
            <X size={22} />
          </button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[1fr_320px]">
          <section className="space-y-5">
            <div className="rounded-3xl border border-[#ede0c8] bg-white p-5">
              <h3 className="mb-4 font-serif text-2xl font-black text-[#1a0a00]">
                Ordered Items
              </h3>

              <div className="space-y-3">
                {(order.items || []).map((item: any) => (
                  <div
                    key={item.uuid}
                    className="flex items-center justify-between rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] p-4"
                  >
                    <div>
                      <h4 className="font-black text-[#1a0a00]">
                        {item.product_title}
                      </h4>
                      <p className="text-sm font-bold text-[#9a7a4a]">
                        Qty: {item.quantity} × ₹{item.price_amount}
                      </p>
                    </div>

                    <p className="font-black text-[#1a0a00]">
                      ₹{item.total_amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-[#ede0c8] bg-white p-5">
              <h3 className="mb-4 font-serif text-2xl font-black text-[#1a0a00]">
                Shipping Address
              </h3>

              <p className="font-black text-[#1a0a00]">
                {order.shipping_address?.full_name}
              </p>
              <p className="mt-2 text-sm font-bold leading-6 text-[#5c3d1a]">
                {order.shipping_address?.address_line_1}
                <br />
                {order.shipping_address?.address_line_2}
                <br />
                {order.shipping_address?.landmark}
                <br />
                {order.shipping_address?.city} -{" "}
                {order.shipping_address?.postal_code}
                <br />
                Phone: {order.shipping_address?.phone}
              </p>
            </div>
          </section>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-[#ede0c8] bg-white p-5">
              <h3 className="font-serif text-2xl font-black text-[#1a0a00]">
                Payment
              </h3>

              <div className="mt-4 space-y-3 text-sm font-bold text-[#5c3d1a]">
                <p>Subtotal: ₹{order.subtotal_amount}</p>
                <p>Shipping: ₹{order.shipping_amount}</p>
                <p className="text-xl font-black text-[#1a0a00]">
                  Total: ₹{order.total_amount}
                </p>
              </div>

              <div className="mt-4">
                <Badge type="payment" value={order.payment_status} />
              </div>
            </div>

            <div className="rounded-3xl border border-[#ede0c8] bg-white p-5">
              <h3 className="font-serif text-2xl font-black text-[#1a0a00]">
                Manage Status
              </h3>

              <select
                value={order.order_status}
                onChange={(e) => onStatusChange(order, e.target.value)}
                className="mt-4 w-full rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] px-4 py-3 font-bold text-[#5c3d1a]"
              >
                {statusOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Badge({ value, type }: { value: string; type: "payment" | "order" }) {
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
      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-black uppercase ${
        map[value] || "bg-slate-100 text-slate-700"
      }`}
    >
      {value}
    </span>
  );
}