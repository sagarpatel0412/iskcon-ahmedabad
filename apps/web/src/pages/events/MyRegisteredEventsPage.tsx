import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { CalendarDays, Clock, MapPin, QrCode, Ticket, X } from "lucide-react";
import { getMyRegistrations } from "../../services/eventService";
import { formatDate, posterUrl } from "./eventStyles";
import AppLoader from "../../components/common/AppLoader";

export default function MyRegisteredEventsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await getMyRegistrations();
      setRegistrations(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <AppLoader
        title="Loading Events"
        subtitle="Fetching spiritual wisdom..."
      />
    );
  }

  return (
    <div className="min-h-screen p-5">
      <div className="mb-5 rounded-2xl bg-[#1a0a00] px-5 py-3 text-center text-xs font-black tracking-[0.25em] text-[#d4a853]">
        ॐ नमो भगवते वासुदेवाय · My Registered Events
      </div>

      <div className="mb-6">
        <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
          My Registered Events
        </h1>
        <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
          View your registrations and entry QR codes.
        </p>
      </div>

      {registrations.length === 0 ? (
        <div className="rounded-3xl border border-[#ede0c8] bg-white p-12 text-center">
          <div className="text-5xl">🙏</div>
          <h2 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
            No registered events
          </h2>
          <p className="mt-2 text-sm font-bold text-[#9a7a4a]">
            Your registered events will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((registration) => (
            <RegisteredEventRow
              key={registration.uuid}
              registration={registration}
              onClick={() => setSelected(registration)}
            />
          ))}
        </div>
      )}

      {selected && (
        <RegistrationModal
          registration={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function RegisteredEventRow({
  registration,
  onClick,
}: {
  registration: any;
  onClick: () => void;
}) {
  const event = registration.event || registration.Event || {};
  const poster = event.poster_url ? posterUrl(event.poster_url) : "";

  return (
    <button
      onClick={onClick}
      className="flex w-full flex-wrap gap-4 rounded-3xl border border-[#ede0c8] bg-white p-4 text-left shadow-sm transition hover:shadow-xl"
    >
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a0a00] to-[#3d2200]">
        {poster ? (
          <img src={poster} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-[#c8902a]">
            ॐ
          </div>
        )}
      </div>

      <div className="min-w-[240px] flex-1">
        <div className="mb-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            {registration.status || "registered"}
          </span>

          <span className="rounded-full bg-[#f5e8c8] px-3 py-1 text-xs font-black text-[#8b6914]">
            {event.is_paid ? `Paid · ₹${event.price_amount || 0}` : "Free"}
          </span>
        </div>

        <h2 className="font-serif text-2xl font-black text-[#1a0a00]">
          {event.title || "Event"}
        </h2>

        <div className="mt-2 flex flex-wrap gap-4 text-sm font-bold text-[#9a7a4a]">
          <span>📅 {formatDate(event.event_date)}</span>
          <span>
            🕐 {event.start_time || "-"} - {event.end_time || "-"}
          </span>
          <span>📍 {event.location || "-"}</span>
        </div>
      </div>

      <div className="flex items-center">
        <span className="inline-flex items-center gap-2 rounded-xl bg-[#1a0a00] px-4 py-3 text-sm font-black text-[#d4a853]">
          <QrCode size={18} />
          Show QR
        </span>
      </div>
    </button>
  );
}

function RegistrationModal({
  registration,
  onClose,
}: {
  registration: any;
  onClose: () => void;
}) {
  const event = registration.event || registration.Event || {};
  const qrToken = registration.qr_token || registration.qrToken || "";
  const poster = event.poster_url ? posterUrl(event.poster_url) : "";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-[#fdfaf5] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ede0c8] bg-[#fdfaf5] p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#c8902a]">
              Event Pass
            </p>
            <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
              {event.title || "Registered Event"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-white p-3 text-[#1a0a00] shadow-sm"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid gap-6 p-5 lg:grid-cols-[1fr_360px]">
          <main className="space-y-5">
            <section className="overflow-hidden rounded-3xl border border-[#ede0c8] bg-white">
              {poster ? (
                <img src={poster} className="h-72 w-full object-cover" />
              ) : (
                <div className="flex h-72 items-center justify-center bg-gradient-to-br from-[#1a0a00] to-[#3d2200]">
                  <div className="text-center">
                    <div className="text-7xl text-[#c8902a]/30">ॐ</div>
                    <h3 className="mt-3 font-serif text-4xl font-black text-[#d4a853]">
                      {event.title}
                    </h3>
                  </div>
                </div>
              )}

              <div className="p-5">
                <h3 className="font-serif text-3xl font-black text-[#1a0a00]">
                  {event.title}
                </h3>

                <p className="mt-3 whitespace-pre-line text-sm font-medium leading-7 text-[#5c3d1a]">
                  {event.description || "No description available."}
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-[#ede0c8] bg-white p-5">
              <h3 className="mb-4 font-serif text-2xl font-black text-[#1a0a00]">
                Event Details
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <Info
                  icon={CalendarDays}
                  label="Date"
                  value={formatDate(event.event_date)}
                />
                <Info
                  icon={Clock}
                  label="Time"
                  value={`${event.start_time || "-"} - ${event.end_time || "-"}`}
                />
                <Info
                  icon={MapPin}
                  label="Location"
                  value={event.location || "-"}
                />
                <Info
                  icon={Ticket}
                  label="Registration Status"
                  value={registration.status || "registered"}
                />
              </div>
            </section>

            {registration.responses && (
              <section className="rounded-3xl border border-[#ede0c8] bg-white p-5">
                <h3 className="mb-4 font-serif text-2xl font-black text-[#1a0a00]">
                  Your Submitted Details
                </h3>

                <div className="grid gap-3 md:grid-cols-2">
                  {Object.entries(registration.responses).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] p-4"
                      >
                        <p className="text-xs font-black uppercase tracking-wider text-[#9a7a4a]">
                          {key.replace(/_/g, " ")}
                        </p>
                        <p className="mt-1 font-black text-[#1a0a00]">
                          {String(value)}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </section>
            )}
          </main>

          <aside className="space-y-5">
            <section className="rounded-3xl border-2 border-[#c8902a] bg-white p-6 text-center">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#8b6914]">
                Entry QR Code
              </p>

              <div className="mx-auto mt-5 inline-block rounded-3xl border border-[#ede0c8] bg-white p-5">
                {qrToken ? (
                  <QRCodeCanvas
                    value={qrToken}
                    size={230}
                    bgColor="#ffffff"
                    fgColor="#1a0a00"
                    level="H"
                    includeMargin
                  />
                ) : (
                  <div className="flex h-[230px] w-[230px] items-center justify-center rounded-2xl bg-[#f7f0e4] text-center font-black text-[#9a7a4a]">
                    QR token missing
                  </div>
                )}
              </div>

              <p className="mt-4 text-xs font-bold leading-5 text-[#9a7a4a]">
                Show this QR code at the entry gate. Devotee will scan this to
                grant your entry.
              </p>

              {qrToken && (
                <div className="mt-4 break-all rounded-xl bg-[#f7f0e4] p-3 font-mono text-xs text-[#5c3d1a]">
                  {qrToken}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-[#3d2200] bg-gradient-to-br from-[#1a0a00] to-[#3d2200] p-6">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d4a853]">
                Payment
              </p>

              <h3 className="mt-3 font-serif text-4xl font-black text-white">
                {event.is_paid ? `₹${event.price_amount || 0}` : "Free"}
              </h3>

              <p className="mt-2 text-sm font-bold text-[#d4a853]">
                {event.is_paid
                  ? registration.payment_status || "Payment status"
                  : "No payment required"}
              </p>
            </section>

            <section className="rounded-3xl border border-[#c8902a] bg-[#f5e8c8] p-5">
              <p className="text-sm font-black uppercase tracking-wider text-[#8b6914]">
                🪔 Organised by
              </p>

              <div className="mt-4 flex items-center gap-3">
                <img
                  src="https://iskconahmedabad.com/images/logo.png"
                  className="h-12 w-12 rounded-full border-2 border-[#c8902a] bg-white object-contain"
                />

                <div>
                  <h3 className="font-black text-[#1a0a00]">
                    {event.centre?.name || "ISKCON Ahmedabad"}
                  </h3>
                  <p className="text-xs font-bold text-[#9a7a4a]">
                    Official Temple Event
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: any;
}) {
  return (
    <div className="rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] p-4">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5e8c8] text-[#8b6914]">
        <Icon size={21} />
      </div>

      <p className="text-xs font-black uppercase tracking-wider text-[#9a7a4a]">
        {label}
      </p>

      <p className="mt-1 font-black text-[#1a0a00]">{value}</p>
    </div>
  );
}
