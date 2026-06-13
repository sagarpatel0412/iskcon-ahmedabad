import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Save } from "lucide-react";
import { createDailyProgress } from "../../services/progressService";

export default function DailyProgressPage() {
  const navigate = useNavigate();

  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    progress_date: today,
    mala_count: 16,
    lecture_attended: true,
    lecture_title: "Bhāgavatam Morning Class",
    books_read_count: 1,
    current_book: "Śrīmad Bhāgavatam — Canto 1",
    book_status: "ongoing",
    notes: "",
  });

  const [saving, setSaving] = useState(false);

  const percent = useMemo(() => {
    return Math.min((form.mala_count / 16) * 100, 100);
  }, [form.mala_count]);

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const changeMala = (value: number) => {
    setForm((prev) => ({
      ...prev,
      mala_count: Math.max(0, Math.min(64, prev.mala_count + value)),
    }));
  };

  const save = async () => {
    try {
      setSaving(true);

      await createDailyProgress({
        ...form,
        mala_count: Number(form.mala_count),
        books_read_count: Number(form.books_read_count || 0),
      });

      alert("Progress saved! Hare Krishna 🙏");
      navigate("/progress/track");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to save progress");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-5">
      <div className="mb-5 rounded-2xl bg-[#1a0a00] px-5 py-3 text-center text-xs font-black tracking-[0.25em] text-[#d4a853]">
        ॐ नमो भगवते वासुदेवाय · Daily Sādhana Tracker
      </div>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-black text-[#1a0a00]">
            Log Progress
          </h1>
          <p className="mt-1 text-sm font-bold text-[#9a7a4a]">
            Record your daily sādhana.
          </p>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-[#c8902a] px-5 py-3 text-sm font-black text-[#1a0a00] hover:bg-[#d4a853] disabled:opacity-60"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Entry"}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <main className="space-y-5">
          <Card title="Progress Date">
            <Input
              label="Progress Date"
              type="date"
              value={form.progress_date}
              onChange={(v:any) => update("progress_date", v)}
            />
          </Card>

          <Card title="🧿 Japa — Mala Count">
            <div className="flex flex-col items-center">
              <div
                className="flex h-44 w-44 items-center justify-center rounded-full border-4 border-[#f5e8c8]"
                style={{
                  background: `conic-gradient(#c8902a ${percent}%, #f5e8c8 ${percent}%)`,
                }}
              >
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-lg">
                  <div className="font-serif text-5xl font-black text-[#1a0a00]">
                    {form.mala_count}
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-[#9a7a4a]">
                    Rounds
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => changeMala(-1)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7f0e4] text-[#5c3d1a]"
                >
                  <Minus />
                </button>

                <button
                  onClick={() => changeMala(-4)}
                  className="rounded-full bg-[#ede0c8] px-5 py-3 font-black text-[#5c3d1a]"
                >
                  -4
                </button>

                <button
                  onClick={() => changeMala(4)}
                  className="rounded-full bg-[#c8902a] px-5 py-3 font-black text-[#1a0a00]"
                >
                  +4
                </button>

                <button
                  onClick={() => changeMala(1)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[#c8902a] text-[#1a0a00]"
                >
                  <Plus />
                </button>
              </div>

              <div className="mt-6 flex max-w-md flex-wrap justify-center gap-2">
                {Array.from({ length: 16 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      update(
                        "mala_count",
                        index < form.mala_count ? index : index + 1
                      )
                    }
                    className={`h-6 w-6 rounded-full border ${
                      index < form.mala_count
                        ? "border-[#8b6914] bg-[#c8902a]"
                        : "border-[#ede0c8] bg-[#ede0c8]"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-3 text-xs font-bold text-[#9a7a4a]">
                Tap a bead to update rounds.
              </p>
            </div>
          </Card>

          <Card title="📖 Lecture / Class">
            <label className="flex items-center justify-between rounded-xl bg-[#f7f0e4] p-4">
              <div>
                <p className="font-black text-[#1a0a00]">
                  Attended a lecture today
                </p>
                <p className="text-xs font-bold text-[#9a7a4a]">
                  Bhāgavatam class, Gītā seminar, online class etc.
                </p>
              </div>

              <input
                type="checkbox"
                checked={form.lecture_attended}
                onChange={(e) => update("lecture_attended", e.target.checked)}
                className="h-5 w-5"
              />
            </label>

            {form.lecture_attended && (
              <Input
                label="Lecture Title"
                value={form.lecture_title}
                onChange={(v:any) => update("lecture_title", v)}
              />
            )}
          </Card>

          <Card title="📚 Book Reading">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Pages / Chapters Read"
                type="number"
                value={String(form.books_read_count)}
                onChange={(v:any) => update("books_read_count", Number(v))}
              />

              <label>
                <span className="text-sm font-black text-[#5c3d1a]">
                  Book Status
                </span>
                <select
                  value={form.book_status}
                  onChange={(e) => update("book_status", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
                >
                  <option value="not_started">Not Started</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </label>

              <div className="md:col-span-2">
                <Input
                  label="Current Book"
                  value={form.current_book}
                  onChange={(v:any) => update("book_name", v)}
                />
              </div>
            </div>
          </Card>

          <Card title="📝 Notes & Realizations">
            <label>
              <span className="text-sm font-black text-[#5c3d1a]">
                Personal notes, key verse heard, realizations
              </span>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Write realization from japa, lecture, reading..."
                className="mt-2 min-h-36 w-full rounded-xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
              />
            </label>
          </Card>
        </main>

        <aside className="space-y-5">
          <section className="rounded-2xl bg-gradient-to-br from-[#1a0a00] to-[#3d2200] p-6 text-white shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#d4a853]">
              Today
            </p>
            <h2 className="mt-3 font-serif text-4xl font-black">
              Hare Krishna 🙏
            </h2>
            <p className="mt-2 text-sm font-bold text-[#d4a853]">
              Every round, every page, every lecture is progress.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Chip active={form.mala_count >= 16}>
                🧿 {form.mala_count} Rounds
              </Chip>
              <Chip active={form.lecture_attended}>📖 Lecture</Chip>
              <Chip active={form.books_read_count > 0}>📚 Reading</Chip>
            </div>
          </section>

          <section className="rounded-2xl border border-[#ede0c8] bg-white p-5">
            <h3 className="font-serif text-2xl font-black text-[#1a0a00]">
              Quick Summary
            </h3>

            <div className="mt-4 space-y-3 text-sm font-bold text-[#5c3d1a]">
              <p>🧿 Rounds: {form.mala_count}</p>
              <p>📖 Lecture: {form.lecture_attended ? "Yes" : "No"}</p>
              <p>📚 Reading: {form.books_read_count} pages/chapters</p>
              <p>📘 Book: {form.current_book || "-"}</p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <section className="rounded-2xl border border-[#ede0c8] bg-white p-5">
      <h2 className="mb-4 border-b border-[#ede0c8] pb-3 font-serif text-2xl font-black text-[#1a0a00]">
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
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-[#ede0c8] bg-white px-4 py-3 text-sm font-bold outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}

function Chip({ active, children }: any) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-black ${
        active
          ? "border-emerald-300 bg-emerald-900/30 text-emerald-200"
          : "border-[#5c3d1a] bg-white/10 text-[#d4a853]"
      }`}
    >
      {children}
    </span>
  );
}