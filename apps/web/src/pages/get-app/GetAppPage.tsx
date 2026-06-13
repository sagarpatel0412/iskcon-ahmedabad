import { Download, Smartphone } from "lucide-react";
import googlePlayBadge from "../../assets/play-store-bagde.svg";
import appStoreBadge from "../../assets/app-store-badge.svg";

export default function GetAppPage() {
  return (
    <main className="min-h-screen bg-[#fdfaf5]">
      <section className="bg-[#1a0a00] py-20 text-center text-white">
        <Smartphone className="mx-auto h-16 w-16 text-[#d4a853]" />

        <h1 className="mt-6 font-serif text-5xl font-black">Get Krishna App</h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg font-bold text-[#d4a853]">
          Stay connected with ISKCON Ahmedabad wherever you go. Access events,
          yatras, courses, journals, newsletters, donations and spiritual
          progress from your mobile device.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="rounded-full bg-[#f5e8c8] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#8b6914]">
              Mobile App
            </span>

            <h2 className="mt-5 font-serif text-5xl font-black text-[#1a0a00]">
              Your Spiritual Journey,
              <br />
              In Your Pocket
            </h2>

            <p className="mt-5 text-lg font-bold leading-8 text-[#5c3d1a]">
              Browse temple events, register for yatras, join courses, read
              journals and newsletters, track your spiritual progress and stay
              connected with the ISKCON Ahmedabad community.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <button className="w-full max-w-[240px] overflow-hidden rounded-2xl shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                <img
                  src={appStoreBadge}
                  alt="App Store"
                  className="w-full h-auto block"
                />
              </button>
              <button className="w-full max-w-[240px] overflow-hidden rounded-2xl shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                <img
                  src={googlePlayBadge}
                  alt="Google Play"
                  className="w-full h-auto block"
                />
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#f5e8c8]" />
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#f5e8c8]" />

              <div className="relative flex h-[600px] w-[300px] items-center justify-center rounded-[3rem] border-[10px] border-[#1a0a00] bg-white shadow-2xl">
                <div className="text-center">
                  <Download className="mx-auto h-16 w-16 text-[#c8902a]" />

                  <h3 className="mt-4 text-2xl font-black text-[#1a0a00]">
                    Krishna App
                  </h3>

                  <p className="mt-2 font-bold text-[#5c3d1a]">
                    ISKCON Ahmedabad
                  </p>

                  <p className="mt-5 text-sm font-bold text-[#9a7a4a]">
                    Mobile Preview Coming Soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 grid gap-5 md:grid-cols-4">
          {[
            "Temple Events",
            "Yatras & Trips",
            "Courses",
            "Journals & Newsletters",
          ].map((item) => (
            <div
              key={item}
              className="rounded-[2rem] border border-[#ede0c8] bg-white p-6 text-center"
            >
              <h3 className="font-serif text-2xl font-black text-[#1a0a00]">
                {item}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
