import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import CourseForm from "./CourseForm";
import { getCourseByUuid, updateCourse } from "../../services/courseService";

export default function EditCoursePage() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [uuid]);

  const loadCourse = async () => {
    try {
      const res = await getCourseByUuid(uuid!);
      const course = res.data;

      setForm({
        ...course,
        centre_id: course.centre_id ? String(course.centre_id) : "",
        max_capacity: course.max_capacity ? String(course.max_capacity) : "",
        price_amount: course.price_amount ? String(course.price_amount) : "",
        sessions: course.sessions || [],
      });
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      await updateCourse(uuid!, {
        ...form,
        centre_id: form.centre_id ? Number(form.centre_id) : undefined,
        max_capacity: form.max_capacity ? Number(form.max_capacity) : undefined,
        price_amount: Number(form.price_amount || 0),
      });

      alert("Course updated successfully 🙏");
      navigate(`/courses/${uuid}`);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 text-orange-700">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Loading course...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50 px-4 py-10">
      <section className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-extrabold text-slate-900">
          Edit Course
        </h1>

        <CourseForm
          form={form}
          setForm={setForm}
          saving={saving}
          submitLabel="Update Course"
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  );
}