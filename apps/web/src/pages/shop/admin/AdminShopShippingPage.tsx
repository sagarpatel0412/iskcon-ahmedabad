import { useEffect, useState } from "react";
import { Loader2, PackageCheck, Truck, X } from "lucide-react";
import {
  getAllProductOrders,
  updateProductShipping,
} from "../../../services/shopService";

const statusOptions = ["confirmed", "packed", "shipped", "delivered"];

export default function AdminShopShippingPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getAllProductOrders({
        page,
        limit: 10,
        payment_status: "success",
        order_status: status === "all" ? undefined : status,
      });

      setOrders(res.data.items || []);
      setPagination(res.data.pagination || null);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load shipping orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, status]);

  return (
    <main className="min-h-screen bg-[#fdfaf5] p-5">
      <div className="mb-6">
        <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
          Shipping Management
        </h1>
        <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
          Add courier details, tracking number and update delivery status.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-3 rounded-3xl border border-[#ede0c8] bg-white p-4">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] px-4 py-3 text-sm font-bold text-[#5c3d1a]"
        >
          <option value="all">All Shipping Status</option>
          {statusOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
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
            No shipping orders
          </h2>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm">
          <div className="grid grid-cols-[1.2fr_1fr_1fr_140px_150px] border-b border-[#ede0c8] bg-[#f7f0e4] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#8b6914]">
            <div>Order</div>
            <div>Customer</div>
            <div>Courier</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {orders.map((order) => (
            <div
              key={order.uuid}
              className="grid grid-cols-[1.2fr_1fr_1fr_140px_150px] items-center border-b border-[#ede0c8] px-5 py-4 last:border-b-0"
            >
              <div>
                <h3 className="font-black text-[#1a0a00]">
                  {order.order_number}
                </h3>
                <p className="text-xs font-bold text-[#9a7a4a]">
                  ₹{order.total_amount}
                </p>
              </div>

              <div className="text-sm font-bold text-[#5c3d1a]">
                {order.user?.first_name} {order.user?.last_name}
                <p className="text-xs text-[#9a7a4a]">{order.user?.phone}</p>
              </div>

              <div className="text-sm font-bold text-[#5c3d1a]">
                {order.courier_name || "-"}
                <p className="text-xs text-[#9a7a4a]">
                  {order.tracking_number || "No tracking"}
                </p>
              </div>

              <span className="w-fit rounded-full bg-[#f5e8c8] px-3 py-1 text-xs font-black uppercase text-[#8b6914]">
                {order.order_status}
              </span>

              <button
                onClick={() => setSelected(order)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1a0a00] px-4 py-3 text-sm font-black text-[#d4a853]"
              >
                <Truck size={16} />
                Update
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
        <ShippingModal
          order={selected}
          onClose={() => setSelected(null)}
          onSaved={() => {
            setSelected(null);
            load();
          }}
        />
      )}
    </main>
  );
}

function ShippingModal({ order, onClose, onSaved }: any) {
  const [form, setForm] = useState({
    courier_name: order.courier_name || "",
    tracking_number: order.tracking_number || "",
    tracking_url: order.tracking_url || "",
    order_status: order.order_status || "confirmed",
    note: "",
  });

  const [saving, setSaving] = useState(false);

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    try {
      setSaving(true);
      await updateProductShipping(order.uuid, form);
      onSaved();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to update shipping");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-[#fdfaf5] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#ede0c8] p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#c8902a]">
              Update Shipping
            </p>
            <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
              {order.order_number}
            </h2>
          </div>

          <button onClick={onClose} className="rounded-xl bg-white p-3">
            <X size={22} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <Input
            label="Courier Name"
            value={form.courier_name}
            onChange={(v: string) => update("courier_name", v)}
            placeholder="Blue Dart / DTDC / India Post"
          />

          <Input
            label="Tracking Number"
            value={form.tracking_number}
            onChange={(v: string) => update("tracking_number", v)}
            placeholder="Tracking number"
          />

          <Input
            label="Tracking URL"
            value={form.tracking_url}
            onChange={(v: string) => update("tracking_url", v)}
            placeholder="https://..."
          />

          <label className="block">
            <span className="mb-1 block text-sm font-black text-[#5c3d1a]">
              Order Status
            </span>
            <select
              value={form.order_status}
              onChange={(e) => update("order_status", e.target.value)}
              className="w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
            >
              {statusOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <Textarea
            label="Note"
            value={form.note}
            onChange={(v: string) => update("note", v)}
            placeholder="Optional note for status history"
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-[#ede0c8] p-5">
          <button
            onClick={onClose}
            className="rounded-2xl border border-[#ede0c8] bg-white px-5 py-3 font-black text-[#5c3d1a]"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#c8902a] px-6 py-3 font-black text-[#1a0a00] disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Truck size={18} />}
            Save Shipping
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }: any) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-black text-[#5c3d1a]">
        {label}
      </span>
      <input
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}

function Textarea({ label, value, onChange, placeholder }: any) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-black text-[#5c3d1a]">
        {label}
      </span>
      <textarea
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-24 w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}