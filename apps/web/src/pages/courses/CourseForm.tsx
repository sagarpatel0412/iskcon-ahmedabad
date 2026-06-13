import { Plus, Save, Trash2, Loader2 } from "lucide-react";

export default function CourseForm({
  form,
  setForm,
  saving,
  submitLabel,
  onSubmit,
}: any) {
  const update = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const addSession = () => {
    update("sessions", [
      ...(form.sessions || []),
      {
        session_number: (form.sessions?.length || 0) + 1,
        title: "",
        description: "",
        session_date: "",
        start_time: "",
        end_time: "",
        venue_name: "",
        venue_address: "",
        online_meeting_url: "",
      },
    ]);
  };

  const updateSession = (index: number, key: string, value: any) => {
    const sessions = [...(form.sessions || [])];
    sessions[index][key] = value;
    update("sessions", sessions);
  };

  const removeSession = (index: number) => {
    update(
      "sessions",
      form.sessions.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <Card title="Basic Course Details">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Title" value={form.title} onChange={(v:any) => update("title", v)} />
          <Input label="Cover Image URL" value={form.cover_image_url} onChange={(v:any) => update("cover_image_url", v)} />

          <Select
            label="Course Mode"
            value={form.course_mode}
            onChange={(v:any) => update("course_mode", v)}
            options={["offline", "online", "hybrid"]}
          />

          <Select
            label="Status"
            value={form.status}
            onChange={(v:any) => update("status", v)}
            options={["draft", "published", "cancelled", "completed"]}
          />

          <Input type="date" label="Start Date" value={form.start_date} onChange={(v:any) => update("start_date", v)} />
          <Input type="date" label="End Date" value={form.end_date} onChange={(v:any) => update("end_date", v)} />
          <Input type="time" label="Start Time" value={form.start_time} onChange={(v:any) => update("start_time", v)} />
          <Input type="time" label="End Time" value={form.end_time} onChange={(v:any) => update("end_time", v)} />
        </div>

        <Textarea label="Description" value={form.description} onChange={(v:any) => update("description", v)} />
      </Card>

      <Card title="Venue / Online Details">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Venue Name" value={form.venue_name} onChange={(v:any) => update("venue_name", v)} />
          <Input label="Online Meeting URL" value={form.online_meeting_url} onChange={(v:any) => update("online_meeting_url", v)} />
        </div>

        <Textarea label="Venue Address" value={form.venue_address} onChange={(v:any) => update("venue_address", v)} />
      </Card>

      <Card title="Payment & Registration">
        <div className="grid gap-4 md:grid-cols-2">
          <Input type="number" label="Max Capacity" value={form.max_capacity} onChange={(v:any) => update("max_capacity", v)} />
          <Input type="number" label="Price Amount" value={form.price_amount} onChange={(v:any) => update("price_amount", v)} />
          <Input label="Currency" value={form.currency} onChange={(v:any) => update("currency", v)} />
          <Input type="datetime-local" label="Registration Start" value={form.registration_start_date} onChange={(v:any) => update("registration_start_date", v)} />
          <Input type="datetime-local" label="Registration End" value={form.registration_end_date} onChange={(v:any) => update("registration_end_date", v)} />
        </div>

        <label className="mt-4 flex items-center gap-2 font-bold text-slate-700">
          <input
            type="checkbox"
            checked={!!form.is_paid}
            onChange={(e) => update("is_paid", e.target.checked)}
          />
          Paid Course
        </label>
      </Card>

      <Card title="Learning Details">
        <div className="grid gap-4 md:grid-cols-3">
          <Textarea
            label="What You Will Learn"
            value={form.what_you_will_learn}
            onChange={(v:any) => update("what_you_will_learn", v)}
          />

          <Textarea
            label="Requirements"
            value={form.requirements}
            onChange={(v:any) => update("requirements", v)}
          />

          <Textarea
            label="Rules"
            value={form.rules}
            onChange={(v:any) => update("rules", v)}
          />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input label="Contact Name" value={form.contact_name} onChange={(v:any) => update("contact_name", v)} />
          <Input label="Contact Phone" value={form.contact_phone} onChange={(v:any) => update("contact_phone", v)} />
        </div>
      </Card>

      <Card title="Course Sessions">
        <button
          onClick={addSession}
          type="button"
          className="mb-4 rounded-full bg-orange-100 px-4 py-2 font-bold text-orange-700"
        >
          <Plus className="mr-1 inline h-4 w-4" />
          Add Session
        </button>

        <div className="space-y-5">
          {(form.sessions || []).map((session: any, index: number) => (
            <div
              key={index}
              className="rounded-3xl border border-orange-100 bg-orange-50/40 p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900">
                  Session {index + 1}
                </h3>

                <button
                  type="button"
                  onClick={() => removeSession(index)}
                  className="text-sm font-bold text-red-600"
                >
                  <Trash2 className="mr-1 inline h-4 w-4" />
                  Remove
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  type="number"
                  label="Session Number"
                  value={session.session_number}
                  onChange={(v:any) =>
                    updateSession(index, "session_number", Number(v))
                  }
                />

                <Input
                  label="Session Title"
                  value={session.title}
                  onChange={(v:any) => updateSession(index, "title", v)}
                />

                <Input
                  type="date"
                  label="Session Date"
                  value={session.session_date}
                  onChange={(v:any) => updateSession(index, "session_date", v)}
                />

                <Input
                  type="time"
                  label="Start Time"
                  value={session.start_time}
                  onChange={(v:any) => updateSession(index, "start_time", v)}
                />

                <Input
                  type="time"
                  label="End Time"
                  value={session.end_time}
                  onChange={(v:any) => updateSession(index, "end_time", v)}
                />

                <Input
                  label="Venue Name"
                  value={session.venue_name}
                  onChange={(v:any) => updateSession(index, "venue_name", v)}
                />

                <Input
                  label="Online Meeting URL"
                  value={session.online_meeting_url}
                  onChange={(v:any) =>
                    updateSession(index, "online_meeting_url", v)
                  }
                />
              </div>

              <Textarea
                label="Description"
                value={session.description}
                onChange={(v:any) => updateSession(index, "description", v)}
              />

              <Textarea
                label="Venue Address"
                value={session.venue_address}
                onChange={(v:any) => updateSession(index, "venue_address", v)}
              />
            </div>
          ))}
        </div>
      </Card>

      <button
        onClick={onSubmit}
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-4 font-bold text-white hover:bg-orange-700 disabled:opacity-70"
      >
        {saving ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Save className="h-5 w-5" />
        )}
        {submitLabel}
      </button>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-extrabold text-slate-900">{title}</h2>
      {children}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm outline-none focus:border-orange-400"
      />
    </label>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-24 w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm outline-none focus:border-orange-400"
      />
    </label>
  );
}

function Select({ label, value, onChange, options }: any) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm outline-none focus:border-orange-400"
      >
        {options.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}