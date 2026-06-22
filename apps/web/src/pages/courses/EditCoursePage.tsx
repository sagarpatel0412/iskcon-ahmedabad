import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import CourseForm from "./CourseForm";
import {
  getCourseByUuid,
  updateCourse,
  uploadCourseCoverImage,
} from "../../services/courseService";

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
        coverFile: null,
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

  const cleanSessions = (sessions: any[] = []) => {
    return sessions.map((session) => ({
      session_number: Number(session.session_number),
      title: session.title || "",
      description: session.description || "",
      session_date: session.session_date || "",
      start_time: session.start_time || "",
      end_time: session.end_time || "",
      venue_name: session.venue_name || "",
      venue_address: session.venue_address || "",
      online_meeting_url: session.online_meeting_url || "",
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const { coverFile, centre, creator, sessions, ...rest } = form;

      const payload = {
        title: rest.title,
        description: rest.description || "",
        cover_image_url: rest.cover_image_url || "",
        course_mode: rest.course_mode || "offline",
        venue_name: rest.venue_name || "",
        venue_address: rest.venue_address || "",
        online_meeting_url: rest.online_meeting_url || "",
        start_date: rest.start_date,
        end_date: rest.end_date,
        start_time: rest.start_time || "",
        end_time: rest.end_time || "",
        max_capacity: rest.max_capacity ? Number(rest.max_capacity) : undefined,
        is_paid: !!rest.is_paid,
        price_amount: Number(rest.price_amount || 0),
        currency: rest.currency || "INR",
        registration_start_date: rest.registration_start_date || undefined,
        registration_end_date: rest.registration_end_date || undefined,
        what_you_will_learn: rest.what_you_will_learn || "",
        requirements: rest.requirements || "",
        rules: rest.rules || "",
        contact_name: rest.contact_name || "",
        contact_phone: rest.contact_phone || "",
        status: rest.status || "draft",
        centre_id: rest.centre_id ? Number(rest.centre_id) : undefined,
        sessions: cleanSessions(sessions),
      };

      await updateCourse(uuid!, payload);

      if (coverFile) {
        await uploadCourseCoverImage(uuid!, coverFile);
      }

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
