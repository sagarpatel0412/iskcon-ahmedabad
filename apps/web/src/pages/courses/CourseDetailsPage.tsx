// src/pages/courses/CourseDetailsPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  CheckCircle,
  Clock,
  CreditCard,
  Loader2,
  Mail,
  MapPin,
  MonitorPlay,
  Phone,
  Users,
} from "lucide-react";
import {
  getCourseByUuid,
  registerCourse,
  verifyCoursePayment,
} from "../../services/courseService";
import useAuth from "../../hooks/useAuth";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CourseDetailsPage() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const { isLoggedIn } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    notes: "",
  });

  useEffect(() => {
    loadCourse();
  }, [uuid]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const res = await getCourseByUuid(uuid!);
      setCourse(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRegister = async () => {
    try {
      setRegistering(true);

      const res = await registerCourse(course.uuid, form);
      const data = res.data;

      if (!data.requires_payment) {
        alert("Course registration confirmed successfully 🙏");
        loadCourse();
        return;
      }

      const loaded = await loadRazorpayScript();

      if (!loaded) {
        throw new Error("Failed to load Razorpay");
      }

      const razorpay = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency || "INR",
        order_id: data.order.id,
        name: "ISKCON Ahmedabad",
        description: course.title,

        handler: async (response: any) => {
          await verifyCoursePayment({
            payment_uuid: data.payment_uuid,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert("Payment successful. Course registration confirmed 🙏");
          loadCourse();
        },

        theme: {
          color: "#ea580c",
        },
      });

      razorpay.open();
    } catch (error: any) {
      alert(error?.response?.data?.message || error.message || "Failed");
    } finally {
      setRegistering(false);
    }
  };

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = () => {
    if (!course?.is_paid || Number(course?.price_amount) <= 0) return "Free";
    return `${course.currency === "INR" ? "₹" : course.currency}${course.price_amount}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-orange-700" />
        <span className="font-bold text-orange-700">Loading course...</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50">
        <p className="font-bold text-slate-700">Course not found</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50">
      <section className="relative">
        <div className="h-[360px] bg-orange-100">
          {course.cover_image_url ? (
            <img
              src={`http://localhost:3000${course.cover_image_url}`}
              alt={course.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-orange-600">
              <BookOpen className="h-20 w-20" />
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8">
          <div className="mx-auto max-w-6xl text-white">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-orange-500 px-4 py-1 text-xs font-bold">
                {course.course_mode?.toUpperCase()}
              </span>

              <span className="rounded-full bg-white/20 px-4 py-1 text-xs font-bold backdrop-blur">
                {formatPrice()}
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-extrabold md:text-5xl">
              {course.title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-orange-50 md:text-base">
              {course.description ||
                "A spiritual learning course for seekers and devotees."}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard
              icon={<CalendarDays />}
              label="Dates"
              value={`${formatDate(course.start_date)} - ${formatDate(course.end_date)}`}
            />
            <InfoCard
              icon={<MonitorPlay />}
              label="Mode"
              value={course.course_mode}
            />
            <InfoCard
              icon={<Users />}
              label="Capacity"
              value={course.max_capacity ? `${course.max_capacity}` : "Open"}
            />
          </div>

          <Card title="Course Information">
            <div className="grid gap-4 md:grid-cols-2">
              <Detail label="Venue" value={course.venue_name} />
              <Detail label="Venue Address" value={course.venue_address} />
              <Detail label="Online Link" value={course.online_meeting_url} />
              <Detail
                label="Time"
                value={`${course.start_time || "-"} - ${course.end_time || "-"}`}
              />
              <Detail label="Contact Name" value={course.contact_name} />
              <Detail label="Contact Phone" value={course.contact_phone} />
            </div>
          </Card>

          <Card title="What You Will Learn">
            <TextBlock title="Learning" text={course.what_you_will_learn} />
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <TextBlock title="Requirements" text={course.requirements} />
              <TextBlock title="Rules" text={course.rules} />
            </div>
          </Card>

          {course.sessions?.length > 0 && (
            <Card title="Course Sessions">
              <div className="space-y-4">
                {course.sessions.map((session: any) => (
                  <div
                    key={session.uuid}
                    className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                        Session {session.session_number}
                      </span>
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                        {formatDate(session.session_date)}
                      </span>
                    </div>

                    <h3 className="text-lg font-extrabold text-slate-900">
                      {session.title}
                    </h3>

                    {session.description && (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {session.description}
                      </p>
                    )}

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <Detail
                        label="Time"
                        value={`${session.start_time || "-"} - ${session.end_time || "-"}`}
                      />
                      <Detail label="Venue" value={session.venue_name} />
                      <Detail label="Address" value={session.venue_address} />
                      <Detail
                        label="Online Link"
                        value={session.online_meeting_url}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-extrabold text-slate-900">
                Register for Course
              </h2>
            </div>

            <div className="mb-5 rounded-2xl bg-orange-50 p-4">
              <p className="text-sm font-bold text-slate-500">Course Price</p>
              <p className="mt-1 text-3xl font-extrabold text-orange-700">
                {formatPrice()}
              </p>
            </div>

            <div className="space-y-3">
              <Input
                label="Full Name"
                value={form.full_name}
                onChange={(v: any) => update("full_name", v)}
              />
              <Input
                label="Phone"
                value={form.phone}
                onChange={(v: any) => update("phone", v)}
                icon={<Phone className="h-4 w-4" />}
              />
              <Input
                label="Email"
                value={form.email}
                onChange={(v: any) => update("email", v)}
                icon={<Mail className="h-4 w-4" />}
              />
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Any notes"
                className="min-h-24 w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
            </div>

            <button
              onClick={() => {
                isLoggedIn ? handleRegister() : navigate("/login");
              }}
              disabled={registering}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700 disabled:opacity-70"
            >
              {isLoggedIn ? (
                registering ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : course.is_paid ? (
                  "Register & Pay"
                ) : (
                  "Register Free"
                )
              ) : (
                "Login to Register ..."
              )}
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-extrabold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

function InfoCard({ icon, label, value }: any) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
      <div className="mb-3 text-orange-600 [&_svg]:h-6 [&_svg]:w-6">{icon}</div>
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-extrabold capitalize text-slate-900">{value}</p>
    </div>
  );
}

function Detail({ label, value }: any) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-1 break-words font-bold text-slate-800">
        {value || "-"}
      </p>
    </div>
  );
}

function TextBlock({ title, text }: any) {
  return (
    <div className="rounded-2xl bg-orange-50 p-4">
      <p className="font-bold text-orange-700">{title}</p>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
        {text || "-"}
      </p>
    </div>
  );
}

function Input({ label, value, onChange, icon }: any) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <div className="flex items-center gap-2 rounded-2xl border border-orange-100 px-4 py-3 focus-within:border-orange-400">
        {icon}
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </label>
  );
}
