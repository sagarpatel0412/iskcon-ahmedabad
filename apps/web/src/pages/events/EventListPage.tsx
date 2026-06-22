import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Loader2, Search } from "lucide-react";
import { getEvents } from "../../services/eventService";
import { badgeClass, formatDate, posterUrl } from "./eventStyles";
import PageSeo from "../../components/seo/PageSeo";

export default function EventListPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getEvents({
        page,
        limit: 9,
        search,
        status,
      });

      setEvents(res.data.items || []);
      setPagination(res.data.pagination || null);
    } catch (error) {
      console.error(error);
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      load();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <>
      <PageSeo
        title="Explore Events | ISKCON Ahmedabad"
        description="Explore events and enjoy Krishna conscious programs."
      />

      <div className="min-h-screen p-5">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
              Events
            </h1>
            <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
              Explore ISKCON Ahmedabad events.
            </p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-3">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-full border border-[#ede0c8] bg-white px-4 py-2 text-sm font-bold text-[#5c3d1a]"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          <div className="flex min-w-[260px] items-center gap-2 rounded-full border border-[#ede0c8] bg-white px-4 py-2">
            <Search size={17} className="text-[#9a7a4a]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full bg-transparent text-sm font-bold outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-[#ede0c8] bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-[#c8902a]" />
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#ede0c8] bg-white p-12 text-center">
            <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
              No events found
            </h2>
            <p className="mt-2 text-sm font-bold text-[#9a7a4a]">
              Try changing search or status filter.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {events.map((event) => (
                <div
                  key={event.uuid}
                  className="overflow-hidden rounded-2xl border border-[#ede0c8] bg-white shadow-sm transition hover:shadow-xl"
                >
                  {event.poster_url ? (
                    <img
                      src={posterUrl(event.poster_url)}
                      className="h-44 w-full object-cover"
                      alt={event.title}
                    />
                  ) : (
                    <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-[#1a0a00] to-[#3d2200]">
                      <div className="absolute right-4 top-0 text-8xl text-[#c8902a]/10">
                        ॐ
                      </div>
                      <p className="px-5 text-center font-serif text-2xl font-black text-[#d4a853]">
                        {event.title}
                      </p>
                    </div>
                  )}

                  <div className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full bg-[#c8902a] px-3 py-1 text-xs font-black text-[#1a0a00]">
                        {formatDate(event.event_date)}
                      </span>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-black ${badgeClass(
                          event.status,
                        )}`}
                      >
                        {event.status || "draft"}
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
                      {event.title}
                    </h2>

                    <div className="mt-3 space-y-1 text-sm font-bold text-[#9a7a4a]">
                      <p>
                        🕐 {event.start_time || "-"} – {event.end_time || "-"}
                      </p>
                      <p>📍 {event.location || "-"}</p>
                      <p>
                        {event.is_paid
                          ? `₹${event.price_amount}`
                          : "Free Event"}
                      </p>
                    </div>

                    <div className="mt-5 flex gap-2 border-t border-[#ede0c8] pt-4">
                      <Link
                        to={`/events/${event.uuid}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1a0a00] px-3 py-2 text-sm font-black text-[#d4a853]"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-xl border border-[#ede0c8] bg-white px-4 py-2 font-black text-[#5c3d1a] disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="font-black text-[#8b6914]">
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-xl border border-[#ede0c8] bg-white px-4 py-2 font-black text-[#5c3d1a] disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}