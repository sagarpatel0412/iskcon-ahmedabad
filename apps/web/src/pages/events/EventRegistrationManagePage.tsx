import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Eye, MapPin, UsersRound } from "lucide-react";
import { getMyEvents } from "../../services/eventService";
import AppLoader from "../../components/common/AppLoader";

export default function EventRegistrationManagePage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getMyEvents();
      setEvents(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLoader
        title="Loading Events"
        subtitle="Fetching your created events..."
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mb-6 rounded-2xl bg-[#1a0a00] px-5 py-3 text-center text-xs font-black tracking-[0.25em] text-[#d4a853]">
        ॐ नमो भगवते वासुदेवाय · Event Registrations
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-5xl font-black text-[#1a0a00]">
          Event Registration Management
        </h1>
        <p className="mt-2 font-bold text-[#9a7a4a]">
          Select an event to view registered devotees and seekers.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="rounded-[2rem] border border-[#ede0c8] bg-white p-10 text-center">
          <UsersRound className="mx-auto h-14 w-14 text-[#c8902a]" />
          <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
            No events created yet
          </h2>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {events.map((event) => (
            <div
              key={event.uuid}
              className="rounded-[2rem] border border-[#ede0c8] bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full bg-[#f5e8c8] px-3 py-1 text-xs font-black uppercase text-[#8b6914]">
                    {event.status}
                  </span>

                  <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
                    {event.title}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a0a00] text-[#d4a853]">
                  <CalendarDays />
                </div>
              </div>

              <div className="mt-5 space-y-2 text-sm font-bold text-[#5c3d1a]">
                <p>📅 {event.event_date || "-"}</p>
                <p>
                  🕐 {event.start_time || "-"} - {event.end_time || "-"}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {event.location || "-"}
                </p>
                <p>👥 Capacity: {event.max_capacity || "Unlimited"}</p>
                <p>
                  🎟 {event.is_paid ? `₹${event.price_amount}` : "Free Event"}
                </p>
              </div>

              <Link
                to={`/events/${event.uuid}/registrations`}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c8902a] px-5 py-3 font-black text-[#1a0a00] hover:bg-[#d4a853]"
              >
                <Eye className="h-5 w-5" />
                View Registrations
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}