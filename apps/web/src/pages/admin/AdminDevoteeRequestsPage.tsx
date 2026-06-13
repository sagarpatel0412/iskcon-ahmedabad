// src/pages/admin/AdminDevoteeRequestsPage.tsx

import { useEffect, useState } from "react";
import {
  getDevoteeRequests,
  reviewDevoteeRequest,
} from "../../services/adminService";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

export default function AdminDevoteeRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    loadRequests();
  }, [status]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await getDevoteeRequests({ status });
      setRequests(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const review = async (uuid: string, reviewStatus: "approved" | "rejected") => {
    const reason =
      reviewStatus === "rejected"
        ? window.prompt("Reason for rejection?")
        : "";

    await reviewDevoteeRequest(uuid, {
      status: reviewStatus,
      reason,
    });

    loadRequests();
  };

  return (
    <div>
      <Header
        title="Devotee Requests"
        text="Approve or reject devotee verification requests."
      />

      <div className="mb-6 rounded-3xl border border-orange-100 bg-white p-4 shadow-sm">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-2xl border border-orange-100 px-4 py-3 font-bold outline-none"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="grid gap-5">
          {requests.map((request) => (
            <div
              key={request.uuid}
              className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-5 md:flex-row md:justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge text={request.status} type="orange" />
                    <Badge
                      text={request.initiation_status}
                      type="yellow"
                    />
                    <Badge
                      text={`${request.current_malas || 0} malas`}
                      type="green"
                    />
                  </div>

                  <h2 className="text-xl font-black text-slate-900">
                    {request.user?.first_name} {request.user?.last_name}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {request.user?.email || "-"} • {request.user?.phone || "-"}
                  </p>

                  <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                    <Detail label="Spiritual Name" value={request.spiritual_name} />
                    <Detail label="Years Associated" value={request.years_associated} />
                    <Detail label="Reference Name" value={request.devotee_reference_name} />
                    <Detail label="Reference Phone" value={request.devotee_reference_phone} />
                    <Detail label="Services" value={request.services} />
                    <Detail label="Reason" value={request.reason} />
                  </div>
                </div>

                {request.status === "pending" && (
                  <div className="flex min-w-[180px] flex-col gap-2">
                    <button
                      onClick={() => review(request.uuid, "approved")}
                      className="rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white"
                    >
                      <CheckCircle className="mr-1 inline h-4 w-4" />
                      Approve
                    </button>

                    <button
                      onClick={() => review(request.uuid, "rejected")}
                      className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white"
                    >
                      <XCircle className="mr-1 inline h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {requests.length === 0 && (
            <div className="rounded-[2rem] bg-white p-10 text-center font-bold text-slate-500">
              No requests found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Header({ title, text }: any) {
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

function Loading() {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-[2rem] bg-white">
      <Loader2 className="mr-2 h-6 w-6 animate-spin text-orange-700" />
      <span className="font-bold text-orange-700">Loading...</span>
    </div>
  );
}

function Badge({ text, type }: any) {
  const styles: any = {
    green: "bg-green-100 text-green-700",
    orange: "bg-orange-100 text-orange-700",
    yellow: "bg-yellow-100 text-yellow-800",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${styles[type]}`}
    >
      {text || "-"}
    </span>
  );
}

function Detail({ label, value }: any) {
  return (
    <div>
      <p className="text-xs font-black uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-700">{value || "-"}</p>
    </div>
  );
}