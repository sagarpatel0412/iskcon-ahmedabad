// src/pages/admin/AdminUsersPage.tsx

import { useEffect, useState } from "react";
import {
  activateUser,
  deactivateUser,
  getAdminUsers,
  unverifyDevotee,
  verifyDevotee,
  updateAdminUser,
} from "../../services/adminService";
import { Loader2, ShieldCheck, UserX, Edit, X, Save } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsers({ search });
      setUsers(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (user: any) => {
    if (user.is_verified_devotee) {
      await unverifyDevotee(user.uuid);
    } else {
      await verifyDevotee(user.uuid);
    }

    loadUsers();
  };

  const handleActive = async (user: any) => {
    if (user.is_active) {
      await deactivateUser(user.uuid);
    } else {
      await activateUser(user.uuid);
    }

    loadUsers();
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.phone || "",
      gender: user.gender || "",
      country_code: user.country_code || "",
      state_code: user.state_code || "",
      city: user.city || "",
      address_line_1: user.address_line_1 || "",
      address_line_2: user.address_line_2 || "",
      landmark: user.landmark || "",
      postal_code: user.postal_code || "",
      is_active: !!user.is_active,
      is_verified_devotee: !!user.is_verified_devotee,
    });
  };

  const updateForm = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleUpdateUser = async () => {
    try {
      setSaving(true);

      await updateAdminUser(editingUser.uuid, form);

      setEditingUser(null);
      await loadUsers();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Header
        title="Users"
        text="Manage users, active status and devotee verification."
      />

      <div className="mb-6 flex gap-3 rounded-3xl border border-orange-100 bg-white p-4 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email or phone"
          className="w-full rounded-2xl border border-orange-100 px-4 py-3 outline-none focus:border-orange-500"
        />

        <button
          onClick={loadUsers}
          className="rounded-full bg-orange-600 px-6 py-3 font-bold text-white"
        >
          Search
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-sm">
          {users.map((user) => (
            <div
              key={user.uuid}
              className="border-b border-orange-100 p-5 last:border-b-0"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    {user.first_name} {user.last_name}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    {user.email || "-"} • {user.phone || "-"}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge
                      text={user.is_active ? "Active" : "Inactive"}
                      type={user.is_active ? "green" : "red"}
                    />

                    <Badge
                      text={
                        user.is_verified_devotee
                          ? "Verified Devotee"
                          : "Not Verified"
                      }
                      type={user.is_verified_devotee ? "orange" : "slate"}
                    />

                    {user.user_roles?.map((ur: any) => (
                      <Badge
                        key={ur.id}
                        text={ur.role?.name || "Role"}
                        type="yellow"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleVerify(user)}
                    className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700"
                  >
                    <ShieldCheck className="mr-1 inline h-4 w-4" />
                    {user.is_verified_devotee ? "Unverify" : "Verify"}
                  </button>

                  <button
                    onClick={() => openEditModal(user)}
                    className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-800"
                  >
                    <Edit className="mr-1 inline h-4 w-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleActive(user)}
                    className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700"
                  >
                    <UserX className="mr-1 inline h-4 w-4" />
                    {user.is_active ? "Deactivate" : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-widest text-orange-600">
                  Admin User Edit
                </p>
                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  Update User Details
                </h2>
              </div>

              <button
                onClick={() => setEditingUser(null)}
                className="rounded-full bg-slate-100 p-2 text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="First Name"
                value={form.first_name}
                onChange={(v: string) => updateForm("first_name", v)}
              />
              <Input
                label="Last Name"
                value={form.last_name}
                onChange={(v: string) => updateForm("last_name", v)}
              />
              <Input
                label="Phone"
                value={form.phone}
                onChange={(v: string) => updateForm("phone", v)}
              />

              <label className="block">
                <span className="mb-1 block text-sm font-bold text-slate-700">
                  Gender
                </span>
                <select
                  value={form.gender}
                  onChange={(e) => updateForm("gender", e.target.value)}
                  className="w-full rounded-2xl border border-orange-100 px-4 py-3 outline-none focus:border-orange-500"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <Input
                label="Country Code"
                value={form.country_code}
                onChange={(v: string) => updateForm("country_code", v)}
              />
              <Input
                label="State Code"
                value={form.state_code}
                onChange={(v: string) => updateForm("state_code", v)}
              />
              <Input
                label="City"
                value={form.city}
                onChange={(v: string) => updateForm("city", v)}
              />
              <Input
                label="Postal Code"
                value={form.postal_code}
                onChange={(v: string) => updateForm("postal_code", v)}
              />
              <Input
                label="Address Line 1"
                value={form.address_line_1}
                onChange={(v: string) => updateForm("address_line_1", v)}
              />
              <Input
                label="Address Line 2"
                value={form.address_line_2}
                onChange={(v: string) => updateForm("address_line_2", v)}
              />
              <Input
                label="Landmark"
                value={form.landmark}
                onChange={(v: string) => updateForm("landmark", v)}
              />
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-3 rounded-2xl bg-orange-50 p-4 font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => updateForm("is_active", e.target.checked)}
                />
                Active User
              </label>

              <label className="flex items-center gap-3 rounded-2xl bg-orange-50 p-4 font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={form.is_verified_devotee}
                  onChange={(e) =>
                    updateForm("is_verified_devotee", e.target.checked)
                  }
                />
                Verified Devotee
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditingUser(null)}
                className="rounded-full bg-slate-100 px-5 py-3 font-bold text-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateUser}
                disabled={saving}
                className="rounded-full bg-orange-600 px-5 py-3 font-bold text-white disabled:opacity-70"
              >
                <Save className="mr-1 inline h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Header({ title, text }: any) {
  return (
    <div className="mb-6 rounded-[2rem] bg-gradient-to-r from-orange-600 to-amber-500 p-8 text-white shadow-sm">
      <p className="text-sm font-black uppercase tracking-widest text-orange-100">
        Admin
      </p>
      <h1 className="mt-2 text-4xl font-black">{title}</h1>
      <p className="mt-3 font-semibold text-orange-50">{text}</p>
    </div>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-bold text-slate-700">
        {label}
      </span>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-orange-100 px-4 py-3 outline-none focus:border-orange-500"
      />
    </label>
  );
}

function Loading() {
  return (
    <div className="flex min-h-[300px] items-center justify-center rounded-[2rem] bg-white">
      <Loader2 className="mr-2 h-6 w-6 animate-spin text-orange-700" />
      <span className="font-bold text-orange-700">Loading...</span>
    </div>
  );
}

function Badge({ text, type }: any) {
  const styles: any = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    yellow: "bg-yellow-100 text-yellow-800",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-black ${styles[type]}`}
    >
      {text}
    </span>
  );
}
