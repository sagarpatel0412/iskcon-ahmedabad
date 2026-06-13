import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TripForm from "./TripForm";
import { createTrip } from "../../services/tripService";

const emptyForm = {
  title: "",
  description: "",
  cover_image_url: "",
  centre_id: "",
  start_date: "",
  end_date: "",
  departure_city: "",
  destination: "",
  meeting_point: "",
  meeting_time: "",
  price_amount: 0,
  currency: "INR",
  is_paid: false,
  max_capacity: "",
  registration_start_date: "",
  registration_end_date: "",
  includes: "",
  excludes: "",
  rules: "",
  contact_name: "",
  contact_phone: "",
  status: "draft",
  days: [],
  stays: [],
};

export default function CreateTripPage() {
  const [form, setForm] = useState<any>(emptyForm);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const res = await createTrip({
        ...form,
        centre_id: form.centre_id ? Number(form.centre_id) : undefined,
        max_capacity: form.max_capacity ? Number(form.max_capacity) : undefined,
        price_amount: Number(form.price_amount || 0),
      });

      alert("Trip created successfully 🙏");
      navigate(`/trips/${res.data.trip.uuid}`);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to create trip");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50 px-4 py-10">
      <section className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-extrabold text-slate-900">
          Create Trip / Yatra
        </h1>

        <TripForm
          form={form}
          setForm={setForm}
          saving={saving}
          submitLabel="Create Trip"
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  );
}