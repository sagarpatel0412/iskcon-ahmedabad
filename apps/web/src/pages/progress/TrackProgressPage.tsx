import { useEffect, useMemo, useState } from "react";
import { getMyDailyProgress } from "../../services/progressService";
import AppLoader from "../../components/common/AppLoader";
import ProgressLevelCard from "./ProgressLevelCard";

export default function TrackProgressPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await getMyDailyProgress();
      setEntries(Array.isArray(res.data) ? res.data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = useMemo(() => {
    const totalRounds = entries.reduce(
      (sum, item) => sum + Number(item.mala_count || 0),
      0,
    );

    const fullDays = entries.filter(
      (item) => Number(item.mala_count) >= 16,
    ).length;
    const lectures = entries.filter((item) => item.lecture_attended).length;
    const booksCompleted = entries.filter(
      (item) => item.book_status === "completed",
    ).length;

    return {
      totalRounds,
      fullDays,
      lectures,
      booksCompleted,
      daysLogged: entries.length,
    };
  }, [entries]);

  if (loading) {
    return (
      <AppLoader
        title="Loading Progress"
        subtitle="Fetching spiritual wisdom..."
      />
    );
  }

  return (
    <div className="min-h-screen p-5">
      <div className="mb-5 rounded-2xl bg-[#1a0a00] px-5 py-3 text-center text-xs font-black tracking-[0.25em] text-[#d4a853]">
        ॐ नमो भगवते वासुदेवाय · My Progress
      </div>

      <div className="mb-6">
        <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
          Track My Progress
        </h1>
        <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
          Your sādhana history and growth summary.
        </p>
      </div>

      <section className="mb-5 rounded-2xl bg-gradient-to-br from-[#1a0a00] to-[#3d2200] p-6 text-center shadow-xl">
        <div className="font-serif text-6xl font-black text-[#d4a853]">
          🔥 {stats.fullDays}
        </div>
        <p className="mt-2 text-lg font-black text-white">Full Mala Days</p>
        <p className="mt-1 text-sm font-bold text-[#d4a853]">
          Keep going. Consistency is bhakti in action.
        </p>
      </section>

      <ProgressLevelCard />

      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard
          number={stats.totalRounds}
          label="Total Rounds"
          sub="All entries"
        />
        <StatCard number={stats.daysLogged} label="Days Logged" sub="Total" />
        <StatCard number={stats.lectures} label="Lectures" sub="Attended" />
        <StatCard
          number={stats.booksCompleted}
          label="Books Completed"
          sub="All time"
        />
      </section>

      <section className="mb-5 rounded-2xl border border-[#ede0c8] bg-white p-5">
        <h2 className="mb-5 font-serif text-3xl font-black text-[#1a0a00]">
          Recent Sādhana
        </h2>

        <div className="space-y-3">
          {entries.length === 0 ? (
            <div className="rounded-2xl bg-[#f7f0e4] p-10 text-center">
              <div className="text-5xl">🙏</div>
              <h3 className="mt-4 font-serif text-3xl font-black text-[#1a0a00]">
                No progress logged yet
              </h3>
              <p className="mt-2 text-sm font-bold text-[#9a7a4a]">
                Start by logging today’s sādhana.
              </p>
            </div>
          ) : (
            entries.map((entry) => (
              <ProgressEntryCard key={entry.uuid || entry.id} entry={entry} />
            ))
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-[#ede0c8] bg-white p-5">
        <h2 className="mb-5 font-serif text-3xl font-black text-[#1a0a00]">
          Rounds Overview
        </h2>

        <div className="flex h-40 items-end gap-2">
          {entries
            .slice(0, 14)
            .reverse()
            .map((entry) => {
              const height = Math.max(
                8,
                Math.min(100, (Number(entry.mala_count || 0) / 16) * 100),
              );

              return (
                <div
                  key={entry.uuid || entry.id}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div className="text-xs font-black text-[#5c3d1a]">
                    {entry.mala_count || 0}
                  </div>

                  <div
                    className={`w-full rounded-t-lg ${
                      Number(entry.mala_count || 0) >= 16
                        ? "bg-[#c8902a]"
                        : "border border-[#c8902a] bg-[#f5e8c8]"
                    }`}
                    style={{ height: `${height}%` }}
                  />

                  <div className="text-[10px] font-bold text-[#9a7a4a]">
                    {formatDay(entry.progress_date)}
                  </div>
                </div>
              );
            })}
        </div>
      </section>
    </div>
  );
}

function ProgressEntryCard({ entry }: { entry: any }) {
  const complete = Number(entry.mala_count || 0) >= 16;

  return (
    <div className="rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-2xl font-black text-[#1a0a00]">
            {formatFullDate(entry.progress_date)}
          </h3>
          <p className="mt-1 text-xs font-bold text-[#9a7a4a]">
            Logged progress entry
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-black ${
            complete
              ? "bg-emerald-50 text-emerald-700"
              : "bg-[#f5e8c8] text-[#8b6914]"
          }`}
        >
          {complete ? "Complete" : "Partial"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-sm font-bold text-[#5c3d1a]">
        <span>🧿 {entry.mala_count || 0} rounds</span>
        <span>📖 {entry.lecture_attended ? "Lecture ✓" : "No lecture"}</span>
        <span>📚 {entry.books_read_count || 0} read</span>
      </div>

      {entry.book_name && (
        <div className="mt-4 rounded-xl bg-white p-3">
          <p className="text-xs font-black uppercase tracking-wider text-[#9a7a4a]">
            Current Book
          </p>
          <p className="mt-1 font-black text-[#1a0a00]">{entry.book_name}</p>
          <p className="mt-1 text-xs font-bold text-[#8b6914]">
            {entry.book_status}
          </p>
        </div>
      )}

      {entry.notes && (
        <div className="mt-4 rounded-xl bg-[#f7f0e4] p-3 text-sm italic leading-6 text-[#5c3d1a]">
          “{entry.notes}”
        </div>
      )}
    </div>
  );
}

function StatCard({
  number,
  label,
  sub,
}: {
  number: any;
  label: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-[#ede0c8] bg-white p-5 text-center">
      <div className="font-serif text-4xl font-black text-[#c8902a]">
        {number}
      </div>
      <div className="mt-2 text-xs font-black uppercase tracking-wider text-[#9a7a4a]">
        {label}
      </div>
      <div className="mt-1 text-xs font-bold text-[#5c3d1a]">{sub}</div>
    </div>
  );
}

function formatFullDate(date?: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDay(date?: string) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}
