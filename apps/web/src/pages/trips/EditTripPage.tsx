import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import TripForm from "./TripForm";
import { getTripByUuid, updateTrip } from "../../services/tripService";

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
        days: trip.days || [],
        stays: trip.stays || [],
      });
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to load trip");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      await updateTrip(uuid!, {
        ...form,
        centre_id: form.centre_id ? Number(form.centre_id) : undefined,
        max_capacity: form.max_capacity ? Number(form.max_capacity) : undefined,
        price_amount: Number(form.price_amount || 0),
      });

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