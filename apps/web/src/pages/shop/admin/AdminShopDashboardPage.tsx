import { useEffect, useState } from "react";
import {
  AlertTriangle,
  IndianRupee,
  Loader2,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import {
  getAllProductOrders,
  getShopProducts,
} from "../../../services/shopService";

export default function AdminShopDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    revenue: 0,
  });

  const [lowStock, setLowStock] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const load = async () => {
    try {
      setLoading(true);

      const productsRes = await getShopProducts({
        page: 1,
        limit: 100,
        status: "published",
      });

      const ordersRes = await getAllProductOrders({
        page: 1,
        limit: 10,
      });

      const products = productsRes.data.items || [];
      const orders = ordersRes.data.items || [];

      const lowStockItems = products.filter(
        (p: any) => Number(p.stock_quantity) <= Number(p.low_stock_alert),
      );

      const successOrders = orders.filter(
        (o: any) => o.payment_status === "success",
      );

      setStats({
        totalProducts: productsRes.data.pagination?.total || products.length,
        lowStockProducts: lowStockItems.length,
        totalOrders: ordersRes.data.pagination?.total || orders.length,
        pendingOrders: orders.filter((o: any) => o.order_status === "pending")
          .length,
        revenue: successOrders.reduce(
          (sum: number, order: any) => sum + Number(order.total_amount || 0),
          0,
        ),
      });

      setLowStock(lowStockItems.slice(0, 5));
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error(error);
      alert("Failed to load shop dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfaf5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#c8902a]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fdfaf5] p-5">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
          Shop Dashboard
        </h1>
        <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
          Manage temple store products, orders and inventory.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={Package} title="Products" value={stats.totalProducts} />
        <StatCard icon={Truck} title="Orders" value={stats.totalOrders} />
        <StatCard
          icon={ShoppingBag}
          title="Pending"
          value={stats.pendingOrders}
        />
        <StatCard
          icon={AlertTriangle}
          title="Low Stock"
          value={stats.lowStockProducts}
        />
        <StatCard
          icon={IndianRupee}
          title="Revenue"
          value={`₹${stats.revenue}`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-[#ede0c8] bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
            Low Stock Products
          </h2>

          <div className="mt-5 space-y-3">
            {lowStock.length === 0 ? (
              <p className="text-sm font-bold text-[#9a7a4a]">
                No low stock products.
              </p>
            ) : (
              lowStock.map((product) => (
                <div
                  key={product.uuid}
                  className="flex items-center justify-between rounded-2xl bg-[#fdfaf5] p-4"
                >
                  <div>
                    <h3 className="font-black text-[#1a0a00]">
                      {product.title}
                    </h3>
                    <p className="text-xs font-bold text-[#9a7a4a]">
                      Alert at {product.low_stock_alert}
                    </p>
                  </div>

                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-700">
                    {product.stock_quantity} left
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-[#ede0c8] bg-white p-6 shadow-sm">
          <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
            Recent Orders
          </h2>

          <div className="mt-5 space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm font-bold text-[#9a7a4a]">
                No recent orders.
              </p>
            ) : (
              recentOrders.map((order) => (
                <div
                  key={order.uuid}
                  className="flex items-center justify-between rounded-2xl bg-[#fdfaf5] p-4"
                >
                  <div>
                    <h3 className="font-black text-[#1a0a00]">
                      {order.order_number}
                    </h3>
                    <p className="text-xs font-bold text-[#9a7a4a]">
                      {order.order_status} · {order.payment_status}
                    </p>
                  </div>

                  <span className="font-black text-[#1a0a00]">
                    ₹{order.total_amount}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({ icon: Icon, title, value }: any) {
  return (
    <div className="rounded-3xl border border-[#ede0c8] bg-white p-5 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5e8c8] text-[#8b6914]">
        <Icon className="h-6 w-6" />
      </div>

      <p className="mt-5 text-sm font-black uppercase tracking-wider text-[#9a7a4a]">
        {title}
      </p>

      <h3 className="mt-2 text-3xl font-black text-[#1a0a00]">{value}</h3>
    </div>
  );
}