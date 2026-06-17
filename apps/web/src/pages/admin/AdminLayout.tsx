// src/pages/admin/AdminLayout.tsx

import { Link, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  MapPin,
  GraduationCap,
  FileText,
  CreditCard,
  Crown,
  HeartHandshake,
  UserCheck,
} from "lucide-react";
import { MdTempleBuddhist } from "react-icons/md";

const links = [
  { to: "/meta-idx", label: "Dashboard", icon: LayoutDashboard },
  { to: "/meta-idx/users", label: "Users", icon: Users },
  { to: "/meta-idx/devotee-requests", label: "Devotee Requests", icon: UserCheck },
  { to: "/meta-idx/events", label: "Events", icon: CalendarDays },
  { to: "/meta-idx/trips", label: "Trips", icon: MapPin },
  { to: "/meta-idx/courses", label: "Courses", icon: GraduationCap },
  { to: "/meta-idx/content", label: "Content", icon: FileText },
  { to: "/meta-idx/payments", label: "Payments", icon: CreditCard },
  { to: "/meta-idx/subscriptions", label: "Subscriptions", icon: Crown },
  { to: "/meta-idx/donations", label: "Donations", icon: HeartHandshake },
  { to: "/meta-idx/centres", label: "Centres", icon: MdTempleBuddhist },
];

export default function AdminLayout() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50">
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[2rem] border border-orange-100 bg-white p-4 shadow-sm lg:sticky lg:top-24">
          <div className="mb-5 rounded-3xl bg-gradient-to-r from-orange-600 to-amber-500 p-5 text-white">
            <p className="text-xs font-black uppercase tracking-widest text-orange-100">
              Admin Portal
            </p>
            <h1 className="mt-2 text-2xl font-black">ISKCON Admin</h1>
          </div>

          <nav className="space-y-2">
            {links.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-orange-50 hover:text-orange-700"
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <section>
          <Outlet />
        </section>
      </section>
    </main>
  );
}