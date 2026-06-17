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
              <div className="relative flex h-[640px] w-[320px] overflow-hidden rounded-[3rem] border-[10px] border-[#1a0a00] bg-[#fdfaf5] shadow-2xl">
                <div className="h-full w-full overflow-hidden">
                  {/* Mobile Hero */}
                  <div className="bg-[#1a0a00] px-5 pb-9 pt-12 text-center">
                    <img
                      src="https://iskconahmedabad.com/images/logo.png"
                      alt="ISKCON Ahmedabad"
                      className="mx-auto h-[92px] w-[92px] rounded-full border-4 border-[#c8902a] bg-white object-contain"
                    />

                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.25em] text-[#d4a853]">
                      ISKCON Ahmedabad
                    </p>

                    <h3 className="mt-2 text-3xl font-black text-white">
                      Welcome Back
                    </h3>

                    <p className="mt-2 text-sm font-bold leading-5 text-[#f5e8c8]">
                      Login to continue your Krishna consciousness journey.
                    </p>
                  </div>

                  {/* Mobile Content */}
                  <div className="p-4">
                    <div className="rounded-[28px] border border-[#ede0c8] bg-white p-4 shadow-lg">
                      <h4 className="mb-4 text-2xl font-black text-[#1a0a00]">
                        Login
                      </h4>

                      <div className="mb-4">
                        <p className="mb-2 text-sm font-black text-[#5c3d1a]">
                          Email Address *
                        </p>
                        <div className="rounded-[18px] border border-[#ede0c8] bg-[#fdfaf5] px-4 py-4 text-sm font-bold text-[#1a0a00]">
                          sagar@test.com
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="mb-2 text-sm font-black text-[#5c3d1a]">
                          Password
                        </p>
                        <div className="rounded-[18px] border border-[#ede0c8] bg-[#fdfaf5] px-4 py-4 text-sm font-bold text-[#1a0a00]">
                          ••••••
                        </div>
                      </div>

                      <div className="mt-5 rounded-[20px] bg-[#c8902a] py-4 text-center text-base font-black text-[#1a0a00] shadow-lg">
                        Login with OTP
                      </div>

                      <p className="mt-5 text-center text-sm font-black text-[#8b6914]">
                        New seeker? Register here
                      </p>
                    </div>

                    <div className="mt-4 rounded-[28px] bg-[#1a0a00] p-5">
                      <h4 className="text-xl font-black text-white">
                        Hare Krishna 🙏
                      </h4>

                      <p className="mt-2 text-sm font-bold leading-5 text-[#d4a853]">
                        Access events, yatras, courses, journals, newsletters,
                        progress tracking and seva opportunities from one app.
                      </p>
                    </div>
                  </div>
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
