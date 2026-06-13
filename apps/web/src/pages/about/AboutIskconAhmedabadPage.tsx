import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  Clock,
  MapPin,
  Music,
  Sparkles,
} from "lucide-react";
import temple from "../../assets/iskon-temple.jpg";

export default function AboutIskconAhmedabadPage() {
  return (
    <div className="-mx-5 -my-8 bg-[#fdfaf5]">
      <section className="relative min-h-[700px] overflow-hidden bg-[#1a0a00] px-5 py-28 text-center">
        <img
          src={temple}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a00]/50 to-[#1a0a00]" />

        <div className="relative z-10 mx-auto max-w-5xl my-[30px]">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#d4a853]">
            ॐ नमो भगवते वासुदेवाय
          </p>
          <h1 className="mt-5 font-serif text-6xl font-black text-white md:text-8xl">
            About ISKCON Ahmedabad
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-lg font-bold leading-8 text-[#f5e8c8]">
            A spiritual home in Ahmedabad dedicated to Śrī Śrī Rādhā Govinda,
            bhakti-yoga, kirtan, prasādam and the teachings of Śrīla Prabhupāda.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          <main className="space-y-6">
            <Card title="A Spiritual Home for Everyone">
              <p>
                ISKCON Ahmedabad welcomes seekers, families, students, devotees
                and visitors who want to experience Krishna consciousness in a
                practical and joyful way. The temple offers darshan, kirtan,
                ārati, prasādam, festivals, study classes and spiritual
                association.
              </p>
              <p>
                The heart of the temple is loving service to Śrī Śrī Rādhā
                Govinda. Through daily worship and community programs, visitors
                are invited to slow down, hear the holy names, read sacred
                wisdom and reconnect with their eternal relationship with
                Krishna.
              </p>
            </Card>
            <section className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white p-6 shadow-sm">
              <div className="mb-5">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c8902a]">
                  Virtual Darshan
                </p>

                <h2 className="mt-2 font-serif text-4xl font-black text-[#1a0a00]">
                  Temple Tour of ISKCON Ahmedabad
                </h2>

                <p className="mt-3 text-[15px] leading-8 text-[#5c3d1a]">
                  Experience the beauty of Śrī Śrī Rādhā Govinda Temple through
                  this guided virtual tour. Explore the magnificent temple hall,
                  altar, kirtan spaces and spiritual atmosphere that thousands
                  of devotees experience every year.
                </p>
              </div>

              <div className="overflow-hidden rounded-3xl border border-[#ede0c8]">
                <iframe
                  className="aspect-video w-full"
                  src="https://www.youtube.com/embed/Jzd0zNFJ0Jo"
                  title="ISKCON Ahmedabad Temple Tour"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="mt-5 rounded-2xl bg-[#fdfaf5] p-4">
                <p className="text-sm font-bold leading-7 text-[#9a7a4a]">
                  ✨ Take a virtual walk through one of Gujarat's most beautiful
                  spiritual landmarks and discover the atmosphere of devotion,
                  kirtan, worship and community service that defines ISKCON
                  Ahmedabad.
                </p>
              </div>
            </section>

            <Card title="Our Mission">
              <p>
                The mission of ISKCON Ahmedabad is to share bhakti-yoga and the
                teachings of Bhagavad-gītā and Śrīmad Bhāgavatam in a way that
                is accessible to modern life. The temple helps people cultivate
                devotion through chanting, hearing, service, prasādam and
                association.
              </p>
            </Card>

            <Card title="Programs and Festivals">
              <div className="grid gap-4 md:grid-cols-2">
                <Info
                  icon={CalendarDays}
                  title="Sunday Feast"
                  text="Kirtan, discourse and prasādam for all."
                />
                <Info
                  icon={BookOpen}
                  title="Gītā Classes"
                  text="Systematic study for spiritual growth."
                />
                <Info
                  icon={Music}
                  title="Kirtan Evenings"
                  text="Chanting the holy names in devotee association."
                />
                <Info
                  icon={Sparkles}
                  title="Festivals"
                  text="Janmāṣṭamī, Ratha Yatra, Gaura Pūrṇimā and more."
                />
              </div>
            </Card>
          </main>

          <aside className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm">
              <img
                src="https://iskconahmedabad.com/images/logo.png"
                className="mx-auto h-48 object-contain p-8"
              />
              <div className="border-t border-[#ede0c8] p-6">
                <h3 className="font-serif text-3xl font-black text-[#1a0a00]">
                  ISKCON Ahmedabad
                </h3>
                <p className="mt-3 text-sm font-bold leading-7 text-[#9a7a4a]">
                  Serving Śrī Śrī Rādhā Govinda through worship, education,
                  outreach and spiritual culture.
                </p>
              </div>
            </div>

            <SideInfo
              icon={MapPin}
              title="Location"
              text="ISKCON Cross Road, Sarkhej Gandhinagar Highway, Ahmedabad, Gujarat."
            />
            <SideInfo
              icon={Clock}
              title="Daily Darshan"
              text="Morning and evening darshan with ārati and temple programs."
            />

            <Link
              to="/events"
              className="block rounded-2xl bg-[#c8902a] px-6 py-4 text-center font-black text-[#1a0a00]"
            >
              Explore Temple Events
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <section className="rounded-3xl border border-[#ede0c8] bg-white p-7 shadow-sm">
      <h2 className="font-serif text-4xl font-black text-[#1a0a00]">{title}</h2>
      <div className="mt-5 space-y-4 text-[15px] font-medium leading-8 text-[#5c3d1a]">
        {children}
      </div>
    </section>
  );
}

function Info({ icon: Icon, title, text }: any) {
  return (
    <div className="rounded-2xl bg-[#fdfaf5] p-5">
      <Icon className="h-7 w-7 text-[#c8902a]" />
      <h3 className="mt-3 font-serif text-2xl font-black text-[#1a0a00]">
        {title}
      </h3>
      <p className="mt-2 text-sm font-bold leading-6 text-[#9a7a4a]">{text}</p>
    </div>
  );
}

function SideInfo({ icon: Icon, title, text }: any) {
  return (
    <div className="rounded-3xl border border-[#ede0c8] bg-white p-6">
      <Icon className="h-7 w-7 text-[#c8902a]" />
      <h3 className="mt-3 font-serif text-2xl font-black text-[#1a0a00]">
        {title}
      </h3>
      <p className="mt-2 text-sm font-bold leading-6 text-[#9a7a4a]">{text}</p>
    </div>
  );
}
