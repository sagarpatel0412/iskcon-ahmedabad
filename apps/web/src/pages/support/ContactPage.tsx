import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { submitContactMessage } from "../../services/supportService";
import PageSeo from "../../components/seo/PageSeo";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    if (!form.name || !form.message) {
      alert("Name and message are required");
      return;
    }

    try {
      setLoading(true);
      await submitContactMessage(form);
      alert("Message sent successfully. Hare Krishna 🙏");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageSeo
        title="Contact us | ISKCON Ahmedabad"
        description="Contact us for query"
      />

      <div className="-mx-5 -my-8 min-h-screen bg-[#fdfaf5]">
        <section className="bg-[#1a0a00] px-5 py-24 text-center">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#d4a853]">
            ISKCON Ahmedabad
          </p>
          <h1 className="mt-4 font-serif text-6xl font-black text-white">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-bold leading-8 text-[#f5e8c8]">
            Reach out for temple programs, spiritual guidance, events, journals,
            newsletters or app support.
          </p>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 lg:grid-cols-[1fr_380px]">
          <main className="rounded-[2rem] border border-[#ede0c8] bg-white p-8 shadow-sm">
            <h2 className="font-serif text-4xl font-black text-[#1a0a00]">
              Send Message
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Input
                label="Name *"
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
              <Input
                label="Subject"
                value={form.subject}
                onChange={(v: any) => update("subject", v)}
              />
              <Textarea
                label="Message *"
                value={form.message}
                onChange={(v: any) => update("message", v)}
              />
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="mt-7 w-full rounded-2xl bg-[#c8902a] px-6 py-4 font-black text-[#1a0a00] hover:bg-[#d4a853] disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </main>

          <aside className="space-y-5">
            <SideCard
              icon={MapPin}
              title="Temple Address"
              text="ISKCON Cross Road, S.G. Highway, Ahmedabad, Gujarat."
            />
            <SideCard
              icon={Phone}
              title="Phone"
              text="Contact temple office for program details."
            />
            <SideCard
              icon={Mail}
              title="Email"
              text="Use this form and our team will respond."
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
