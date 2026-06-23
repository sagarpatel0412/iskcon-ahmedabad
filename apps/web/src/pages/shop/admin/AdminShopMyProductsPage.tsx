import { useEffect, useState } from "react";
import {
  Edit,
  Loader2,
  Package,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  deleteShopProduct,
  getShopProducts,
} from "../../../services/shopService";
import useAuth from "../../../hooks/useAuth";

export default function AdminShopMyProductsPage() {
  const { user, isAdmin } = useAuth();

  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getShopProducts({
        page,
        limit: 10,
        search,
        status: undefined,
      });

      const allProducts = res.data.items || [];

      const filtered = isAdmin
        ? allProducts
        : allProducts.filter((p: any) => p.created_by === user?.id);

      setProducts(filtered);
      setPagination(res.data.pagination || null);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      load();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

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
            My Shop Products
          </h1>
          <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
            Products created by you for the temple shop.
          </p>
        </div>

        <Link
          to="/shop/manage/products"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#c8902a] px-5 py-3 font-black text-[#1a0a00]"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className="mb-5 flex items-center gap-3 rounded-3xl border border-[#ede0c8] bg-white p-4">
        <Search className="text-[#9a7a4a]" size={18} />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search my products..."
          className="w-full bg-transparent text-sm font-bold outline-none"
        />
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
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.uuid}
              className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm"
            >
              <div className="h-44 bg-[#f5e8c8]">
                {imageUrl(product) ? (
                  <img
                    src={imageUrl(product)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-12 w-12 text-[#c8902a]" />
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-[#f5e8c8] px-3 py-1 text-xs font-black text-[#8b6914]">
                    {product.category?.name || "Category"}
                  </span>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                    {product.status}
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
                  {product.title}
                </h2>

                <p className="mt-2 text-sm font-bold text-[#9a7a4a]">
                  ₹{product.price_amount} · Stock {product.stock_quantity}
                </p>

                <div className="mt-5 flex gap-2 border-t border-[#ede0c8] pt-4">
                  <Link
                    to="/shop/manage/products"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#ede0c8] px-3 py-2 text-sm font-black text-[#5c3d1a]"
                  >
                    <Edit size={16} />
                    Edit
                  </Link>

                  <button
                    onClick={() => remove(product)}
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
    </main>
  );
}