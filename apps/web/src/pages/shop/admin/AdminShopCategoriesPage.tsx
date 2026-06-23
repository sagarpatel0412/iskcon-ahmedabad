import { useEffect, useState } from "react";
import { Edit, FolderTree, Loader2, Plus, Trash2, X } from "lucide-react";
import {
  createShopCategory,
  deleteShopCategory,
  getShopCategories,
  updateShopCategory,
} from "../../../services/shopService";

const emptyForm = {
  centre_id: 1,
  name: "",
  description: "",
  image_url: "",
  is_active: true,
};

export default function AdminShopCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyForm);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getShopCategories();
      setCategories(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (category: any) => {
    setEditing(category);
    setForm({
      centre_id: category.centre_id || 1,
      name: category.name || "",
      description: category.description || "",
      image_url: category.image_url || "",
      is_active: !!category.is_active,
    });
    setModalOpen(true);
  };

  const submit = async () => {
    try {
      setSaving(true);

      const payload = {
        ...form,
        centre_id: form.centre_id ? Number(form.centre_id) : null,
      };

      if (editing) {
        await updateShopCategory(editing.uuid, payload);
      } else {
        await createShopCategory(payload);
      }

      setModalOpen(false);
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (category: any) => {
    if (!confirm(`Delete ${category.name}?`)) return;

    try {
      await deleteShopCategory(category.uuid);
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <main className="min-h-screen bg-[#fdfaf5] p-5">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
            Shop Categories
          </h1>
          <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
            Manage product categories for temple store.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#c8902a] px-5 py-3 font-black text-[#1a0a00] hover:bg-[#d4a853]"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-[#ede0c8] bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#c8902a]" />
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#ede0c8] bg-white p-12 text-center">
          <FolderTree className="mx-auto h-12 w-12 text-[#c8902a]" />
          <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
            No categories found
          </h2>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.uuid}
              className="rounded-3xl border border-[#ede0c8] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f5e8c8]">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FolderTree className="text-[#c8902a]" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
                    {category.name}
                  </h2>

                  <p className="mt-1 text-xs font-black uppercase text-[#8b6914]">
                    {category.slug}
                  </p>

                  <p className="mt-2 line-clamp-2 text-sm font-bold leading-6 text-[#9a7a4a]">
                    {category.description || "No description"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#ede0c8] pt-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    category.is_active
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {category.is_active ? "Active" : "Inactive"}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(category)}
                    className="rounded-xl border border-[#ede0c8] p-3 text-[#8b6914] hover:bg-[#f5e8c8]"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => remove(category)}
                    className="rounded-xl border border-red-100 p-3 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <CategoryModal
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

function CategoryModal({
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
      <div className="w-full max-w-2xl rounded-3xl bg-[#fdfaf5] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#ede0c8] p-5">
          <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
            {editing ? "Edit Category" : "Create Category"}
          </h2>

          <button onClick={onClose} className="rounded-xl bg-white p-3">
            <X size={22} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <Input
            label="Name"
            value={form.name}
            onChange={(v: any) => update("name", v)}
          />

          <Input
            label="Image URL"
            value={form.image_url}
            onChange={(v: any) => update("image_url", v)}
          />

          <Textarea
            label="Description"
            value={form.description}
            onChange={(v: any) => update("description", v)}
          />

          <label className="flex items-center gap-3 rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 font-bold text-[#5c3d1a]">
            <input
              type="checkbox"
              checked={!!form.is_active}
              onChange={(e) => update("is_active", e.target.checked)}
            />
            Active Category
          </label>
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
            {saving && <Loader2 className="h-5 w-5 animate-spin" />}
            {editing ? "Update Category" : "Create Category"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-black text-[#5c3d1a]">
        {label}
      </span>
      <input
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
        className="min-h-28 w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}