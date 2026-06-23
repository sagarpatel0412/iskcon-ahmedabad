import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Loader2,
  Package,
  RefreshCcw,
} from "lucide-react";
import { getShopProducts, updateShopProduct } from "../../../services/shopService";

export default function AdminShopLowStockPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUuid, setUpdatingUuid] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getShopProducts({
        page: 1,
        limit: 100,
        status: "published",
      });

      const items = res.data.items || [];

      setProducts(
        items.filter(
          (p: any) => Number(p.stock_quantity) <= Number(p.low_stock_alert),
        ),
      );
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load low stock");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const restock = async (product: any) => {
    const quantity = prompt(
      `Enter new stock quantity for ${product.title}`,
      String(product.stock_quantity || 0),
    );

    if (quantity === null) return;

    try {
      setUpdatingUuid(product.uuid);

      await updateShopProduct(product.uuid, {
        stock_quantity: Number(quantity),
      });

      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to update stock");
    } finally {
      setUpdatingUuid(null);
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
      <div className="mb-6">
        <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
          Low Stock Products
        </h1>
        <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
          Products that need refill before going out of stock.
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-[#ede0c8] bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#c8902a]" />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#ede0c8] bg-white p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-[#c8902a]" />

          <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
            No low stock products
          </h2>

          <p className="mt-2 text-sm font-bold text-[#9a7a4a]">
            Inventory looks healthy.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.uuid}
              className="flex flex-wrap items-center gap-4 rounded-3xl border border-[#ede0c8] bg-white p-4 shadow-sm"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#f5e8c8]">
                {imageUrl(product) ? (
                  <img
                    src={imageUrl(product)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="text-[#c8902a]" />
                  </div>
                )}
              </div>

              <div className="min-w-[240px] flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />

                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">
                    Low Stock
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
                  {product.title}
                </h2>

                <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
                  Category: {product.category?.name || "-"}
                </p>
              </div>

              <div className="rounded-2xl bg-[#fdfaf5] px-5 py-3 text-center">
                <p className="text-xs font-black uppercase text-[#9a7a4a]">
                  Current
                </p>
                <p className="text-2xl font-black text-red-600">
                  {product.stock_quantity}
                </p>
              </div>

              <div className="rounded-2xl bg-[#fdfaf5] px-5 py-3 text-center">
                <p className="text-xs font-black uppercase text-[#9a7a4a]">
                  Alert At
                </p>
                <p className="text-2xl font-black text-[#1a0a00]">
                  {product.low_stock_alert}
                </p>
              </div>

              <button
                onClick={() => restock(product)}
                disabled={updatingUuid === product.uuid}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#c8902a] px-5 py-3 font-black text-[#1a0a00] disabled:opacity-60"
              >
                {updatingUuid === product.uuid ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <RefreshCcw size={18} />
                )}
                Update Stock
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}