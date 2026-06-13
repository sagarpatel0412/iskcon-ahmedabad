import { Link } from "react-router-dom";
import { Home, ArrowLeft, Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fdfaf5] px-5">
      <div className="max-w-3xl text-center">
        <div className="mb-6 text-[120px] font-black leading-none text-[#c8902a]">
          404
        </div>

        <p className="mb-4 text-xs font-black uppercase tracking-[0.4em] text-[#8b6914]">
          Hare Krishna
        </p>

        <h1 className="font-serif text-5xl font-black text-[#1a0a00]">
          You seem to be lost in Maya
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-[#7a5c36]">
          The page you are looking for could not be found.
          Just like Arjuna needed guidance, let us help
          you find your way back.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-2xl bg-[#c8902a] px-6 py-4 font-black text-[#1a0a00] transition hover:bg-[#d4a853]"
          >
            <Home size={20} />
            Back Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-2xl border border-[#c8902a] px-6 py-4 font-black text-[#8b6914] transition hover:bg-[#f5e8c8]"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        <div className="mt-16 rounded-3xl border border-[#ede0c8] bg-white p-8 shadow-sm">
          <Compass
            size={48}
            className="mx-auto text-[#c8902a]"
          />

          <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
            Keep Moving Toward Krishna
          </h2>

          <p className="mt-3 leading-7 text-[#7a5c36]">
            Read spiritual journals, attend temple events,
            track your daily progress and continue your
            journey in Krishna consciousness.
          </p>
        </div>

        <div className="mt-10 text-sm font-bold text-[#9a7a4a]">
          Hare Krishna Hare Krishna Krishna Krishna Hare Hare
          <br />
          Hare Rama Hare Rama Rama Rama Hare Hare
        </div>
      </div>
    </div>
  );
}