import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Crown,
  Flower2,
  Globe2,
  Heart,
  Music,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import pachtattva from "../../assets/pancha-tattva.jpeg";
import ballkrishna from "../../assets/baal-krishna.jpeg";

export default function AboutKrishnaChaitanyaPage() {
  return (
    <div className="-mx-5 -my-8 bg-[#fdfaf5]">
      <section className="relative overflow-hidden bg-[#1a0a00] px-5 py-28 text-center">
        <img
          src={ballkrishna}
          alt="Sri Chaitanya Mahaprabhu"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a00]/70 via-[#1a0a00]/85 to-[#1a0a00]" /> */}
        <div className="absolute inset-0 text-[320px] text-[#c8902a]/5">
          हरि
        </div>

        <div className="relative z-10 mx-auto max-w-5xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#d4a853]">
            The Golden Gift of Divine Love
          </p>

          <h1 className="mt-5 font-serif text-5xl font-black leading-tight text-white md:text-8xl">
            Experience the Glory of Krishna & Chaitanya Mahaprabhu
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg font-bold leading-8 text-[#f5e8c8]">
            Discover the mercy of Lord Krishna and Śrī Chaitanya Mahaprabhu
            through the holy name, nāma-saṅkīrtana, spiritual wisdom, guru,
            devotee association and the path of pure bhakti.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#c8902a] px-7 py-4 font-black text-[#1a0a00] shadow-lg hover:bg-[#d4a853]"
            >
              Start Learning
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              to="/journals"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#d4a853] px-7 py-4 font-black text-[#d4a853] hover:bg-[#d4a853] hover:text-[#1a0a00]"
            >
              Read Wisdom
              <BookOpen className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-8 overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm">
        <div className="p-7">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c8902a]">
            Featured Lecture
          </p>

          <h3 className="mt-2 font-serif text-4xl font-black text-[#1a0a00]">
            Why Chant Hare Krishna?
          </h3>

          <p className="mt-4 text-[15px] leading-8 text-[#5c3d1a]">
            Śrīla Prabhupāda explains how the chanting of the Hare Krishna
            Mahāmantra cleanses the heart, awakens spiritual consciousness and
            reconnects the soul with Krishna. Chaitanya Mahaprabhu taught that
            nāma-saṅkīrtana is the most effective spiritual process for this
            age.
          </p>
        </div>

        <div className="overflow-hidden border-t border-[#ede0c8]">
          <iframe
            className="aspect-video w-full"
            src="https://www.youtube.com/embed/KbsrwQGiO6A"
            title="Importance of Chanting Hare Krishna"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="bg-[#fdfaf5] p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-5">
              <h4 className="font-serif text-2xl font-black text-[#1a0a00]">
                Cleanses the Heart
              </h4>
              <p className="mt-2 text-sm font-bold leading-7 text-[#9a7a4a]">
                Removes unwanted habits, anxiety and material attachments.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <h4 className="font-serif text-2xl font-black text-[#1a0a00]">
                Awakens Love of God
              </h4>
              <p className="mt-2 text-sm font-bold leading-7 text-[#9a7a4a]">
                Revives the soul's forgotten relationship with Krishna.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5">
              <h4 className="font-serif text-2xl font-black text-[#1a0a00]">
                Practical for Everyone
              </h4>
              <p className="mt-2 text-sm font-bold leading-7 text-[#9a7a4a]">
                Can be practiced anywhere, at any time and by anyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
          <aside className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm">
              <img
                src={pachtattva}
                alt="Sri Chaitanya Mahaprabhu"
                className="h-[560px] w-full object-cover object-top"
              />

              <div className="p-6">
                <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
                  Śrī Chaitanya Mahaprabhu
                </h2>
                <p className="mt-2 text-sm font-bold leading-7 text-[#9a7a4a]">
                  The golden incarnation of Lord Krishna who spread the chanting
                  of the holy names and the path of love of God.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-[#ede0c8] bg-[#1a0a00] p-6 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d4a853]">
                Maha Mantra
              </p>

              <p className="mt-4 font-serif text-2xl font-black leading-9 text-white">
                Hare Krishna Hare Krishna Krishna Krishna Hare Hare
              </p>
              <p className="mt-3 font-serif text-2xl font-black leading-9 text-white">
                Hare Rama Hare Rama Rama Rama Hare Hare
              </p>
            </div>

            <Link
              to="/events"
              className="block rounded-2xl bg-[#c8902a] px-6 py-4 text-center font-black text-[#1a0a00] hover:bg-[#d4a853]"
            >
              Join Temple Programs
            </Link>
          </aside>

          <main className="space-y-6">
            <Card title="Who is Lord Krishna?">
              <p>
                Lord Krishna is the Supreme Personality of Godhead, the source
                of all beauty, knowledge, strength, fame, wealth and
                renunciation. He is not only the controller of the universe, but
                also the most loving friend of every living being.
              </p>
              <p>
                In bhakti-yoga, Krishna is approached not by fear, pride or dry
                speculation, but by loving service. The heart becomes purified
                when we hear about Krishna, chant His names, remember His
                pastimes and serve Him with devotion.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Info
                  icon={Crown}
                  title="Supreme Lord"
                  text="Krishna is the original source of all divine manifestations."
                />
                <Info
                  icon={Heart}
                  title="Loving Friend"
                  text="He lives in the heart and guides the sincere seeker."
                />
              </div>
            </Card>

            <Card title="Who is Śrī Chaitanya Mahaprabhu?">
              <p>
                Śrī Chaitanya Mahaprabhu appeared to distribute Krishna-prema,
                pure love of Krishna, through the simple and powerful process of
                chanting the holy names. He did not reserve spiritual life for a
                selected class of people. He opened the path of bhakti for
                everyone.
              </p>
              <p>
                Mahaprabhu taught by His own example: humility, compassion,
                devotion, deep absorption in Krishna and loving service to all
                living beings. His movement is called the saṅkīrtana movement,
                the congregational chanting of the holy names of the Lord.
              </p>
            </Card>

            <section className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white p-7 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c8902a]">
                Heart of the Movement
              </p>

              <h2 className="mt-2 font-serif text-4xl font-black text-[#1a0a00]">
                Importance of Nāma-Saṅkīrtana
              </h2>

              <p className="mt-5 text-[15px] font-medium leading-8 text-[#5c3d1a]">
                Nāma-saṅkīrtana means chanting the holy names of the Lord
                together. In this age, the mind is restless, life is fast and
                people are surrounded by anxiety. Chaitanya Mahaprabhu gave the
                easiest and most merciful spiritual practice: chant the names of
                Krishna with sincerity.
              </p>

              <div className="mt-7 grid gap-4 md:grid-cols-2">
                <Info
                  icon={Music}
                  title="Purifies the Heart"
                  text="Chanting removes inner dust such as anger, greed, envy and illusion."
                />
                <Info
                  icon={Users}
                  title="Unites Devotees"
                  text="Saṅkīrtana brings people together in joy, devotion and service."
                />
                <Info
                  icon={Sparkles}
                  title="Awakens Bhakti"
                  text="The holy name gradually awakens love for Krishna."
                />
                <Info
                  icon={Globe2}
                  title="For Everyone"
                  text="Anyone can chant, regardless of background, language or status."
                />
              </div>

              <div className="mt-7 rounded-[2rem] bg-[#fdfaf5] p-6">
                <h3 className="font-serif text-3xl font-black text-[#1a0a00]">
                  Why the Holy Name is So Powerful
                </h3>
                <p className="mt-3 text-sm font-bold leading-7 text-[#9a7a4a]">
                  Krishna and His name are spiritually non-different. When we
                  chant Hare Krishna, we are directly associating with Krishna
                  through sound vibration. This is why chanting gives peace,
                  strength, clarity and spiritual happiness.
                </p>
              </div>
            </section>

            <Card title="Value of the Hare Krishna Mahā-Mantra">
              <p>
                The Hare Krishna mahā-mantra is a prayer of the soul. “Hare”
                calls upon the divine energy of the Lord, “Krishna” means the
                all-attractive Supreme Lord, and “Rama” means the reservoir of
                spiritual pleasure.
              </p>
              <p>
                By chanting this mantra, we are praying: “O Lord, O energy of
                the Lord, please engage me in Your loving service.” This
                chanting is not ordinary music or ritual. It is a personal call
                to Krishna from the heart.
              </p>

              <div className="mt-6 rounded-3xl border border-[#ede0c8] bg-[#fff8ec] p-6 text-center">
                <p className="font-serif text-3xl font-black leading-10 text-[#1a0a00]">
                  Chant with humility, hear with attention, and serve with love.
                </p>
              </div>
            </Card>

            <Card title="Why We Need a Spiritual Leader or Guru">
              <p>
                A genuine guru is not an ordinary teacher. Guru means one who
                removes darkness by giving spiritual knowledge. The guru
                connects the disciple with Krishna, teaches the scriptures,
                guides the practice of bhakti and protects the seeker from
                confusion.
              </p>
              <p>
                Just as a student needs a qualified teacher to understand a deep
                subject, a spiritual seeker needs guidance to understand the
                science of the soul, Krishna, devotional service and the purpose
                of human life.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Info
                  icon={Sun}
                  title="Removes Ignorance"
                  text="Guru gives spiritual light and helps us see life clearly."
                />
                <Info
                  icon={BookOpen}
                  title="Explains Scripture"
                  text="Guru teaches Bhagavad-gītā and Bhāgavatam practically."
                />
                <Info
                  icon={Flower2}
                  title="Guides Bhakti"
                  text="Guru helps us chant, serve and grow steadily."
                />
                <Info
                  icon={Heart}
                  title="Connects to Krishna"
                  text="Guru’s purpose is to bring the soul closer to Krishna."
                />
              </div>
            </Card>

            <Card title="The Path of Bhakti in Daily Life">
              <p>
                Bhakti is not limited to the temple. It can be practiced in
                daily life through chanting, hearing, offering food to Krishna,
                reading scripture, serving devotees, attending kirtan and living
                with compassion.
              </p>
              <p>
                Even small acts become spiritual when offered to Krishna. A
                simple meal becomes prasādam. A song becomes kirtan. A home
                becomes sacred when Krishna is remembered there.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <Mini title="Chant" text="Daily holy name meditation." />
                <Mini title="Hear" text="Listen to Krishna-katha." />
                <Mini title="Serve" text="Offer time, skills and heart." />
                <Mini title="Read" text="Study Gītā and Bhāgavatam." />
                <Mini title="Associate" text="Stay close to devotees." />
                <Mini title="Prasādam" text="Honor food offered to Krishna." />
              </div>
            </Card>

            <Card title="Why This Page Matters for Seekers">
              <p>
                This page is for anyone who wants to understand why ISKCON gives
                so much importance to Krishna, Chaitanya Mahaprabhu, chanting,
                guru and devotee association. These are not separate topics.
                Together they form the living path of Krishna consciousness.
              </p>
              <p>
                Krishna is the goal, Chaitanya Mahaprabhu gives the method, the
                holy name purifies the heart, guru gives guidance, and devotee
                association gives strength to continue.
              </p>
            </Card>
          </main>
        </div>
      </section>

      <section className="bg-[#1a0a00] px-5 py-24 text-center">
        <div className="mx-auto max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-[#d4a853]">
            Begin with the Holy Name
          </p>

          <h2 className="mt-5 font-serif text-5xl font-black leading-tight text-white">
            The easiest beginning is sincere chanting.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base font-bold leading-8 text-[#d4a853]">
            No high qualification is required. Start with faith, chant Hare
            Krishna, hear about the Lord, honor prasādam and keep association
            with devotees.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              to="/events"
              className="rounded-2xl bg-[#c8902a] px-7 py-4 font-black text-[#1a0a00] hover:bg-[#d4a853]"
            >
              Attend Kirtan
            </Link>

            <Link
              to="/centres"
              className="rounded-2xl border border-[#d4a853] px-7 py-4 font-black text-[#d4a853] hover:bg-[#d4a853] hover:text-[#1a0a00]"
            >
              Visit Temple
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <section className="rounded-3xl border border-[#ede0c8] bg-white p-7 shadow-sm">
      <h2 className="font-serif text-4xl font-black leading-tight text-[#1a0a00]">
        {title}
      </h2>

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

function Mini({ title, text }: any) {
  return (
    <div className="rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] p-5">
      <h3 className="font-serif text-2xl font-black text-[#1a0a00]">{title}</h3>
      <p className="mt-2 text-sm font-bold leading-6 text-[#9a7a4a]">{text}</p>
    </div>
  );
}
