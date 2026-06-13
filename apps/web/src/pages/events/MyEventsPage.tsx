import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteEvent, getMyEvents } from "../../services/eventService";
import { formatDate } from "./eventStyles";

export default function MyEventsPage() {
  const [events, setEvents] = useState<any[]>([]);

  const load = async () => {
    const res = await getMyEvents();
    setEvents(Array.isArray(res.data) ? res.data : []);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (uuid: string) => {
    if (!confirm("Delete this event?")) return;
    await deleteEvent(uuid);
    load();
  };

  return (
    <div className="min-h-screen bg-[#f0e8d8] p-5">
      <div className="mb-6 flex justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-black text-[#1a0a00]">My Events</h1>
          <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
            Events created by you.
          </p>
        </div>

        <Link
          to="/events/create"
          className="rounded-xl bg-[#c8902a] px-5 py-3 text-sm font-black text-[#1a0a00]"
        >
          + Create
        </Link>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.uuid}
            className="flex flex-wrap gap-4 rounded-2xl border border-[#ede0c8] bg-white p-4"
          >
            <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl border border-[#c8902a] bg-[#f5e8c8]">
              <span className="font-serif text-3xl font-black text-[#1a0a00]">
                {event.event_date ? new Date(event.event_date).getDate() : "-"}
              </span>
              <span className="text-xs font-black uppercase text-[#8b6914]">
                {event.event_date
                  ? new Date(event.event_date).toLocaleString("en-IN", { month: "short" })
                  : ""}
              </span>
            </div>

            <div className="min-w-[240px] flex-1">
              <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
                {event.title}
              </h2>
              <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
                {formatDate(event.event_date)} · {event.start_time || "-"} · {event.location || "-"}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Link className="rounded-lg bg-[#1a0a00] px-3 py-2 text-sm font-black text-[#d4a853]" to={`/events/${event.uuid}/details`}>
                  View
                </Link>
                <Link className="rounded-lg border border-[#ede0c8] px-3 py-2 text-sm font-black text-[#5c3d1a]" to={`/events/${event.uuid}/edit`}>
                  Edit
                </Link>
                <Link className="rounded-lg border border-[#ede0c8] px-3 py-2 text-sm font-black text-[#5c3d1a]" to={`/events/${event.uuid}/form`}>
                  Form
                </Link>
                <Link className="rounded-lg border border-[#ede0c8] px-3 py-2 text-sm font-black text-[#5c3d1a]" to="/events/scan-qr">
                  Scan QR
                </Link>
                <button className="rounded-lg bg-red-50 px-3 py-2 text-sm font-black text-red-700" onClick={() => remove(event.uuid)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="rounded-2xl border border-[#ede0c8] bg-white p-10 text-center">
            <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
              No events created yet
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}