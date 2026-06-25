import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getActivePromotionalBanner } from "../../services/promotionalBannerService";

export default function PromotionalModal({
  position = "all",
}: {
  position?: string;
}) {
  const navigate = useNavigate();
  const [banner, setBanner] = useState<any>(null);

  useEffect(() => {
    loadBanner();
  }, [position]);

  const loadBanner = async () => {
    try {
      const res = await getActivePromotionalBanner(position);
      const item = res.data;

      if (!item) return;

      const seenKey = `promo_seen_${item.uuid}`;

      if (sessionStorage.getItem(seenKey)) return;

      if (item.display_type !== "modal" && item.display_type !== "both") return;

      setBanner(item);
    } catch {
      // silently ignore promotional banner errors
    }
  };

  const close = () => {
    if (banner?.uuid) {
      sessionStorage.setItem(`promo_seen_${banner.uuid}`, "true");
    }

    setBanner(null);
  };

  const goToLink = () => {
    if (!banner?.redirect_url) {
      close();
      return;
    }

    close();
    navigate(banner.redirect_url);
  };

  const imageUrl = (url?: string) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://localhost:3000${url}`;
  };

  if (!banner) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4">
      <div className="group relative h-[88vh] w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-[#1a0a00] shadow-2xl">
        <button
          onClick={close}
          className="absolute right-5 top-5 z-20 rounded-full bg-white/90 p-3 text-[#1a0a00] shadow transition hover:bg-white"
        >
          <X size={24} />
        </button>

        {banner.image_url ? (
          <img
            src={imageUrl(banner.image_url)}
            alt={banner.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#1a0a00] text-7xl text-[#c8902a]">
            ॐ
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/20" />

        <div className="absolute bottom-0 left-0 right-0 max-h-[58%] translate-y-[calc(100%-150px)] overflow-y-auto bg-gradient-to-t from-black/95 via-black/85 to-black/40 p-7 text-center transition duration-500 group-hover:translate-y-0 md:p-10">
          {banner.subtitle && (
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#d4a853]">
              {banner.subtitle}
            </p>
          )}

          <h2 className="mt-2 font-serif text-4xl font-black leading-tight text-white md:text-6xl">
            {banner.title}
          </h2>

          {banner.description && (
            <p className="mx-auto mt-4 max-w-3xl text-sm font-bold leading-7 text-[#f5e8c8] md:text-base md:leading-8">
              {banner.description}
            </p>
          )}

          {banner.button_text && banner.redirect_url && (
            <button
              onClick={goToLink}
              className="mt-7 rounded-2xl bg-[#c8902a] px-8 py-4 font-black text-[#1a0a00] transition hover:bg-[#d4a853]"
            >
              {banner.button_text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
