import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  getEvent,
  getEventFormFields,
  registerForEvent,
} from "../../services/eventService";
import { formatDate, posterUrl } from "./eventStyles";
import AppLoader from "../../components/common/AppLoader";
import {
  createEventPaymentOrder,
  verifyEventPayment,
} from "../../services/eventPaymentService";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function EventRegistrationPage() {
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, [uuid]);

  const load = async () => {
    try {
      const eventRes = await getEvent(uuid!);
      setEvent(eventRes.data);

      const fieldsRes = await getEventFormFields(uuid!);
      const fieldList = Array.isArray(fieldsRes.data) ? fieldsRes.data : [];

      setFields(fieldList);

      const initialValues: Record<string, any> = {};
      fieldList.forEach((field: any) => {
        initialValues[field.field_key] =
          field.field_type === "checkbox" ? false : "";
      });

      setResponses(initialValues);
    } finally {
      setLoading(false);
    }
  };

  const poster = useMemo(() => {
    if (!event?.poster_url) return "";
    return posterUrl(event.poster_url);
  }, [event]);

  const updateResponse = (key: string, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validate = () => {
    for (const field of fields) {
      if (!field.is_required) continue;

      const value = responses[field.field_key];

      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (field.field_type === "checkbox" && value === false)
      ) {
        alert(`${field.label} is required`);
        return false;
      }
    }

    return true;
  };

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const submit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);

      if (!event.is_paid) {
        const res = await registerForEvent(uuid!, {
          form_answers: responses,
        });

        alert(res.data?.message || "Registered successfully");

        navigate("/events/my-registrations", {
          replace: true,
        });

        return;
      }

      const sdkLoaded = await loadRazorpayScript();

      if (!sdkLoaded) {
        alert("Unable to load Razorpay. Please try again.");
        return;
      }

      const orderRes = await createEventPaymentOrder(uuid!);

      const { key, order, payment_uuid } = orderRes.data;

      const razorpay = new window.Razorpay({
        key,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,

        name: "ISKCON Ahmedabad",
        description: event.title,
        image: "https://iskconahmedabad.com/images/logo.png",

        theme: {
          color: "#c8902a",
        },

        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay using UPI",
                instruments: [
                  {
                    method: "upi",
                  },
                ],
              },
            },
            sequence: ["block.upi"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },

        handler: async function (response: any) {
          try {
            await verifyEventPayment({
              payment_uuid,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              form_answers: responses,
            });

            alert("Payment successful. Event registered successfully 🙏");

            navigate("/events/my-registrations", {
              replace: true,
            });
          } catch (error: any) {
            alert(
              error?.response?.data?.message ||
                "Payment verified failed. Please contact support.",
            );
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment cancelled");
          },
        },
      });

      razorpay.open();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Registration failed",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AppLoader title="Loading Form" subtitle="Fetching spiritual wisdom..." />
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#f0e8d8] p-10 text-center">
        <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
          Event not found
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5">
      <div className="mb-5 rounded-2xl bg-[#1a0a00] px-5 py-3 text-center text-xs font-black tracking-[0.25em] text-[#d4a853]">
        ॐ नमो भगवते वासुदेवाय · Event Registration
      </div>

      <Link
        to={`/events/${uuid}`}
        className="mb-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-black text-[#5c3d1a] hover:text-[#c8902a]"
      >
        <ArrowLeft size={17} />
        Back to Event
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <main className="rounded-3xl border border-[#ede0c8] bg-white p-6 shadow-sm">
          <div className="mb-6 border-b border-[#ede0c8] pb-5">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#c8902a]">
              Register for
            </p>

            <h1 className="mt-2 font-serif text-4xl font-black text-[#1a0a00]">
              {event.title}
            </h1>

            <p className="mt-2 text-sm font-bold text-[#9a7a4a]">
              {formatDate(event.event_date)} · {event.start_time || "-"} –{" "}
              {event.end_time || "-"}
            </p>
          </div>

          {fields.length === 0 ? (
            <div className="rounded-2xl bg-[#fdfaf5] p-6 text-center">
              <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
                No custom form fields
              </h2>

              <p className="mt-2 text-sm font-bold text-[#9a7a4a]">
                You can register directly for this event.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {fields.map((field) => (
                <DynamicField
                  key={field.uuid || field.field_key}
                  field={field}
                  value={responses[field.field_key]}
                  onChange={(value) => updateResponse(field.field_key, value)}
                />
              ))}
            </div>
          )}

          <button
            onClick={submit}
            disabled={submitting}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-[#c8902a] px-5 py-4 font-black text-[#1a0a00] hover:bg-[#d4a853] disabled:opacity-60"
          >
            <CheckCircle2 size={20} />
            {submitting
              ? "Registering..."
              : event.is_paid
                ? `Register & Pay ₹${event.price_amount || 0}`
                : "Register Now"}
          </button>
        </main>

        <aside className="space-y-5">
          <section className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white shadow-sm">
            {poster ? (
              <img src={poster} className="h-56 w-full object-cover" />
            ) : (
              <div className="flex h-56 items-center justify-center bg-gradient-to-br from-[#1a0a00] to-[#3d2200]">
                <p className="px-5 text-center font-serif text-3xl font-black text-[#d4a853]">
                  {event.title}
                </p>
              </div>
            )}

            <div className="p-5">
              <p className="text-xs font-black uppercase tracking-wider text-[#9a7a4a]">
                Event Summary
              </p>

              <div className="mt-4 space-y-3 text-sm font-bold text-[#5c3d1a]">
                <p>📅 {formatDate(event.event_date)}</p>
                <p>
                  🕐 {event.start_time || "-"} – {event.end_time || "-"}
                </p>
                <p>📍 {event.location || "-"}</p>
                <p>
                  🎟{" "}
                  {event.is_paid
                    ? `Paid Event · ₹${event.price_amount || 0}`
                    : "Free Event"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#c8902a] bg-[#f5e8c8] p-5">
            <p className="text-sm font-black uppercase tracking-wider text-[#8b6914]">
              Note
            </p>

            <p className="mt-2 text-sm font-bold leading-6 text-[#5c3d1a]">
              After registration, your QR code will be generated. Show it at the
              event entry gate for verification.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function DynamicField({
  field,
  value,
  onChange,
}: {
  field: any;
  value: any;
  onChange: (value: any) => void;
}) {
  const label = (
    <span className="text-sm font-black text-[#5c3d1a]">
      {field.label}
      {field.is_required && <span className="ml-1 text-red-700">*</span>}
    </span>
  );

  if (field.field_type === "textarea") {
    return (
      <label className="block md:col-span-2">
        {label}
        <textarea
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 min-h-28 w-full rounded-xl border border-[#ede0c8] px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
        />
      </label>
    );
  }

  if (field.field_type === "select") {
    const options = normalizeOptions(field.options);

    return (
      <label className="block">
        {label}
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-xl border border-[#ede0c8] px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
        >
          <option value="">Select {field.label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.field_type === "checkbox") {
    return (
      <label className="flex items-center justify-between rounded-xl border border-[#ede0c8] bg-[#fdfaf5] p-4">
        <span>
          {label}
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#9a7a4a]">
            Checkbox
          </p>
        </span>

        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5"
        />
      </label>
    );
  }

  const inputType =
    field.field_type === "phone"
      ? "tel"
      : field.field_type === "number"
        ? "number"
        : field.field_type === "email"
          ? "email"
          : field.field_type === "date"
            ? "date"
            : "text";

  return (
    <label className="block">
      {label}
      <input
        type={inputType}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-[#ede0c8] px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}

function normalizeOptions(options: any): string[] {
  if (!options) return [];

  if (Array.isArray(options)) {
    return options.map(String);
  }

  if (typeof options === "string") {
    try {
      const parsed = JSON.parse(options);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return options
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }
  }

  return [];
}
