import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  Clock,
  HeartHandshake,
  MapPin,
  Music,
  Newspaper,
  PlayCircle,
  Sparkles,
  Users,
  Utensils,
  Flower2,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import panchtattva from '../../assets/pancha-tattva.jpeg'

const AARTI_SCHEDULE = [
  { title: "Mangla Aarti", time: "04:30 AM", minutes: 4 * 60 + 30 },
  {
    title: "Darshan Aarti",
    subtitle: "Darshan Open",
    time: "07:15 AM",
    minutes: 7 * 60 + 15,
  },
  { title: "Gwala Bhog Aarti", time: "08:30 AM", minutes: 8 * 60 + 30 },
  { title: "Rajbhog Aarti", time: "12:30 PM", minutes: 12 * 60 + 30 },
  { title: "Darshan Closed", time: "01:00 PM", minutes: 13 * 60 },
  {
    title: "Utthapana Aarti",
    subtitle: "Darshan Open",
    time: "04:00 PM",
    minutes: 16 * 60,
  },
  { title: "Tulasi Aarti", time: "06:00 PM", minutes: 18 * 60 },
  { title: "Sandhya Aarti", time: "06:30 PM", minutes: 18 * 60 + 30 },
  { title: "Shayana Aarti", time: "08:20 PM", minutes: 20 * 60 + 20 },
  { title: "Darshan Closed", time: "08:30 PM", minutes: 20 * 60 + 30 },
];

function getTempleStatus() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const templeOpen =
    currentMinutes >= 4 * 60 + 30 && currentMinutes < 20 * 60 + 30;

  if (!templeOpen) {
    return {
      templeOpen: false,
      current: "Temple Closed",
      next: "Mangla Aarti",
      nextTime: "04:30 AM",
    };
  }

  let current = AARTI_SCHEDULE[0];
  let next = AARTI_SCHEDULE[1];

  for (let i = 0; i < AARTI_SCHEDULE.length - 1; i++) {
    if (
      currentMinutes >= AARTI_SCHEDULE[i].minutes &&
      currentMinutes < AARTI_SCHEDULE[i + 1].minutes
    ) {
      current = AARTI_SCHEDULE[i];
      next = AARTI_SCHEDULE[i + 1];
      break;
    }
  }

  return {
    templeOpen: true,
    current: current.title,
    next: next.title,
    nextTime: next.time,
  };
}

