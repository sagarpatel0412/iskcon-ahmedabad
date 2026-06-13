import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createEventFormFields,
  getEvent,
  getEventFormFields,
} from "../../services/eventService";

const fieldTypes = ["text", "number", "email", "phone", "select", "checkbox", "textarea", "date"];

export default function CreateEventFormPage() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([
    {
      label: "Full Name",
      field_key: "full_name",
      field_type: "text",
      is_required: true,
      options: null,
      sort_order: 1,
    },
    {
      label: "Phone Number",
      field_key: "phone_number",
      field_type: "phone",
      is_required: true,
      options: null,
      sort_order: 2,
    },
  ]);

  useEffect(() => {
    getEvent(uuid!).then((res) => setEvent(res.data));
    getEventFormFields(uuid!).then((res) => {
      if (Array.isArray(res.data) && res.data.length) setFields(res.data);
    });
  }, [uuid]);

  const addField = () => {
    setFields((prev) => [
      ...prev,
      {
        label: "",
        field_key: "",
        field_type: "text",
        is_required: false,
        options: null,
        sort_order: prev.length + 1,
      },
    ]);
  };

  const updateField = (index: number, key: string, value: any) => {
    setFields((prev) =>
      prev.map((field, i) => (i === index ? { ...field, [key]: value } : field))
    );
  };

  const save = async () => {
    const clean = fields
      .filter((field) => field.label.trim())
      .map((field, index) => ({
        label: field.label,
        field_key:
          field.field_key ||
          field.label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
        field_type: field.field_type,
        options:
          typeof field.options === "string" && field.options.trim()
            ? field.options.split(",").map((x: string) => x.trim())
            : field.options || null,
        is_required: Boolean(field.is_required),
        sort_order: index + 1,
      }));

    await createEventFormFields(uuid!, clean);
    navigate("/events/my-events");
  };

  return (
    <div className="min-h-screen bg-[#f0e8d8] p-5">
      <div className="mb-6 flex flex-wrap justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
            Registration Form Fields
          </h1>
          <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
            {event?.title || "Event"}
          </p>
        </div>

        <button
          onClick={save}
          className="rounded-xl bg-[#c8902a] px-5 py-3 text-sm font-black text-[#1a0a00]"
        >
          Save Form
        </button>
      </div>

      <div className="rounded-2xl border border-[#ede0c8] bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-bold text-[#9a7a4a]">
            These fields will appear when seekers register for this event.
          </p>

          <button
            onClick={addField}
            className="rounded-xl border border-[#ede0c8] px-4 py-2 text-sm font-black text-[#5c3d1a]"
          >
            + Add Field
          </button>
        </div>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={index}
              className="rounded-xl border border-[#ede0c8] bg-[#fdfaf5] p-4"
            >
              <div className="grid gap-4 md:grid-cols-4">
                <Input
                  label="Label"
                  value={field.label}
                  onChange={(v: string) => updateField(index, "label", v)}
                />

                <Input
                  label="Field Key"
                  value={field.field_key}
                  onChange={(v: string) => updateField(index, "field_key", v)}
                />

                <label>
                  <span className="text-sm font-black text-[#5c3d1a]">Type</span>
                  <select
                    value={field.field_type}
                    onChange={(e) => updateField(index, "field_type", e.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#ede0c8] px-4 py-3 text-sm font-bold"
                  >
                    {fieldTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <Input
                  label="Options comma separated"
                  value={Array.isArray(field.options) ? field.options.join(",") : field.options || ""}
                  onChange={(v: string) => updateField(index, "options", v)}
                />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-black text-[#5c3d1a]">
                  <input
                    type="checkbox"
                    checked={field.is_required}
                    onChange={(e) =>
                      updateField(index, "is_required", e.target.checked)
                    }
                  />
                  Required
                </label>

                {fields.length > 1 && (
                  <button
                    onClick={() =>
                      setFields((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="rounded-lg bg-red-50 px-3 py-2 text-sm font-black text-red-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <label>
      <span className="text-sm font-black text-[#5c3d1a]">{label}</span>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-[#ede0c8] px-4 py-3 text-sm font-bold"
      />
    </label>
  );
}