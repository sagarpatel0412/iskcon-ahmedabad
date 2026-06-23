import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  BookOpen,
  CalendarDays,
  Crown,
  Flame,
  GraduationCap,
  History,
  Loader2,
  MapPin,
  Newspaper,
  PlusCircle,
  Sparkles,
  Target,
  UserCheck,
  Users,
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import { getLatestTrips } from "../../services/tripService";
import { getCourses, getLatestCourses } from "../../services/courseService";
import { getMySubscription } from "../../services/contentPaymentService";
import AppLoader from "../../components/common/AppLoader";
import ProgressLevelCard from "../progress/ProgressLevelCard";
import PageSeo from "../../components/seo/PageSeo";
// import { getEvents } from "../../services/eventService"; // use your event API

export default function DashboardPage() {
  const { user, roles } = useAuth();

  const [trips, setTrips] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const canManage = roles?.includes("ADMIN") || roles?.includes("DEVOTEE");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [tripsRes, coursesRes, subRes] = await Promise.all([
        getLatestTrips(),
        getLatestCourses(),
        getMySubscription().catch(() => null),
        // getEvents(),
      ]);

      setTrips(tripsRes.data || []);
      setCourses(coursesRes.data || []);
      setSubscription(subRes?.data?.subscription || subRes?.data || null);

      // replace this with real event API response
      setEvents([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const firstName = user?.first_name || "Devotee";
  const lastName = user?.last_name || "Devotee";

  const stats = [
    {
      label: "Upcoming Events",
      value: events.length,
      icon: CalendarDays,
      color: "bg-orange-100 text-orange-700",
    },
    {
      label: "Trips / Yatras",
      value: trips.length,
      icon: MapPin,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Courses",
      value: courses.length,
      icon: GraduationCap,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Premium",
      value: subscription ? "Active" : "No",
      icon: Crown,
      color: "bg-amber-100 text-amber-700",
    },
  ];

  const quickActions = canManage
    ? [
        {
          title: "Create Event",
          text: "Add temple events and manage registrations.",
          to: "/events/create",
          icon: CalendarDays,
        },
        {
          title: "Create Trip / Yatra",
          text: "Organize multi-day spiritual yatras.",
          to: "/trips/create",
          icon: MapPin,
        },
        {
          title: "Create Course",
          text: "Add offline or online spiritual courses.",
          to: "/courses/create",
          icon: GraduationCap,
        },
        {
          title: "Create Journal",
          text: "Publish premium devotional content.",
          to: "/content/create",
          icon: BookOpen,
        },
      ]
    : [
        {
          title: "Browse Events",
          text: "Join temple events and festivals.",
          to: "/events",
          icon: CalendarDays,
        },
        {
          title: "Browse Trips",
          text: "Register for upcoming yatras.",
          to: "/trips",
          icon: MapPin,
        },
        {
          title: "Browse Courses",
          text: "Learn from devotees and mentors.",
          to: "/courses",
          icon: GraduationCap,
        },
        {
          title: "Premium Content",
          text: "Read journals and newsletters.",
          to: "/content/subscriptions",
          icon: Crown,
        },
      ];

  if (loading) {
    return (
      <AppLoader title="Loading Dashboard..." subtitle="Hang in tight ..." />
    );
  }

  return (
    <>
      <PageSeo title="Dashboard | ISKCON Ahmedabad" description="Dashboard" />
      <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50 px-4 py-8">
        <section className="mx-auto max-w-7xl space-y-8">
          <div className="relative min-h-[430px] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-700 via-amber-500 to-yellow-400 p-8 text-white shadow-2xl md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(120,53,15,0.35),transparent_35%)]" />

            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-sm" />
            <div className="absolute bottom-[-90px] right-32 h-64 w-64 rounded-full bg-orange-900/20 blur-md" />
            <div className="absolute left-10 top-24 h-24 w-24 rounded-full bg-yellow-200/20" />
            <div className="absolute bottom-10 left-1/2 h-16 w-16 rounded-full bg-white/10" />

            <div className="relative z-10 flex min-h-[350px] flex-col justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-5 py-2 text-sm font-black backdrop-blur">
                  <Sparkles className="h-4 w-4" />
                  Hare Krishna
                </div>

                <h1 className="text-4xl font-black leading-tight md:text-6xl">
                  Welcome, {firstName} {lastName} 🙏
                </h1>

                <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-orange-50 md:text-xl">
                  Manage your devotional journey, courses, yatras, events,
                  journals and newsletters from one beautiful spiritual
                  dashboard.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  {roles?.map((role: string) => (
                    <span
                      key={role}
                      className="rounded-full bg-white px-5 py-2 text-xs font-black uppercase tracking-wide text-orange-700 shadow-sm"
                    >
                      {role}
                    </span>
                  ))}

                  {user?.isSubscribed && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-amber-950/30 px-5 py-2 text-xs font-black uppercase tracking-wide text-white ring-1 ring-white/30">
                      <Crown className="h-4 w-4" />
                      Premium
                    </span>
                  )}

                  {user?.is_verified_devotee && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-800/30 px-5 py-2 text-xs font-black uppercase tracking-wide text-white ring-1 ring-white/30">
                      <UserCheck className="h-4 w-4" />
                      Verified Devotee
                    </span>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    to="/courses"
                    className="rounded-full bg-white px-6 py-3 text-sm font-black text-orange-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-50"
                  >
                    Explore Courses
                  </Link>

                  <Link
                    to="/trips"
                    className="rounded-full border border-white/40 bg-white/15 px-6 py-3 text-sm font-black text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/25"
                  >
                    View Yatras
                  </Link>

                  <Link
                    to="/festivals"
                    className="rounded-full bg-white px-6 py-3 text-sm font-black text-orange-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-50"
                  >
                    View Festivals
                  </Link>
                </div>
              </div>

              <div className="grid w-full max-w-sm grid-cols-2 gap-4">
                <div className="rounded-3xl border border-white/25 bg-white/20 p-5 backdrop-blur">
                  <p className="text-xs font-black uppercase text-orange-50">
                    Events
                  </p>
                  <p className="mt-2 text-4xl font-black">{events.length}</p>
                </div>

                <div className="rounded-3xl border border-white/25 bg-white/20 p-5 backdrop-blur">
                  <p className="text-xs font-black uppercase text-orange-50">
                    Yatras
                  </p>
                  <p className="mt-2 text-4xl font-black">{trips.length}</p>
                </div>

                <div className="rounded-3xl border border-white/25 bg-white/20 p-5 backdrop-blur">
                  <p className="text-xs font-black uppercase text-orange-50">
                    Courses
                  </p>
                  <p className="mt-2 text-4xl font-black">{courses.length}</p>
                </div>

                <div className="rounded-3xl border border-white/25 bg-white/20 p-5 backdrop-blur">
                  <p className="text-xs font-black uppercase text-orange-50">
                    Premium
                  </p>
                  <p className="mt-2 text-2xl font-black">
                    {subscription ? "Active" : "No"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                  <Activity className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Spiritual Progress
                  </h2>
                  <p className="text-sm font-semibold text-slate-500">
                    Track your daily chanting, reading and seva journey.
                  </p>
                </div>
              </div>

              <Link
                to="/progress/daily"
                className="rounded-full bg-orange-600 px-5 py-2 text-sm font-bold text-white"
              >
                Add Today
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-3xl bg-gradient-to-b from-orange-50 to-white p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <Flame className="h-6 w-6" />
                </div>

                <p className="text-sm font-bold text-slate-500">
                  Today’s Sadhana
                </p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  Keep Going
                </h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                  Record chanting rounds, reading, seva and daily spiritual
                  habits.
                </p>
              </div>

              <div className="rounded-3xl bg-gradient-to-b from-yellow-50 to-white p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
                  <Target className="h-6 w-6" />
                </div>

                <p className="text-sm font-bold text-slate-500">Daily Goal</p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  Stay Consistent
                </h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                  Build discipline through small daily devotional progress.
                </p>
              </div>

              <Link
                to="/progress/history"
                className="rounded-3xl bg-gradient-to-b from-green-50 to-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                  <History className="h-6 w-6" />
                </div>

                <p className="text-sm font-bold text-slate-500">
                  Progress History
                </p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  View Journey
                </h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                  See your previous days and understand your spiritual
                  consistency.
                </p>
              </Link>
            </div>
          </div>

          <ProgressLevelCard />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm"
                >
                  <div
                    className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${item.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <p className="text-sm font-bold text-slate-500">
                    {item.label}
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    {item.value}
                  </h2>
                </div>
              );
            })}
          </div>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Quick Actions
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Continue your seva and spiritual activities.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.title}
                    to={action.to}
                    className="group rounded-3xl border border-orange-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 transition group-hover:bg-orange-600 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-lg font-black text-slate-900">
                      {action.title}
                    </h3>

                    <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                      {action.text}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-3">
            <SectionCard
              title="Upcoming Trips / Yatras"
              icon={MapPin}
              to="/trips"
            >
              {trips.slice(0, 4).map((trip) => (
                <MiniItem
                  key={trip.uuid}
                  title={trip.title}
                  subtitle={`${trip.destination} • ${formatDate(trip.start_date)}`}
                  to={`/trips/${trip.uuid}`}
                />
              ))}

              {trips.length === 0 && <Empty text="No yatras available yet." />}
            </SectionCard>

            <SectionCard
              title="Spiritual Courses"
              icon={GraduationCap}
              to="/courses"
            >
              {courses.slice(0, 4).map((course) => (
                <MiniItem
                  key={course.uuid}
                  title={course.title}
                  subtitle={`${course.course_mode} • ${formatDate(course.start_date)}`}
                  to={`/courses/${course.uuid}`}
                />
              ))}

              {courses.length === 0 && (
                <Empty text="No courses available yet." />
              )}
            </SectionCard>

            <SectionCard title="Premium Access" icon={Crown} to="/profile">
              {subscription ? (
                <div className="rounded-2xl bg-green-50 p-5">
                  <p className="text-sm font-black text-green-700">
                    Premium Active
                  </p>
                  <h3 className="mt-2 text-xl font-black text-slate-900">
                    {subscription.plan_name || "Premium Plan"}
                  </h3>
                  <p className="mt-2 text-sm font-semibold text-slate-600">
                    Valid until {formatDate(subscription.end_date)}
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl bg-orange-50 p-5">
                  <p className="text-sm font-black text-orange-700">
                    No active subscription
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-600">
                    Subscribe to unlock premium journals and newsletters.
                  </p>

                  <Link
                    to="/content/subscriptions"
                    className="mt-4 inline-flex rounded-full bg-orange-600 px-4 py-2 text-sm font-bold text-white"
                  >
                    View Plans
                  </Link>
                </div>
              )}
            </SectionCard>
          </div>

          <section className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                <BookOpen className="h-6 w-6" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  Content & Learning
                </h2>
                <p className="text-sm font-semibold text-slate-500">
                  Journals, newsletters and learning resources.
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <FeatureCard
                title="Journals"
                text="Read devotional journal posts and premium writings."
                icon={BookOpen}
                to="/journals"
              />

              <FeatureCard
                title="Newsletters"
                text="Stay updated with temple announcements and spiritual content."
                icon={Newspaper}
                to="/newsletters"
              />

              <FeatureCard
                title="Courses"
                text="Learn Bhagavad Gita, bhakti basics and spiritual practice."
                icon={GraduationCap}
                to="/courses"
              />
            </div>
          </section>
        </section>
      </main>
    </>
  );
}

function SectionCard({ title, icon: Icon, to, children }: any) {
  return (
    <div className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
            <Icon className="h-5 w-5" />
          </div>
          <h2 className="font-black text-slate-900">{title}</h2>
        </div>

        <Link to={to} className="text-sm font-black text-orange-700">
          View all
        </Link>
      </div>

      <div className="space-y-3">{children}</div>
    </div>
  );
}

function MiniItem({ title, subtitle, to }: any) {
  return (
    <Link
      to={to}
      className="block rounded-2xl bg-orange-50 p-4 transition hover:bg-orange-100"
    >
      <h3 className="font-black text-slate-900">{title}</h3>
      <p className="mt-1 text-sm font-semibold text-slate-500">{subtitle}</p>
    </Link>
  );
}

function FeatureCard({ title, text, icon: Icon, to }: any) {
  return (
    <Link
      to={to}
      className="rounded-3xl bg-gradient-to-b from-orange-50 to-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
        {text}
      </p>
    </Link>
  );
}

function Empty({ text }: any) {
  return (
    <div className="rounded-2xl bg-slate-50 p-5 text-center">
      <p className="text-sm font-bold text-slate-500">{text}</p>
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
