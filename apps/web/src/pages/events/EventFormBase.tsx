import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadEventPoster } from "../../services/eventService";
import { posterUrl } from "./eventStyles";

type Props = {
  mode: "create" | "edit";
  initialEvent?: any;
  onSubmit: (payload: any) => Promise<any>;
};

export default function EventFormBase({ mode, initialEvent, onSubmit }: Props) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    centre_id: 1,
    title: "",
    description: "",
    poster_url: "",
    location: "",
    event_date: "",
    start_time: "",
    end_time: "",
    registration_start_at: "",
    registration_end_at: "",
    max_capacity: "",
    is_paid: false,
    price_amount: "",
    currency: "INR",
    status: "draft",
  });

  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!initialEvent) return;

    setForm({
      centre_id: initialEvent.centre_id || 1,
      title: initialEvent.title || "",
      description: initialEvent.description || "",
      poster_url: initialEvent.poster_url || "",
      location: initialEvent.location || "",
      event_date: initialEvent.event_date || "",
      start_time: initialEvent.start_time || "",
      end_time: initialEvent.end_time || "",
      registration_start_at: initialEvent.registration_start_at?.slice(0, 16) || "",
      registration_end_at: initialEvent.registration_end_at?.slice(0, 16) || "",
      max_capacity: initialEvent.max_capacity ? String(initialEvent.max_capacity) : "",
      is_paid: Boolean(initialEvent.is_paid),
      price_amount: initialEvent.price_amount ? String(initialEvent.price_amount) : "",
      currency: initialEvent.currency || "INR",
      status: initialEvent.status || "draft",
    });
  }, [initialEvent]);

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = async (status?: string) => {
    try {
      setSaving(true);

      const payload = {
        ...form,
        status: status || form.status,
        centre_id: Number(form.centre_id),
        max_capacity: form.max_capacity ? Number(form.max_capacity) : null,
        price_amount: form.is_paid ? Number(form.price_amount || 0) : 0,
        registration_start_at: form.registration_start_at || null,
        registration_end_at: form.registration_end_at || null,
      };

      const res = await onSubmit(payload);
      const event = res.data?.event || res.data;

      if (file && event?.uuid) {
        await uploadEventPoster(event.uuid, file);
      }

      navigate(`/events/${event.uuid}/form`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0e8d8] p-5">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
            {mode === "create" ? "Create New Event" : "Edit Event"}
          </h1>
          <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
            Fill event details, poster, timing and payment settings.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => save("draft")}
            disabled={saving}
            className="rounded-xl border border-[#ede0c8] bg-white px-5 py-3 text-sm font-black text-[#5c3d1a]"
          >
            Save Draft
          </button>
          <button
            onClick={() => save("published")}
            disabled={saving}
            className="rounded-xl bg-[#c8902a] px-5 py-3 text-sm font-black text-[#1a0a00]"
          >
            {saving ? "Saving..." : mode === "create" ? "Publish Event" : "Update Event"}
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Card title="Basic Information">
            <Input label="Event Title *" value={form.title} onChange={(v:any) => update("title", v)} />
            <Textarea label="Description" value={form.description} onChange={(v:any) => update("description", v)} />

            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Event Date *" type="date" value={form.event_date} onChange={(v:any) => update("event_date", v)} />
              <Input label="Location" value={form.location} onChange={(v:any) => update("location", v)} />
              <Input label="Start Time" type="time" value={form.start_time} onChange={(v:any) => update("start_time", v)} />
              <Input label="End Time" type="time" value={form.end_time} onChange={(v:any) => update("end_time", v)} />
            </div>
          </Card>

          <Card title="Registration Window">
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Registration Opens" type="datetime-local" value={form.registration_start_at} onChange={(v:any) => update("registration_start_at", v)} />
              <Input label="Registration Closes" type="datetime-local" value={form.registration_end_at} onChange={(v:any) => update("registration_end_at", v)} />
              <Input label="Max Capacity" type="number" value={form.max_capacity} onChange={(v:any) => update("max_capacity", v)} />

              <label>
                <span className="text-sm font-black text-[#5c3d1a]">Status</span>
                <select
                  value={form.status}
                  onChange={(e) => update("status", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#ede0c8] px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                  <option value="cancelled">cancelled</option>
                  <option value="completed">completed</option>
                </select>
              </label>
            </div>
          </Card>

          <Card title="Payment Settings">
            <label className="flex items-center justify-between rounded-xl bg-[#f7f0e4] p-4">
              <div>
                <p className="font-black text-[#1a0a00]">Paid Event</p>
                <p className="text-xs font-bold text-[#9a7a4a]">
                  Enable payment for registration.
                </p>
              </div>

              <input
                type="checkbox"
                checked={form.is_paid}
                onChange={(e) => update("is_paid", e.target.checked)}
                className="h-5 w-5"
              />
            </label>

            {form.is_paid && (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Input label="Price Amount" type="number" value={form.price_amount} onChange={(v:any) => update("price_amount", v)} />
                <Input label="Currency" value={form.currency} onChange={(v:any) => update("currency", v)} />
              </div>
            )}
          </Card>
        </div>

        <aside className="space-y-5">
          <Card title="Event Poster">
            <div className="rounded-xl border-2 border-dashed border-[#ede0c8] bg-[#f7f0e4] p-6 text-center">
              <div className="text-4xl">🖼️</div>
              <p className="mt-2 font-black text-[#5c3d1a]">Upload Poster</p>
              <p className="mt-1 text-xs font-bold text-[#9a7a4a]">
                JPG, PNG, WEBP up to 5MB
              </p>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-4 w-full text-sm"
              />
            </div>

            {(file || form.poster_url) && (
              <img
                src={file ? URL.createObjectURL(file) : posterUrl(form.poster_url)}
                className="mt-4 h-56 w-full rounded-xl object-cover"
              />
            )}
          </Card>

          <Card title="Preview">
            <div className="rounded-xl bg-gradient-to-br from-[#1a0a00] to-[#3d2200] p-6 text-center">
              <p className="text-xs font-black tracking-[0.2em] text-[#d4a853]">
                ISKCON AHMEDABAD
              </p>
              <h3 className="mt-2 font-serif text-2xl font-black text-white">
                {form.title || "Event Title"}
              </h3>
              <p className="mt-2 text-sm font-bold text-[#d4a853]">
                {form.event_date || "Date"} · {form.start_time || "Time"} ·{" "}
                {form.is_paid ? `₹${form.price_amount || 0}` : "Free"}
              </p>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-[#ede0c8] bg-white p-5">
      <h2 className="mb-4 border-b border-[#ede0c8] pb-3 font-serif text-2xl font-black text-[#1a0a00]">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <label className="block">
      <span className="text-sm font-black text-[#5c3d1a]">{label}</span>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-[#ede0c8] px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <label className="block">
      <span className="text-sm font-black text-[#5c3d1a]">{label}</span>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 min-h-28 w-full rounded-xl border border-[#ede0c8] px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}