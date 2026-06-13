// src/pages/trips/TripForm.tsx

import { Plus, Trash2, Save, Loader2 } from "lucide-react";

export default function TripForm({
  form,
  setForm,
  saving,
  submitLabel,
  onSubmit,
}: any) {
  const update = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const addDay = () => {
    update("days", [
      ...(form.days || []),
      {
        day_number: (form.days?.length || 0) + 1,
        title: "",
        description: "",
        date: "",
        breakfast_info: "",
        lunch_info: "",
        dinner_info: "",
        places: [],
      },
    ]);
  };

  const updateDay = (index: number, key: string, value: any) => {
    const days = [...(form.days || [])];
    days[index][key] = value;
    update("days", days);
  };

  const removeDay = (index: number) => {
    update(
      "days",
      form.days.filter((_: any, i: number) => i !== index)
    );
  };

  const addPlace = (dayIndex: number) => {
    const days = [...(form.days || [])];
    days[dayIndex].places = [
      ...(days[dayIndex].places || []),
      {
        place_name: "",
        description: "",
        visit_time: "",
        location_url: "",
        image_url: "",
        sort_order: (days[dayIndex].places?.length || 0) + 1,
      },
    ];
    update("days", days);
  };

  const updatePlace = (
    dayIndex: number,
    placeIndex: number,
    key: string,
    value: any
  ) => {
    const days = [...(form.days || [])];
    days[dayIndex].places[placeIndex][key] = value;
    update("days", days);
  };

  const removePlace = (dayIndex: number, placeIndex: number) => {
    const days = [...(form.days || [])];
    days[dayIndex].places = days[dayIndex].places.filter(
      (_: any, i: number) => i !== placeIndex
    );
    update("days", days);
  };

  const addStay = () => {
    update("stays", [
      ...(form.stays || []),
      {
        stay_name: "",
        stay_type: "other",
        address: "",
        check_in_date: "",
        check_out_date: "",
        contact_phone: "",
        location_url: "",
        notes: "",
      },
    ]);
  };

  const updateStay = (index: number, key: string, value: any) => {
    const stays = [...(form.stays || [])];
    stays[index][key] = value;
    update("stays", stays);
  };

  const removeStay = (index: number) => {
    update(
      "stays",
      form.stays.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <Card title="Basic Trip Details">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Title" value={form.title} onChange={(v:any) => update("title", v)} />
          <Input label="Destination" value={form.destination} onChange={(v:any) => update("destination", v)} />
          <Input label="Departure City" value={form.departure_city} onChange={(v:any) => update("departure_city", v)} />
          <Input label="Cover Image URL" value={form.cover_image_url} onChange={(v:any) => update("cover_image_url", v)} />
          <Input type="date" label="Start Date" value={form.start_date} onChange={(v:any) => update("start_date", v)} />
          <Input type="date" label="End Date" value={form.end_date} onChange={(v:any) => update("end_date", v)} />
          <Input label="Meeting Point" value={form.meeting_point} onChange={(v:any) => update("meeting_point", v)} />
          <Input type="time" label="Meeting Time" value={form.meeting_time} onChange={(v:any) => update("meeting_time", v)} />
        </div>

        <Textarea label="Description" value={form.description} onChange={(v:any) => update("description", v)} />
      </Card>

      <Card title="Registration & Payment">
        <div className="grid gap-4 md:grid-cols-2">
          <Input type="number" label="Max Capacity" value={form.max_capacity} onChange={(v:any) => update("max_capacity", v)} />
          <Input type="number" label="Price Amount" value={form.price_amount} onChange={(v:any) => update("price_amount", v)} />
          <Input label="Currency" value={form.currency} onChange={(v:any) => update("currency", v)} />
          <Select
            label="Status"
            value={form.status}
            onChange={(v:any) => update("status", v)}
            options={[
              "draft",
              "published",
              "cancelled",
              "completed",
            ]}
          />
          <Input type="datetime-local" label="Registration Start" value={form.registration_start_date} onChange={(v:any) => update("registration_start_date", v)} />
          <Input type="datetime-local" label="Registration End" value={form.registration_end_date} onChange={(v:any) => update("registration_end_date", v)} />
        </div>

        <label className="mt-4 flex items-center gap-2 font-bold text-slate-700">
          <input
            type="checkbox"
            checked={!!form.is_paid}
            onChange={(e) => update("is_paid", e.target.checked)}
          />
          Paid Trip
        </label>
      </Card>

      <Card title="Includes, Excludes & Rules">
        <div className="grid gap-4 md:grid-cols-3">
          <Textarea label="Includes" value={form.includes} onChange={(v:any) => update("includes", v)} />
          <Textarea label="Excludes" value={form.excludes} onChange={(v:any) => update("excludes", v)} />
          <Textarea label="Rules" value={form.rules} onChange={(v:any) => update("rules", v)} />
        </div>
      </Card>

      <Card title="Stay Details">
        <button onClick={addStay} className="mb-4 rounded-full bg-orange-100 px-4 py-2 font-bold text-orange-700">
          <Plus className="mr-1 inline h-4 w-4" /> Add Stay
        </button>

        <div className="space-y-4">
          {(form.stays || []).map((stay: any, index: number) => (
            <div key={index} className="rounded-2xl border border-orange-100 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Stay Name" value={stay.stay_name} onChange={(v:any) => updateStay(index, "stay_name", v)} />
                <Select
                  label="Stay Type"
                  value={stay.stay_type}
                  onChange={(v:any) => updateStay(index, "stay_type", v)}
                  options={["ashram", "hotel", "guest_house", "dharamshala", "other"]}
                />
                <Input type="date" label="Check In" value={stay.check_in_date} onChange={(v:any) => updateStay(index, "check_in_date", v)} />
                <Input type="date" label="Check Out" value={stay.check_out_date} onChange={(v:any) => updateStay(index, "check_out_date", v)} />
                <Input label="Contact Phone" value={stay.contact_phone} onChange={(v:any) => updateStay(index, "contact_phone", v)} />
                <Input label="Location URL" value={stay.location_url} onChange={(v:any) => updateStay(index, "location_url", v)} />
              </div>

              <Textarea label="Address" value={stay.address} onChange={(v:any) => updateStay(index, "address", v)} />
              <Textarea label="Notes" value={stay.notes} onChange={(v:any) => updateStay(index, "notes", v)} />

              <button onClick={() => removeStay(index)} className="mt-3 text-sm font-bold text-red-600">
                <Trash2 className="mr-1 inline h-4 w-4" /> Remove Stay
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Daily Itinerary">
        <button onClick={addDay} className="mb-4 rounded-full bg-orange-100 px-4 py-2 font-bold text-orange-700">
          <Plus className="mr-1 inline h-4 w-4" /> Add Day
        </button>

        <div className="space-y-5">
          {(form.days || []).map((day: any, dayIndex: number) => (
            <div key={dayIndex} className="rounded-3xl border border-orange-100 p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <Input type="number" label="Day Number" value={day.day_number} onChange={(v:any) => updateDay(dayIndex, "day_number", Number(v))} />
                <Input type="date" label="Date" value={day.date} onChange={(v:any) => updateDay(dayIndex, "date", v)} />
                <Input label="Title" value={day.title} onChange={(v:any) => updateDay(dayIndex, "title", v)} />
              </div>

              <Textarea label="Description" value={day.description} onChange={(v:any) => updateDay(dayIndex, "description", v)} />

              <div className="grid gap-4 md:grid-cols-3">
                <Textarea label="Breakfast" value={day.breakfast_info} onChange={(v:any) => updateDay(dayIndex, "breakfast_info", v)} />
                <Textarea label="Lunch" value={day.lunch_info} onChange={(v:any) => updateDay(dayIndex, "lunch_info", v)} />
                <Textarea label="Dinner" value={day.dinner_info} onChange={(v:any) => updateDay(dayIndex, "dinner_info", v)} />
              </div>

              <div className="mt-5">
                <button onClick={() => addPlace(dayIndex)} className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-800">
                  <Plus className="mr-1 inline h-4 w-4" /> Add Place
                </button>

                <div className="mt-4 space-y-3">
                  {(day.places || []).map((place: any, placeIndex: number) => (
                    <div key={placeIndex} className="rounded-2xl bg-orange-50 p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input label="Place Name" value={place.place_name} onChange={(v:any) => updatePlace(dayIndex, placeIndex, "place_name", v)} />
                        <Input type="time" label="Visit Time" value={place.visit_time} onChange={(v:any) => updatePlace(dayIndex, placeIndex, "visit_time", v)} />
                        <Input label="Location URL" value={place.location_url} onChange={(v:any) => updatePlace(dayIndex, placeIndex, "location_url", v)} />
                        <Input label="Image URL" value={place.image_url} onChange={(v:any) => updatePlace(dayIndex, placeIndex, "image_url", v)} />
                      </div>
                      <Textarea label="Description" value={place.description} onChange={(v:any) => updatePlace(dayIndex, placeIndex, "description", v)} />
                      <button onClick={() => removePlace(dayIndex, placeIndex)} className="mt-2 text-sm font-bold text-red-600">
                        Remove Place
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={() => removeDay(dayIndex)} className="mt-4 text-sm font-bold text-red-600">
                <Trash2 className="mr-1 inline h-4 w-4" /> Remove Day
              </button>
            </div>
          ))}
        </div>
      </Card>

      <button
        onClick={onSubmit}
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-4 font-bold text-white hover:bg-orange-700 disabled:opacity-70"
      >
        {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
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
      <span className="mb-1 block text-sm font-bold text-slate-700">{label}</span>
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
    <label className="mt-4 block">
      <span className="mb-1 block text-sm font-bold text-slate-700">{label}</span>
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
      <span className="mb-1 block text-sm font-bold text-slate-700">{label}</span>
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