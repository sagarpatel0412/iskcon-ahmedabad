import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { getRecommendedKrishnaImages } from "../../services/homeService";
import { Link } from "react-router-dom";

export default function KrishnaGallerySection() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecommendedKrishnaImages()
      .then((res) => {
        setImages(res.data?.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="bg-[#fff8ec] px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[320px] animate-pulse rounded-[2rem] bg-[#f1e6d0]"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#fff8ec] px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5e8c8]">
            <Sparkles className="h-7 w-7 text-[#c8902a]" />
          </div>

          <h2 className="font-serif text-5xl font-black text-[#1a0a00]">
            Divine Darshan Gallery
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-sm font-bold leading-7 text-[#9a7a4a]">
            Take a moment to behold the beautiful forms of Lord Krishna and
            immerse your heart in remembrance, devotion and gratitude.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {images.map((item, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-[2rem] border border-[#ede0c8] bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
            >
              <img
                src={item.image}
                alt={`Krishna Darshan ${index + 1}`}
                className="h-[360px] w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          {/* <button
            onClick={() => window.location.reload()}
            className="rounded-2xl bg-[#c8902a] px-7 py-4 font-black text-[#1a0a00] transition hover:bg-[#d4a853]"
          >
            Show More Darshan
          </button> */}
          <Link
            to="/gallery"
            className="rounded-2xl border border-[#c8902a] px-7 py-4 font-black text-[#8b6914] hover:bg-[#c8902a] hover:text-[#1a0a00]"
          >
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
