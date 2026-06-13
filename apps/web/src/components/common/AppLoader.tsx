import { LoaderCircle } from "lucide-react";

export default function AppLoader({
  title = "Loading...",
  subtitle = "Please wait",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdfaf5] px-5">
      <div className="max-w-lg text-center">
        <img
          src="https://iskconahmedabad.com/images/logo.png"
          alt="ISKCON Ahmedabad"
          className="mx-auto h-28 w-28 animate-pulse rounded-full border-4 border-[#c8902a] bg-white p-2 shadow-xl"
        />

        <LoaderCircle
          size={50}
          className="mx-auto mt-8 animate-spin text-[#c8902a]"
        />

        <p className="mt-6 text-xs font-black uppercase tracking-[0.35em] text-[#8b6914]">
          Hare Krishna
        </p>

        <h1 className="mt-4 font-serif text-4xl font-black text-[#1a0a00]">
          {title}
        </h1>

        <p className="mt-4 text-lg leading-8 text-[#7a5c36]">
          {subtitle}
        </p>

        <div className="mt-10 rounded-3xl border border-[#ede0c8] bg-white p-6 shadow-sm">
          <p className="text-sm font-bold text-[#9a7a4a]">
            Hare Krishna Hare Krishna Krishna Krishna Hare Hare
            <br />
            Hare Rama Hare Rama Rama Rama Hare Hare
          </p>
        </div>
      </div>
    </div>
  );
}