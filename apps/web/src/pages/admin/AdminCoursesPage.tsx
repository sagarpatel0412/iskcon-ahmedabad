import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import { getAdminCourses } from "../../services/adminService";
import { AdminBadge, AdminHeader, AdminLoading } from "./AdminShared";

export default function AdminCoursesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminCourses().then((res) => setItems(res.data || [])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AdminHeader title="Courses" text="View all spiritual courses." />
      {loading ? <AdminLoading /> : (
        <div className="grid gap-5">
          {items.map((course) => (
            <div key={course.uuid} className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <AdminBadge text={course.status} />
                      <AdminBadge text={course.course_mode} type="yellow" />
                      <AdminBadge text={course.is_paid ? "Paid" : "Free"} type={course.is_paid ? "yellow" : "green"} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900">{course.title}</h2>
                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      {course.start_date} to {course.end_date}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={`/courses/${course.uuid}`} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                    View
                  </Link>
                  <Link to={`/courses/${course.uuid}/registrations`} className="rounded-full bg-orange-600 px-4 py-2 text-sm font-bold text-white">
                    Registrations
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