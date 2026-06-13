import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Crown,
  Eye,
  Image as ImageIcon,
  Lock,
  NotebookText,
  UserRound,
} from "lucide-react";

import { getPost, getAuthorPost } from "../../services/contentService";
import AppLoader from "../../components/common/AppLoader";
import {
  createPostPurchaseOrder,
  createSubscriptionOrder,
  getSubscriptionPlans,
  verifyPostPurchase,
  verifySubscriptionPayment,
} from "../../services/contentPaymentService";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ContentDetailsPage() {
  const { uuid } = useParams();
  const location = useLocation();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<any[]>([]);
  const [paying, setPaying] = useState(false);

  const isAuthor = location.pathname.startsWith("/content/author/");

  useEffect(() => {
    load();
  }, [uuid, isAuthor]);

  const load = async () => {
    try {
      setLoading(true);

      const res = isAuthor ? await getAuthorPost(uuid!) : await getPost(uuid!);
      setPost(res.data);

      if (res.data?.is_locked) {
        const plansRes = await getSubscriptionPlans();
        setPlans(Array.isArray(plansRes.data) ? plansRes.data : []);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const buyPost = async () => {
    try {
      setPaying(true);

      const loaded = await loadRazorpayScript();

      if (!loaded) {
        alert("Unable to load Razorpay");
        return;
      }

      const orderRes = await createPostPurchaseOrder(post.uuid);
      const { key, order, payment_uuid } = orderRes.data;

      const razorpay = new window.Razorpay({
        key,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        name: "ISKCON Ahmedabad",
        description: post.title,
        image: "https://iskconahmedabad.com/images/logo.png",
        theme: {
          color: "#c8902a",
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay using UPI",
                instruments: [{ method: "upi" }],
              },
            },
            sequence: ["block.upi"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        handler: async function (response: any) {
          await verifyPostPurchase({
            payment_uuid,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert("Content unlocked successfully 🙏");
          await load();
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      });

      razorpay.open();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  const subscribe = async (planUuid: string) => {
    try {
      setPaying(true);

      const loaded = await loadRazorpayScript();

      if (!loaded) {
        alert("Unable to load Razorpay");
        return;
      }

      const orderRes = await createSubscriptionOrder(planUuid);
      const { key, order, payment_uuid, plan } = orderRes.data;

      const razorpay = new window.Razorpay({
        key,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        name: "ISKCON Ahmedabad",
        description: plan?.name || "Premium Subscription",
        image: "https://iskconahmedabad.com/images/logo.png",
        theme: {
          color: "#c8902a",
        },
        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay using UPI",
                instruments: [{ method: "upi" }],
              },
            },
            sequence: ["block.upi"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        handler: async function (response: any) {
          await verifySubscriptionPayment({
            payment_uuid,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert("Subscription activated successfully 🙏");
          await load();
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      });

      razorpay.open();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Subscription failed");
    } finally {
      setPaying(false);
    }
  };

  const publishedDate = useMemo(() => {
    if (!post?.published_at) return "-";

    return new Date(post.published_at).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, [post]);

  const readingTime = useMemo(() => {
    const text = (post?.content || post?.excerpt || "").replace(/<[^>]+>/g, " ");
    const words = text.trim().split(/\s+/).filter(Boolean).length;

    return Math.max(1, Math.ceil(words / 200));
  }, [post]);

  if (loading) {
    return (
      <AppLoader
        title="Loading Content"
        subtitle="Fetching spiritual wisdom..."
      />
    );
  }

  if (!post) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
        <h1 className="text-3xl font-black text-slate-900">
          Content not found
        </h1>
      </div>
    );
  }

  const unlockProps = {
    plans,
    paying,
    onBuyPost: buyPost,
    onSubscribe: subscribe,
  };

  if (post.type === "journal") {
    return (
      <JournalDetailsPage
        post={post}
        publishedDate={publishedDate}
        readingTime={readingTime}
        {...unlockProps}
      />
    );
  }

  return (
    <NewsletterDetailsPage
      post={post}
      publishedDate={publishedDate}
      readingTime={readingTime}
      {...unlockProps}
    />
  );
}

function JournalDetailsPage({
  post,
  publishedDate,
  readingTime,
  plans,
  paying,
  onBuyPost,
  onSubscribe,
}: {
  post: any;
  publishedDate: string;
  readingTime: number;
  plans: any[];
  paying: boolean;
  onBuyPost: () => void;
  onSubscribe: (planUuid: string) => void;
}) {
  const banner =
    post.banner_image_url ||
    post.cover_image_url ||
    post.thumbnail_url ||
    "https://iskconahmedabad.com/images/gallery/gallery2.jpg";

  const cover =
    post.cover_image_url || post.thumbnail_url || post.banner_image_url || banner;

  const thumbnail =
    post.thumbnail_url || post.cover_image_url || post.banner_image_url || banner;

  const isPaid = post.visibility === "paid" || post.access_type !== "free";

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/journals"
        className="mb-6 inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 hover:bg-[#f5e8c8] hover:text-[#8b6914]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Journals
      </Link>

      <div className="my-6 flex">
        <span className="rounded-full bg-[#1a0a00] px-5 py-2 text-[11px] font-black uppercase tracking-[0.25em] text-[#d4a853] shadow-lg">
          ॐ नमो भगवते वासुदेवाय
        </span>
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
        <div className="relative h-52 overflow-hidden bg-slate-950 md:h-64">
          <img src={banner} className="h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/30 to-transparent" />

          <div className="absolute left-6 top-6 flex flex-wrap gap-2">
            <Badge className="bg-amber-100 text-amber-800">
              <NotebookText className="h-3 w-3" />
              Journal
            </Badge>

            <Badge
              className={
                isPaid
                  ? "bg-purple-100 text-purple-800"
                  : "bg-emerald-100 text-emerald-800"
              }
            >
              {isPaid ? <Crown className="h-3 w-3" /> : null}
              {isPaid ? "Premium" : "Free"}
            </Badge>

            {post.is_locked && (
              <Badge className="bg-red-100 text-red-800">
                <Lock className="h-3 w-3" />
                Locked
              </Badge>
            )}

            <Badge className="bg-blue-100 text-blue-800">{post.status}</Badge>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-white md:text-5xl">
              {post.title}
            </h1>
          </div>
        </div>

        <div className="grid gap-0 md:grid-cols-[320px_1fr]">
          <aside className="border-b border-slate-200 bg-slate-50 p-5 md:border-b-0 md:border-r">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <img src={cover} className="h-80 w-full object-cover" />

              <div className="border-t border-slate-100 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Cover Image
                </p>

                <p className="mt-1 text-sm font-bold text-slate-700">
                  Journal reading edition
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <MiniInfo label="Views" value={post.view_count || 0} />
              <MiniInfo label="Read" value={`${readingTime} min`} />
              <MiniInfo label="Date" value={publishedDate} />
              <MiniInfo
                label="Access"
                value={
                  isPaid
                    ? `${post.currency || "INR"} ${post.price_amount}`
                    : "Free"
                }
              />
            </div>
          </aside>

          <main className="p-5 md:p-8">
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <ImageBox label="thumbnail_url" src={thumbnail} />
              <ImageBox label="banner_image_url" src={banner} />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Content Identity
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Type" value={post.type} />
                <Field label="Slug" value={post.slug || "-"} />
                <Field label="Visibility" value={post.visibility} />
                <Field label="Access Type" value={post.access_type} />
                <Field label="Status" value={post.status} />
                <Field
                  label="Price"
                  value={
                    isPaid
                      ? `${post.currency || "INR"} ${post.price_amount}`
                      : "Free"
                  }
                />
              </div>
            </div>

            {post.excerpt && (
              <div className="mt-6 rounded-3xl border-l-4 border-amber-500 bg-amber-50 p-6">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-amber-700">
                  Journal Excerpt
                </p>

                <div
                  className="prose max-w-none prose-headings:text-slate-900 prose-p:text-slate-700"
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                />
              </div>
            )}
          </main>
        </div>
      </section>

      {post.is_locked ? (
        <UnlockContentCard
          post={post}
          plans={plans}
          paying={paying}
          onBuyPost={onBuyPost}
          onSubscribe={onSubscribe}
        />
      ) : (
        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.25em] text-[#8b6914]">
            Journal Content
          </p>

          <div
            className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:font-medium prose-p:leading-8 prose-p:text-slate-700 prose-strong:text-slate-900 prose-img:rounded-3xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </section>
      )}

      <MediaGallery post={post} />
      <AuthorCard post={post} />
    </div>
  );
}

function NewsletterDetailsPage({
  post,
  publishedDate,
  readingTime,
  plans,
  paying,
  onBuyPost,
  onSubscribe,
}: {
  post: any;
  publishedDate: string;
  readingTime: number;
  plans: any[];
  paying: boolean;
  onBuyPost: () => void;
  onSubscribe: (planUuid: string) => void;
}) {
  const banner =
    post.banner_image_url ||
    post.cover_image_url ||
    post.thumbnail_url ||
    "https://iskconahmedabad.com/images/gallery/gallery2.jpg";

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/newsletters"
        className="mb-6 inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 hover:bg-[#f5e8c8] hover:text-[#8b6914]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Newsletters
      </Link>

      <section className="relative overflow-hidden rounded-[2rem] shadow-xl">
        <img src={banner} className="h-[520px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="mb-4 flex flex-wrap gap-3">
            <span className="rounded-full bg-[#c8902a] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#1a0a00]">
              {post.type}
            </span>

            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wider text-white backdrop-blur">
              {post.visibility}
            </span>

            {post.is_locked && (
              <span className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-xs font-black uppercase tracking-wider text-white">
                <Lock className="h-4 w-4" />
                Locked
              </span>
            )}
          </div>

          <h1 className="max-w-5xl text-4xl font-black leading-tight text-white md:text-6xl">
            {post.title}
          </h1>

          <p className="mt-4 max-w-3xl text-base font-bold leading-7 text-white/85">
            By {post.author?.first_name} {post.author?.last_name || ""} · ISKCON
            Ahmedabad
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <MetaCard icon={Eye} label="Views" value={post.view_count || 0} />
        <MetaCard icon={CalendarDays} label="Published" value={publishedDate} />
        <MetaCard
          icon={BookOpen}
          label="Reading Time"
          value={`${readingTime} min`}
        />
        <MetaCard
          icon={Lock}
          label="Access"
          value={
            Number(post.price_amount) > 0
              ? `${post.currency || "INR"} ${post.price_amount}`
              : "Free"
          }
        />
      </section>

      {post.excerpt && (
        <section className="mt-10 rounded-[2rem] border border-[#ede0c8] bg-[#f5e8c8] p-7 md:p-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#8b6914]">
            Excerpt
          </p>

          <div
            className="prose max-w-none prose-headings:text-slate-900 prose-p:text-slate-700"
            dangerouslySetInnerHTML={{ __html: post.excerpt }}
          />
        </section>
      )}

      {post.is_locked ? (
        <UnlockContentCard
          post={post}
          plans={plans}
          paying={paying}
          onBuyPost={onBuyPost}
          onSubscribe={onSubscribe}
        />
      ) : (
        <section className="mt-10 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm md:p-10">
          <div
            className="prose prose-lg max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:font-medium prose-p:leading-8 prose-p:text-slate-700 prose-strong:text-slate-900 prose-img:rounded-3xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </section>
      )}

      <MediaGallery post={post} />
      <AuthorCard post={post} />
    </div>
  );
}

function UnlockContentCard({
  post,
  plans,
  paying,
  onBuyPost,
  onSubscribe,
}: {
  post: any;
  plans: any[];
  paying: boolean;
  onBuyPost: () => void;
  onSubscribe: (planUuid: string) => void;
}) {
  const canBuySingle =
    post.access_type === "one_time" ||
    post.access_type === "subscription_or_one_time";

  const canSubscribe =
    post.access_type === "subscription" ||
    post.access_type === "subscription_or_one_time";

  return (
    <div className="mt-10 rounded-[2rem] border border-[#c8902a] bg-[#fdfaf5] p-8 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#1a0a00] text-4xl">
        🔒
      </div>

      <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-[#8b6914]">
        Premium Content
      </p>

      <h2 className="mt-3 font-serif text-4xl font-black text-[#1a0a00]">
        Unlock this {post.type}
      </h2>

      <p className="mx-auto mt-3 max-w-xl text-sm font-bold leading-7 text-[#9a7a4a]">
        {post.lock_message ||
          "This content requires purchase or active subscription."}
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {canBuySingle && (
          <div className="rounded-3xl border border-[#ede0c8] bg-white p-6">
            <h3 className="font-serif text-3xl font-black text-[#1a0a00]">
              Buy Once
            </h3>

            <p className="mt-2 text-sm font-bold text-[#9a7a4a]">
              Unlock only this journal/newsletter forever.
            </p>

            <div className="mt-5 font-serif text-5xl font-black text-[#c8902a]">
              ₹{Number(post.price_amount || 0)}
            </div>

            <button
              disabled={paying}
              onClick={onBuyPost}
              className="mt-6 w-full rounded-2xl bg-[#c8902a] px-5 py-4 font-black text-[#1a0a00] hover:bg-[#d4a853] disabled:opacity-60"
            >
              {paying ? "Processing..." : "Unlock This Content"}
            </button>
          </div>
        )}

        {canSubscribe && (
          <div className="rounded-3xl border border-[#ede0c8] bg-white p-6">
            <h3 className="font-serif text-3xl font-black text-[#1a0a00]">
              Subscribe
            </h3>

            <p className="mt-2 text-sm font-bold text-[#9a7a4a]">
              Unlock all premium journals and newsletters.
            </p>

            <div className="mt-5 space-y-3">
              {plans.map((plan) => (
                <button
                  key={plan.uuid}
                  disabled={paying}
                  onClick={() => onSubscribe(plan.uuid)}
                  className="w-full rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] p-4 text-left transition hover:border-[#c8902a] hover:bg-[#f5e8c8] disabled:opacity-60"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-black text-[#1a0a00]">{plan.name}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#9a7a4a]">
                        {plan.plan_type}
                      </p>
                    </div>

                    <div className="font-serif text-2xl font-black text-[#c8902a]">
                      ₹{Number(plan.amount || 0)}
                    </div>
                  </div>
                </button>
              ))}

              {plans.length === 0 && (
                <p className="rounded-2xl bg-[#f5e8c8] p-4 text-sm font-bold text-[#8b6914]">
                  No subscription plans available.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MediaGallery({ post }: { post: any }) {
  if (!post.media?.length) return null;

  return (
    <section className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#8b6914]">
            Gallery
          </p>

          <h2 className="mt-2 text-3xl font-black text-slate-900">
            Media Attachments
          </h2>
        </div>

        <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-600">
          {post.media.length} items
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {post.media.map((item: any) => (
          <div
            key={item.uuid}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"
          >
            {item.media_type === "image" ? (
              <img src={item.file_url} className="h-80 w-full object-cover" />
            ) : (
              <div className="flex h-80 items-center justify-center bg-slate-100">
                <ImageIcon className="h-12 w-12 text-slate-400" />
              </div>
            )}

            <div className="p-5">
              <h3 className="font-black text-slate-900">
                {item.title || "Media"}
              </h3>

              {item.media_type !== "image" && (
                <a
                  href={item.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-sm font-black text-[#8b6914]"
                >
                  Open File
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AuthorCard({ post }: { post: any }) {
  return (
    <section className="mt-12 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#c8902a] text-3xl font-black text-[#1a0a00]">
          {post.author?.first_name?.charAt(0)?.toUpperCase() || (
            <UserRound className="h-8 w-8" />
          )}
        </div>

        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#8b6914]">
            Author
          </p>

          <h3 className="mt-1 text-2xl font-black text-slate-900">
            {post.author?.first_name} {post.author?.last_name}
          </h3>

          <p className="mt-1 font-bold text-slate-500">
            ISKCON Ahmedabad Content Contributor
          </p>
        </div>
      </div>
    </section>
  );
}

function MetaCard({ icon: Icon, label, value }: any) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5e8c8] text-[#8b6914]">
        <Icon className="h-5 w-5" />
      </div>

      <p className="text-sm font-black text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-black text-slate-900">{value}</p>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function ImageBox({ label, src }: { label: string; src: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 bg-slate-50 px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-400">
        {label}
      </div>

      <img src={src} className="h-36 w-full object-cover" />
    </div>
  );
}

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-black text-slate-800">
        {value}
      </p>
    </div>
  );
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black uppercase ${className}`}
    >
      {children}
    </span>
  );
}
