import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Loader2,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import {
  getMyCart,
  removeCartItem,
  updateCartItem,
} from "../../services/shopService";
import PageSeo from "../../components/seo/PageSeo";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingUuid, setUpdatingUuid] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getMyCart();
      setCart(res.data);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const imageUrl = (item: any) => {
    const img = item.product?.images?.[0]?.image_url;
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `http://localhost:3000${img}`;
  };

  const updateQty = async (item: any, quantity: number) => {
    if (quantity <= 0) return;

    try {
      setUpdatingUuid(item.uuid);
      await updateCartItem(item.uuid, { quantity });
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to update cart");
    } finally {
      setUpdatingUuid(null);
    }
  };

  const removeItem = async (item: any) => {
    try {
      setUpdatingUuid(item.uuid);
      await removeCartItem(item.uuid);
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to remove item");
    } finally {
      setUpdatingUuid(null);
    }
  };

  const items = cart?.items || [];

  const subtotal = items.reduce((sum: number, item: any) => {
    return sum + Number(item.product?.price_amount || 0) * Number(item.quantity || 0);
  }, 0);

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
        title="Cart | Temple Shop"
        description="Review your temple shop cart."
      />

      <main className="min-h-screen bg-[#fdfaf5] px-5 py-10">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="font-serif text-5xl font-black text-[#1a0a00]">
              My Cart
            </h1>
            <p className="mt-2 text-sm font-bold text-[#9a7a4a]">
              Review your devotional products before checkout.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#ede0c8] bg-white p-12 text-center">
              <ShoppingCart className="mx-auto h-14 w-14 text-[#c8902a]" />
              <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
                Your cart is empty
              </h2>
              <Link
                to="/shop"
                className="mt-6 inline-flex rounded-2xl bg-[#c8902a] px-6 py-3 font-black text-[#1a0a00]"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-4">
                {items.map((item: any) => (
                  <div
                    key={item.uuid}
                    className="flex flex-wrap items-center gap-4 rounded-3xl border border-[#ede0c8] bg-white p-4 shadow-sm"
                  >
                    <div className="h-24 w-24 overflow-hidden rounded-2xl bg-[#f5e8c8]">
                      {imageUrl(item) ? (
                        <img
                          src={imageUrl(item)}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="text-[#c8902a]" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-[220px] flex-1">
                      <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
                        {item.product?.title}
                      </h2>
                      <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
                        ₹{item.product?.price_amount}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQty(item, item.quantity - 1)}
                        disabled={updatingUuid === item.uuid}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ede0c8]"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="w-8 text-center font-black text-[#1a0a00]">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => updateQty(item, item.quantity + 1)}
                        disabled={updatingUuid === item.uuid}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#ede0c8]"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="w-28 text-right font-black text-[#1a0a00]">
                      ₹{Number(item.product?.price_amount || 0) * item.quantity}
                    </div>

                    <button
                      onClick={() => removeItem(item)}
                      disabled={updatingUuid === item.uuid}
                      className="rounded-xl bg-red-50 p-3 text-red-600"
                    >
                      {updatingUuid === item.uuid ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                ))}
              </div>

              <aside className="h-fit rounded-3xl border border-[#ede0c8] bg-white p-6 shadow-sm">
                <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
                  Order Summary
                </h2>

                <div className="mt-5 space-y-3 text-sm font-bold text-[#5c3d1a]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Calculated later</span>
                  </div>

                  <div className="border-t border-[#ede0c8] pt-4 text-xl font-black text-[#1a0a00]">
                    <div className="flex justify-between">
                      <span>Total</span>
                      <span>₹{subtotal}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/shop/checkout"
                  className="mt-6 flex w-full justify-center rounded-2xl bg-[#c8902a] px-6 py-4 font-black text-[#1a0a00]"
                >
                  Proceed To Checkout
                </Link>

                <Link
                  to="/shop"
                  className="mt-3 flex w-full justify-center rounded-2xl border border-[#ede0c8] px-6 py-4 font-black text-[#5c3d1a]"
                >
                  Continue Shopping
                </Link>
              </aside>
            </div>
          )}
        </section>
      </main>
    </>
  );
}