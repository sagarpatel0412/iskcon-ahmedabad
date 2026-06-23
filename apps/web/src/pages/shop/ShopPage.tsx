import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Loader2,
  Package,
  Search,
  ShoppingCart,
  Store,
} from "lucide-react";
import {
  addToCart,
  getShopCategories,
  getShopProducts,
  toggleWishlist,
} from "../../services/shopService";
import PageSeo from "../../components/seo/PageSeo";
import { useRequireLogin } from "../../hooks/useRequireLogin";

export default function ShopPage() {
  const requireLogin = useRequireLogin();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [categoryUuid, setCategoryUuid] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadCategories = async () => {
    const res = await getShopCategories();
    setCategories(res.data || []);
  };

  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await getShopProducts({
        page,
        limit: 12,
        search,
        category_uuid: categoryUuid || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
        in_stock: "true",
      });

      setProducts(res.data.items || []);
      setPagination(res.data.pagination || null);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load shop products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [page, categoryUuid, sortBy, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadProducts();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const addProductToCart = async (product: any) => {
    if (!requireLogin()) return;
    try {
      setActionLoading(product.uuid);

      await addToCart({
        product_uuid: product.uuid,
        quantity: 1,
      });

      alert("Added to cart 🙏");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to add to cart");
    } finally {
      setActionLoading(null);
    }
  };

  const wishlist = async (product: any) => {
    if (!requireLogin()) return;
    try {
      setActionLoading(product.uuid);
      await toggleWishlist(product.uuid);
      alert("Wishlist updated 🙏");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Please login to use wishlist");
    } finally {
      setActionLoading(null);
    }
  };

  const imageUrl = (product: any) => {
    const img = product.images?.[0]?.image_url;
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `http://localhost:3000${img}`;
  };

  const price = (product: any) => `₹${product.price_amount}`;

  return (
    <>
      <PageSeo
        title="Temple Shop | ISKCON Ahmedabad"
        description="Buy books, worship items, prasadam and devotional products."
      />

      <main className="min-h-screen bg-[#fdfaf5]">
        <section className="relative overflow-hidden bg-[#1a0a00] px-5 py-20 text-center">
          <div className="absolute inset-0 text-[220px] text-[#c8902a]/5">
            ॐ
          </div>

          <div className="relative z-10 mx-auto max-w-4xl">
            <Store className="mx-auto h-16 w-16 text-[#d4a853]" />

            <h1 className="mt-6 font-serif text-5xl font-black text-white md:text-6xl">
              Temple Shop
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg font-bold leading-8 text-[#d4a853]">
              Buy devotional books, prasadam, worship items, japa bags, tulasi
              malas and temple products delivered to your home.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-10">
          <div className="mb-8 rounded-3xl border border-[#ede0c8] bg-white p-4 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
              <div className="flex items-center gap-3 rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] px-4 py-3">
                <Search className="h-5 w-5 text-[#9a7a4a]" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search books, agarbatti, prasadam..."
                  className="w-full bg-transparent text-sm font-bold outline-none"
                />
              </div>

              <select
                value={categoryUuid}
                onChange={(e) => {
                  setCategoryUuid(e.target.value);
                  setPage(1);
                }}
                className="rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] px-4 py-3 text-sm font-bold text-[#5c3d1a]"
              >
                <option value="">All Categories</option>
                {categories.map((cat: any) => (
                  <option key={cat.uuid} value={cat.uuid}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split("-");
                  setSortBy(field);
                  setSortOrder(order);
                  setPage(1);
                }}
                className="rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] px-4 py-3 text-sm font-bold text-[#5c3d1a]"
              >
                <option value="created_at-DESC">Newest</option>
                <option value="price_amount-ASC">Price: Low to High</option>
                <option value="price_amount-DESC">Price: High to Low</option>
                <option value="title-ASC">Name A-Z</option>
              </select>
            </div>
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
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <div
                    key={product.uuid}
                    className="group overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link to={`/shop/products/${product.uuid}`}>
                      <div className="h-56 bg-[#f5e8c8]">
                        {imageUrl(product) ? (
                          <img
                            src={imageUrl(product)}
                            alt={product.title}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="h-12 w-12 text-[#c8902a]" />
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-5">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#f5e8c8] px-3 py-1 text-xs font-black text-[#8b6914]">
                          {product.category?.name || "Shop"}
                        </span>

                        {Number(product.stock_quantity) <= 0 && (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      <Link to={`/shop/products/${product.uuid}`}>
                        <h2 className="line-clamp-2 font-serif text-2xl font-black text-[#1a0a00]">
                          {product.title}
                        </h2>
                      </Link>

                      <p className="mt-2 line-clamp-2 text-sm font-bold leading-6 text-[#9a7a4a]">
                        {product.description || "Devotional product"}
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-2xl font-black text-[#1a0a00]">
                          {price(product)}
                        </p>

                        <p className="text-xs font-black text-[#8b6914]">
                          Stock {product.stock_quantity}
                        </p>
                      </div>

                      <div className="mt-5 flex gap-2">
                        <button
                          onClick={() => wishlist(product)}
                          disabled={actionLoading === product.uuid}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ede0c8] text-[#8b6914] hover:bg-[#f5e8c8]"
                        >
                          <Heart className="h-5 w-5" />
                        </button>

                        <button
                          onClick={() => addProductToCart(product)}
                          disabled={
                            actionLoading === product.uuid ||
                            Number(product.stock_quantity) <= 0
                          }
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#c8902a] px-4 py-3 font-black text-[#1a0a00] disabled:opacity-50"
                        >
                          {actionLoading === product.uuid ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <ShoppingCart className="h-5 w-5" />
                          )}
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-10 flex justify-center gap-3">
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
            </>
          )}
        </section>
      </main>
    </>
  );
}