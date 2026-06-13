// src/pages/profile/ProfilePage.tsx

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Crown,
  ShoppingBag,
  Save,
  Loader2,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";
import {
  getMyProfile,
  updateMyProfile,
  getMySubscription,
  getMyPurchases,
} from "../../services/profileService";
import { cancelSubscription } from "../../services/profileService";
import { PremiumBadge } from "../../components/premium-badge/PremiumBadge";

type Role = {
  id: number;
  name: string;
};

type Profile = {
  id: number;
  uuid: string;
  first_name: string;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  gender?: "male" | "female" | "other" | null;
  country_code?: string | null;
  state_code?: string | null;
  city?: string | null;
  address_line_1?: string | null;
  address_line_2?: string | null;
  landmark?: string | null;
  postal_code?: string | null;
  profile_image_url?: string | null;
  is_email_verified?: boolean;
  is_phone_verified?: boolean;
  is_verified_devotee?: boolean;
  roles?: Role[];
  isSubscribed?:boolean
};

type Subscription = {
  uuid: string;
  plan_name: string;
  plan_type: string;
  amount: number;
  currency: string;
  start_date: string;
  end_date: string;
  status: string;
};

type Purchase = {
  uuid: string;
  payment_type: string;
  amount: number;
  currency: string;
  payment_status: string;
  paid_at: string;
  post?: {
    title: string;
    uuid: string;
  };
  subscription?: Subscription;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfilePage();
  }, []);

  const loadProfilePage = async () => {
    try {
      setLoading(true);

      const [profileRes, subscriptionRes, purchasesRes] = await Promise.all([
        getMyProfile(),
        getMySubscription(),
        getMyPurchases(),
      ]);

      const user =
        profileRes.data?.user || profileRes.data?.data || profileRes.data;

      setProfile(user);
      setForm(user);

      const subData =
        subscriptionRes.data?.subscription ||
        subscriptionRes.data?.data ||
        null;
      setSubscription(subData);

      setPurchases(purchasesRes.data?.data || purchasesRes.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof Profile, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateMyProfile({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        gender: form.gender,
        country_code: form.country_code,
        state_code: form.state_code,
        city: form.city,
        address_line_1: form.address_line_1,
        address_line_2: form.address_line_2,
        landmark: form.landmark,
        postal_code: form.postal_code,
        profile_image_url: form.profile_image_url,
      });

      alert("Profile updated successfully 🙏");
      loadProfilePage();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (amount: number, currency = "INR") => {
    return `${currency === "INR" ? "₹" : currency}${amount}`;
  };

  const handleCancelSubscription = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel your subscription?",
    );

    if (!confirmed) return;

    try {
      await cancelSubscription("Cancelled from profile page");

      alert("Subscription cancelled successfully");

      loadProfilePage();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to cancel subscription");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50">
        <div className="flex items-center gap-3 text-orange-700">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="font-bold">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-orange-50">
        <p className="font-bold text-slate-700">Profile not found</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50 px-4 py-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-orange-100 text-orange-700">
                {profile.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10" />
                )}
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  {profile.first_name} {profile.last_name}
                </h1>

                <div className="mt-2 flex flex-wrap gap-2">
                  {profile.roles?.map((role) => (
                    <span
                      key={role.id}
                      className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700"
                    >
                      {role.name}
                    </span>
                  ))}

                  {profile.is_verified_devotee && (
                    <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      <ShieldCheck className="h-3 w-3" />
                      Verified Devotee
                    </span>
                  )}

                  {profile?.isSubscribed && <PremiumBadge />}
                </div>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-3 font-bold text-white hover:bg-orange-700 disabled:opacity-70"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-extrabold text-slate-900">
                Profile Information
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="First Name"
                  value={form.first_name}
                  onChange={(v) => handleChange("first_name", v)}
                />
                <Input
                  label="Last Name"
                  value={form.last_name}
                  onChange={(v) => handleChange("last_name", v)}
                />

                <ReadOnlyInput
                  label="Email"
                  value={profile.email}
                  icon={<Mail className="h-4 w-4" />}
                />
                <Input
                  label="Phone"
                  value={form.phone}
                  onChange={(v) => handleChange("phone", v)}
                  icon={<Phone className="h-4 w-4" />}
                />

                <Select
                  label="Gender"
                  value={form.gender || ""}
                  onChange={(v) => handleChange("gender", v)}
                  options={[
                    { label: "Select Gender", value: "" },
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Other", value: "other" },
                  ]}
                />

                <Input
                  label="Profile Image URL"
                  value={form.profile_image_url}
                  onChange={(v) => handleChange("profile_image_url", v)}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-extrabold text-slate-900">
                Address
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Country Code"
                  value={form.country_code}
                  onChange={(v) => handleChange("country_code", v)}
                />
                <Input
                  label="State Code"
                  value={form.state_code}
                  onChange={(v) => handleChange("state_code", v)}
                />
                <Input
                  label="City"
                  value={form.city}
                  onChange={(v) => handleChange("city", v)}
                  icon={<MapPin className="h-4 w-4" />}
                />
                <Input
                  label="Postal Code"
                  value={form.postal_code}
                  onChange={(v) => handleChange("postal_code", v)}
                />
                <Input
                  label="Address Line 1"
                  value={form.address_line_1}
                  onChange={(v) => handleChange("address_line_1", v)}
                />
                <Input
                  label="Address Line 2"
                  value={form.address_line_2}
                  onChange={(v) => handleChange("address_line_2", v)}
                />
                <Input
                  label="Landmark"
                  value={form.landmark}
                  onChange={(v) => handleChange("landmark", v)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <Crown className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-extrabold text-slate-900">
                  Active Subscription
                </h2>
              </div>

              {subscription ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-orange-700">
                    {subscription.plan_name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {subscription.plan_type?.toUpperCase()} Plan
                  </p>

                  <div className="rounded-2xl bg-orange-50 p-4">
                    <p className="text-sm text-slate-500">Amount</p>
                    <p className="font-extrabold text-slate-900">
                      {formatPrice(subscription.amount, subscription.currency)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Start</p>
                      <p className="font-bold text-slate-800">
                        {formatDate(subscription.start_date)}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-500">End</p>
                      <p className="font-bold text-slate-800">
                        {formatDate(subscription.end_date)}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                    {subscription.status}
                  </span>
                  <button
                    onClick={handleCancelSubscription}
                    className="mt-4 w-full rounded-full border border-red-200 bg-red-50 px-4 py-3 font-bold text-red-600 transition hover:bg-red-100"
                  >
                    Cancel Subscription
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                  <p className="font-bold text-slate-700">
                    No active subscription
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Subscribe to unlock premium content.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-orange-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-extrabold text-slate-900">
                  Purchases
                </h2>
              </div>

              {purchases.length === 0 ? (
                <p className="text-sm text-slate-500">No purchases yet.</p>
              ) : (
                <div className="space-y-3">
                  {purchases.map((purchase) => (
                    <div
                      key={purchase.uuid}
                      className="rounded-2xl border border-orange-100 p-4"
                    >
                      <p className="font-bold text-slate-900">
                        {purchase.post?.title ||
                          purchase.subscription?.plan_name ||
                          "Subscription Purchase"}
                      </p>

                      <div className="mt-2 flex items-center justify-between text-sm">
                        <span className="font-bold text-orange-700">
                          {formatPrice(purchase.amount, purchase.currency)}
                        </span>

                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                          {purchase.payment_status}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                        <CalendarDays className="h-3 w-3" />
                        {formatDate(purchase.paid_at)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value?: string | null;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <div className="flex items-center gap-2 rounded-2xl border border-orange-100 bg-white px-4 py-3 focus-within:border-orange-400">
        {icon}
        <input
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </label>
  );
}

function ReadOnlyInput({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <div className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-slate-500">
        {icon}
        <input
          value={value || ""}
          readOnly
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none focus:border-orange-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
