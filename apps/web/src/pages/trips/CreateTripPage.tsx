import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TripForm from "./TripForm";
import { createTrip, uploadTripCoverImage } from "../../services/tripService";

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

      const { coverFile, ...tripPayload } = form;

      const res = await createTrip({
        ...tripPayload,
        centre_id: tripPayload.centre_id
          ? Number(tripPayload.centre_id)
          : undefined,
        max_capacity: tripPayload.max_capacity
          ? Number(tripPayload.max_capacity)
          : undefined,
        price_amount: Number(tripPayload.price_amount || 0),
        cover_image_url: undefined,
      });

      const trip = res.data.trip;

      if (coverFile && trip?.uuid) {
        await uploadTripCoverImage(trip.uuid, coverFile);
      }

      alert("Trip created successfully 🙏");
      navigate(`/trips/${trip.uuid}`);
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
