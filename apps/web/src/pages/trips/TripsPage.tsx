import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Users, Crown, Loader2 } from "lucide-react";
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

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const res = await getTrips();
      setTrips(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

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
        title="Explore Trips| ISKCON Ahmedabad"
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

          {trips.length === 0 ? (
            <div className="rounded-3xl border border-orange-100 bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-bold text-slate-800">
                No trips available
              </h2>
              <p className="mt-2 text-slate-500">
                Upcoming yatras will appear here.
              </p>
            </div>
          ) : (
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
                        src={trip.cover_image_url}
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
          )}
        </section>
      </main>
    </>
  );
}
