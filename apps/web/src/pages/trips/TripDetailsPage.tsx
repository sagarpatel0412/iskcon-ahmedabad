import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CalendarDays,
  MapPin,
  Users,
  Phone,
  Mail,
  Loader2,
  CheckCircle,
  Home,
  Clock,
  CreditCard,
} from "lucide-react";
import {
  getTripByUuid,
  registerTrip,
  verifyTripPayment,
} from "../../services/tripService";
import useAuth from "../../hooks/useAuth";

declare global {
  interface Window {
    Razorpay: any;
  }
}

type Trip = any;

export default function TripDetailsPage() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);

  const { isLoggedIn } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    notes: "",
  });

  useEffect(() => {
    loadTrip();
  }, [uuid]);

  const loadTrip = async () => {
    try {
      setLoading(true);
      const res = await getTripByUuid(uuid!);
      setTrip(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load trip");
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    try {
      if (!trip) return;

      setRegistering(true);

      const payload = {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
      };

      const res = await registerTrip(trip.uuid, payload);
      const data = res.data;

      if (!data.requires_payment) {
        alert("Trip registration confirmed successfully 🙏");
        loadTrip();
        return;
      }

      const loaded = await loadRazorpayScript();

      if (!loaded) {
        throw new Error("Failed to load Razorpay");
      }

      const razorpay = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency || "INR",
        order_id: data.order.id,
        name: "ISKCON Ahmedabad",
        description: trip.title,

        handler: async (response: any) => {
          await verifyTripPayment({
            payment_uuid: data.payment_uuid,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert("Payment successful. Trip registration confirmed 🙏");
          loadTrip();
        },

        theme: {
          color: "#ea580c",
        },
      });

      razorpay.on("payment.failed", () => {
        alert("Payment failed. Please try again.");
      });

      razorpay.open();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || error.message || "Failed");
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = () => {
    if (!trip?.is_paid || Number(trip?.price_amount) <= 0) return "Free";
    return `${trip.currency === "INR" ? "₹" : trip.currency}${trip.price_amount}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50">
        <div className="flex items-center gap-3 text-orange-700">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="font-bold">Loading trip details...</span>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50">
        <p className="font-bold text-slate-700">Trip not found</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50">
      <section className="relative">
        <div className="h-[360px] bg-orange-100">
          {trip.cover_image_url ? (
            <img
              src={`http://localhost:3000${trip.cover_image_url}`}
              alt={trip.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-orange-600">
              <MapPin className="h-20 w-20" />
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8">
          <div className="mx-auto max-w-6xl text-white">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-orange-500 px-4 py-1 text-xs font-bold">
                {trip.destination}
              </span>

              <span className="rounded-full bg-white/20 px-4 py-1 text-xs font-bold backdrop-blur">
                {formatPrice()}
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-extrabold md:text-5xl">
              {trip.title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-orange-50 md:text-base">
              {trip.description ||
                "A devotional trip organized for seekers and devotees."}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard
              icon={<CalendarDays />}
              label="Dates"
              value={`${formatDate(trip.start_date)} - ${formatDate(trip.end_date)}`}
            />

            <InfoCard
              icon={<MapPin />}
              label="Departure"
              value={trip.departure_city || "-"}
            />

            <InfoCard
              icon={<Users />}
              label="Capacity"
              value={
                trip.max_capacity ? `${trip.max_capacity} devotees` : "Open"
              }
            />
          </div>

          <Card title="Trip Information">
            <div className="grid gap-4 md:grid-cols-2">
              <Detail label="Destination" value={trip.destination} />
              <Detail label="Meeting Point" value={trip.meeting_point} />
              <Detail label="Meeting Time" value={trip.meeting_time} />
              <Detail label="Price" value={formatPrice()} />
              <Detail label="Contact Name" value={trip.contact_name} />
              <Detail label="Contact Phone" value={trip.contact_phone} />
            </div>
          </Card>

          {(trip.includes || trip.excludes || trip.rules) && (
            <Card title="Includes, Excludes & Rules">
              <div className="grid gap-4 md:grid-cols-3">
                <TextBlock title="Includes" text={trip.includes} />
                <TextBlock title="Excludes" text={trip.excludes} />
                <TextBlock title="Rules" text={trip.rules} />
              </div>
            </Card>
          )}

          {trip.stays?.length > 0 && (
            <Card title="Stay Details">
              <div className="space-y-4">
                {trip.stays.map((stay: any) => (
                  <div
                    key={stay.uuid}
                    className="rounded-2xl border border-orange-100 bg-orange-50/40 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-orange-100 p-2 text-orange-700">
                        <Home className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="font-extrabold text-slate-900">
                          {stay.stay_name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {stay.stay_type}
                        </p>

                        <p className="mt-2 text-sm text-slate-600">
                          {stay.address}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-orange-700">
                          <span>{formatDate(stay.check_in_date)}</span>
                          <span>→</span>
                          <span>{formatDate(stay.check_out_date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {trip.days?.length > 0 && (
            <Card title="Daily Itinerary">
              <div className="space-y-5">
                {trip.days.map((day: any) => (
                  <div
                    key={day.uuid}
                    className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                          Day {day.day_number}
                        </span>

                        <h3 className="mt-3 text-lg font-extrabold text-slate-900">
                          {day.title || `Day ${day.day_number}`}
                        </h3>

                        {day.date && (
                          <p className="mt-1 text-sm text-slate-500">
                            {formatDate(day.date)}
                          </p>
                        )}
                      </div>
                    </div>

                    {day.description && (
                      <p className="mb-4 text-sm leading-6 text-slate-600">
                        {day.description}
                      </p>
                    )}

                    <div className="mb-4 grid gap-3 md:grid-cols-3">
                      <Meal label="Breakfast" value={day.breakfast_info} />
                      <Meal label="Lunch" value={day.lunch_info} />
                      <Meal label="Dinner" value={day.dinner_info} />
                    </div>

                    {day.places?.length > 0 && (
                      <div className="space-y-3">
                        {day.places.map((place: any) => (
                          <div
                            key={place.uuid}
                            className="flex gap-3 rounded-2xl bg-orange-50 p-4"
                          >
                            <div className="mt-1 text-orange-700">
                              <MapPin className="h-5 w-5" />
                            </div>

                            <div>
                              <h4 className="font-bold text-slate-900">
                                {place.place_name}
                              </h4>

                              {place.visit_time && (
                                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                  <Clock className="h-3 w-3" />
                                  {place.visit_time}
                                </p>
                              )}

                              {place.description && (
                                <p className="mt-2 text-sm text-slate-600">
                                  {place.description}
                                </p>
                              )}

                              {place.location_url && (
                                <a
                                  href={place.location_url}
                                  target="_blank"
                                  className="mt-2 inline-block text-sm font-bold text-orange-700"
                                >
                                  Open Location
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-orange-600" />
              <h2 className="text-xl font-extrabold text-slate-900">
                Register for Trip
              </h2>
            </div>

            <div className="mb-5 rounded-2xl bg-orange-50 p-4">
              <p className="text-sm font-bold text-slate-500">Trip Price</p>
              <p className="mt-1 text-3xl font-extrabold text-orange-700">
                {formatPrice()}
              </p>
            </div>

            <div className="space-y-3">
              <Input
                label="Full Name"
                value={form.full_name}
                onChange={(v) => handleChange("full_name", v)}
              />
              <Input
                label="Phone"
                value={form.phone}
                onChange={(v) => handleChange("phone", v)}
                icon={<Phone className="h-4 w-4" />}
              />
              <Input
                label="Email"
                value={form.email}
                onChange={(v) => handleChange("email", v)}
                icon={<Mail className="h-4 w-4" />}
              />
              <Input
                label="Age"
                value={form.age}
                onChange={(v) => handleChange("age", v)}
              />

              <select
                value={form.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm outline-none focus:border-orange-400"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <Input
                label="Emergency Contact Name"
                value={form.emergency_contact_name}
                onChange={(v) => handleChange("emergency_contact_name", v)}
              />

              <Input
                label="Emergency Contact Phone"
                value={form.emergency_contact_phone}
                onChange={(v) => handleChange("emergency_contact_phone", v)}
              />

              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Any notes"
                className="min-h-24 w-full rounded-2xl border border-orange-100 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
            </div>

            <button
              onClick={() => {
                isLoggedIn ? handleRegister() : navigate("/login");
              }}
              disabled={registering}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 px-5 py-3 font-bold text-white hover:bg-orange-700 disabled:opacity-70"
            >
              {" "}
              {isLoggedIn ? (
                registering ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : trip.is_paid ? (
                  "Register & Pay"
                ) : (
                  "Register Free"
                )
              ) : (
                "Login to Register ..."
              )}
            </button>
          </div>
        </aside>
      </section>
    </main>
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

function InfoCard({ icon, label, value }: any) {
  return (
    <div className="rounded-3xl border border-orange-100 bg-white p-5 shadow-sm">
      <div className="mb-3 text-orange-600 [&_svg]:h-6 [&_svg]:w-6">{icon}</div>
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function Detail({ label, value }: any) {
  return (
    <div>
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-1 font-bold text-slate-800">{value || "-"}</p>
    </div>
  );
}

function TextBlock({ title, text }: any) {
  return (
    <div className="rounded-2xl bg-orange-50 p-4">
      <p className="font-bold text-orange-700">{title}</p>
      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
        {text || "-"}
      </p>
    </div>
  );
}

function Meal({ label, value }: any) {
  return (
    <div className="rounded-2xl bg-yellow-50 p-3">
      <p className="text-xs font-bold uppercase text-yellow-700">{label}</p>
      <p className="mt-1 text-sm text-slate-600">{value || "-"}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <div className="flex items-center gap-2 rounded-2xl border border-orange-100 px-4 py-3 focus-within:border-orange-400">
        {icon}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </label>
  );
}
