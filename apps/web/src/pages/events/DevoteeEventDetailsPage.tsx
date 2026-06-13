import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getEvent, getEventRegistrations } from "../../services/eventService";
import { formatDate, posterUrl } from "./eventStyles";
import AppLoader from "../../components/common/AppLoader";

export default function DevoteeEventDetailsPage() {
  const { uuid } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);

  useEffect(() => {
    getEvent(uuid!).then((res) => setEvent(res.data));
    getEventRegistrations(uuid!).then((res) => {
      setRegistrations(Array.isArray(res.data) ? res.data : []);
    });
  }, [uuid]);

  if (!event)
    return (
      <AppLoader
        title="Loading Events"
        subtitle="Fetching spiritual wisdom..."
      />
    );

  return (
    <div className="min-h-screen bg-[#f0e8d8] p-5">
      <div className="relative mb-6 flex min-h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a0a00] via-[#3d1500] to-[#1a0a00] p-8 text-center">
        {event.poster_url && (
          <img
            src={posterUrl(event.poster_url)}
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
        )}
        <div className="absolute right-6 top-0 text-[180px] text-[#c8902a]/10">
          ॐ
        </div>

        <div className="relative z-10">
          <p className="text-xs font-black tracking-[0.25em] text-[#d4a853]">
            ISKCON AHMEDABAD PRESENTS
          </p>
          <h1 className="mt-3 font-serif text-5xl font-black text-white">
            {event.title}
          </h1>
          <p className="mt-3 text-sm font-bold text-[#d4a853]">
            {formatDate(event.event_date)} · {event.start_time || "-"} –{" "}
            {event.end_time || "-"}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <main className="space-y-5">
          <section className="rounded-2xl border border-[#ede0c8] bg-white p-5">
            <h2 className="border-b border-[#ede0c8] pb-3 font-serif text-2xl font-black text-[#1a0a00]">
              About this Event
            </h2>

            <p className="mt-4 leading-8 text-[#5c3d1a]">
              {event.description || "No description available."}
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Info label="Date" value={formatDate(event.event_date)} />
              <Info
                label="Time"
                value={`${event.start_time || "-"} - ${event.end_time || "-"}`}
              />
              <Info label="Location" value={event.location || "-"} />
              <Info
                label="Capacity"
                value={event.max_capacity || "Unlimited"}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[#ede0c8] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
                Registrations ({registrations.length})
              </h2>

              <Link
                to="/events/scan-qr"
                className="rounded-xl bg-[#c8902a] px-4 py-2 text-sm font-black text-[#1a0a00]"
              >
                Scan QR
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-b border-[#ede0c8] text-xs uppercase tracking-widest text-[#9a7a4a]">
                    <th className="p-3">Seeker</th>
                    <th className="p-3">Registered</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">QR Token</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration) => (
                    <tr
                      key={registration.uuid}
                      className="border-b border-[#f7f0e4]"
                    >
                      <td className="p-3 font-bold text-[#1a0a00]">
                        {registration.user?.first_name ||
                          registration.user?.email ||
                          "User"}
                      </td>
                      <td className="p-3 text-sm font-bold text-[#9a7a4a]">
                        {formatDate(registration.registered_at)}
                      </td>
                      <td className="p-3">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                          {registration.status}
                        </span>
                      </td>
                      <td className="max-w-[220px] truncate p-3 font-mono text-xs text-[#9a7a4a]">
                        {registration.qr_token}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {registrations.length === 0 && (
                <div className="p-8 text-center font-bold text-[#9a7a4a]">
                  No registrations yet.
                </div>
              )}
            </div>
          </section>
        </main>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-[#3d2200] bg-gradient-to-br from-[#1a0a00] to-[#3d2200] p-5">
            <p className="text-xs font-black tracking-widest text-[#d4a853]">
              REGISTRATION
            </p>
            <h3 className="mt-2 font-serif text-4xl font-black text-white">
              {event.is_paid ? `₹${event.price_amount}` : "Free"}
            </h3>
            <p className="mt-2 text-sm font-bold text-[#d4a853]">
              Status: {event.status}
            </p>
          </section>

          <section className="rounded-2xl border border-[#c8902a] bg-[#f5e8c8] p-5">
            <p className="font-black text-[#1a0a00]">🪔 Organised by</p>
            <p className="mt-2 text-sm font-bold text-[#5c3d1a]">
              {event.centre?.name || "ISKCON Ahmedabad"}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-widest text-[#9a7a4a]">
        {label}
      </p>
      <p className="mt-1 font-black text-[#1a0a00]">{value}</p>
    </div>
  );
}
