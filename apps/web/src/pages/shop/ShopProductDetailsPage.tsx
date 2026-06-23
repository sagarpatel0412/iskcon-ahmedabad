import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Heart,
  Loader2,
  Package,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Star,
} from "lucide-react";
import {
  addToCart,
  getShopProductByUuid,
  toggleWishlist,
  createProductReview,
  getProductReviews,
} from "../../services/shopService";
import PageSeo from "../../components/seo/PageSeo";
import { useRequireLogin } from "../../hooks/useRequireLogin";

export default function ShopProductDetailsPage() {
  const { uuid } = useParams();
  const requireLogin = useRequireLogin();

  const [product, setProduct] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewSummary, setReviewSummary] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSaving, setReviewSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getShopProductByUuid(uuid!);
      setProduct(res.data);

      const firstImage = res.data.images?.[0]?.image_url;
      setSelectedImage(firstImage || "");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    loadReviews();
  }, [uuid]);

  const loadReviews = async () => {
    const res = await getProductReviews(uuid!);
    setReviews(res.data.reviews || []);
    setReviewSummary(res.data.summary || null);
  };

  const imageUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://localhost:3000${url}`;
  };

  const submitReview = async () => {
    if (!requireLogin()) return;
    try {
      setReviewSaving(true);

      await createProductReview(product.uuid, {
        rating,
        review_text: reviewText,
      });

      setReviewText("");
      setRating(5);
      await loadReviews();

      alert("Review submitted 🙏");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to submit review");
    } finally {
      setReviewSaving(false);
    }
  };

  const addProductToCart = async () => {
    if (!requireLogin()) return;
    try {
      setActionLoading(true);

      await addToCart({
        product_uuid: product.uuid,
        quantity,
      });

      alert("Added to cart 🙏");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to add to cart");
    } finally {
      setActionLoading(false);
    }
  };

  const wishlist = async () => {
    if (!requireLogin()) return;
    try {
      await toggleWishlist(product.uuid);
      alert("Wishlist updated 🙏");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Please login to use wishlist");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfaf5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#c8902a]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fdfaf5] p-10 text-center">
        Product not found
      </div>
    );
  }

  return (
    <>
      <PageSeo
        title={`${product.title} | Temple Shop`}
        description={product.description || "ISKCON Ahmedabad temple product"}
      />

      <main className="min-h-screen bg-[#fdfaf5] px-5 py-10">
        <section className="mx-auto max-w-7xl">
          <Link
            to="/shop"
            className="mb-6 inline-block text-sm font-black text-[#8b6914]"
          >
            ← Back to Shop
          </Link>

          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <div className="overflow-hidden rounded-[2rem] border border-[#ede0c8] bg-white shadow-sm">
                <div className="h-[480px] bg-[#f5e8c8]">
                  {selectedImage ? (
                    <img
                      src={imageUrl(selectedImage)}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package className="h-20 w-20 text-[#c8902a]" />
                    </div>
                  )}
                </div>
              </div>

              {product.images?.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto">
                  {product.images.map((image: any) => (
                    <button
                      key={image.uuid}
                      onClick={() => setSelectedImage(image.image_url)}
                      className={`h-24 w-24 shrink-0 overflow-hidden rounded-2xl border ${
                        selectedImage === image.image_url
                          ? "border-[#c8902a]"
                          : "border-[#ede0c8]"
                      }`}
                    >
                      <img
                        src={imageUrl(image.image_url)}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#f5e8c8] px-4 py-2 text-xs font-black text-[#8b6914]">
                  {product.category?.name || "Temple Shop"}
                </span>

                {product.is_featured && (
                  <span className="rounded-full bg-orange-100 px-4 py-2 text-xs font-black text-orange-700">
                    Featured
                  </span>
                )}
              </div>

              <h1 className="font-serif text-5xl font-black leading-tight text-[#1a0a00]">
                {product.title}
              </h1>

              <p className="mt-5 text-4xl font-black text-[#c8902a]">
                ₹{product.price_amount}
              </p>

              <p className="mt-5 text-base font-bold leading-8 text-[#5c3d1a]">
                {product.description || "Devotional temple product."}
              </p>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <Info icon={Truck} text="Home Delivery" />
                <Info icon={ShieldCheck} text="Temple Product" />
                <Info icon={Package} text={`Stock ${product.stock_quantity}`} />
              </div>

              <div className="mt-8 rounded-3xl border border-[#ede0c8] bg-white p-5">
                <label className="text-sm font-black text-[#5c3d1a]">
                  Quantity
                </label>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-12 w-12 rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] font-black"
                  >
                    -
                  </button>

                  <span className="w-12 text-center text-xl font-black text-[#1a0a00]">
                    {quantity}
                  </span>

                  <button
                    onClick={() =>
                      setQuantity((q) =>
                        Math.min(Number(product.stock_quantity || 1), q + 1),
                      )
                    }
                    className="h-12 w-12 rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] font-black"
                  >
                    +
                  </button>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={wishlist}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ede0c8] text-[#8b6914] hover:bg-[#f5e8c8]"
                  >
                    <Heart className="h-6 w-6" />
                  </button>

                  <button
                    onClick={addProductToCart}
                    disabled={
                      actionLoading || Number(product.stock_quantity) <= 0
                    }
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#c8902a] px-6 py-4 font-black text-[#1a0a00] disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <ShoppingCart className="h-5 w-5" />
                    )}
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-12 rounded-[2rem] border border-[#ede0c8] bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
                  Customer Reviews
                </h2>

                <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
                  {reviewSummary?.total_reviews || 0} reviews ·{" "}
                  {reviewSummary?.average_rating || 0}/5 average rating
                </p>
              </div>

              <div className="flex gap-1 text-[#c8902a]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-5 w-5 ${
                      index < Math.round(reviewSummary?.average_rating || 0)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mb-8 rounded-3xl border border-[#ede0c8] bg-[#fdfaf5] p-5">
              <h3 className="font-serif text-2xl font-black text-[#1a0a00]">
                Write a Review
              </h3>

              <div className="mt-4 flex gap-2">
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = index + 1;

                  return (
                    <button
                      key={value}
                      onClick={() => setRating(value)}
                      className="text-[#c8902a]"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          value <= rating ? "fill-current" : ""
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                className="mt-4 min-h-28 w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none"
              />

              <button
                onClick={submitReview}
                disabled={reviewSaving}
                className="mt-4 rounded-2xl bg-[#c8902a] px-6 py-3 font-black text-[#1a0a00] disabled:opacity-60"
              >
                {reviewSaving ? "Submitting..." : "Submit Review"}
              </button>
            </div>

            {reviews.length === 0 ? (
              <p className="rounded-2xl bg-[#fdfaf5] p-5 text-sm font-bold text-[#9a7a4a]">
                No reviews yet. Be the first to review this product.
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.uuid}
                    className="rounded-3xl border border-[#ede0c8] bg-[#fdfaf5] p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black text-[#1a0a00]">
                          {review.user?.first_name} {review.user?.last_name}
                        </p>

                        <div className="mt-2 flex gap-1 text-[#c8902a]">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${
                                index < Number(review.rating)
                                  ? "fill-current"
                                  : ""
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs font-bold text-[#9a7a4a]">
                        {new Date(review.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    <p className="mt-4 text-sm font-bold leading-7 text-[#5c3d1a]">
                      {review.review_text || "No written review."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
    </>
  );
}

function Info({ icon: Icon, text }: any) {
  return (
    <div className="rounded-2xl border border-[#ede0c8] bg-white p-4 text-center">
      <Icon className="mx-auto h-6 w-6 text-[#c8902a]" />
      <p className="mt-2 text-xs font-black text-[#8b6914]">{text}</p>
    </div>
  );
}
