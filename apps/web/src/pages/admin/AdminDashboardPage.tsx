// src/pages/admin/AdminDashboardPage.tsx

import { useEffect, useState } from "react";
import {
  CalendarDays,
  Crown,
  CreditCard,
  FileText,
  GraduationCap,
  HeartHandshake,
  Loader2,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  getAdminUsers,
  getDevoteeRequests,
  getAdminEvents,
  getAdminTrips,
  getAdminCourses,
  getAdminContent,
  getAdminContentPayments,
  getAdminTripPayments,
  getAdminCoursePayments,
  getAdminSubscriptions,
  getAdminDonations,
} from "../../services/adminService";
import { AdminHeader } from "./AdminShared";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<any>({
    users: 0,
    pendingDevoteeRequests: 0,
    events: 0,
    trips: 0,
    courses: 0,
    content: 0,
    payments: 0,
    subscriptions: 0,
    donations: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        usersRes,
        requestsRes,
        eventsRes,
        tripsRes,
        coursesRes,
        contentRes,
        contentPaymentsRes,
        tripPaymentsRes,
        coursePaymentsRes,
        subscriptionsRes,
        donationsRes,
      ] = await Promise.all([
        getAdminUsers(),
        getDevoteeRequests({ status: "pending" }),
        getAdminEvents(),
        getAdminTrips(),
        getAdminCourses(),
        getAdminContent(),
        getAdminContentPayments(),
        getAdminTripPayments(),
        getAdminCoursePayments(),
        getAdminSubscriptions(),
        getAdminDonations(),
      ]);

      setCounts({
        users: usersRes.data?.length || 0,
        pendingDevoteeRequests: requestsRes.data?.length || 0,
        events: eventsRes.data?.length || 0,
        trips: tripsRes.data?.length || 0,
        courses: coursesRes.data?.length || 0,
        content: contentRes.data?.length || 0,
        payments:
          (contentPaymentsRes.data?.length || 0) +
          (tripPaymentsRes.data?.length || 0) +
          (coursePaymentsRes.data?.length || 0),
        subscriptions: subscriptionsRes.data?.length || 0,
        donations: donationsRes.data?.length || 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { label: "Users", value: counts.users, icon: Users },
    {
      label: "Pending Devotee Requests",
      value: counts.pendingDevoteeRequests,
      icon: ShieldCheck,
    },
    { label: "Events", value: counts.events, icon: CalendarDays },
    { label: "Trips / Yatras", value: counts.trips, icon: MapPin },
    { label: "Courses", value: counts.courses, icon: GraduationCap },
    { label: "Content Posts", value: counts.content, icon: FileText },
    { label: "Payments", value: counts.payments, icon: CreditCard },
    { label: "Subscriptions", value: counts.subscriptions, icon: Crown },
    { label: "Donations", value: counts.donations, icon: HeartHandshake },
  ];

  return (
    <div>
      <AdminHeader
        title="Admin Dashboard"
        text="Monitor users, devotee requests, payments, courses, trips and content."
      />

      {loading ? (
        <div className="flex min-h-[350px] items-center justify-center rounded-[2rem] bg-white">
          <Loader2 className="mr-2 h-6 w-6 animate-spin text-orange-700" />
          <span className="font-bold text-orange-700">
            Loading admin dashboard...
          </span>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm"
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <Icon className="h-7 w-7" />
                </div>

                <p className="text-sm font-black uppercase tracking-wide text-slate-400">
                  {card.label}
                </p>

                <h2 className="mt-2 text-4xl font-black text-slate-900">
                  {card.value}
                </h2>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}