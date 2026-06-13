import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  Clock,
  MapPin,
  Music,
  Newspaper,
  PlayCircle,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="-mx-5 -my-8 bg-[#fdfaf5]">
      <section className="relative flex min-h-[650px] items-center justify-center overflow-hidden bg-[#1a0a00] px-5 text-center">
        <img
          src="https://iskconahmedabad.com/images/gallery/gallery2.jpg"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a00]/60 via-[#1a0a00]/55 to-[#1a0a00]" />

        <div className="relative z-10 max-w-5xl">
          {/* <p className="text-sm font-black uppercase tracking-[0.35em] text-[#d4a853]">
            ॐ नमो भगवते वासुदेवाय
          </p> */}

          <h1 className="mt-5 font-serif text-6xl font-black leading-tight text-white md:text-8xl">
            ISKCON Ahmedabad
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg font-bold leading-8 text-[#f5e8c8]">
            Serving Śrī Śrī Rādhā Govinda with love, devotion, kirtan,
            prasādam, festivals and timeless Vedic wisdom.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/events"
              className="rounded-2xl bg-[#c8902a] px-7 py-4 font-black text-[#1a0a00] hover:bg-[#d4a853]"
            >
              Explore Events
            </Link>

            <Link
              to="/journals"
              className="rounded-2xl border border-[#d4a853] px-7 py-4 font-black text-[#d4a853] hover:bg-[#d4a853] hover:text-[#1a0a00]"
            >
              Read Journals
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionHeading
          title="Welcome to Krishna Consciousness"
          subtitle="A spiritual home for seekers, devotees and families in Ahmedabad."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={CalendarDays}
            title="Temple Events"
            text="Join festivals, Sunday Feast, seminars, kirtans and spiritual programs."
            to="/events"
          />

          <FeatureCard
            icon={BookOpen}
            title="Journals"
            text="Read devotional reflections, book wisdom and spiritual study material."
            to="/journals"
          />

          <FeatureCard
            icon={Newspaper}
            title="Newsletters"
            text="Stay updated with temple announcements, articles and regular wisdom."
            to="/newsletters"
          />
        </div>
      </section>

      <section className="bg-[#f7f0e4] px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            title="Temple Timings"
            subtitle="Join us for darshan and ārati. Everyone is welcome."
          />

          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {[
              ["Mangala Aarti", "4:30 AM"],
              ["Darshan", "4:30 AM - 12:30 PM"],
              ["Raj Bhog", "12:00 PM"],
              ["Sandhya Aarti", "7:00 PM"],
              ["Shayan Aarti", "8:30 PM"],
            ].map(([name, time]) => (
              <div
                key={name}
                className="rounded-3xl border border-[#ede0c8] bg-white p-6 text-center shadow-sm"
              >
                <Clock className="mx-auto h-8 w-8 text-[#c8902a]" />
                <h3 className="mt-4 font-serif text-2xl font-black text-[#1a0a00]">
                  {name}
                </h3>
                <p className="mt-2 font-black text-[#8b6914]">{time}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionHeading
          title="Programs & Festivals"
          subtitle="Regular sādhana, classes and celebrations for spiritual growth."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <ProgramCard
            icon={Sparkles}
            title="Sunday Feast"
            text="Weekly kirtan, discourse and prasādam for everyone."
          />
          <ProgramCard
            icon={BookOpen}
            title="Bhagavad Gita Classes"
            text="Systematic study of the Gītā for practical spiritual wisdom."
          />
          <ProgramCard
            icon={Music}
            title="Kirtan Evenings"
            text="Soulful chanting of the holy names in devotee association."
          />
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#1a0a00] px-5 py-24 text-center">
        <div className="absolute inset-0 text-[260px] text-[#c8902a]/5">ॐ</div>
        <div className="relative z-10 mx-auto max-w-4xl">
          <h2 className="font-serif text-5xl font-black text-white">
            “Chant and be happy.”
          </h2>
          <p className="mt-5 text-lg font-bold leading-8 text-[#d4a853]">
            Hare Krishna Hare Krishna Krishna Krishna Hare Hare <br />
            Hare Rama Hare Rama Rama Rama Hare Hare
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionHeading
          title="Temple Discourses & Kirtans"
          subtitle="Watch lectures, kirtans and spiritual programs."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            "pIGGy8Abuck",
            "GiKCYnFvfOs",
            "3tT3GWa7sGw",
          ].map((id) => (
            <div
              key={id}
              className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm"
            >
              <iframe
                src={`https://www.youtube.com/embed/${id}`}
                title="ISKCON Ahmedabad video"
                className="aspect-video w-full"
                allowFullScreen
              />

              <div className="flex items-center gap-3 p-5">
                <PlayCircle className="h-6 w-6 text-[#c8902a]" />
                <p className="font-black text-[#1a0a00]">
                  Temple Discourse / Kirtan
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f0e4] px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            title="Visit ISKCON Ahmedabad"
            subtitle="Come for darshan, kirtan, prasādam and spiritual association."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <ContactCard
              icon={MapPin}
              title="Address"
              text="ISKCON Cross Road, Sarkhej Gandhinagar Highway, Ahmedabad, Gujarat."
            />
            <ContactCard
              icon={Clock}
              title="Daily Darshan"
              text="Morning to afternoon and evening ārati timings."
            />
            <ContactCard
              icon={BookOpen}
              title="Spiritual Study"
              text="Join Gītā classes, journals, newsletters and devotional programs."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-5 h-1 w-24 rounded-full bg-[#c8902a]" />
      <h2 className="font-serif text-5xl font-black text-[#1a0a00]">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-7 text-[#9a7a4a]">
        {subtitle}
      </p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text, to }: any) {
  return (
    <Link
      to={to}
      className="rounded-3xl border border-[#ede0c8] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5e8c8] text-[#8b6914]">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="mt-5 font-serif text-3xl font-black text-[#1a0a00]">
        {title}
      </h3>
      <p className="mt-3 text-sm font-bold leading-7 text-[#9a7a4a]">
        {text}
      </p>
    </Link>
  );
}

function ProgramCard({ icon: Icon, title, text }: any) {
  return (
    <div className="rounded-3xl border border-[#ede0c8] bg-white p-7 shadow-sm">
      <Icon className="h-9 w-9 text-[#c8902a]" />
      <h3 className="mt-5 font-serif text-3xl font-black text-[#1a0a00]">
        {title}
      </h3>
      <p className="mt-3 text-sm font-bold leading-7 text-[#9a7a4a]">
        {text}
      </p>
    </div>
  );
}

function ContactCard({ icon: Icon, title, text }: any) {
  return (
    <div className="rounded-3xl border border-[#ede0c8] bg-white p-7 shadow-sm">
      <Icon className="h-8 w-8 text-[#c8902a]" />
      <h3 className="mt-5 font-serif text-2xl font-black text-[#1a0a00]">
        {title}
      </h3>
      <p className="mt-3 text-sm font-bold leading-7 text-[#9a7a4a]">
        {text}
      </p>
    </div>
  );
}