import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  IndianRupee,
  Loader2,
  MapPin,
  MonitorPlay,
  Users,
} from "lucide-react";
import { getCourses } from "../../services/courseService";
import PageSeo from "../../components/seo/PageSeo";

type Course = {
  uuid: string;
  title: string;
  description?: string | null;
  cover_image_url?: string | null;
  course_mode: "offline" | "online" | "hybrid";
  venue_name?: string | null;
  venue_address?: string | null;
  online_meeting_url?: string | null;
  start_date: string;
  end_date: string;
  start_time?: string | null;
  end_time?: string | null;
  max_capacity?: number | null;
  is_paid: boolean;
  price_amount: number;
  currency: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await getCourses();
      setCourses(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (course: Course) => {
    if (!course.is_paid || Number(course.price_amount) <= 0) return "Free";
    return `${course.currency === "INR" ? "₹" : course.currency}${course.price_amount}`;
  };

  const modeIcon = (mode: Course["course_mode"]) => {
    if (mode === "online") return <MonitorPlay className="h-4 w-4" />;
    if (mode === "hybrid") return <MonitorPlay className="h-4 w-4" />;
    return <MapPin className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-orange-50">
        <div className="flex items-center gap-3 text-orange-700">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="font-bold">Loading courses...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageSeo
        title="Explore Courses | ISKCON Ahmedabad"
        description="Explore Courses to know krishna"
      />

      <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50 px-4 py-10">
        <section className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-700">
              <BookOpen className="h-8 w-8" />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
              Spiritual Courses
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Learn through offline, online, and hybrid courses conducted by
              devotees with session-wise guidance.
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="rounded-3xl border border-orange-100 bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-bold text-slate-800">
                No courses available
              </h2>
              <p className="mt-2 text-slate-500">
                Upcoming courses will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <Link
                  key={course.uuid}
                  to={`/courses/${course.uuid}`}
                  className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="h-48 bg-orange-100">
                    {course.cover_image_url ? (
                      <img
                        src={course.cover_image_url}
                        alt={course.title}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-orange-600">
                        <BookOpen className="h-12 w-12" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                        {modeIcon(course.course_mode)}
                        {course.course_mode.toUpperCase()}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          course.is_paid
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {formatPrice(course)}
                      </span>
                    </div>

                    <h2 className="text-xl font-extrabold text-slate-900">
                      {course.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {course.description ||
                        "A spiritual learning course for seekers and devotees."}
                    </p>

                    <div className="mt-5 space-y-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-orange-600" />
                        {formatDate(course.start_date)} -{" "}
                        {formatDate(course.end_date)}
                      </div>

                      {course.venue_name && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-orange-600" />
                          {course.venue_name}
                        </div>
                      )}

                      {course.max_capacity && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-orange-600" />
                          Capacity: {course.max_capacity}
                        </div>
                      )}
                    </div>

                    <button className="mt-6 w-full rounded-full bg-orange-600 px-5 py-3 font-bold text-white transition group-hover:bg-orange-700">
                      View Course
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
