import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Mail, Phone, UserRound } from "lucide-react";
import {
  getCourseByUuid,
  getCourseRegistrations,
} from "../../services/courseService";
import AppLoader from "../../components/common/AppLoader";

export default function CourseRegistrationsPage() {
  const { uuid } = useParams();

  const [course, setCourse] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [uuid]);

  const load = async () => {
    try {
      const [courseRes, regRes] = await Promise.all([
        getCourseByUuid(uuid!),
        getCourseRegistrations(uuid!),
      ]);

      setCourse(courseRes.data);
      setRegistrations(Array.isArray(regRes.data) ? regRes.data : []);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: registrations.length,
      confirmed: registrations.filter((r) => r.registration_status === "confirmed").length,
      pending: registrations.filter((r) => r.registration_status === "pending").length,
      completed: registrations.filter((r) => r.progress_status === "completed").length,
    };
  }, [registrations]);

  if (loading) {
    return (
      <AppLoader
        title="Loading Course Registrations"
        subtitle="Fetching registered seekers and devotees..."
      />
    );
  }

  return (
    <div className="min-h-screen">
      <Link
        to="/courses/manage-registrations"
        className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-[#5c3d1a] hover:text-[#c8902a]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Course List
      </Link>

      <section className="overflow-hidden rounded-[2rem] border border-[#ede0c8] bg-white shadow-sm">
        <div className="bg-[#1a0a00] p-7 text-white">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#d4a853]">
            Course Registrations
          </p>

          <h1 className="mt-3 font-serif text-5xl font-black">
            {course?.title}
          </h1>

          <p className="mt-3 font-bold text-[#d4a853]">
            {course?.course_type || "Course"} · {course?.mode || "-"} ·{" "}
            {course?.is_paid ? `₹${course?.price_amount}` : "Free"}
          </p>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-4">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Confirmed" value={stats.confirmed} />
          <StatCard label="Pending" value={stats.pending} />
          <StatCard label="Completed" value={stats.completed} />
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-[#ede0c8] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
            Registered Students
          </h2>

          <span className="rounded-full bg-[#f5e8c8] px-4 py-2 text-xs font-black text-[#8b6914]">
            {registrations.length} registrations
          </span>
        </div>

        {registrations.length === 0 ? (
          <div className="rounded-3xl bg-[#fdfaf5] p-10 text-center">
            <UserRound className="mx-auto h-14 w-14 text-[#c8902a]" />
            <h3 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
              No registrations yet
            </h3>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => (
              <CourseRegistrationCard key={reg.uuid} reg={reg} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CourseRegistrationCard({ reg }: { reg: any }) {
  const user = reg.user;
  const payment = reg.payment || reg.course_payment;

  return (
    <div className="rounded-3xl border border-[#ede0c8] bg-[#fdfaf5] p-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c8902a] text-xl font-black text-[#1a0a00]">
            {reg.full_name?.charAt(0)?.toUpperCase() ||
              user?.first_name?.charAt(0)?.toUpperCase() ||
              "U"}
          </div>

          <div>
            <h3 className="font-serif text-2xl font-black text-[#1a0a00]">
              {reg.full_name ||
                `${user?.first_name || ""} ${user?.last_name || ""}`}
            </h3>

            <div className="mt-2 space-y-1 text-sm font-bold text-[#5c3d1a]">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {reg.email || user?.email || "-"}
              </p>

              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {reg.phone || user?.phone || "-"}
              </p>

              <p>Joined: {formatDate(reg.createdAt || reg.created_at)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge value={reg.registration_status || "pending"} />
          <Badge value={reg.payment_status || "not_required"} />
          <Badge value={reg.progress_status || "not_started"} />
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <Info label="Progress %" value={`${reg.progress_percentage || 0}%`} />
        <Info label="Completed At" value={formatDate(reg.completed_at)} />
        <Info label="Payment ID" value={payment?.provider_payment_id || "-"} />
        <Info
          label="Amount"
          value={
            payment?.amount
              ? `${payment.currency || "INR"} ${payment.amount}`
              : "-"
          }
        />
      </div>

      {reg.notes && (
        <div className="mt-5 rounded-2xl bg-white p-4">
          <p className="text-xs font-black uppercase tracking-wider text-[#9a7a4a]">
            Notes
          </p>
          <p className="mt-1 text-sm font-bold text-[#1a0a00]">{reg.notes}</p>
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-xl bg-white p-3">
      <p className="text-xs font-black uppercase text-[#9a7a4a]">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-[#1a0a00]">
        {String(value || "-")}
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-3xl border border-[#ede0c8] bg-[#fdfaf5] p-5 text-center">
      <p className="font-serif text-5xl font-black text-[#c8902a]">{value}</p>
      <p className="mt-2 text-xs font-black uppercase tracking-wider text-[#8b6914]">
        {label}
      </p>
    </div>
  );
}

function Badge({ value }: { value: string }) {
  return (
    <span className="rounded-full bg-[#f5e8c8] px-3 py-1 text-xs font-black uppercase text-[#8b6914]">
      {value}
    </span>
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