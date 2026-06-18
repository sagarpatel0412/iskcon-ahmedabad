import { Link } from "react-router-dom";
import { BookOpen, Globe2, Heart, Ship, Sparkles } from "lucide-react";
import PageSeo from "../../components/seo/PageSeo";

export default function AboutPrabhupadaPage() {
  return (
    <>
      <PageSeo
        title="About Srila Prabhupada | ISKCON Ahmedabad"
        description="Explore About Srila Prabhupada"
      />

      <div className="-mx-5 -my-8 bg-[#fdfaf5]">
        <section className="relative overflow-hidden bg-[#1a0a00] px-5 py-28 text-center">
          <div className="absolute inset-0 text-[320px] text-[#c8902a]/5">
            ॐ
          </div>

          <div className="relative z-10 mx-auto max-w-5xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-[#d4a853]">
              Founder-Ācārya of ISKCON
            </p>
            <h1 className="mt-5 font-serif text-6xl font-black text-white md:text-8xl">
              His Divine Grace Śrīla Prabhupāda
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg font-bold leading-8 text-[#f5e8c8]">
              A. C. Bhaktivedanta Swami Prabhupāda carried the teachings of Lord
              Krishna and Śrī Caitanya Mahāprabhu across the world.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20">
          <div className="grid gap-10 lg:grid-cols-[420px_1fr]">
            <aside className="space-y-6">
              <div className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm">
                <img
                  src="https://iskconahmedabad.com/images/srila-prabhupada.jpg"
                  className="h-[520px] w-full object-cover"
                />
                <div className="p-6">
                  <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
                    Śrīla Prabhupāda
                  </h2>
                  <p className="mt-2 text-sm font-bold text-[#9a7a4a]">
                    1896 – 1977
                  </p>
                </div>
              </div>

              <Link
                to="/journals"
                className="block rounded-2xl bg-[#c8902a] px-6 py-4 text-center font-black text-[#1a0a00]"
              >
                Read Spiritual Journals
              </Link>
            </aside>

            <main className="space-y-6">
              <Card title="Early Life and Spiritual Calling">
                <p>
                  Śrīla Prabhupāda was born as Abhay Charan in Kolkata in 1896.
                  From childhood he was drawn to devotion to Lord Krishna. In
                  1922 he met his spiritual master, Śrīla Bhaktisiddhānta
                  Sarasvatī Ṭhākura, who instructed him to spread the message of
                  Krishna consciousness in the English language.
                </p>
              </Card>

              <Card title="Journey to the West">
                <p>
                  In 1965, at the age of sixty-nine, Śrīla Prabhupāda travelled
                  to America on the cargo ship Jaladuta. He carried little
                  money, a trunk of books and deep faith in Krishna. His journey
                  was not for personal comfort; it was an act of compassion for
                  the world.
                </p>
              </Card>

              <section className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white p-7 shadow-sm">
                <div className="mb-5">
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-[#c8902a]">
                    Biography Documentary
                  </p>

                  <h2 className="mt-2 font-serif text-4xl font-black text-[#1a0a00]">
                    The Life and Mission of Śrīla Prabhupāda
                  </h2>

                  <p className="mt-3 text-[15px] leading-8 text-[#5c3d1a]">
                    Watch the inspiring story of His Divine Grace A.C.
                    Bhaktivedanta Swami Prabhupāda — from his early life in
                    Kolkata, his meeting with his spiritual master, the
                    courageous Jaladuta voyage, and the worldwide establishment
                    of the Hare Krishna movement.
                  </p>
                </div>

                <div className="overflow-hidden rounded-3xl border border-[#ede0c8]">
                  <iframe
                    className="aspect-video w-full"
                    src="https://www.youtube.com/embed/UsoczeYeaY8"
                    title="Srila Prabhupada Biography"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>

                <div className="mt-5 rounded-2xl bg-[#fdfaf5] p-5">
                  <div className="flex items-start gap-3">
                    <Ship className="mt-1 h-6 w-6 text-[#c8902a]" />

                    <div>
                      <h3 className="font-serif text-2xl font-black text-[#1a0a00]">
                        The Jaladuta Journey
                      </h3>

                      <p className="mt-2 text-sm font-bold leading-7 text-[#9a7a4a]">
                        At the age of sixty-nine, Śrīla Prabhupāda crossed the
                        ocean aboard the cargo ship Jaladuta carrying only a few
                        possessions, his books and complete faith in Krishna.
                        This historic journey transformed the spiritual lives of
                        millions worldwide.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <Card title="Founding ISKCON">
                <p>
                  In 1966, Śrīla Prabhupāda founded the International Society
                  for Krishna Consciousness in New York City. From a humble
                  beginning, ISKCON grew into a worldwide spiritual movement
                  centred on chanting the holy names, studying scripture, deity
                  worship, prasādam distribution and devotional service.
                </p>
              </Card>

              <Card title="Books and Legacy">
                <p>
                  Śrīla Prabhupāda translated and commented on major Vedic
                  texts, including Bhagavad-gītā As It Is, Śrīmad Bhāgavatam and
                  Caitanya-caritāmṛta. His books continue to guide seekers,
                  devotees, scholars and spiritual communities across the world.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Info
                    icon={BookOpen}
                    title="Sacred Books"
                    text="Translations and commentaries on the Vedic scriptures."
                  />
                  <Info
                    icon={Globe2}
                    title="Worldwide Mission"
                    text="Temples, communities and devotees across the world."
                  />
                  <Info
                    icon={Heart}
                    title="Bhakti-Yoga"
                    text="Loving devotional service to Krishna."
                  />
                  <Info
                    icon={Sparkles}
                    title="Holy Name"
                    text="Chanting Hare Krishna as the heart of spiritual life."
                  />
                </div>
              </Card>

              <Card title="Why Śrīla Prabhupāda Matters">
                <p>
                  Śrīla Prabhupāda made ancient Vedic wisdom practical for
                  modern people. He taught that spiritual life is not limited by
                  country, caste, background or language. Anyone can begin by
                  chanting, hearing, serving and accepting Krishna prasādam.
                </p>
                <p>
                  His life shows determination, humility, scholarship and
                  complete dependence on Krishna. For ISKCON Ahmedabad and the
                  worldwide ISKCON family, he remains the founder-ācārya and
                  guiding spiritual teacher.
                </p>
              </Card>
            </main>
          </div>
        </section>
      </div>
    </>
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
