import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Loader2,
  Package,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import {
  addToCart,
  getMyWishlist,
  toggleWishlist,
} from "../../services/shopService";
import PageSeo from "../../components/seo/PageSeo";

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getMyWishlist();
      setItems(res.data || []);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const imageUrl = (product: any) => {
    const img = product?.images?.[0]?.image_url;
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `http://localhost:3000${img}`;
  };

  const addProductToCart = async (product: any) => {
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

  const removeWishlist = async (product: any) => {
    try {
      setActionLoading(product.uuid);
      await toggleWishlist(product.uuid);
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to remove wishlist");
    } finally {
      setActionLoading(null);
    }
  };

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
        title="Wishlist | Temple Shop"
        description="Your saved devotional products."
      />

      <main className="min-h-screen bg-[#fdfaf5] px-5 py-10">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="font-serif text-5xl font-black text-[#1a0a00]">
              My Wishlist
            </h1>
            <p className="mt-2 text-sm font-bold text-[#9a7a4a]">
              Products you saved for later.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#ede0c8] bg-white p-12 text-center">
              <Heart className="mx-auto h-14 w-14 text-[#c8902a]" />
              <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
                Wishlist is empty
              </h2>

              <Link
                to="/shop"
                className="mt-6 inline-flex rounded-2xl bg-[#c8902a] px-6 py-3 font-black text-[#1a0a00]"
              >
                Explore Shop
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((wishlist) => {
                const product = wishlist.product;

                return (
                  <div
                    key={wishlist.uuid}
                    className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm"
                  >
                    <Link to={`/shop/products/${product.uuid}`}>
                      <div className="h-56 bg-[#f5e8c8]">
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
                    </Link>

                    <div className="p-5">
                      <h2 className="line-clamp-2 font-serif text-2xl font-black text-[#1a0a00]">
                        {product.title}
                      </h2>

                      <p className="mt-2 text-sm font-bold text-[#9a7a4a]">
                        ₹{product.price_amount}
                      </p>

                      <div className="mt-5 flex gap-2">
                        <button
                          onClick={() => removeWishlist(product)}
                          disabled={actionLoading === product.uuid}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600"
                        >
                          {actionLoading === product.uuid ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>

                        <button
                          onClick={() => addProductToCart(product)}
                          disabled={actionLoading === product.uuid}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#c8902a] px-4 py-3 font-black text-[#1a0a00]"
                        >
                          <ShoppingCart className="h-5 w-5" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}