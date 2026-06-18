import { useState } from "react";
import { AlertTriangle, Bug, ShieldCheck } from "lucide-react";
import { submitProblemReport } from "../../services/supportService";
import PageSeo from "../../components/seo/PageSeo";

export default function ReportProblemPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    problem_type: "app_bug",
    page_url: window.location.href,
    title: "",
    description: "",
    priority: "medium",
  });

  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    if (!form.title || !form.description) {
      alert("Problem title and description are required");
      return;
    }

    try {
      setLoading(true);
      await submitProblemReport(form);
      alert("Problem reported successfully. We will check it soon 🙏");
      setForm({
        name: "",
        email: "",
        phone: "",
        problem_type: "app_bug",
        page_url: window.location.href,
        title: "",
        description: "",
        priority: "medium",
      });
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageSeo
        title="Report Problem | ISKCON Ahmedabad"
        description="Report Problem"
      />

      <div className="-mx-5 -my-8 min-h-screen bg-[#fdfaf5]">
        <section className="bg-[#1a0a00] px-5 py-24 text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-[#d4a853]" />
          <h1 className="mt-5 font-serif text-6xl font-black text-white">
            Report a Problem
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-bold leading-8 text-[#f5e8c8]">
            Found a bug, payment issue, login issue or content problem? Report
            it here without login.
          </p>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[1fr_380px]">
          <main className="rounded-[2rem] border border-[#ede0c8] bg-white p-8 shadow-sm">
            <h2 className="font-serif text-4xl font-black text-[#1a0a00]">
              Problem Details
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Input
                label="Name"
                value={form.name}
                onChange={(v: any) => update("name", v)}
              />
              <Input
                label="Email"
                value={form.email}
                onChange={(v: any) => update("email", v)}
              />
              <Input
                label="Phone"
                value={form.phone}
                onChange={(v: any) => update("phone", v)}
              />

              <Select
                label="Problem Type"
                value={form.problem_type}
                onChange={(v: any) => update("problem_type", v)}
              >
                <option value="login_issue">Login Issue</option>
                <option value="payment_issue">Payment Issue</option>
                <option value="event_issue">Event Issue</option>
                <option value="content_issue">
                  Journal / Newsletter Issue
                </option>
                <option value="app_bug">App Bug</option>
                <option value="other">Other</option>
              </Select>

              <Input
                label="Page URL"
                value={form.page_url}
                onChange={(v: any) => update("page_url", v)}
              />
              <Select
                label="Priority"
                value={form.priority}
                onChange={(v: any) => update("priority", v)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>

              <Input
                label="Problem Title *"
                value={form.title}
                onChange={(v: any) => update("title", v)}
              />
              <Textarea
                label="Description *"
                value={form.description}
                onChange={(v: any) => update("description", v)}
              />
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="mt-7 w-full rounded-2xl bg-[#c8902a] px-6 py-4 font-black text-[#1a0a00] hover:bg-[#d4a853] disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Problem Report"}
            </button>
          </main>

          <aside className="space-y-5">
            <SideCard
              icon={Bug}
              title="Bug Reports"
              text="Tell us what broke and where it happened."
            />
            <SideCard
              icon={ShieldCheck}
              title="Public Support"
              text="You can report problems without logging in."
            />
            <SideCard
              icon={AlertTriangle}
              title="Urgent Issues"
              text="Use high or urgent priority for payment or registration issues."
            />
          </aside>
        </section>
      </div>
    </>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <label className="block">
      <span className="text-sm font-black text-[#5c3d1a]">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] px-4 py-3 font-bold outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}

function Select({ label, value, onChange, children }: any) {
  return (
    <label className="block">
      <span className="text-sm font-black text-[#5c3d1a]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] px-4 py-3 font-bold outline-none focus:border-[#c8902a]"
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 min-h-36 w-full rounded-2xl border border-[#ede0c8] bg-[#fdfaf5] px-4 py-3 font-bold outline-none focus:border-[#c8902a]"
      />
    </label>
  );
}

function SideCard({ icon: Icon, title, text }: any) {
  return (
    <div className="rounded-3xl border border-[#ede0c8] bg-white p-6 shadow-sm">
      <Icon className="h-8 w-8 text-[#c8902a]" />
      <h3 className="mt-4 font-serif text-2xl font-black text-[#1a0a00]">
        {title}
      </h3>
      <p className="mt-2 text-sm font-bold leading-6 text-[#9a7a4a]">{text}</p>
    </div>
  );
}
