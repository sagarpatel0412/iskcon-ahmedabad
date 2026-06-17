import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  Images,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAllKrishnaImages } from "../../services/homeService";

export default function KrishnaGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    getAllKrishnaImages()
      .then((res) => setImages(res.data?.data || []))
      .finally(() => setLoading(false));
  }, []);

  const activeImage = activeIndex !== null ? images[activeIndex] : null;

  const openImage = (index: number) => {
    setActiveIndex(index);
  };

  const closeImage = () => {
    setActiveIndex(null);
  };

  const nextImage = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % images.length);
  };

  const prevImage = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  };

  const downloadImage = async (imageUrl: string, index: number) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = `krishna-darshan-${index + 1}.jpg`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(blobUrl);
  };

  return (
    <div className="-mx-5 -my-8 bg-[#fdfaf5]">
      {/* <section className="relative overflow-hidden bg-[#1a0a00] px-5 py-24 text-center">
        <div className="absolute inset-0 text-[280px] text-[#c8902a]/5">
          श्री
        </div>

        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#d4a853]">
            Divine Darshan Gallery
          </p>

          <h1 className="mt-5 font-serif text-6xl font-black text-white md:text-8xl">
            Krishna Gallery
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg font-bold leading-8 text-[#f5e8c8]">
            Behold beautiful darshan images of Lord Krishna and remember His
            divine form with devotion.
          </p>

          <Link
            to="/"
            className="mx-auto mt-8 inline-flex items-center gap-2 rounded-2xl border border-[#d4a853] px-6 py-4 font-black text-[#d4a853] hover:bg-[#d4a853] hover:text-[#1a0a00]"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </section> */}

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-[#f5e8c8] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#8b6914]">
              Darshan
            </div>

            <h2 className="mt-4 font-serif text-5xl font-black text-[#1a0a00]">
              All Krishna Images
            </h2>

            <p className="mt-3 max-w-2xl text-sm font-bold leading-7 text-[#9a7a4a]">
              Click any image to open full view, then move next or previous
              through the gallery.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-white px-5 py-4 font-black text-[#8b6914] shadow-sm">
            <Images className="h-5 w-5 text-[#c8902a]" />
            {images.length} Images
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="h-[340px] animate-pulse rounded-[2rem] bg-[#f1e6d0]"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[2rem] border border-[#ede0c8] bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <button
                  onClick={() => openImage(index)}
                  className="block w-full"
                >
                  <img
                    src={item.image}
                    alt={`Krishna Darshan ${index + 1}`}
                    className="h-[340px] w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-75"
                  />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadImage(item.image, index);
                  }}
                  className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur transition hover:bg-white"
                >
                  <Download className="h-5 w-5 text-[#1a0a00]" />
                </button>

                <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  {/* <h3 className="font-serif text-2xl font-black text-white">
                    Krishna Darshan
                  </h3> */}

                  <p className="mt-1 text-sm font-bold text-[#f5e8c8]">
                    Click to view full image
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {activeImage && activeIndex !== null && (
        <div className="fixed inset-0 z-50 bg-[#1a0a00]/95 px-4 py-5">
          <button
            onClick={closeImage}
            className="absolute right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1a0a00]"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-5 top-1/2 z-50 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a0a00] md:flex"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-5 top-1/2 z-50 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#1a0a00] md:flex"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="mx-auto flex h-full max-w-6xl flex-col">
            <div className="flex flex-1 items-center justify-center overflow-hidden">
              <img
                src={activeImage.image}
                alt={`Krishna Darshan ${activeIndex + 1}`}
                className="max-h-[72vh] max-w-full rounded-[2rem] object-contain shadow-2xl"
              />
            </div>

            <div className="mt-5 text-center">
              <h3 className="font-serif text-3xl font-black text-white">
                Krishna Darshan {activeIndex + 1}
              </h3>
              <p className="mt-1 text-sm font-bold text-[#d4a853]">
                {activeIndex + 1} / {images.length}
              </p>
            </div>

            <div className="mt-5 flex justify-center gap-3 md:hidden">
              <button
                onClick={prevImage}
                className="rounded-2xl bg-white px-6 py-3 font-black text-[#1a0a00]"
              >
                Previous
              </button>

              <button
                onClick={nextImage}
                className="rounded-2xl bg-[#c8902a] px-6 py-3 font-black text-[#1a0a00]"
              >
                Next
              </button>
            </div>

            <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
              {images.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 ${
                    activeIndex === index
                      ? "border-[#c8902a]"
                      : "border-white/20"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
