import { useEffect, useState } from "react";
import {
  Edit,
  ImagePlus,
  Loader2,
  Megaphone,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  createPromotionalBanner,
  deletePromotionalBanner,
  getPromotionalBanners,
  updatePromotionalBanner,
  uploadPromotionalBannerImage,
} from "../../services/promotionalBannerService";

const emptyForm = {
  title: "",
  subtitle: "",
  description: "",
  button_text: "View Details",
  redirect_url: "",
  banner_type: "custom",
  reference_uuid: "",
  display_type: "modal",
  position: "all",
  start_at: "",
  end_at: "",
  auto_remove_at: "",
  priority: 1,
  is_active: true,
  imageFile: null as File | null,
};

export default function AdminPromotionalBannersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [position, setPosition] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyForm);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getPromotionalBanners({
        page,
        limit: 10,
        position,
      });

      setItems(res.data.items || []);
      setPagination(res.data.pagination || null);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, position]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (banner: any) => {
    setEditing(banner);
    setForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      button_text: banner.button_text || "View Details",
      redirect_url: banner.redirect_url || "",
      banner_type: banner.banner_type || "custom",
      reference_uuid: banner.reference_uuid || "",
      display_type: banner.display_type || "modal",
      position: banner.position || "all",
      start_at: banner.start_at ? banner.start_at.slice(0, 16) : "",
      end_at: banner.end_at ? banner.end_at.slice(0, 16) : "",
      auto_remove_at: banner.auto_remove_at
        ? banner.auto_remove_at.slice(0, 16)
        : "",
      priority: banner.priority || 1,
      is_active: !!banner.is_active,
      imageFile: null,
    });
    setModalOpen(true);
  };

  const submit = async () => {
    try {
      setSaving(true);

      const { imageFile, ...payload } = form;

      const cleanPayload = {
        ...payload,
        reference_uuid: payload.reference_uuid || null,
        start_at: payload.start_at || null,
        end_at: payload.end_at || null,
        auto_remove_at: payload.auto_remove_at || null,
        priority: Number(payload.priority || 1),
      };

      let bannerUuid = editing?.uuid;

      if (editing) {
        await updatePromotionalBanner(editing.uuid, cleanPayload);
      } else {
        const res = await createPromotionalBanner(cleanPayload);
        bannerUuid = res.data.banner.uuid;
      }

      if (imageFile && bannerUuid) {
        await uploadPromotionalBannerImage(bannerUuid, imageFile);
      }

      setModalOpen(false);
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to save banner");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (banner: any) => {
    if (!confirm(`Delete banner "${banner.title}"?`)) return;

    try {
      await deletePromotionalBanner(banner.uuid);
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to delete banner");
    }
  };

  const imageUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://localhost:3000${url}`;
  };

  return (
    <main className="min-h-screen bg-[#fdfaf5] p-5">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
            Promotional Banners
          </h1>
          <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
            Create popup/banner promotions for trips, events, courses and shop
            products.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#c8902a] px-5 py-3 font-black text-[#1a0a00]"
        >
          <Plus size={18} />
          Add Banner
        </button>
      </div>

      <div className="mb-5 flex flex-wrap gap-3 rounded-3xl border border-[#ede0c8] bg-white p-4">
        <select
          value={position}
          onChange={(e) => {
            setPosition(e.target.value);
            setPage(1);
          }}
          className="rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] px-4 py-3 text-sm font-bold text-[#5c3d1a]"
        >
          <option value="all">All Positions</option>
          <option value="home">Home</option>
          <option value="shop">Shop</option>
          <option value="events">Events</option>
          <option value="trips">Trips</option>
          <option value="courses">Courses</option>
        </select>

        {pagination && (
          <span className="rounded-full bg-[#f5e8c8] px-4 py-3 text-sm font-black text-[#8b6914]">
            {pagination.total} banners
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-[#ede0c8] bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#c8902a]" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#ede0c8] bg-white p-12 text-center">
          <Megaphone className="mx-auto h-12 w-12 text-[#c8902a]" />
          <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
            No banners found
          </h2>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((banner) => (
            <div
              key={banner.uuid}
              className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm"
            >
              <div className="h-48 bg-[#f5e8c8]">
                {banner.image_url ? (
                  <img
                    src={imageUrl(banner.image_url)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Megaphone className="h-12 w-12 text-[#c8902a]" />
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#f5e8c8] px-3 py-1 text-xs font-black text-[#8b6914]">
                    {banner.position}
                  </span>

                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-700">
                    {banner.banner_type}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      banner.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {banner.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
                  {banner.title}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm font-bold leading-6 text-[#9a7a4a]">
                  {banner.subtitle || banner.description || "Promotion banner"}
                </p>

                <div className="mt-4 space-y-1 text-xs font-bold text-[#9a7a4a]">
                  <p>Display: {banner.display_type}</p>
                  <p>Priority: {banner.priority}</p>
                  {banner.auto_remove_at && (
                    <p>
                      Auto remove:{" "}
                      {new Date(banner.auto_remove_at).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

                <div className="mt-5 flex gap-2 border-t border-[#ede0c8] pt-4">
                  <button
                    onClick={() => openEdit(banner)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#ede0c8] px-3 py-2 text-sm font-black text-[#5c3d1a]"
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => remove(banner)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-black text-red-600"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
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
        <BannerModal
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

function BannerModal({
  form,
  setForm,
  saving,
  editing,
  onClose,
  onSubmit,
}: any) {
  const update = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-[#fdfaf5] shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-[#ede0c8] bg-[#fdfaf5] p-5">
          <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
            {editing ? "Edit Banner" : "Create Banner"}
          </h2>

          <button onClick={onClose} className="rounded-xl bg-white p-3">
            <X size={22} />
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <Input
            label="Title"
            value={form.title}
            onChange={(v: string) => update("title", v)}
          />

          <Input
            label="Subtitle"
            value={form.subtitle}
            onChange={(v: string) => update("subtitle", v)}
          />

          <Input
            label="Button Text"
            value={form.button_text}
            onChange={(v: string) => update("button_text", v)}
          />

          <Input
            label="Redirect URL"
            value={form.redirect_url}
            onChange={(v: string) => update("redirect_url", v)}
            placeholder="/trips/uuid or /shop/products/uuid"
          />

          <Select
            label="Banner Type"
            value={form.banner_type}
            onChange={(v: string) => update("banner_type", v)}
            options={["event", "trip", "course", "product", "custom"]}
          />

          <Input
            label="Reference UUID"
            value={form.reference_uuid}
            onChange={(v: string) => update("reference_uuid", v)}
          />

          <Select
            label="Display Type"
            value={form.display_type}
            onChange={(v: string) => update("display_type", v)}
            options={["modal", "banner", "both"]}
          />

          <Select
            label="Position"
            value={form.position}
            onChange={(v: string) => update("position", v)}
            options={["home", "shop", "events", "trips", "courses", "all"]}
          />

          <Input
            type="datetime-local"
            label="Start At"
            value={form.start_at}
            onChange={(v: string) => update("start_at", v)}
          />

          <Input
            type="datetime-local"
            label="End At"
            value={form.end_at}
            onChange={(v: string) => update("end_at", v)}
          />

          <Input
            type="datetime-local"
            label="Auto Remove At"
            value={form.auto_remove_at}
            onChange={(v: string) => update("auto_remove_at", v)}
          />

          <Input
            type="number"
            label="Priority"
            value={form.priority}
            onChange={(v: string) => update("priority", v)}
          />

          <label className="block">
            <span className="mb-1 block text-sm font-black text-[#5c3d1a]">
              Banner Image
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => update("imageFile", e.target.files?.[0] || null)}
              className="w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none"
            />

            {form.imageFile && (
              <p className="mt-2 text-xs font-black text-[#8b6914]">
                Selected: {form.imageFile.name}
              </p>
            )}
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 font-bold text-[#5c3d1a]">
            <input
              type="checkbox"
              checked={!!form.is_active}
              onChange={(e) => update("is_active", e.target.checked)}
            />
            Active Banner
          </label>

          <div className="md:col-span-2">
            <Textarea
              label="Description"
              value={form.description}
              onChange={(v: string) => update("description", v)}
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
            className="inline-flex items-center gap-2 rounded-2xl bg-[#c8902a] px-6 py-3 font-black text-[#1a0a00] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ImagePlus size={18} />
            )}
            {editing ? "Update Banner" : "Create Banner"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }: any) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-black text-[#5c3d1a]">
        {label}
      </span>
      <input
        type={type}
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-black text-[#5c3d1a]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
      >
        {options.map((item: string) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
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
        className="min-h-28 w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}