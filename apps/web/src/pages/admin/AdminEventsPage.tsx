import { useEffect, useState } from "react";
import { CalendarDays, Trash2 } from "lucide-react";
import {
  deleteAdminEvent,
  getAdminEvents,
  updateAdminEventStatus,
} from "../../services/adminService";
import { AdminBadge, AdminHeader, AdminLoading } from "./AdminShared";

export default function AdminEventsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await getAdminEvents();
      setItems(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (event: any, status: string) => {
    try {
      setUpdatingId(event.uuid);
      await updateAdminEventStatus(event.uuid, status);
      await loadEvents();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (event: any) => {
    const ok = window.confirm(
      `Are you sure you want to delete "${event.title}"?`
    );

    if (!ok) return;

    try {
      setUpdatingId(event.uuid);
      await deleteAdminEvent(event.uuid);
      await loadEvents();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <AdminHeader title="Events" text="View and manage all temple events." />

      {loading ? (
        <AdminLoading />
      ) : (
        <div className="grid gap-5">
          {items.map((event) => (
            <div
              key={event.uuid || event.id}
              className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                    <CalendarDays className="h-6 w-6" />
                  </div>

                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <AdminBadge text={event.status || "event"} />
                      <AdminBadge
                        text={event.is_paid ? "Paid" : "Free"}
                        type={event.is_paid ? "yellow" : "green"}
                      />
                    </div>

                    <h2 className="text-xl font-black text-slate-900">
                      {event.title}
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      {event.location || "-"} •{" "}
                      {event.event_date || event.date || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={event.status || "draft"}
                    disabled={updatingId === event.uuid}
                    onChange={(e) =>
                      handleStatusChange(event, e.target.value)
                    }
                    className="rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-700 outline-none focus:border-orange-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>

                  <button
                    onClick={() => handleDelete(event)}
                    disabled={updatingId === event.uuid}
                    className="rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 disabled:opacity-60"
                  >
                    <Trash2 className="mr-1 inline h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="rounded-[2rem] bg-white p-10 text-center font-bold text-slate-500">
              No events found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}