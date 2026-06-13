import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Eye,
  UsersRound,
} from "lucide-react";

import { getMyCreatedCourses } from "../../services/courseService";
import AppLoader from "../../components/common/AppLoader";

export default function CourseRegistrationManagePage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getMyCreatedCourses();
      setCourses(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLoader
        title="Loading Courses"
        subtitle="Fetching your courses..."
      />
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-5xl font-black text-[#1a0a00]">
          Course Registrations
        </h1>

        <p className="mt-2 font-bold text-[#9a7a4a]">
          View registrations for your courses.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {courses.map((course) => (
          <div
            key={course.uuid}
            className="rounded-[2rem] border border-[#ede0c8] bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <BookOpen className="h-10 w-10 text-[#c8902a]" />

              <span className="rounded-full bg-[#f5e8c8] px-3 py-1 text-xs font-black text-[#8b6914]">
                {course.status}
              </span>
            </div>

            <h2 className="mt-5 font-serif text-3xl font-black text-[#1a0a00]">
              {course.title}
            </h2>

            <p className="mt-3 text-sm font-bold text-[#5c3d1a]">
              {course.description}
            </p>

            <Link
              to={`/courses/${course.uuid}/registrations`}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#c8902a] px-5 py-3 font-black text-[#1a0a00]"
            >
              <Eye className="h-5 w-5" />
              View Registrations
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}