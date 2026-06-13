import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, CreditCard, Loader2, MonitorPlay } from "lucide-react";
import { getMyRegisteredCourses } from "../../services/courseService";

export default function RegisteredCoursesPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      const res = await getMyRegisteredCourses();
      setRegistrations(res.data || []);
    } catch (error) {
      alert("Failed to load registered courses");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "-";

  const formatPrice = (reg: any) => {
    if (!reg.payment) return "Free";
    return `${reg.payment.currency === "INR" ? "₹" : reg.payment.currency}${reg.payment.amount}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 text-orange-700">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Loading registrations...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50 px-4 py-10">
      <section className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-extrabold text-slate-900">
          My Registered Courses
        </h1>

        <p className="mb-8 text-slate-500">
          View all courses you registered for.
        </p>

        {registrations.length === 0 ? (
          <div className="rounded-3xl border border-orange-100 bg-white p-10 text-center shadow-sm">
            <p className="font-bold text-slate-700">
              You have not registered for any course yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {registrations.map((reg) => (
              <div
                key={reg.uuid}
                className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                        {reg.registration_status}
                      </span>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        {reg.payment_status}
                      </span>
                    </div>

                    <h2 className="text-xl font-extrabold text-slate-900">
                      {reg.course?.title || "Course"}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(reg.course?.start_date)} -{" "}
                        {formatDate(reg.course?.end_date)}
                      </span>

                      <span className="flex items-center gap-1">
                        <MonitorPlay className="h-4 w-4" />
                        {reg.course?.course_mode}
                      </span>

                      <span className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        {formatPrice(reg)}
                      </span>
                    </div>
                  </div>

                  <Link
                    to={`/courses/${reg.course?.uuid}`}
                    className="rounded-full bg-orange-600 px-5 py-3 text-center font-bold text-white"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}