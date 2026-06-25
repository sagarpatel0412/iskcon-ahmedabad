import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPromotionalBanners } from "../../services/promotionalBannerService";

export default function PromotionalCarousel({
  position = "all",
}: {
  position?: "home" | "shop" | "events" | "trips" | "courses" | "all";
}) {
  const navigate = useNavigate();

  const [items, setItems] = useState<any[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getPromotionalBanners({
        page: 1,
        limit: 10,
        position,
        is_active: true,
      });

      const banners = (res.data.items || []).filter(
        (item: any) =>
          item.display_type === "banner" || item.display_type === "both",
      );

      setItems(banners);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [position]);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [items.length]);

  const imageUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://localhost:3000${url}`;
  };

  const next = () => {
    setActive((prev) => (prev + 1) % items.length);
  };

  const previous = () => {
    setActive((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToBanner = (banner: any) => {
    if (banner.redirect_url) {
      navigate(banner.redirect_url);
    }
  };

  if (loading || items.length === 0) return null;

  const banner = items[active];

  return (
    <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-[#ede0c8] bg-[#1a0a00] shadow-xl">
      <div className="grid min-h-[280px] md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative p-8 md:p-10">
          <div className="absolute right-6 top-0 text-9xl text-[#c8902a]/10">
            ॐ
          </div>

          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#c8902a]/15 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-[#d4a853]">
              <Megaphone className="h-4 w-4" />
              {banner.banner_type || "Promotion"}
            </div>

            {banner.subtitle && (
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#d4a853]">
                {banner.subtitle}
              </p>
            )}

            <h2 className="mt-3 font-serif text-4xl font-black leading-tight text-white md:text-5xl">
              {banner.title}
            </h2>

            {banner.description && (
              <p className="mt-4 max-w-xl text-sm font-bold leading-7 text-[#f5e8c8]">
                {banner.description}
              </p>
            )}

            {banner.button_text && banner.redirect_url && (
              <button
                onClick={() => goToBanner(banner)}
                className="mt-7 rounded-2xl bg-[#c8902a] px-6 py-3 font-black text-[#1a0a00] transition hover:bg-[#d4a853]"
              >
                {banner.button_text}
              </button>
            )}
          </div>
        </div>

        <div className="relative min-h-[260px] bg-[#f5e8c8]">
          {banner.image_url ? (
            <img
              src={imageUrl(banner.image_url)}
              alt={banner.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-[260px] items-center justify-center text-[#c8902a]">
              <Megaphone className="h-20 w-20" />
            </div>
          )}
        </div>
      </div>

      {items.length > 1 && (
        <>
          <button
            onClick={previous}
            className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1a0a00] shadow"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1a0a00] shadow"
          >
            <ChevronRight size={22} />
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {items.map((item, index) => (
              <button
                key={item.uuid}
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === active
                    ? "w-8 bg-[#c8902a]"
                    : "w-2.5 bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}