import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { FaInstagram } from "react-icons/fa";

const instagramPosts = [
  "https://www.instagram.com/reel/DZb5YENsjEJ/",
  "https://www.instagram.com/reel/DZL59mdoVU7/",
  "https://www.instagram.com/reel/DZKqmb6s7M7/",
];

export default function InstagramFeedPage() {
  useEffect(() => {
    const scriptId = "instagram-embed-script";

    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      // @ts-ignore
      window.instgrm?.Embeds?.process();
    }

    setTimeout(() => {
      // @ts-ignore
      window.instgrm?.Embeds?.process();
    }, 500);
  }, []);

  return (
    <main className="min-h-screen bg-[#fdfaf5]">
      <section className="bg-[#1a0a00] px-5 py-20 text-center text-white">
        <FaInstagram className="mx-auto h-16 w-16 text-pink-500" />

        <h1 className="mt-6 font-serif text-5xl font-black">
          ISKCON Ahmedabad Instagram
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg font-bold text-[#d4a853]">
          Watch latest reels, temple moments, festivals, kirtans and devotional
          updates from ISKCON Ahmedabad.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="mb-8 rounded-[2rem] border border-[#ede0c8] bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f5e8c8] text-[#8b6914]">
              <Sparkles className="h-6 w-6" />
            </div>

            <div>
              <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
                Temple Reels & Posts
              </h2>

              <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
                Updates are shown from selected public Instagram posts.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {instagramPosts.map((url) => (
            <InstagramEmbed key={url} url={url} />
          ))}
        </div>
      </section>
    </main>
  );
}

function InstagramEmbed({ url }: { url: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#ede0c8] bg-white p-4 shadow-sm">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: "#fff",
          border: 0,
          borderRadius: "24px",
          margin: "0 auto",
          maxWidth: "540px",
          minWidth: "300px",
          width: "100%",
        }}
      />
    </div>
  );
}