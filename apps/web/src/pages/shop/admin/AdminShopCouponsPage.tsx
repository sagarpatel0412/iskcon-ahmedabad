import { useEffect, useState } from "react";
import { Edit, Loader2, Plus, TicketPercent, Trash2, X } from "lucide-react";
import {
  createShopCoupon,
  deleteShopCoupon,
  getShopCoupons,
  updateShopCoupon,
} from "../../../services/shopService";

const emptyForm = {
  code: "",
  title: "",
  description: "",
  discount_type: "percentage",
  discount_value: "",
  min_order_amount: "0",
  max_discount_amount: "",
  usage_limit: "",
  per_user_limit: "1",
  start_at: "",
  end_at: "",
  is_active: true,
};

export default function AdminShopCouponsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyForm);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getShopCoupons({ page, limit: 10 });
      setItems(res.data.items || []);
      setPagination(res.data.pagination || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (coupon: any) => {
    setEditing(coupon);
    setForm({
      code: coupon.code || "",
      title: coupon.title || "",
      description: coupon.description || "",
      discount_type: coupon.discount_type || "percentage",
      discount_value: coupon.discount_value || "",
      min_order_amount: coupon.min_order_amount || "0",
      max_discount_amount: coupon.max_discount_amount || "",
      usage_limit: coupon.usage_limit || "",
      per_user_limit: coupon.per_user_limit || "1",
      start_at: coupon.start_at ? coupon.start_at.slice(0, 16) : "",
      end_at: coupon.end_at ? coupon.end_at.slice(0, 16) : "",
      is_active: !!coupon.is_active,
    });
    setModalOpen(true);
  };

  const submit = async () => {
    try {
      setSaving(true);

      const payload = {
        ...form,
        code: form.code.trim().toUpperCase(),
        discount_value: Number(form.discount_value || 0),
        min_order_amount: Number(form.min_order_amount || 0),
        max_discount_amount: form.max_discount_amount
          ? Number(form.max_discount_amount)
          : null,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
        per_user_limit: Number(form.per_user_limit || 1),
        start_at: form.start_at || null,
        end_at: form.end_at || null,
      };

      if (editing) {
        await updateShopCoupon(editing.uuid, payload);
      } else {
        await createShopCoupon(payload);
      }

      setModalOpen(false);
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to save coupon");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (coupon: any) => {
    if (!confirm(`Delete coupon ${coupon.code}?`)) return;

    try {
      await deleteShopCoupon(coupon.uuid);
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to delete coupon");
    }
  };

  return (
    <main className="min-h-screen bg-[#fdfaf5] p-5">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
            Shop Coupons
          </h1>
          <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
            Create and manage discount coupons.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#c8902a] px-5 py-3 font-black text-[#1a0a00]"
        >
          <Plus size={18} />
          Add Coupon
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-[#ede0c8] bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#c8902a]" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#ede0c8] bg-white p-12 text-center">
          <TicketPercent className="mx-auto h-12 w-12 text-[#c8902a]" />
          <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
            No coupons found
          </h2>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_1fr_130px_130px_130px_150px] border-b border-[#ede0c8] bg-[#f7f0e4] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#8b6914]">
            <div>Coupon</div>
            <div>Discount</div>
            <div>Min Order</div>
            <div>Used</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {items.map((coupon) => (
            <div
              key={coupon.uuid}
              className="grid grid-cols-[1fr_1fr_130px_130px_130px_150px] items-center border-b border-[#ede0c8] px-5 py-4 last:border-b-0"
            >
              <div>
                <h3 className="font-black text-[#1a0a00]">{coupon.code}</h3>
                <p className="text-xs font-bold text-[#9a7a4a]">
                  {coupon.title}
                </p>
              </div>

              <div className="font-bold text-[#5c3d1a]">
                {coupon.discount_type === "percentage"
                  ? `${coupon.discount_value}%`
                  : `₹${coupon.discount_value}`}
              </div>

              <div className="font-bold text-[#5c3d1a]">
                ₹{coupon.min_order_amount}
              </div>

              <div className="font-bold text-[#5c3d1a]">
                {coupon.used_count}
                {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ""}
              </div>

              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-black ${
                  coupon.is_active
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {coupon.is_active ? "Active" : "Inactive"}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(coupon)}
                  className="rounded-xl border border-[#ede0c8] p-3 text-[#8b6914]"
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={() => remove(coupon)}
                  className="rounded-xl bg-red-50 p-3 text-red-600"
                >
                  <Trash2 size={16} />
                </button>
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

      {modalOpen && (
        <CouponModal
          form={form}
          setForm={setForm}
          saving={saving}
          editing={editing}
          onClose={() => setModalOpen(false)}
          onSubmit={submit}
        />
      )}
    </main>
  );
}

function CouponModal({ form, setForm, saving, editing, onClose, onSubmit }: any) {
  const update = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-[#fdfaf5] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#ede0c8] p-5">
          <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
            {editing ? "Edit Coupon" : "Create Coupon"}
          </h2>

          <button onClick={onClose} className="rounded-xl bg-white p-3">
            <X size={22} />
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <Input label="Code" value={form.code} onChange={(v: any) => update("code", v)} />
          <Input label="Title" value={form.title} onChange={(v: any) => update("title", v)} />

          <label className="block">
            <span className="mb-1 block text-sm font-black text-[#5c3d1a]">
              Discount Type
            </span>
            <select
              value={form.discount_type}
              onChange={(e) => update("discount_type", e.target.value)}
              className="w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </label>

          <Input type="number" label="Discount Value" value={form.discount_value} onChange={(v: any) => update("discount_value", v)} />
          <Input type="number" label="Min Order Amount" value={form.min_order_amount} onChange={(v: any) => update("min_order_amount", v)} />
          <Input type="number" label="Max Discount Amount" value={form.max_discount_amount} onChange={(v: any) => update("max_discount_amount", v)} />
          <Input type="number" label="Usage Limit" value={form.usage_limit} onChange={(v: any) => update("usage_limit", v)} />
          <Input type="number" label="Per User Limit" value={form.per_user_limit} onChange={(v: any) => update("per_user_limit", v)} />
          <Input type="datetime-local" label="Start At" value={form.start_at} onChange={(v: any) => update("start_at", v)} />
          <Input type="datetime-local" label="End At" value={form.end_at} onChange={(v: any) => update("end_at", v)} />

          <label className="flex items-center gap-3 rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 font-bold text-[#5c3d1a]">
            <input
              type="checkbox"
              checked={!!form.is_active}
              onChange={(e) => update("is_active", e.target.checked)}
            />
            Active Coupon
          </label>

          <div className="md:col-span-2">
            <Textarea
              label="Description"
              value={form.description}
              onChange={(v: any) => update("description", v)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#ede0c8] p-5">
          <button
            onClick={onClose}
            className="rounded-2xl border border-[#ede0c8] bg-white px-5 py-3 font-black text-[#5c3d1a]"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            disabled={saving}
            className="rounded-2xl bg-[#c8902a] px-6 py-3 font-black text-[#1a0a00] disabled:opacity-60"
          >
            {saving ? "Saving..." : editing ? "Update Coupon" : "Create Coupon"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-black text-[#5c3d1a]">
        {label}
      </span>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-black text-[#5c3d1a]">
        {label}
      </span>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-24 w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}