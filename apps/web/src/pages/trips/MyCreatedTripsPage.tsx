import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Pencil, Users, Loader2 } from "lucide-react";
import { getMyCreatedTrips } from "../../services/tripService";

export default function MyCreatedTripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const res = await getMyCreatedTrips();
      setTrips(res.data || []);
    } catch (error) {
      alert("Failed to load created trips");
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 text-orange-700">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Loading trips...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50 px-4 py-10">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              My Created Trips
            </h1>
            <p className="mt-2 text-slate-500">
              Manage yatras and trip registrations.
            </p>
          </div>

          <Link
            to="/trips/create"
            className="rounded-full bg-orange-600 px-5 py-3 font-bold text-white"
          >
            Create Trip
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="font-bold text-slate-700">No trips created yet.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {trips.map((trip) => (
              <div
                key={trip.uuid}
                className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                        {trip.status}
                      </span>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                        {trip.is_paid ? "Paid" : "Free"}
                      </span>
                    </div>

                    <h2 className="text-xl font-extrabold text-slate-900">
                      {trip.title}
                    </h2>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {trip.destination}
                      </span>

                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                      </span>

                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Capacity: {trip.max_capacity || "Open"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/trips/${trip.uuid}`}
                      className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700"
                    >
                      View
                    </Link>

                    <Link
                      to={`/trips/${trip.uuid}/registrations`}
                      className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-800"
                    >
                      Registrations
                    </Link>

                    <Link
                      to={`/trips/${trip.uuid}/edit`}
                      className="rounded-full bg-orange-600 px-4 py-2 text-sm font-bold text-white"
                    >
                      <Pencil className="mr-1 inline h-4 w-4" />
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}