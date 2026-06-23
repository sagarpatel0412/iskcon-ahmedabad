import { useEffect, useState } from "react";
import {
  Edit,
  ImagePlus,
  Loader2,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  createShopProduct,
  deleteShopProduct,
  getShopCategories,
  getShopProducts,
  updateShopProduct,
  uploadShopProductImage,
} from "../../../services/shopService";

const emptyForm = {
  centre_id: 1,
  category_id: "",
  title: "",
  description: "",
  sku: "",
  price_amount: "",
  currency: "INR",
  stock_quantity: "",
  low_stock_alert: 5,
  weight_grams: "",
  is_featured: false,
  status: "draft",
  imageFile: null as File | null,
};

export default function AdminShopProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyForm);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getShopProducts({
        page,
        limit: 10,
        search,
        status: status === "all" ? undefined : status,
      });

      setProducts(res.data.items || []);
      setPagination(res.data.pagination || null);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    const res = await getShopCategories();
    setCategories(res.data || []);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    load();
  }, [page, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      load();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (product: any) => {
    setEditing(product);
    setForm({
      centre_id: product.centre_id || 1,
      category_id: product.category_id || "",
      title: product.title || "",
      description: product.description || "",
      sku: product.sku || "",
      price_amount: product.price_amount || "",
      currency: product.currency || "INR",
      stock_quantity: product.stock_quantity || "",
      low_stock_alert: product.low_stock_alert || 5,
      weight_grams: product.weight_grams || "",
      is_featured: !!product.is_featured,
      status: product.status || "draft",
      imageFile: null,
    });
    setModalOpen(true);
  };

  const submit = async () => {
    try {
      setSaving(true);

      const { imageFile, ...rawPayload } = form;

      const payload = {
        ...rawPayload,
        centre_id: rawPayload.centre_id ? Number(rawPayload.centre_id) : null,
        category_id: Number(rawPayload.category_id),
        price_amount: Number(rawPayload.price_amount || 0),
        stock_quantity: Number(rawPayload.stock_quantity || 0),
        low_stock_alert: Number(rawPayload.low_stock_alert || 5),
        weight_grams: rawPayload.weight_grams
          ? Number(rawPayload.weight_grams)
          : null,
      };

      let productUuid = editing?.uuid;

      if (editing) {
        await updateShopProduct(editing.uuid, payload);
      } else {
        const res = await createShopProduct(payload);
        productUuid = res.data.product.uuid;
      }

      if (imageFile && productUuid) {
        await uploadShopProductImage(productUuid, imageFile);
      }

      setModalOpen(false);
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (product: any) => {
    if (!confirm(`Delete ${product.title}?`)) return;

    try {
      await deleteShopProduct(product.uuid);
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to delete product");
    }
  };

  const imageUrl = (product: any) => {
    const img = product.images?.[0]?.image_url;
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `http://localhost:3000${img}`;
  };

  return (
    <main className="min-h-screen bg-[#fdfaf5] p-5">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
            Shop Products
          </h1>
          <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
            Create and manage temple store products.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#c8902a] px-5 py-3 font-black text-[#1a0a00] hover:bg-[#d4a853]"
        >
          <Plus size={18} />
          Add Product
        </button>
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
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="inactive">Inactive</option>
        </select>

        <div className="flex min-w-[280px] flex-1 items-center gap-3 rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] px-4 py-3">
          <Search size={18} className="text-[#9a7a4a]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm font-bold outline-none"
          />
        </div>

        {pagination && (
          <span className="rounded-full bg-[#f5e8c8] px-4 py-3 text-sm font-black text-[#8b6914]">
            {pagination.total} products
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-[#ede0c8] bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#c8902a]" />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#ede0c8] bg-white p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-[#c8902a]" />
          <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
            No products found
          </h2>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm">
          <div className="grid grid-cols-[90px_1.5fr_1fr_120px_120px_160px] border-b border-[#ede0c8] bg-[#f7f0e4] px-5 py-3 text-xs font-black uppercase tracking-wider text-[#8b6914]">
            <div>Image</div>
            <div>Product</div>
            <div>Category</div>
            <div>Price</div>
            <div>Stock</div>
            <div>Actions</div>
          </div>

          {products.map((product) => (
            <div
              key={product.uuid}
              className="grid grid-cols-[90px_1.5fr_1fr_120px_120px_160px] items-center border-b border-[#ede0c8] px-5 py-4 last:border-b-0"
            >
              <div>
                {imageUrl(product) ? (
                  <img
                    src={imageUrl(product)}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f5e8c8]">
                    <Package className="text-[#c8902a]" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-black text-[#1a0a00]">{product.title}</h3>
                <p className="mt-1 text-xs font-bold text-[#9a7a4a]">
                  {product.status}
                  {product.is_featured ? " · Featured" : ""}
                </p>
              </div>

              <div className="text-sm font-bold text-[#5c3d1a]">
                {product.category?.name || "-"}
              </div>

              <div className="font-black text-[#1a0a00]">
                ₹{product.price_amount}
              </div>

              <div className="font-bold text-[#5c3d1a]">
                {product.stock_quantity}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(product)}
                  className="rounded-xl border border-[#ede0c8] p-3 text-[#8b6914] hover:bg-[#f5e8c8]"
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={() => remove(product)}
                  className="rounded-xl border border-red-100 p-3 text-red-600 hover:bg-red-50"
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
        <ProductModal
          form={form}
          setForm={setForm}
          categories={categories}
          saving={saving}
          editing={editing}
          onClose={() => setModalOpen(false)}
          onSubmit={submit}
        />
      )}
    </main>
  );
}

function ProductModal({
  form,
  setForm,
  categories,
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
            {editing ? "Edit Product" : "Create Product"}
          </h2>

          <button onClick={onClose} className="rounded-xl bg-white p-3">
            <X size={22} />
          </button>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2">
          <Input label="Title" value={form.title} onChange={(v: any) => update("title", v)} />

          <label className="block">
            <span className="mb-1 block text-sm font-black text-[#5c3d1a]">
              Category
            </span>
            <select
              value={form.category_id}
              onChange={(e) => update("category_id", e.target.value)}
              className="w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((cat: any) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>

          <Input label="SKU" value={form.sku} onChange={(v: any) => update("sku", v)} />
          <Input type="number" label="Price" value={form.price_amount} onChange={(v: any) => update("price_amount", v)} />
          <Input type="number" label="Stock Quantity" value={form.stock_quantity} onChange={(v: any) => update("stock_quantity", v)} />
          <Input type="number" label="Low Stock Alert" value={form.low_stock_alert} onChange={(v: any) => update("low_stock_alert", v)} />
          <Input type="number" label="Weight Grams" value={form.weight_grams} onChange={(v: any) => update("weight_grams", v)} />

          <label className="block">
            <span className="mb-1 block text-sm font-black text-[#5c3d1a]">
              Status
            </span>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              className="w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 font-bold text-[#5c3d1a]">
            <input
              type="checkbox"
              checked={!!form.is_featured}
              onChange={(e) => update("is_featured", e.target.checked)}
            />
            Featured Product
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-black text-[#5c3d1a]">
              Product Image
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
            className="inline-flex items-center gap-2 rounded-2xl bg-[#c8902a] px-6 py-3 font-black text-[#1a0a00] disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus size={18} />}
            {editing ? "Update Product" : "Create Product"}
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
        className="min-h-28 w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}