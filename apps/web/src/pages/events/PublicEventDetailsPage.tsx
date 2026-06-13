import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Share2,
  Ticket,
  Users,
} from "lucide-react";
import { getEvent, getEventFormFields } from "../../services/eventService";
import { getToken } from "../../services/authService";
import { formatDate, posterUrl } from "./eventStyles";
import AppLoader from "../../components/common/AppLoader";

export default function PublicEventDetailsPage() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isLoggedIn = !!getToken();

  useEffect(() => {
    load();
  }, [uuid]);

  const load = async () => {
    try {
      const eventRes = await getEvent(uuid!);
      setEvent(eventRes.data);

      const fieldsRes = await getEventFormFields(uuid!);
      setFields(Array.isArray(fieldsRes.data) ? fieldsRes.data : []);
    } finally {
      setLoading(false);
    }
  };

  const poster = useMemo(() => {
    if (!event?.poster_url) return "";
    return posterUrl(event.poster_url);
  }, [event]);

  const spotsLeft = useMemo(() => {
    const max = Number(event?.max_capacity || 0);
    const registered = Number(
      event?.registration_count || event?.registrations_count || 0,
    );

    if (!max) return "Unlimited";
    return Math.max(max - registered, 0);
  }, [event]);

  const handleRegister = () => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: {
          from: `/events/${uuid}`,
        },
      });
      return;
    }

    navigate(`/events/${uuid}/register`);
  };

  const handleShare = async () => {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      alert("Event link copied");
    } catch {
      alert(url);
    }
  };

  if (loading) {
    return (
      <AppLoader
        title="Loading Journals"
        subtitle="Fetching spiritual wisdom..."
      />
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#f0e8d8] p-10 text-center">
        <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
          Event not found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5">
      <div className="mb-5 rounded-2xl bg-[#1a0a00] px-5 py-3 text-center text-xs font-black tracking-[0.25em] text-[#d4a853]">
        ॐ नमो भगवते वासुदेवाय · ISKCON Ahmedabad Events
      </div>

      <Link
        to="/events"
        className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-[#5c3d1a] hover:text-[#c8902a]"
      >
        <ArrowLeft size={17} />
        Back to Events
      </Link>

      <section className="relative mb-6 flex min-h-[360px] items-end overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a0a00] via-[#3d1500] to-[#1a0a00] p-8 shadow-xl">
        {poster && (
          <img
            src={poster}
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0a00] via-[#1a0a00]/45 to-transparent" />
        <div className="absolute right-8 top-0 text-[200px] text-[#c8902a]/10">
          ॐ
        </div>

        <div className="relative z-10 max-w-4xl">
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#c8902a] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#1a0a00]">
              {event.status || "published"}
            </span>

            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wider text-white backdrop-blur">
              {event.is_paid
                ? `Paid · ₹${event.price_amount || 0}`
                : "Free Entry"}
            </span>
          </div>

          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d4a853]">
            ISKCON Ahmedabad Presents
          </p>

          <h1 className="mt-3 font-serif text-5xl font-black leading-tight text-white md:text-6xl">
            {event.title}
          </h1>

          <p className="mt-4 text-lg font-bold text-[#f5e8c8]">
            {formatDate(event.event_date)} · {event.start_time || "-"} –{" "}
            {event.end_time || "-"}
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <main className="space-y-5">
          <section className="rounded-3xl border border-[#ede0c8] bg-white p-6 shadow-sm">
            <h2 className="border-b border-[#ede0c8] pb-4 font-serif text-3xl font-black text-[#1a0a00]">
              About this Event
            </h2>

            <p className="mt-5 whitespace-pre-line text-[15px] font-medium leading-8 text-[#5c3d1a]">
              {event.description || "No description available."}
            </p>
          </section>

          <section className="rounded-3xl border border-[#ede0c8] bg-white p-6 shadow-sm">
            <h2 className="mb-5 font-serif text-3xl font-black text-[#1a0a00]">
              Event Information
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <InfoCard
                icon={CalendarDays}
                label="Date"
                value={formatDate(event.event_date)}
              />

              <InfoCard
                icon={Clock}
                label="Time"
                value={`${event.start_time || "-"} - ${event.end_time || "-"}`}
              />

              <InfoCard
                icon={MapPin}
                label="Location"
                value={event.location || "-"}
              />

              <InfoCard
                icon={Users}
                label="Capacity"
                value={
                  event.max_capacity
                    ? `${spotsLeft} spots left`
                    : "Unlimited capacity"
                }
              />
            </div>
          </section>

          {fields.length > 0 && (
            <section className="rounded-3xl border border-[#ede0c8] bg-white p-6 shadow-sm">
              <h2 className="mb-3 font-serif text-3xl font-black text-[#1a0a00]">
                Registration Form
              </h2>

              <p className="mb-5 text-sm font-bold text-[#9a7a4a]">
                These details will be asked during registration.
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                {fields.map((field) => (
                  <div
                    key={field.uuid || field.field_key}
                    className="rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] p-4"
                  >
                    <p className="font-black text-[#1a0a00]">
                      {field.label}
                      {field.is_required && (
                        <span className="ml-1 text-red-700">*</span>
                      )}
                    </p>

                    <p className="mt-1 text-xs font-black uppercase tracking-wider text-[#9a7a4a]">
                      {field.field_type}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        <aside className="space-y-5">
          <section className="sticky top-6 rounded-3xl border border-[#3d2200] bg-gradient-to-br from-[#1a0a00] to-[#3d2200] p-6 shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d4a853]">
              Registration
            </p>

            <h3 className="mt-3 font-serif text-5xl font-black text-white">
              {event.is_paid ? `₹${event.price_amount || 0}` : "Free"}
            </h3>

            <p className="mt-2 text-sm font-bold text-[#d4a853]">
              {event.is_paid
                ? `${event.currency || "INR"} payment required`
                : "No payment required"}
            </p>

            <div className="my-5 h-px bg-[#5c3d1a]" />

            <div className="space-y-3 text-sm font-bold text-[#f5e8c8]">
              <p>📅 {formatDate(event.event_date)}</p>
              <p>
                🕐 {event.start_time || "-"} – {event.end_time || "-"}
              </p>
              <p>📍 {event.location || "-"}</p>
              <p>
                👥{" "}
                {event.max_capacity
                  ? `${spotsLeft} spots left`
                  : "Unlimited capacity"}
              </p>
            </div>

            <button
              onClick={handleRegister}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c8902a] px-5 py-4 font-black text-[#1a0a00] hover:bg-[#d4a853]"
            >
              <Ticket size={19} />
              {isLoggedIn ? "Register Now" : "Login to Register"}
            </button>

            <button
              onClick={handleShare}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#5c3d1a] px-5 py-3 font-black text-[#d4a853] hover:bg-[#3d2200]"
            >
              <Share2 size={18} />
              Copy Event Link
            </button>
          </section>

          <section className="rounded-3xl border border-[#c8902a] bg-[#f5e8c8] p-5">
            <p className="text-sm font-black uppercase tracking-wider text-[#8b6914]">
              🪔 Organised by
            </p>

            <div className="mt-4 flex items-center gap-3">
              <img
                src="https://iskconahmedabad.com/images/logo.png"
                className="h-12 w-12 rounded-full border-2 border-[#c8902a] bg-white object-contain"
              />

              <div>
                <h3 className="font-black text-[#1a0a00]">
                  {event.centre?.name || "ISKCON Ahmedabad"}
                </h3>
                <p className="text-xs font-bold text-[#9a7a4a]">
                  Official Temple Event
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: any;
}) {
  return (
    <div className="rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] p-4">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5e8c8] text-[#8b6914]">
        <Icon size={21} />
      </div>

      <p className="text-xs font-black uppercase tracking-wider text-[#9a7a4a]">
        {label}
      </p>

      <p className="mt-1 font-black text-[#1a0a00]">{value}</p>
    </div>
  );
}
