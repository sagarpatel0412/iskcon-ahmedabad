import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseForm from "./CourseForm";
import { createCourse, uploadCourseCoverImage } from "../../services/courseService";

const emptyForm = {
  title: "",
  description: "",
  cover_image_url: "",
  centre_id: "",
  course_mode: "offline",
  venue_name: "",
  venue_address: "",
  online_meeting_url: "",
  start_date: "",
  end_date: "",
  start_time: "",
  end_time: "",
  max_capacity: "",
  is_paid: false,
  price_amount: "",
  currency: "INR",
  registration_start_date: "",
  registration_end_date: "",
  what_you_will_learn: "",
  requirements: "",
  rules: "",
  contact_name: "",
  contact_phone: "",
  status: "draft",
  sessions: [],
};

export default function CreateCoursePage() {
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const { coverFile, ...coursePayload } = form;

      const res = await createCourse({
        ...coursePayload,
        centre_id: coursePayload.centre_id
          ? Number(coursePayload.centre_id)
          : undefined,
        max_capacity: coursePayload.max_capacity
          ? Number(coursePayload.max_capacity)
          : undefined,
        price_amount: Number(coursePayload.price_amount || 0),
        cover_image_url: undefined,
      });

      const course = res.data.course;

      if (coverFile && course?.uuid) {
        await uploadCourseCoverImage(course.uuid, coverFile);
      }
      navigate(`/courses/${res.data.course.uuid}`);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to create course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50 px-4 py-10">
      <section className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-extrabold text-slate-900">
          Create Course
        </h1>

        <CourseForm
          form={form}
          setForm={setForm}
          saving={saving}
          submitLabel="Create Course"
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  );
}