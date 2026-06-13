import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  CalendarDays,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { getFestivalCalendar } from "../../services/festivalCalendarService.ts";

export default function FestivalCalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [year, setYear] = useState(2026);
  const [city, setCity] = useState("Ahmedabad");
  const [country, setCountry] = useState("India");
  const [loading, setLoading] = useState(false);

  const upcomingEvents = useMemo(() => {
    const today = new Date();

    return events
      .filter((event) => new Date(event.start) >= today)
      .slice(0, 5);
  }, [events]);

  async function loadCalendar() {
    try {
      setLoading(true);

      const data = await getFestivalCalendar({
        year,
        city,
        country,
      });

      setEvents(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCalendar();
  }, []);

  function handleEventClick(info: any) {
    const event = info.event;

    const title = event.title;
    const description = `
${event.extendedProps.description || ""}

${event.extendedProps.fasting || ""}
  `.trim();

    const startDate = event.start;
    const endDate = event.end || event.start;

    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]|\.\d{3}/g, "");
    };

    const googleCalendarUrl =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(title)}` +
      `&details=${encodeURIComponent(description)}` +
      `&dates=${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`;

    window.open(googleCalendarUrl, "_blank");
  }

  const formatDate = (date?: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-yellow-50 px-4 py-8">
      <style>
        {`
          .fc {
            font-family: inherit;
          }

          .fc .fc-toolbar-title {
            font-weight: 900;
            color: #0f172a;
          }

          .fc .fc-button {
            border: none !important;
            border-radius: 999px !important;
            background: #ea580c !important;
            padding: 0.55rem 1rem !important;
            font-weight: 800 !important;
            box-shadow: none !important;
          }

          .fc .fc-button:hover {
            background: #c2410c !important;
          }

          .fc .fc-button-primary:disabled {
            background: #fdba74 !important;
          }

          .fc .fc-daygrid-day-number {
            color: #334155;
            font-weight: 800;
            padding: 0.5rem;
          }

          .fc .fc-col-header-cell {
            background: #fff7ed;
            padding: 0.75rem 0;
          }

          .fc .fc-col-header-cell-cushion {
            color: #9a3412;
            font-weight: 900;
            text-decoration: none;
          }

          .fc .fc-daygrid-event {
            border: none !important;
            border-radius: 999px !important;
            padding: 3px 8px !important;
            font-weight: 800;
            cursor: pointer;
          }

          .fc .fc-day-today {
            background: #ffedd5 !important;
          }

          .fc-theme-standard td,
          .fc-theme-standard th,
          .fc-theme-standard .fc-scrollgrid {
            border-color: #fed7aa !important;
          }
        `}
      </style>

      <section className="mx-auto max-w-7xl space-y-8">
        <div className="relative min-h-[340px] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-700 via-amber-500 to-yellow-400 p-8 text-white shadow-2xl md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(120,53,15,0.32),transparent_35%)]" />
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-sm" />
          <div className="absolute bottom-[-80px] right-32 h-60 w-60 rounded-full bg-orange-900/20 blur-md" />

          <div className="relative z-10 flex min-h-[260px] flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-5 py-2 text-sm font-black backdrop-blur">
                <Sparkles className="h-4 w-4" />
                Vaishnava Calendar
              </div>

              <h1 className="text-4xl font-black leading-tight md:text-6xl">
                Festival Calendar
              </h1>

              <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-orange-50">
                View ISKCON and Vaishnava festivals by year and location. Click
                any festival to add it directly to Google Calendar.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-black uppercase tracking-wide text-orange-700 shadow-sm">
                  <MapPin className="h-4 w-4" />
                  {city}, {country}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-xs font-black uppercase tracking-wide text-white ring-1 ring-white/30">
                  <CalendarDays className="h-4 w-4" />
                  {year}
                </span>
              </div>
            </div>

            <div className="grid w-full max-w-sm grid-cols-2 gap-4">
              <div className="rounded-3xl border border-white/25 bg-white/20 p-5 backdrop-blur">
                <p className="text-xs font-black uppercase text-orange-50">
                  Festivals
                </p>
                <p className="mt-2 text-4xl font-black">{events.length}</p>
              </div>

              <div className="rounded-3xl border border-white/25 bg-white/20 p-5 backdrop-blur">
                <p className="text-xs font-black uppercase text-orange-50">
                  Location
                </p>
                <p className="mt-2 text-2xl font-black">{city}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
              <Search className="h-6 w-6" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Generate Calendar
              </h2>
              <p className="text-sm font-semibold text-slate-500">
                Select year and location to generate the festival calendar.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[160px_1fr_1fr_160px]">
            <Input
              type="number"
              value={year}
              onChange={(value:any) => setYear(Number(value))}
              placeholder="Year"
            />

            <Input
              value={city}
              onChange={setCity}
              placeholder="City"
              readOnly={true}
            />

            <Input
              value={country}
              onChange={setCountry}
              placeholder="Country"
              readOnly={true}
            />

            <button
              onClick={loadCalendar}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-3 font-black text-white shadow hover:bg-orange-700 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              Load
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
            {loading ? (
              <div className="flex min-h-[500px] items-center justify-center">
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-orange-700" />
                <span className="font-bold text-orange-700">
                  Loading calendar...
                </span>
              </div>
            ) : (
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                height="auto"
                eventClick={handleEventClick}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth",
                }}
                eventColor="#ea580c"
              />
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-orange-100 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-yellow-100 p-3 text-yellow-700">
                  <CalendarDays className="h-6 w-6" />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Upcoming Festivals
                  </h2>
                  <p className="text-sm font-semibold text-slate-500">
                    Next events from this calendar.
                  </p>
                </div>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-5 text-center">
                  <p className="text-sm font-bold text-slate-500">
                    No upcoming festivals found.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <button
                      key={`${event.title}-${index}`}
                      onClick={() => {
                        const fakeInfo = {
                          event: {
                            title: event.title,
                            start: new Date(event.start),
                            end: event.end ? new Date(event.end) : null,
                            extendedProps: event.extendedProps || event,
                          },
                        };

                        handleEventClick(fakeInfo);
                      }}
                      className="w-full rounded-2xl bg-orange-50 p-4 text-left transition hover:bg-orange-100"
                    >
                      <p className="text-sm font-black text-slate-900">
                        {event.title}
                      </p>

                      <p className="mt-1 text-xs font-bold text-orange-700">
                        {formatDate(event.start)}
                      </p>

                      <p className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-slate-500">
                        <ExternalLink className="h-3 w-3" />
                        Add to Google Calendar
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-[2rem] border border-orange-100 bg-gradient-to-br from-orange-50 to-yellow-50 p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-900">
                Tip
              </h2>

              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                Festival dates can depend on location. Always generate the
                calendar using the city where you will observe the festival.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Input({ value, onChange, placeholder, type = "text", readOnly = false }: any) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="rounded-2xl border border-orange-100 bg-orange-50/40 px-5 py-3 font-semibold text-slate-800 outline-none transition focus:border-orange-500 focus:bg-white"
      readOnly={readOnly}
    />
  );
}