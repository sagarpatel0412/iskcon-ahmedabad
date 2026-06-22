import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Users,
  Loader2,
  Search,
} from "lucide-react";
import { getTrips } from "../../services/tripService";
import PageSeo from "../../components/seo/PageSeo";

type Trip = {
  uuid: string;
  title: string;
  description?: string | null;
  cover_image_url?: string | null;
  start_date: string;
  end_date: string;
  destination: string;
  departure_city?: string | null;
  price_amount: number;
  currency: string;
  is_paid: boolean;
  max_capacity?: number | null;
};

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const loadTrips = async () => {
    try {
      setPageLoading(true);

      const res = await getTrips({
        page,
        limit: 9,
        search,
      });

      setTrips(res.data.items || []);
      setPagination(res.data.pagination || null);
    } catch (error) {
      console.error(error);
      alert("Failed to load trips");
    } finally {
      setLoading(false);
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadTrips();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatPrice = (trip: Trip) => {
    if (!trip.is_paid || Number(trip.price_amount) <= 0) return "Free";
    return `${trip.currency === "INR" ? "₹" : trip.currency}${trip.price_amount}`;
  };

  const imageUrl = (url?: string | null) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://localhost:3000${url}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-orange-50">
        <div className="flex items-center gap-3 text-orange-700">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="font-bold">Loading trips...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageSeo
        title="Explore Trips | ISKCON Ahmedabad"
        description="Explore Trips"
      />

      <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50 px-4 py-10">
        <section className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-700">
              <MapPin className="h-8 w-8" />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">
              Spiritual Trips & Yatras
            </h1>

            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              Join organized devotional trips with stay details, daily
              itinerary, prasadam information, and places to visit.
            </p>
          </div>

          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-orange-100 bg-white p-4 shadow-sm">
            <div className="flex min-w-[260px] flex-1 items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 px-4 py-3">
              <Search className="h-5 w-5 text-orange-600" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title, destination, city..."
                className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            {pagination && (
              <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">
                {pagination.total} trips found
              </span>
            )}
          </div>

          {pageLoading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-3xl border border-orange-100 bg-white">
              <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
          ) : trips.length === 0 ? (
            <div className="rounded-3xl border border-orange-100 bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-bold text-slate-800">
                No trips available
              </h2>
              <p className="mt-2 text-slate-500">
                Upcoming yatras will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trips.map((trip) => (
                  <Link
                    key={trip.uuid}
                    to={`/trips/${trip.uuid}`}
                    className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="h-48 bg-orange-100">
                      {trip.cover_image_url ? (
                        <img
                          src={imageUrl(trip.cover_image_url)}
                          alt={trip.title}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-orange-600">
                          <MapPin className="h-12 w-12" />
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="mb-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                          {trip.destination}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            trip.is_paid
                              ? "bg-amber-100 text-amber-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {formatPrice(trip)}
                        </span>
                      </div>

                      <h2 className="text-xl font-extrabold text-slate-900">
                        {trip.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {trip.description ||
                          "A devotional yatra organized for seekers and devotees."}
                      </p>

                      <div className="mt-5 space-y-3 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-orange-600" />
                          {formatDate(trip.start_date)} -{" "}
                          {formatDate(trip.end_date)}
                        </div>

                        {trip.departure_city && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-orange-600" />
                            From {trip.departure_city}
                          </div>
                        )}

                        {trip.max_capacity && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-orange-600" />
                            Capacity: {trip.max_capacity}
                          </div>
                        )}
                      </div>

                      <button className="mt-6 w-full rounded-full bg-orange-600 px-5 py-3 font-bold text-white transition group-hover:bg-orange-700">
                        View Details
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded-xl border border-orange-100 bg-white px-4 py-2 font-bold text-orange-700 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  <span className="font-bold text-orange-700">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <button
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-xl border border-orange-100 bg-white px-4 py-2 font-bold text-orange-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}