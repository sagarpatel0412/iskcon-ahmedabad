import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, MapPin, Route, UsersRound } from "lucide-react";
import { getMyCreatedTrips } from "../../services/tripService";
import AppLoader from "../../components/common/AppLoader";

export default function TripRegistrationManagePage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getMyCreatedTrips();
      setTrips(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLoader
        title="Loading Trips"
        subtitle="Fetching your created yatras..."
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mb-6 rounded-2xl bg-[#1a0a00] px-5 py-3 text-center text-xs font-black tracking-[0.25em] text-[#d4a853]">
        ॐ नमो भगवते वासुदेवाय · Trip Registrations
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-5xl font-black text-[#1a0a00]">
          Trip Registration Management
        </h1>
        <p className="mt-2 font-bold text-[#9a7a4a]">
          Select a yatra to view registered devotees and seekers.
        </p>
      </div>

      {trips.length === 0 ? (
        <div className="rounded-[2rem] border border-[#ede0c8] bg-white p-10 text-center">
          <UsersRound className="mx-auto h-14 w-14 text-[#c8902a]" />
          <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
            No trips created yet
          </h2>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {trips.map((trip) => (
            <div
              key={trip.uuid}
              className="overflow-hidden rounded-[2rem] border border-[#ede0c8] bg-white shadow-sm"
            >
              {trip.cover_image_url ? (
                <img
                  src={trip.cover_image_url}
                  className="h-52 w-full object-cover"
                />
              ) : (
                <div className="flex h-52 items-center justify-center bg-[#1a0a00] text-[#d4a853]">
                  <Route className="h-14 w-14" />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="rounded-full bg-[#f5e8c8] px-3 py-1 text-xs font-black uppercase text-[#8b6914]">
                      {trip.status}
                    </span>

                    <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
                      {trip.title}
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1a0a00] text-[#d4a853]">
                    <Route />
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-sm font-bold text-[#5c3d1a]">
                  <p>📅 {formatDate(trip.start_date)} - {formatDate(trip.end_date)}</p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {trip.destination || "-"}
                  </p>
                  <p>🚩 Departure: {trip.departure_city || "-"}</p>
                  <p>👥 Capacity: {trip.max_capacity || "Unlimited"}</p>
                  <p>🎟 {trip.is_paid ? `₹${trip.price_amount}` : "Free Trip"}</p>
                </div>

                <Link
                  to={`/trips/${trip.uuid}/registrations`}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c8902a] px-5 py-3 font-black text-[#1a0a00] hover:bg-[#d4a853]"
                >
                  <Eye className="h-5 w-5" />
                  View Registrations
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}