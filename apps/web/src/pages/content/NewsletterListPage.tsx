import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Crown,
  Eye,
  Heart,
  Lock,
  Search,
  Sparkles,
  Timer,
  Unlock,
} from "lucide-react";
import { getPosts } from "../../services/contentService";
import useAuth from "../../hooks/useAuth";
import AppLoader from "../../components/common/AppLoader";

export default function NewsletterListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "free" | "paid">("all");
  const [search, setSearch] = useState("");

  const { user, loading: isUserLoading } = useAuth();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getPosts({ type: "newsletter" });
    setPosts(res.data || []);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "free" && post.access_type === "free") ||
        (filter === "paid" && post.access_type !== "free");

      const matchesSearch = post.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [posts, filter, search]);

  if (isUserLoading) {
    return (
      <AppLoader
        title="Loading Content"
        subtitle="Fetching spiritual wisdom..."
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1a0a00] to-[#3d2200] p-8 text-white shadow-xl">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#d4a853]">
          Krishna Wisdom
        </p>
        <h1 className="mt-3 text-4xl font-black">Newsletter Library</h1>
        <p className="mt-3 max-w-2xl font-bold text-[#d4a853]">
          Read free and premium newsletters from ISKCON Ahmedabad.
        </p>
      </div>

      <div className="mb-7 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterButton
            label="All Issues"
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <FilterButton
            label="Free"
            active={filter === "free"}
            onClick={() => setFilter("free")}
          />
          <FilterButton
            label="Premium"
            active={filter === "paid"}
            onClick={() => setFilter("paid")}
          />
        </div>

        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search newsletters..."
            className="bg-transparent font-bold text-slate-700 outline-none"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredPosts.map((post) => (
          <NewsletterCard key={post.uuid} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-12 text-center">
          <h2 className="text-2xl font-black text-slate-900">
            No newsletters found
          </h2>
          <p className="mt-2 font-bold text-slate-500">
            Try changing filter or search text.
          </p>
        </div>
      )}
      {!user?.isSubscribed && (
        <div className="mt-10 flex flex-wrap items-center gap-5 rounded-[2rem] border border-blue-200 bg-blue-50 p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
            <Crown className="h-7 w-7" />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-black text-slate-900">
              Unlock all premium newsletters
            </h3>
            <p className="mt-1 font-bold text-slate-600">
              Get full access to journals, newsletters, deep guides and premium
              spiritual content.
            </p>
          </div>

          <button className="rounded-2xl bg-blue-600 px-6 py-3 font-black text-white hover:bg-blue-700">
            Go Premium
          </button>
        </div>
      )}
    </div>
  );
}

function NewsletterCard({ post }: { post: any }) {
  const isPaid = post.access_type !== "free" || post.visibility === "paid";
  const image =
    post.thumbnail_url ||
    post.cover_image_url ||
    post.banner_image_url ||
    "https://iskconahmedabad.com/images/gallery/gallery2.jpg";

  const plainExcerpt = (post.excerpt || "")
    .replace(/<[^>]*>/g, "")
    .slice(0, 130);

  const readingTime = Math.max(
    1,
    Math.ceil(
      (post.content || "").replace(/<[^>]*>/g, " ").split(/\s+/).length / 200,
    ),
  );

  return (
    <Link
      to={`/content/${post.uuid}`}
      className={`group overflow-hidden rounded-[2rem] border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
        isPaid ? "border-amber-300" : "border-slate-200"
      }`}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-black ${
              isPaid
                ? "bg-amber-100 text-amber-800"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {isPaid ? (
              <Crown className="h-3 w-3" />
            ) : (
              <Unlock className="h-3 w-3" />
            )}
            {isPaid ? "Premium" : "Free"}
          </span>

          {post.media?.some((m: any) => m.is_featured) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs font-black uppercase tracking-widest text-white/80">
            {post.type}
          </p>
          <h2 className="mt-1 line-clamp-2 text-xl font-black leading-tight text-white">
            {post.title}
          </h2>
        </div>
      </div>

      <div className="p-5">
        <p className="line-clamp-3 text-sm font-bold leading-6 text-slate-600">
          {plainExcerpt || "No excerpt available."}
        </p>

        {isPaid && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
            <Lock className="h-4 w-4" />
            {Number(post.price_amount) > 0
              ? `Unlock for ${post.currency || "INR"} ${post.price_amount}`
              : "Premium members only"}
          </div>
        )}

        <div className="mt-4 flex items-center gap-4 text-xs font-black text-slate-400">
          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.view_count || 0}
          </span>

          <span className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            {post.likes_count || 0}
          </span>

          <span className="flex items-center gap-1">
            <Timer className="h-4 w-4" />
            {readingTime} min
          </span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${
                isPaid
                  ? "bg-amber-100 text-amber-800"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {post.author?.first_name?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <span className="text-sm font-bold text-slate-500">
              {post.author?.first_name || "Author"}
            </span>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-xs font-black ${
              isPaid
                ? "bg-amber-500 text-white"
                : "bg-emerald-100 text-emerald-800"
            }`}
          >
            {isPaid ? "Unlock" : "Read now"}
          </span>
        </div>
      </div>
    </Link>
  );
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-black transition ${
        active
          ? "bg-blue-600 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
      }`}
    >
      {label}
    </button>
  );
}
