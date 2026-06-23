import { useEffect, useState } from "react";
import { Loader2, Star } from "lucide-react";
import {
  getAllProductReviews,
  updateProductReviewStatus,
} from "../../../services/shopService";

export default function AdminShopReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getAllProductReviews({
        page,
        limit: 10,
        status: status === "all" ? undefined : status,
      });

      setReviews(res.data.items || []);
      setPagination(res.data.pagination || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, status]);

  const changeStatus = async (review: any, nextStatus: any) => {
    try {
      await updateProductReviewStatus(review.uuid, { status: nextStatus });
      await load();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to update review");
    }
  };

  return (
    <main className="min-h-screen bg-[#fdfaf5] p-5">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
            Product Reviews
          </h1>
          <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
            Moderate product reviews from customers.
          </p>
        </div>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold text-[#5c3d1a]"
        >
          <option value="all">All Reviews</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-[#ede0c8] bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-[#c8902a]" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#ede0c8] bg-white p-12 text-center">
          <Star className="mx-auto h-12 w-12 text-[#c8902a]" />
          <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
            No reviews found
          </h2>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.uuid}
              className="rounded-3xl border border-[#ede0c8] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
                    {review.product?.title || "Product"}
                  </h2>

                  <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
                    By {review.user?.first_name} {review.user?.last_name}
                  </p>

                  <div className="mt-3 flex gap-1 text-[#c8902a]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 ${
                          index < Number(review.rating) ? "fill-current" : ""
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                    review.status === "approved"
                      ? "bg-emerald-50 text-emerald-700"
                      : review.status === "rejected"
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {review.status}
                </span>
              </div>

              <p className="mt-4 rounded-2xl bg-[#fdfaf5] p-4 text-sm font-bold leading-7 text-[#5c3d1a]">
                {review.review_text || "No written review."}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => changeStatus(review, "approved")}
                  className="rounded-xl bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700"
                >
                  Approve
                </button>

                <button
                  onClick={() => changeStatus(review, "pending")}
                  className="rounded-xl bg-yellow-50 px-4 py-2 text-sm font-black text-yellow-700"
                >
                  Pending
                </button>

                <button
                  onClick={() => changeStatus(review, "rejected")}
                  className="rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-700"
                >
                  Reject
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
    </main>
  );
}