export default function HomePage() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((v) => v + 1), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const templeStatus = useMemo(() => getTempleStatus(), []);

  return (
    <div className="-mx-5 -my-8 bg-[#fdfaf5]">
      <section className="relative flex min-h-[760px] items-center justify-center overflow-hidden bg-[#1a0a00] px-5 text-center">
        <img
          src="https://iskconahmedabad.com/images/gallery/gallery2.jpg"
          className="absolute inset-0 h-full w-full object-cover"
          alt="ISKCON Ahmedabad"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a00]/55 via-[#1a0a00]/65 to-[#1a0a00]" />

        <div className="relative z-10 max-w-6xl">
          <div className="mx-auto mb-6 inline-flex rounded-full border border-[#d4a853]/40 bg-white/10 px-5 py-2 text-xs font-black uppercase tracking-[0.28em] text-[#d4a853] backdrop-blur">
            Hare Krishna Movement
          </div>

          <h1 className="font-serif text-6xl font-black leading-tight text-white md:text-8xl">
            ISKCON Ahmedabad
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg font-bold leading-8 text-[#f5e8c8]">
            A spiritual home for seekers, devotees and families — serving Śrī
            Śrī Rādhā Govinda through kirtan, prasādam, festivals, seva and
            timeless Vedic wisdom.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#c8902a] px-7 py-4 font-black text-[#1a0a00] shadow-lg hover:bg-[#d4a853]"
            >
              Explore Events
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              to="/centres"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#d4a853] px-7 py-4 font-black text-[#d4a853] hover:bg-[#d4a853] hover:text-[#1a0a00]"
            >
              Visit Centre
              <MapPin className="h-5 w-5" />
            </Link>
          </div>

          <div className="mx-auto mt-14 grid max-w-4xl gap-4 md:grid-cols-3">
            <HeroStat title="Daily Darshan" text="Morning & Evening" />
            <HeroStat title="Sunday Feast" text="Kirtan, Class, Prasādam" />
            <HeroStat title="Spiritual Study" text="Gītā, Journals, Courses" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionLabel text="Welcome" />

            <h2 className="mt-4 font-serif text-5xl font-black leading-tight text-[#1a0a00]">
              Welcome to Krishna Consciousness
            </h2>

            <p className="mt-5 text-base font-bold leading-8 text-[#9a7a4a]">
              ISKCON Ahmedabad brings together devotion, culture, service and
              spiritual education. Whether you are new seeker or regular
              devotee, you can join temple programs, read wisdom content, attend
              courses and grow spiritually in association.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <MiniPoint
                icon={Flower2}
                text="Darshan of Śrī Śrī Rādhā Govinda"
              />
              <MiniPoint icon={Music} text="Soulful kirtans and ārati" />
              <MiniPoint icon={Utensils} text="Sanctified prasādam" />
              <MiniPoint icon={Users} text="Devotee association and seva" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-[#f5e8c8]" />
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-[#f5e8c8]" />

            <img
              src="https://iskconahmedabad.com/images/gallery/gallery1.jpg"
              alt="Radha Krishna"
              className="relative h-[480px] w-full rounded-[2.5rem] object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#fff8ec] px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-[#f5e8c8]" />
              <div className="absolute -bottom-6 -right-6 h-28 w-28 rounded-full bg-[#f5e8c8]" />

              <img
                src={panchtattva}
                alt="Sri Chaitanya Mahaprabhu"
                className="relative h-[800px] w-full rounded-[2.5rem] object-cover object-top shadow-2xl"
              />
            </div>

            <div className="order-1 lg:order-2">
              {/* <SectionLabel text="Golden Avatar" /> */}

              <h2 className="mt-4 font-serif text-5xl font-black leading-tight text-[#1a0a00]">
                Experience the Glory of Krishna & Chaitanya Mahaprabhu
              </h2>

              <p className="mt-5 text-base font-bold leading-8 text-[#9a7a4a]">
                Śrī Chaitanya Mahaprabhu appeared to freely distribute the love
                of Krishna through the chanting of the holy names. His mercy
                opened the path of bhakti for everyone — beyond caste,
                background, qualification or status.
              </p>

              <p className="mt-4 text-base font-bold leading-8 text-[#9a7a4a]">
                Through sankirtan, compassion and devotion, Mahaprabhu taught
                that the heart becomes purified when we chant Hare Krishna and
                serve the Lord with humility, sincerity and love.
              </p>

              <div className="mt-8 rounded-[2rem] border border-[#ede0c8] bg-white p-6 shadow-sm">
                <p className="font-serif text-2xl font-black text-[#1a0a00]">
                  Hare Krishna Hare Krishna Krishna Krishna Hare Hare
                </p>
                <p className="mt-2 font-serif text-2xl font-black text-[#1a0a00]">
                  Hare Rama Hare Rama Rama Rama Hare Hare
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/journals"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#c8902a] px-6 py-4 font-black text-[#1a0a00] shadow-lg hover:bg-[#d4a853]"
                >
                  Read Wisdom
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 rounded-2xl border border-[#c8902a] px-6 py-4 font-black text-[#8b6914] hover:bg-[#c8902a] hover:text-[#1a0a00]"
                >
                  Join Bhakti Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f0e4] px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            title="Aarti & Darshan Timings"
            subtitle="Śrī Śrī Rādhā Govind daily ārati and darshan schedule."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-[2rem] border border-[#ede0c8] bg-white p-7 shadow-sm">
              <div
                className={`inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${
                  templeStatus.templeOpen
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {templeStatus.templeOpen ? "Temple Open" : "Temple Closed"}
              </div>

              <h3 className="mt-6 font-serif text-4xl font-black text-[#1a0a00]">
                {templeStatus.current}
              </h3>

              <p className="mt-3 text-sm font-bold leading-7 text-[#9a7a4a]">
                {templeStatus.templeOpen
                  ? "Current temple activity according to today’s time."
                  : "Temple opens daily at 04:30 AM for Mangla Aarti."}
              </p>

              <div className="mt-6 rounded-3xl bg-[#f7f0e4] p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8b6914]">
                  Next
                </p>
                <p className="mt-2 font-serif text-2xl font-black text-[#1a0a00]">
                  {templeStatus.next}
                </p>
                <p className="mt-1 font-black text-[#c8902a]">
                  {templeStatus.nextTime}
                </p>
              </div>

              <div className="mt-6 grid gap-3 text-sm font-black text-[#5c3d1a]">
                <div className="flex justify-between rounded-2xl border border-[#ede0c8] p-4">
                  <span>Morning Darshan</span>
                  <span>04:30 AM - 01:00 PM</span>
                </div>
                <div className="flex justify-between rounded-2xl border border-[#ede0c8] p-4">
                  <span>Evening Darshan</span>
                  <span>04:00 PM - 08:30 PM</span>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {AARTI_SCHEDULE.map((item) => (
                <div
                  key={`${item.title}-${item.time}`}
                  className="rounded-3xl border border-[#ede0c8] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <Clock className="h-8 w-8 text-[#c8902a]" />
                  <h3 className="mt-4 font-serif text-2xl font-black text-[#1a0a00]">
                    {item.title}
                  </h3>

                  {item.subtitle && (
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-green-700">
                      {item.subtitle}
                    </p>
                  )}

                  <p className="mt-3 font-black text-[#8b6914]">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionHeading
          title="Explore Krishna App"
          subtitle="Everything connected with temple life in one digital platform."
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
          <FeatureCard
            icon={Sparkles}
            title="Courses"
            text="Join structured spiritual learning programs for seekers and devotees."
            to="/courses"
          />
          <FeatureCard
            icon={MapPin}
            title="Centres"
            text="Find ISKCON centres with contact details and Google Maps location."
            to="/centres"
          />
          <FeatureCard
            icon={Smartphone}
            title="Get App"
            text="Install Krishna App and stay connected with ISKCON Ahmedabad."
            to="/get-app"
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
          <ProgramCard
            icon={HeartHandshake}
            title="Seva Opportunities"
            text="Serve temple, devotees and visitors through practical devotional service."
          />
          <ProgramCard
            icon={Utensils}
            title="Prasādam Distribution"
            text="Share sanctified food and compassion with the community."
          />
          <ProgramCard
            icon={Users}
            title="Devotee Association"
            text="Grow with guidance, friendship and spiritual community."
          />
        </div>
      </section>

      <section className="bg-[#f7f0e4] px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            title="Temple Discourses & Kirtans"
            subtitle="Watch lectures, kirtans and spiritual programs."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {["pIGGy8Abuck", "GiKCYnFvfOs", "3tT3GWa7sGw"].map((id) => (
              <div
                key={id}
                className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
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
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="overflow-hidden rounded-[3rem] bg-[#1a0a00] shadow-2xl">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 md:p-12">
              <SectionLabel text="Visit Us" />

              <h2 className="mt-4 font-serif text-5xl font-black text-white">
                Visit ISKCON Ahmedabad
              </h2>

              <p className="mt-5 text-base font-bold leading-8 text-[#d4a853]">
                Come for darshan, kirtan, prasādam, classes and spiritual
                association. Everyone is welcome.
              </p>

              <div className="mt-8 grid gap-4">
                <ContactCard
                  icon={MapPin}
                  title="Address"
                  text="ISKCON Cross Road, Sarkhej Gandhinagar Highway, Ahmedabad, Gujarat."
                />
                <ContactCard
                  icon={Clock}
                  title="Daily Darshan"
                  text="Morning: 04:30 AM - 01:00 PM, Evening: 04:00 PM - 08:30 PM"
                />
                <ContactCard
                  icon={BookOpen}
                  title="Spiritual Study"
                  text="Join Gītā classes, journals, newsletters and devotional programs."
                />
              </div>
            </div>

            <iframe
              title="ISKCON Ahmedabad Map"
              src="https://maps.google.com/maps?q=23.028407,72.506828&z=15&output=embed"
              className="h-[500px] w-full border-0 lg:h-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="rounded-full bg-[#f5e8c8] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#8b6914]">
      {text}
    </span>
  );
}

function HeroStat({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-[#d4a853]/30 bg-white/10 p-5 backdrop-blur">
      <h3 className="font-serif text-2xl font-black text-white">{title}</h3>
      <p className="mt-2 text-sm font-bold text-[#d4a853]">{text}</p>
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
      <h2 className="font-serif text-5xl font-black text-[#1a0a00]">{title}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-7 text-[#9a7a4a]">
        {subtitle}
      </p>
    </div>
  );
}

function MiniPoint({ icon: Icon, text }: any) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#ede0c8] bg-white p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5e8c8] text-[#8b6914]">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-black text-[#5c3d1a]">{text}</p>
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
      <p className="mt-3 text-sm font-bold leading-7 text-[#9a7a4a]">{text}</p>
    </Link>
  );
}

function ProgramCard({ icon: Icon, title, text }: any) {
  return (
    <div className="rounded-3xl border border-[#ede0c8] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Icon className="h-9 w-9 text-[#c8902a]" />
      <h3 className="mt-5 font-serif text-3xl font-black text-[#1a0a00]">
        {title}
      </h3>
      <p className="mt-3 text-sm font-bold leading-7 text-[#9a7a4a]">{text}</p>
    </div>
  );
}

function ContactCard({ icon: Icon, title, text }: any) {
  return (
    <div className="rounded-3xl border border-[#d4a853]/20 bg-white/10 p-6 backdrop-blur">
      <Icon className="h-8 w-8 text-[#c8902a]" />
      <h3 className="mt-4 font-serif text-2xl font-black text-white">
        {title}
      </h3>
      <p className="mt-3 text-sm font-bold leading-7 text-[#d4a853]">{text}</p>
    </div>
  );
}
