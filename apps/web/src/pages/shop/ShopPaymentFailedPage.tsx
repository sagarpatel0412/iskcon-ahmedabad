import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import PageSeo from "../../components/seo/PageSeo";

export default function ShopPaymentFailedPage() {
  return (
    <>
      <PageSeo title="Payment Failed | Temple Shop" description="Payment failed." />

      <main className="flex min-h-screen items-center justify-center bg-[#fdfaf5] px-5">
        <div className="max-w-xl rounded-3xl border border-[#ede0c8] bg-white p-10 text-center shadow-xl">
          <XCircle className="mx-auto h-20 w-20 text-red-600" />

          <h1 className="mt-6 font-serif text-4xl font-black text-[#1a0a00]">
            Payment Failed
          </h1>

          <p className="mt-3 text-sm font-bold leading-7 text-[#9a7a4a]">
            Your payment was not completed. You can try again from checkout.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/shop/checkout"
              className="rounded-2xl bg-[#c8902a] px-6 py-3 font-black text-[#1a0a00]"
            >
              Try Again
            </Link>

            <Link
              to="/shop/cart"
              className="rounded-2xl border border-[#ede0c8] px-6 py-3 font-black text-[#5c3d1a]"
            >
              Back To Cart
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}