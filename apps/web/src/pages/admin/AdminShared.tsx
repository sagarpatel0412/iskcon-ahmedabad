// src/pages/admin/AdminShared.tsx

import { Loader2 } from "lucide-react";

export function AdminHeader({ title, text }: any) {
  return (
    <div className="mb-6 rounded-[2rem] bg-gradient-to-r from-orange-600 to-amber-500 p-8 text-white shadow-sm">
      <p className="text-sm font-black uppercase tracking-widest text-orange-100">
        Admin
      </p>
      <h1 className="mt-2 text-4xl font-black">{title}</h1>
      <p className="mt-3 font-semibold text-orange-50">{text}</p>
    </div>
  );
}

export function AdminLoading() {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-[2rem] bg-white">
      <Loader2 className="mr-2 h-6 w-6 animate-spin text-orange-700" />
      <span className="font-bold text-orange-700">Loading...</span>
    </div>
  );
}

export function AdminBadge({ text, type = "orange" }: any) {
  const styles: any = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    yellow: "bg-yellow-100 text-yellow-800",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${styles[type]}`}>
      {text || "-"}
    </span>
  );
}