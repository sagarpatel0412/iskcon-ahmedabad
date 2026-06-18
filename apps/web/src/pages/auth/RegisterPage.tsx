import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../../api/client";
import {
  getCities,
  getCountries,
  getStates,
} from "../../services/locationService";
import { getCentres } from "../../services/centreService";
import PageSeo from "../../components/seo/PageSeo";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { roleType } = useParams();

  const isDevotee = roleType === "devotee";

  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [centres, setCentres] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",

    gender: "male",

    centre_id: "",

    country_code: "IN",
    state_code: "GJ",
    city: "Ahmedabad",

    address_line_1: "",
    address_line_2: "",
    landmark: "",
    postal_code: "",
    profile_image_url: "",

    spiritual_name: "",
    current_malas: 0,
    initiation_status: "none",
    years_associated: 0,
    services: "",
    devotee_reference_name: "",
    devotee_reference_phone: "",
    reason: "",
  });

  useEffect(() => {
    loadInitial();
  }, []);

  useEffect(() => {
    if (form.country_code) {
      loadStates(form.country_code);
    }
  }, [form.country_code]);

  useEffect(() => {
    if (form.country_code && form.state_code) {
      loadCities(form.country_code, form.state_code);
    }
  }, [form.country_code, form.state_code]);

  const loadInitial = async () => {
    const [countryRes, centreRes] = await Promise.all([
      getCountries(),
      getCentres(),
    ]);

    setCountries(countryRes.data || []);
    setCentres(centreRes.data || []);
  };

  const loadStates = async (countryCode: string) => {
    const res = await getStates(countryCode);
    setStates(res.data || []);
  };

  const loadCities = async (countryCode: string, stateCode: string) => {
    const res = await getCities(countryCode, stateCode);
    setCities(res.data || []);
  };

  const update = (key: string, value: any) => {
    setForm((prev) => {
      if (key === "country_code") {
        return {
          ...prev,
          country_code: value,
          state_code: "",
          city: "",
        };
      }

      if (key === "state_code") {
        return {
          ...prev,
          state_code: value,
          city: "",
        };
      }

      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const sendOtp = async () => {
    try {
      setLoading(true);

      await api.post("/auth/send-otp", {
        email: form.email,
        purpose: "register",
      });

      const registerData = {
        ...form,
        centre_id: form.centre_id ? Number(form.centre_id) : null,
        current_malas: Number(form.current_malas || 0),
        years_associated: Number(form.years_associated || 0),
      };

      navigate("/verify-otp", {
        state: {
          email: form.email,
          mode: isDevotee ? "devotee_register" : "register",
          registerData,
        },
      });
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageSeo
        title="Register | ISKCON Ahmedabad"
        description="Register to access built in features"
      />

      <div className="min-h-screen bg-[#fdfaf5] px-5 py-10">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-[#ede0c8] bg-white shadow-xl">
          <div className="bg-[#1a0a00] px-8 py-10 text-center">
            <img
              src="https://iskconahmedabad.com/images/logo.png"
              className="mx-auto h-24 w-24 rounded-full border-4 border-[#c8902a] bg-white object-contain p-2"
            />

            <p className="mt-5 text-xs font-black uppercase tracking-[0.3em] text-[#d4a853]">
              ISKCON Ahmedabad
            </p>

            <h1 className="mt-3 font-serif text-5xl font-black text-white">
              {isDevotee ? "Devotee Registration" : "Seeker Registration"}
            </h1>

            <p className="mt-3 font-bold text-[#d4a853]">
              Begin your spiritual journey with Krishna consciousness.
            </p>
          </div>

          <div className="space-y-7 p-8">
            <Section title="Personal Information">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="First Name *"
                  value={form.first_name}
                  onChange={(v: any) => update("first_name", v)}
                />
                <Input
                  label="Last Name"
                  value={form.last_name}
                  onChange={(v: any) => update("last_name", v)}
                />
                <Input
                  label="Email *"
                  value={form.email}
                  onChange={(v: any) => update("email", v)}
                />
                <Input
                  label="Phone"
                  value={form.phone}
                  onChange={(v: any) => update("phone", v)}
                />
                <Input
                  label="Password *"
                  type="password"
                  value={form.password}
                  onChange={(v: any) => update("password", v)}
                />

                <Select
                  label="Gender"
                  value={form.gender}
                  onChange={(v: any) => update("gender", v)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </div>
            </Section>

            <Section title="Centre & Location">
              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  label="ISKCON Centre"
                  value={String(form.centre_id)}
                  onChange={(v: any) => update("centre_id", v)}
                >
                  <option value="">Select Centre</option>
                  {centres?.map((centre) => (
                    <option key={centre.id} value={centre.id}>
                      {centre.name || centre.centre_name}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Country"
                  value={form.country_code}
                  onChange={(v: any) => update("country_code", v)}
                >
                  <option value="">Select Country</option>
                  {countries.map((country) => (
                    <option
                      key={country.isoCode || country.code}
                      value={country.isoCode || country.code}
                    >
                      {country.name}
                    </option>
                  ))}
                </Select>

                <Select
                  label="State"
                  value={form.state_code}
                  onChange={(v: any) => update("state_code", v)}
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option
                      key={state.isoCode || state.code}
                      value={state.isoCode || state.code}
                    >
                      {state.name}
                    </option>
                  ))}
                </Select>

                <Select
                  label="City"
                  value={form.city}
                  onChange={(v: any) => update("city", v)}
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.name || city} value={city.name || city}>
                      {city.name || city}
                    </option>
                  ))}
                </Select>
              </div>
            </Section>

            <Section title="Address Details">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Address Line 1"
                  value={form.address_line_1}
                  onChange={(v: any) => update("address_line_1", v)}
                />
                <Input
                  label="Address Line 2"
                  value={form.address_line_2}
                  onChange={(v: any) => update("address_line_2", v)}
                />
                <Input
                  label="Landmark"
                  value={form.landmark}
                  onChange={(v: any) => update("landmark", v)}
                />
                <Input
                  label="Postal Code"
                  value={form.postal_code}
                  onChange={(v: any) => update("postal_code", v)}
                />
                <div className="md:col-span-2">
                  <Input
                    label="Profile Image URL"
                    value={form.profile_image_url}
                    onChange={(v: any) => update("profile_image_url", v)}
                  />
                </div>
              </div>
            </Section>

            {isDevotee && (
              <Section title="Devotee Request Details">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Spiritual Name"
                    value={form.spiritual_name}
                    onChange={(v: any) => update("spiritual_name", v)}
                  />
                  <Input
                    label="Current Malas"
                    type="number"
                    value={String(form.current_malas)}
                    onChange={(v: any) => update("current_malas", Number(v))}
                  />

                  <Select
                    label="Initiation Status"
                    value={form.initiation_status}
                    onChange={(v: any) => update("initiation_status", v)}
                  >
                    <option value="none">None</option>
                    <option value="harinam">Harinam</option>
                    <option value="diksha">Diksha</option>
                  </Select>

                  <Input
                    label="Years Associated"
                    type="number"
                    value={String(form.years_associated)}
                    onChange={(v: any) => update("years_associated", Number(v))}
                  />
                  <Input
                    label="Devotee Reference Name"
                    value={form.devotee_reference_name}
                    onChange={(v: any) => update("devotee_reference_name", v)}
                  />
                  <Input
                    label="Devotee Reference Phone"
                    value={form.devotee_reference_phone}
                    onChange={(v: any) => update("devotee_reference_phone", v)}
                  />

                  <Textarea
                    label="Services"
                    value={form.services}
                    onChange={(v: any) => update("services", v)}
                  />
                  <Textarea
                    label="Reason for Devotee Request"
                    value={form.reason}
                    onChange={(v: any) => update("reason", v)}
                  />
                </div>
              </Section>
            )}

            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full rounded-2xl bg-[#c8902a] py-4 text-lg font-black text-[#1a0a00] transition hover:bg-[#d4a853] disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-sm font-black text-[#8b6914]">
                Already registered? Login
              </Link>

              <div className="mt-3 text-sm font-bold text-[#9a7a4a]">
                {isDevotee ? (
                  <Link to="/register/seeker" className="text-[#8b6914]">
                    Register as Seeker instead
                  </Link>
                ) : (
                  <Link to="/register/devotee" className="text-[#8b6914]">
                    Register as Devotee instead
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: any) {
  return (
    <section className="rounded-3xl border border-[#ede0c8] bg-[#fdfaf5] p-5">
      <h2 className="mb-5 border-b border-[#ede0c8] pb-3 font-serif text-3xl font-black text-[#1a0a00]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <label className="block">
      <span className="text-sm font-black text-[#5c3d1a]">{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 font-bold text-[#1a0a00] outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}

function Select({ label, value, onChange, children }: any) {
  return (
    <label className="block">
      <span className="text-sm font-black text-[#5c3d1a]">{label}</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 font-bold text-[#1a0a00] outline-none focus:border-[#c8902a]"
      >
        {children}
      </select>
    </label>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <label className="block md:col-span-2">
      <span className="text-sm font-black text-[#5c3d1a]">{label}</span>
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 min-h-28 w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 font-bold text-[#1a0a00] outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}
