import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Crown,
  Edit3,
  ExternalLink,
  Globe2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  createCentre,
  deleteCentre,
  getCentres,
  updateCentre,
} from "../../services/centreService";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  address: "",
  city: "",
  state: "",
  country: "India",
  phone: "",
  email: "",
  website: "",
  logo_url: "",
  banner_url: "",
  latitude: "",
  longitude: "",
  is_active: true,
};

export default function AdminCentrePage() {
  const [centres, setCentres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCentre, setEditingCentre] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyForm);

  const fetchCentres = async () => {
    try {
      setLoading(true);
      const res = await getCentres();
      setCentres(res.data || []);
    } catch (error) {
      console.error(error);
      alert("Failed to load centres");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCentres();
  }, []);

  const filteredCentres = useMemo(() => {
    const q = search.trim().toLowerCase();

    if (!q) return centres;

    return centres.filter((centre) =>
      `${centre.name || ""} ${centre.slug || ""} ${centre.city || ""} ${
        centre.state || ""
      } ${centre.address || ""}`
        .toLowerCase()
        .includes(q)
    );
  }, [centres, search]);

  const updateField = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (value: string) => {
    updateField("name", value);

    if (!form.slug || !editingCentre) {
      updateField("slug", generateSlug(value));
    }
  };

  const openCreateModal = () => {
    setEditingCentre(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEditModal = (centre: any) => {
    setEditingCentre(centre);
    setForm({
      name: centre.name || "",
      slug: centre.slug || "",
      description: centre.description || "",
      address: centre.address || "",
      city: centre.city || "",
      state: centre.state || "",
      country: centre.country || "India",
      phone: centre.phone || "",
      email: centre.email || "",
      website: centre.website || "",
      logo_url: centre.logo_url || "",
      banner_url: centre.banner_url || "",
      latitude: centre.latitude || "",
      longitude: centre.longitude || "",
      is_active: Boolean(centre.is_active),
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setIsModalOpen(false);
    setEditingCentre(null);
    setForm(emptyForm);
  };

  const cleanPayload = () => ({
    ...form,
    description: form.description || null,
    address: form.address || null,
    city: form.city || null,
    state: form.state || null,
    country: form.country || null,
    phone: form.phone || null,
    email: form.email || null,
    website: form.website || null,
    logo_url: form.logo_url || null,
    banner_url: form.banner_url || null,
    latitude: form.latitude ? Number(form.latitude) : null,
    longitude: form.longitude ? Number(form.longitude) : null,
    is_active: form.is_active,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Centre name is required");
      return;
    }

    if (!form.slug.trim()) {
      alert("Slug is required");
      return;
    }

    try {
      setSaving(true);

      if (editingCentre) {
        await updateCentre(editingCentre.id, cleanPayload());
      } else {
        await createCentre(cleanPayload());
      }

      await fetchCentres();
      closeModal();
    } catch (error) {
      console.error(error);
      alert(editingCentre ? "Failed to update centre" : "Failed to create centre");
    } finally {
      setSaving(false);
    }
  };

  const mapsUrl = (centre: any) => {
    if (centre.latitude && centre.longitude) {
      return `https://www.google.com/maps?q=${centre.latitude},${centre.longitude}`;
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${centre.name || ""} ${centre.address || ""} ${centre.city || ""}`
    )}`;
  };

  const handleDelete = async (centre: any) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${centre.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(centre.id);
      await deleteCentre(centre.id);
      setCentres((prev) => prev.filter((item) => item.id !== centre.id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete centre");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[2rem] bg-[#1a0a00] p-8 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c8902a] text-[#1a0a00]">
                <Building2 className="h-7 w-7" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d4a853]">
                  Admin Panel
                </p>
                <h1 className="mt-2 font-serif text-4xl font-black">Centres</h1>
              </div>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#c8902a] px-6 py-3 text-sm font-black text-[#1a0a00] shadow-lg transition hover:bg-[#d4a853]"
            >
              <Plus className="h-4 w-4" />
              Register Centre
            </button>
          </div>

          <p className="mt-5 max-w-2xl text-sm font-bold leading-7 text-[#f5e8c8]">
            Manage ISKCON centres, contact details, address, website, images and
            Google Maps location.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-[#ede0c8] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-black text-[#1a0a00]">Centre List</h2>
            <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
              Total centres: {centres.length}
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a7a4a]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search centres..."
              className="w-full rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] py-3 pl-11 pr-4 text-sm font-bold text-[#1a0a00] outline-none transition placeholder:text-[#9a7a4a] focus:border-[#c8902a] focus:bg-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-[2rem] border border-[#ede0c8] bg-white">
            <Loader2 className="h-7 w-7 animate-spin text-[#c8902a]" />
          </div>
        ) : filteredCentres.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-[#ede0c8] bg-white p-12 text-center">
            <Building2 className="mx-auto mb-4 h-12 w-12 text-[#c8902a]" />
            <h3 className="text-2xl font-black text-[#1a0a00]">
              No centres found
            </h3>
            <button
              onClick={openCreateModal}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#c8902a] px-6 py-3 text-sm font-black text-[#1a0a00]"
            >
              <Plus className="h-4 w-4" />
              Register Centre
            </button>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredCentres.map((centre) => (
              <div
                key={centre.id}
                className="overflow-hidden rounded-[2rem] border border-[#ede0c8] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {centre.banner_url && (
                  <div className="h-48 bg-[#f5e8c8]">
                    <img
                      src={centre.banner_url}
                      alt={centre.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f5e8c8] text-[#8b6914]">
                        {centre.logo_url ? (
                          <img
                            src={centre.logo_url}
                            alt={centre.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-7 w-7" />
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-serif text-2xl font-black text-[#1a0a00]">
                            {centre.name}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-black ${
                              centre.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {centre.is_active ? "Active" : "Inactive"}
                          </span>
                          {centre.is_mother_temple && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-3 py-1 text-xs font-black text-white shadow-sm">
                              <Crown className="h-3.5 w-3.5" />
                              Mother Temple
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
                          /{centre.slug}
                        </p>

                        {[centre.city, centre.state, centre.country]
                          .filter(Boolean)
                          .length > 0 && (
                          <p className="mt-2 text-sm font-black text-[#5c3d1a]">
                            {[centre.city, centre.state, centre.country]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <a
                        href={mapsUrl(centre)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] px-4 py-3 text-sm font-black text-[#5c3d1a] transition hover:bg-[#f5e8c8]"
                      >
                        <MapPin className="h-4 w-4" />
                        Maps
                        <ExternalLink className="h-4 w-4" />
                      </a>

                      <button
                        onClick={() => openEditModal(centre)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-[#1a0a00] px-4 py-3 text-sm font-black text-white transition hover:bg-[#5c3d1a]"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(centre)}
                        disabled={deletingId === centre.id}
                        className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-black text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                      >
                        {deletingId === centre.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>

                  {centre.description && (
                    <p className="mt-5 text-sm font-bold leading-7 text-[#5c3d1a]">
                      {centre.description}
                    </p>
                  )}

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {centre.address && (
                      <InfoItem icon={<MapPin className="h-5 w-5" />} label="Address" value={centre.address} />
                    )}
                    {centre.phone && (
                      <InfoItem icon={<Phone className="h-5 w-5" />} label="Phone" value={centre.phone} />
                    )}
                    {centre.email && (
                      <InfoItem icon={<Mail className="h-5 w-5" />} label="Email" value={centre.email} />
                    )}
                    {centre.website && (
                      <InfoItem icon={<Globe2 className="h-5 w-5" />} label="Website" value={centre.website} isLink />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <CentreFormModal
          form={form}
          saving={saving}
          editingCentre={editingCentre}
          updateField={updateField}
          handleNameChange={handleNameChange}
          generateSlug={generateSlug}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function CentreFormModal({
  form,
  saving,
  editingCentre,
  updateField,
  handleNameChange,
  generateSlug,
  onClose,
  onSubmit,
}: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-[#fdfaf5] shadow-2xl">
        <div className="flex items-center justify-between bg-[#1a0a00] p-6 text-white">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d4a853]">
              {editingCentre ? "Update Centre" : "Register Centre"}
            </p>
            <h2 className="mt-2 font-serif text-3xl font-black">
              {editingCentre ? editingCentre.name : "New Centre"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-white/10 p-3 transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="max-h-[calc(90vh-104px)] overflow-y-auto p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <Input label="Centre Name *" value={form.name} onChange={handleNameChange} required />
            <Input
              label="Slug *"
              value={form.slug}
              onChange={(v: string) => updateField("slug", generateSlug(v))}
              required
            />

            <div className="md:col-span-2">
              <Textarea
                label="Description"
                value={form.description}
                onChange={(v: string) => updateField("description", v)}
              />
            </div>

            <div className="md:col-span-2">
              <Textarea
                label="Address"
                value={form.address}
                onChange={(v: string) => updateField("address", v)}
              />
            </div>

            <Input label="City" value={form.city} onChange={(v: string) => updateField("city", v)} />
            <Input label="State" value={form.state} onChange={(v: string) => updateField("state", v)} />
            <Input label="Country" value={form.country} onChange={(v: string) => updateField("country", v)} />
            <Input label="Phone" value={form.phone} onChange={(v: string) => updateField("phone", v)} />
            <Input label="Email" type="email" value={form.email} onChange={(v: string) => updateField("email", v)} />
            <Input label="Website" value={form.website} onChange={(v: string) => updateField("website", v)} />
            <Input label="Logo URL" value={form.logo_url} onChange={(v: string) => updateField("logo_url", v)} />
            <Input label="Banner URL" value={form.banner_url} onChange={(v: string) => updateField("banner_url", v)} />
            <Input label="Latitude" value={form.latitude} onChange={(v: string) => updateField("latitude", v)} />
            <Input label="Longitude" value={form.longitude} onChange={(v: string) => updateField("longitude", v)} />

            <label className="flex items-center justify-between rounded-2xl border border-[#ede0c8] bg-white p-4 md:col-span-2">
              <span className="font-black text-[#1a0a00]">Active Centre</span>
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => updateField("is_active", e.target.checked)}
                className="h-5 w-5 accent-[#c8902a]"
              />
            </label>
          </div>

          <div className="sticky bottom-0 mt-6 flex justify-end gap-3 bg-[#fdfaf5] py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-[#ede0c8] px-6 py-3 text-sm font-black text-[#5c3d1a]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#c8902a] px-6 py-3 text-sm font-black text-[#1a0a00] disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {editingCentre ? "Update Centre" : "Create Centre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, isLink = false }: any) {
  return (
    <div className="flex gap-4 rounded-2xl bg-[#fdfaf5] p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5e8c8] text-[#8b6914]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-wider text-[#9a7a4a]">{label}</p>
        {isLink ? (
          <a href={value} target="_blank" rel="noreferrer" className="mt-1 block break-all text-sm font-black text-[#1a0a00] hover:text-[#c8902a]">
            {value}
          </a>
        ) : (
          <p className="mt-1 text-sm font-black leading-6 text-[#1a0a00]">{value}</p>
        )}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required = false }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-[#5c3d1a]">{label}</label>
      <input
        type={type}
        required={required}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold text-[#1a0a00] outline-none focus:border-[#c8902a]"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }: any) {
  return (
    <div>
      <label className="mb-2 block text-sm font-black text-[#5c3d1a]">{label}</label>
      <textarea
        rows={3}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-2xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold text-[#1a0a00] outline-none focus:border-[#c8902a]"
      />
    </div>
  );
}