import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  ExternalLink,
  Globe2,
  Mail,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import { getCentres } from "../../services/centreService";
import AppLoader from "../../components/common/AppLoader";
import PageSeo from "../../components/seo/PageSeo";

export default function CentresPage() {
  const [centres, setCentres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCentre, setSelectedCentre] = useState<any>(null);

  useEffect(() => {
    getCentres()
      .then((res) => {
        const items = res.data || [];
        setCentres(items);
        setSelectedCentre(items[0] || null);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredCentres = useMemo(() => {
    const q = search.toLowerCase();

    return centres.filter((centre) =>
      `${centre.name || ""} ${centre.address || ""} ${centre.city || ""} ${centre.state || ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [centres, search]);

  const mapsUrl = (centre: any) => {
    if (!centre) return "#";

    if (centre.latitude && centre.longitude) {
      return `https://www.google.com/maps?q=${centre.latitude},${centre.longitude}`;
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${centre.name || ""} ${centre.address || ""} ${centre.city || ""}`,
    )}`;
  };

  const mapEmbedUrl = (centre: any) => {
    if (!centre) return "";

    if (centre.latitude && centre.longitude) {
      return `https://maps.google.com/maps?q=${centre.latitude},${centre.longitude}&z=15&output=embed`;
    }

    return `https://maps.google.com/maps?q=${encodeURIComponent(
      `${centre.name || ""} ${centre.address || ""} ${centre.city || ""}`,
    )}&z=14&output=embed`;
  };

  if (loading) {
    return (
      <AppLoader
        title="Loading Centres"
        subtitle="Fetching spiritual wisdom..."
      />
    );
  }

  return (
    <>
      <PageSeo
        title="Explore Centres | ISKCON Ahmedabad"
        description="Explore Centres in Ahmedabad"
      />

      <div className="rounded-[2rem] bg-gradient-to-br from-orange-50 via-white to-amber-100 p-4 md:p-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-xl">
          <div className="grid min-h-[720px] lg:grid-cols-[0.9fr_1.1fr]">
            {/* Contact Section */}
            <section className="p-6 md:p-10">
              <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3 font-bold text-slate-900">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <Building2 className="h-5 w-5" />
                  </span>
                  ISKCON Centres
                </div>

                <div className="relative w-full md:w-60">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      const firstMatch = centres.find((centre) =>
                        `${centre.name || ""} ${centre.address || ""} ${centre.city || ""} ${centre.state || ""}`
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase()),
                      );

                      setSelectedCentre(firstMatch || null);
                    }}
                    placeholder="Search centre..."
                    className="w-full rounded-2xl border border-orange-100 bg-orange-50/60 py-3 pl-11 pr-4 text-sm outline-none focus:border-orange-300 focus:bg-white"
                  />
                </div>
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                Get in touch
              </p>

              <h1 className="mt-4 max-w-xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                Visit Our Spiritual Centres
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500">
                Find ISKCON centre contact details, temple address and Google
                Maps directions in one place.
              </p>

              {filteredCentres.length > 1 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {filteredCentres.map((centre) => (
                    <button
                      key={centre.id}
                      type="button"
                      onClick={() => setSelectedCentre(centre)}
                      className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                        selectedCentre?.id === centre.id
                          ? "bg-orange-600 text-white shadow-md"
                          : "bg-orange-50 text-slate-600 hover:bg-orange-100"
                      }`}
                    >
                      {centre.name}
                    </button>
                  ))}
                </div>
              )}

              {!selectedCentre ? (
                <div className="mt-10 rounded-3xl border border-dashed border-orange-200 bg-orange-50/60 p-8 text-center">
                  <Building2 className="mx-auto mb-3 h-10 w-10 text-orange-400" />
                  <p className="font-semibold text-slate-900">
                    No centre found
                  </p>
                </div>
              ) : (
                <div className="mt-10 space-y-5">
                  <div>
                    <h2 className="text-2xl font-black text-slate-950">
                      {selectedCentre.name}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                      {[selectedCentre.city, selectedCentre.state]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  </div>

                  {selectedCentre.description && (
                    <p className="max-w-xl text-sm leading-7 text-slate-500">
                      {selectedCentre.description}
                    </p>
                  )}

                  <div className="space-y-4 pt-4">
                    {selectedCentre.address && (
                      <ContactRow
                        icon={<MapPin className="h-5 w-5" />}
                        title="Address"
                        value={selectedCentre.address}
                      />
                    )}

                    {selectedCentre.phone && (
                      <ContactRow
                        icon={<Phone className="h-5 w-5" />}
                        title="Phone"
                        value={selectedCentre.phone}
                      />
                    )}

                    {selectedCentre.email && (
                      <ContactRow
                        icon={<Mail className="h-5 w-5" />}
                        title="Email"
                        value={selectedCentre.email}
                      />
                    )}

                    {selectedCentre.website && (
                      <ContactRow
                        icon={<Globe2 className="h-5 w-5" />}
                        title="Website"
                        value={selectedCentre.website}
                        isLink
                      />
                    )}
                  </div>

                  <a
                    href={mapsUrl(selectedCentre)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-700"
                  >
                    Get Directions
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </section>

            {/* Map Section */}
            <section className="relative min-h-[420px] bg-orange-50">
              {selectedCentre ? (
                <>
                  <iframe
                    title={selectedCentre.name}
                    src={mapEmbedUrl(selectedCentre)}
                    className="h-full min-h-[720px] w-full border-0"
                    loading="lazy"
                  />

                  <div className="absolute bottom-6 left-6 right-6 rounded-[1.7rem] bg-white/95 p-5 shadow-xl backdrop-blur">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                        <MapPin className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-950">
                          {selectedCentre.name}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                          {selectedCentre.address || "Address not available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-full min-h-[720px] items-center justify-center">
                  <Building2 className="h-14 w-14 text-orange-300" />
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

function ContactRow({ icon, title, value, isLink = false }: any) {
  return (
    <div className="flex gap-4 rounded-3xl bg-orange-50/70 p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-orange-600 shadow-sm">
        {icon}
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500">
          {title}
        </p>

        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block break-all text-sm font-medium leading-6 text-slate-700 hover:text-orange-600"
          >
            {value}
          </a>
        ) : (
          <p className="mt-1 text-sm font-medium leading-6 text-slate-700">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
