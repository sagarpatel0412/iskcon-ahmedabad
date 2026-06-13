import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import {
  deleteAdminTrip,
  getAdminTrips,
  updateAdminTripStatus,
} from "../../services/adminService";
import { AdminBadge, AdminHeader, AdminLoading } from "./AdminShared";

export default function AdminTripsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminTrips()
      .then((res) => setItems(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (trip: any, status: string) => {
    await updateAdminTripStatus(trip.uuid, status);
    getAdminTrips()
      .then((res) => setItems(res.data || []))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (trip: any) => {
    const ok = window.confirm(`Delete "${trip.title}" ?`);

    if (!ok) return;

    await deleteAdminTrip(trip.uuid);
    getAdminTrips()
      .then((res) => setItems(res.data || []))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <AdminHeader
        title="Trips / Yatras"
        text="View all created yatras and trips."
      />
      {loading ? (
        <AdminLoading />
      ) : (
        <div className="grid gap-5">
          {items.map((trip) => (
            <div
              key={trip.uuid}
              className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <AdminBadge text={trip.status} />
                      <AdminBadge
                        text={trip.is_paid ? "Paid" : "Free"}
                        type={trip.is_paid ? "yellow" : "green"}
                      />
                    </div>
                    <h2 className="text-xl font-black text-slate-900">
                      {trip.title}
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      {trip.destination} • {trip.start_date} to {trip.end_date}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={trip.status || "draft"}
                      onChange={(e) => handleStatusChange(trip, e.target.value)}
                      className="rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>

                    <button
                      onClick={() => handleDelete(trip)}
                      className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
