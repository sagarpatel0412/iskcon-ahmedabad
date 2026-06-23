import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import PageSeo from "../../components/seo/PageSeo";

export default function ShopPaymentSuccessPage() {
  return (
    <>
      <PageSeo title="Payment Successful | Temple Shop" description="Payment completed." />

      <main className="flex min-h-screen items-center justify-center bg-[#fdfaf5] px-5">
        <div className="max-w-xl rounded-3xl border border-[#ede0c8] bg-white p-10 text-center shadow-xl">
          <CheckCircle className="mx-auto h-20 w-20 text-emerald-600" />

          <h1 className="mt-6 font-serif text-4xl font-black text-[#1a0a00]">
            Payment Successful 🙏
          </h1>

          <p className="mt-3 text-sm font-bold leading-7 text-[#9a7a4a]">
            Your temple shop order has been placed successfully.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/shop/my-orders"
              className="rounded-2xl bg-[#c8902a] px-6 py-3 font-black text-[#1a0a00]"
            >
              View My Orders
            </Link>

            <Link
              to="/shop"
              className="rounded-2xl border border-[#ede0c8] px-6 py-3 font-black text-[#5c3d1a]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}