import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { getAdminContent } from "../../services/adminService";
import { AdminBadge, AdminHeader, AdminLoading } from "./AdminShared";

export default function AdminContentPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminContent().then((res) => setItems(res.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminHeader title="Content" text="Manage journals, newsletters and articles." />
      {loading ? <AdminLoading /> : (
        <div className="grid gap-5">
          {items.map((post) => (
            <div key={post.uuid} className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <AdminBadge text={post.status} />
                      <AdminBadge text={post.type} type="yellow" />
                      <AdminBadge text={post.access_type} type="green" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900">{post.title}</h2>
                    <p className="mt-2 line-clamp-2 text-sm font-semibold text-slate-500">
                      {post.excerpt || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/content/${post.uuid}`} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                    View
                  </Link>
                  <Link to={`/content/${post.uuid}/edit`} className="rounded-full bg-orange-600 px-4 py-2 text-sm font-bold text-white">
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}