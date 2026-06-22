import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import TripForm from "./TripForm";
import {
  getTripByUuid,
  updateTrip,
  uploadTripCoverImage,
} from "../../services/tripService";

export default function EditTripPage() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTrip();
  }, [uuid]);

  const loadTrip = async () => {
    try {
      const res = await getTripByUuid(uuid!);
      const trip = res.data;

      setForm({
        ...trip,
        coverFile: null,
        days: trip.days || [],
        stays: trip.stays || [],
      });
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load trip");
    } finally {
      setLoading(false);
    }
  };

  const cleanDays = (days: any[] = []) => {
    return days.map((day) => ({
      day_number: Number(day.day_number),
      title: day.title || "",
      description: day.description || "",
      date: day.date || "",
      breakfast_info: day.breakfast_info || "",
      lunch_info: day.lunch_info || "",
      dinner_info: day.dinner_info || "",
      places: (day.places || []).map((place: any) => ({
        place_name: place.place_name || "",
        description: place.description || "",
        visit_time: place.visit_time || "",
        location_url: place.location_url || "",
        image_url: place.image_url || "",
        sort_order: Number(place.sort_order || 1),
      })),
    }));
  };

  const cleanStays = (stays: any[] = []) => {
    return stays.map((stay) => ({
      stay_name: stay.stay_name || "",
      stay_type: stay.stay_type || "other",
      address: stay.address || "",
      check_in_date: stay.check_in_date || "",
      check_out_date: stay.check_out_date || "",
      contact_phone: stay.contact_phone || "",
      location_url: stay.location_url || "",
      notes: stay.notes || "",
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const payload = {
        title: form.title,
        description: form.description || "",
        cover_image_url: form.cover_image_url || "",
        centre_id: form.centre_id ? Number(form.centre_id) : undefined,
        start_date: form.start_date,
        end_date: form.end_date,
        departure_city: form.departure_city || "",
        destination: form.destination,
        meeting_point: form.meeting_point || "",
        meeting_time: form.meeting_time || "",
        price_amount: Number(form.price_amount || 0),
        currency: form.currency || "INR",
        is_paid: !!form.is_paid,
        max_capacity: form.max_capacity ? Number(form.max_capacity) : undefined,
        registration_start_date: form.registration_start_date || undefined,
        registration_end_date: form.registration_end_date || undefined,
        includes: form.includes || "",
        excludes: form.excludes || "",
        rules: form.rules || "",
        contact_name: form.contact_name || "",
        contact_phone: form.contact_phone || "",
        status: form.status || "draft",
        days: cleanDays(form.days),
        stays: cleanStays(form.stays),
      };

      await updateTrip(uuid!, payload);

      if (form.coverFile) {
        await uploadTripCoverImage(uuid!, form.coverFile);
      }

      alert("Trip updated successfully 🙏");
      navigate(`/trips/${uuid}`);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to update trip");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50 text-orange-700">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        Loading trip...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50 px-4 py-10">
      <section className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-extrabold text-slate-900">
          Edit Trip / Yatra
        </h1>

        <TripForm
          form={form}
          setForm={setForm}
          saving={saving}
          submitLabel="Update Trip"
          onSubmit={handleSubmit}
        />
      </section>
    </main>
  );
}
