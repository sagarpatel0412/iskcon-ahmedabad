import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Mail, Phone, UserRound } from "lucide-react";
import { getEvent, getEventRegistrations } from "../../services/eventService";
import AppLoader from "../../components/common/AppLoader";

export default function EventUserRegistrationsPage() {
  const { uuid } = useParams();

  const [event, setEvent] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, [uuid]);

  const load = async () => {
    try {
      const [eventRes, regRes] = await Promise.all([
        getEvent(uuid!),
        getEventRegistrations(uuid!),
      ]);

      setEvent(eventRes.data);
      setRegistrations(Array.isArray(regRes.data) ? regRes.data : []);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const registered = registrations.filter(
      (r) => r.status === "registered"
    ).length;

    const attended = registrations.filter((r) => r.status === "attended").length;

    return {
      total: registrations.length,
      registered,
      attended,
    };
  }, [registrations]);

  if (loading) {
    return (
      <AppLoader
        title="Loading Registrations"
        subtitle="Fetching event registration list..."
      />
    );
  }

  return (
    <div className="min-h-screen">
      <Link
        to="/events/manage-registrations"
        className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-[#5c3d1a] hover:text-[#c8902a]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Event List
      </Link>

      <section className="overflow-hidden rounded-[2rem] border border-[#ede0c8] bg-white shadow-sm">
        <div className="bg-[#1a0a00] p-7 text-white">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#d4a853]">
            Event Registrations
          </p>

          <h1 className="mt-3 font-serif text-5xl font-black">
            {event?.title}
          </h1>

          <p className="mt-3 font-bold text-[#d4a853]">
            {event?.event_date || "-"} · {event?.start_time || "-"} -{" "}
            {event?.end_time || "-"}
          </p>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-3">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Registered" value={stats.registered} />
          <StatCard label="Attended" value={stats.attended} />
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border border-[#ede0c8] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
            Registered Users
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
              <RegistrationCard key={reg.uuid} reg={reg} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function RegistrationCard({ reg }: { reg: any }) {
  const user = reg.user;

  return (
    <div className="rounded-3xl border border-[#ede0c8] bg-[#fdfaf5] p-5">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c8902a] text-xl font-black text-[#1a0a00]">
            {user?.first_name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>
            <h3 className="font-serif text-2xl font-black text-[#1a0a00]">
              {user?.first_name} {user?.last_name || ""}
            </h3>

            <div className="mt-2 space-y-1 text-sm font-bold text-[#5c3d1a]">
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user?.email || "-"}
              </p>

              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {user?.phone || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge value={reg.status || "registered"} />
          <Badge value={reg.payment_status || "not_required"} />
        </div>
      </div>

      {reg.form_answers && (
        <div className="mt-5 rounded-2xl bg-white p-4">
          <p className="mb-3 text-xs font-black uppercase tracking-wider text-[#9a7a4a]">
            Form Answers
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(reg.form_answers).map(([key, value]) => (
              <div key={key} className="rounded-xl bg-[#fdfaf5] p-3">
                <p className="text-xs font-black uppercase text-[#9a7a4a]">
                  {key}
                </p>
                <p className="mt-1 text-sm font-bold text-[#1a0a00]">
                  {String(value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
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