import { useEffect, useState } from "react";
import { Heart, IndianRupee, Receipt, Sparkles } from "lucide-react";

import {
  createDonationOrder,
  verifyDonation,
} from "../../services/donationService";
import useAuth from "../../hooks/useAuth";
import AppLoader from "../../components/common/AppLoader";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import iskconlogo from "../../assets/iskconlogo.png";
import PageSeo from "../../components/seo/PageSeo";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function DonatePage() {
  const navigate = useNavigate();

  const [amount, setAmount] = useState(501);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const { user, loading: isLoading, isLoggedIn } = useAuth();

  const [form, setForm] = useState({
    seva_type: "nitya_seva",
    donor_name: "",
    donor_email: "",
    donor_phone: "",
    is_anonymous: false,
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        donor_name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
        donor_email: user.email || "",
        donor_phone: user.phone || "",
      }));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);

  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }

      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  const donate = async () => {
    try {
      setLoading(true);

      const sdkLoaded = await loadRazorpay();

      if (!sdkLoaded) {
        alert("Unable to load Razorpay");
        return;
      }

      const orderRes = await createDonationOrder({
        ...form,
        amount,
      });

      const { key, order } = orderRes.data;

      const razorpay = new window.Razorpay({
        key,

        order_id: order.id,

        amount: order.amount,

        currency: order.currency,

        name: "ISKCON Ahmedabad",

        description: "Donation",

        image: "https://iskconahmedabad.com/images/logo.png",

        prefill: {
          name: form.donor_name,
          email: form.donor_email,
          contact: form.donor_phone,
        },

        theme: {
          color: "#c8902a",
        },

        config: {
          display: {
            blocks: {
              upi: {
                name: "Pay using UPI",
                instruments: [
                  {
                    method: "upi",
                  },
                ],
              },
            },
            sequence: ["block.upi"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },

        handler: async function (response: any) {
          await verifyDonation(response);

          const receipt = {
            receipt_no: `DON-${Date.now()}`,
            date: new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }),
            donor_name: form.donor_name,
            donor_email: form.donor_email,
            donor_phone: form.donor_phone,
            seva_type: form.seva_type.replaceAll("_", " ").toUpperCase(),
            is_anonymous: form.is_anonymous,
            amount,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
          };

          setReceiptData(receipt);
          setShowReceiptModal(true);

          alert("Donation Successful 🙏 Receipt Generated.");
        },
      });

      razorpay.open();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const generateDonationReceiptPdf = async (data: any) => {
    const doc = new jsPDF("p", "mm", "a4");

    const logo = iskconlogo;

    doc.setFillColor(26, 10, 0);
    doc.rect(0, 0, 210, 45, "F");

    doc.addImage(logo, "PNG", 15, 10, 25, 25);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("ISKCON Ahmedabad", 48, 20);

    doc.setFontSize(11);
    doc.setTextColor(212, 168, 83);
    doc.text("Donation Receipt", 48, 29);

    doc.setTextColor(26, 10, 0);
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text("Thank You For Your Seva", 20, 65);

    doc.setFontSize(11);
    doc.setTextColor(92, 61, 26);
    doc.text(
      "Your generous donation supports Krishna consciousness and temple services.",
      20,
      74,
    );

    doc.setDrawColor(200, 144, 42);
    doc.setLineWidth(0.6);
    doc.line(20, 84, 190, 84);

    const rows = [
      ["Receipt No", data.receipt_no],
      ["Donation Date", data.date],
      ["Donor Name", data.is_anonymous ? "Anonymous Donor" : data.donor_name],
      ["Email", data.donor_email || "-"],
      ["Phone", data.donor_phone || "-"],
      ["Seva Type", data.seva_type],
      ["Amount", `INR ${data.amount}`],
      ["Payment ID", data.razorpay_payment_id || "-"],
      ["Order ID", data.razorpay_order_id || "-"],
    ];

    let y = 100;

    rows.forEach(([label, value]) => {
      doc.setFillColor(253, 250, 245);
      doc.roundedRect(20, y - 7, 170, 12, 2, 2, "F");

      doc.setTextColor(154, 122, 74);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(label, 26, y);

      doc.setTextColor(26, 10, 0);
      doc.setFontSize(11);
      doc.text(String(value), 82, y);

      y += 15;
    });

    doc.setFillColor(245, 232, 200);
    doc.roundedRect(20, y + 5, 170, 25, 3, 3, "F");

    doc.setTextColor(26, 10, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Hare Krishna", 26, y + 16);

    doc.setFontSize(10);
    doc.setTextColor(92, 61, 26);
    doc.text(
      "This is a computer generated receipt for your donation.",
      26,
      y + 23,
    );

    doc.setTextColor(154, 122, 74);
    doc.setFontSize(9);
    doc.text("ISKCON Ahmedabad", 20, 285);
    doc.text("Generated from ISKCON Ahmedabad", 150, 285);

    doc.save(`donation-receipt-${data.receipt_no}.pdf`);
  };

  if (isLoading) {
    return (
      <AppLoader
        title="Loading Doantion Page"
        subtitle="Fetching details ...."
      />
    );
  }

  return (
    <>
      <PageSeo
        title="Donations | ISKCON Ahmedabad"
        description="Donate to support Krishna Consciousness"
      />

      <div className="min-h-screen bg-[#fdfaf5]">
        <section className="bg-[#1a0a00] px-5 py-20 text-center">
          <Heart className="mx-auto text-[#d4a853]" size={60} />

          <h1 className="mt-5 font-serif text-6xl font-black text-white">
            Donate
          </h1>

          <p className="mt-3 text-[#d4a853]">Support Krishna Consciousness</p>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="rounded-3xl border bg-white p-8">
              <h2 className="font-serif text-4xl font-black">
                Donation Details
              </h2>

              <div className="mt-6 grid gap-5">
                <Input
                  label="Donor Name"
                  value={form.donor_name}
                  onChange={(v: any) => update("donor_name", v)}
                />

                <Input
                  label="Email"
                  value={form.donor_email}
                  onChange={(v: any) => update("donor_email", v)}
                />

                <Input
                  label="Phone"
                  value={form.donor_phone}
                  onChange={(v: any) => update("donor_phone", v)}
                />

                <div>
                  <label className="text-sm font-black">Seva</label>

                  <select
                    value={form.seva_type}
                    onChange={(e) => update("seva_type", e.target.value)}
                    className="mt-2 w-full rounded-xl border p-4"
                  >
                    <option value="nitya_seva">Nitya Seva</option>

                    <option value="gau_seva">Gau Seva</option>

                    <option value="khichdi_seva">Khichdi Seva</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-black">Amount</label>

                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {[108, 501, 1008, 2100, 5100, 11000].map((value) => (
                      <button
                        key={value}
                        onClick={() => setAmount(value)}
                        className={`rounded-xl p-4 font-black ${
                          amount === value ? "bg-[#c8902a]" : "border"
                        }`}
                      >
                        ₹{value}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center rounded-xl border px-4">
                    <IndianRupee size={20} />

                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full p-4 outline-none"
                    />
                  </div>
                </div>

                <label className="flex gap-3">
                  <input
                    type="checkbox"
                    checked={form.is_anonymous}
                    onChange={(e) => update("is_anonymous", e.target.checked)}
                  />
                  Donate anonymously
                </label>

                <button
                  disabled={loading}
                  onClick={() => {
                    isLoggedIn ? donate() : navigate("/login");
                  }}
                  className="rounded-2xl bg-[#c8902a] py-4 text-lg font-black"
                >
                  {isLoggedIn
                    ? loading
                      ? "Processing..."
                      : `Donate ₹${amount}`
                    : "Login to Donate ..."}
                </button>

                {receiptData && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                    <h3 className="text-xl font-black text-green-800">
                      Donation Successful 🙏
                    </h3>

                    <p className="mt-1 text-sm font-bold text-green-700">
                      Your receipt is ready to download.
                    </p>

                    <button
                      onClick={() => generateDonationReceiptPdf(receiptData)}
                      className="mt-4 w-full rounded-2xl bg-green-700 py-3 font-black text-white"
                    >
                      Download Donation Receipt PDF
                    </button>
                  </div>
                )}
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-3xl bg-[#1a0a00] p-6 text-white">
                <Sparkles className="text-[#d4a853]" />

                <h3 className="mt-4 text-3xl font-black">Seva Opportunities</h3>

                <ul className="mt-4 space-y-3 text-sm">
                  <li>🙏 Nitya Seva</li>
                  <li>🐄 Gau Seva</li>
                  <li>🍲 Khichdi Seva</li>
                </ul>
              </div>

              <div className="rounded-3xl border bg-white p-6">
                <Receipt />

                <h3 className="mt-4 text-2xl font-black">Donation Receipt</h3>

                <p className="mt-2 text-sm text-slate-500">
                  After successful payment PDF receipt is generated
                  automatically.
                </p>
              </div>
            </aside>
          </div>
        </div>
        {showReceiptModal && receiptData && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-white p-6 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-serif text-3xl font-black text-[#1a0a00]">
                  Donation Receipt Preview
                </h2>

                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="rounded-full bg-[#f5e8c8] px-4 py-2 font-black text-[#1a0a00]"
                >
                  Close
                </button>
              </div>

              <DonationReceiptPreview receipt={receiptData} />

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => generateDonationReceiptPdf(receiptData)}
                  className="flex-1 rounded-2xl bg-[#c8902a] py-4 font-black text-[#1a0a00]"
                >
                  Download PDF
                </button>

                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="flex-1 rounded-2xl border border-[#ede0c8] py-4 font-black text-[#5c3d1a]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Input({ label, value, onChange }: any) {
  return (
    <label>
      <div className="mb-2 text-sm font-black">{label}</div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border p-4"
      />
    </label>
  );
}

function DonationReceiptPreview({ receipt }: { receipt: any }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#ede0c8] bg-[#fdfaf5]">
      <div className="flex items-center gap-5 bg-[#1a0a00] p-6 text-white">
        <img
          src="https://iskconahmedabad.com/images/logo.png"
          className="h-20 w-20 rounded-full border-4 border-[#c8902a] bg-white object-contain p-2"
        />

        <div>
          <h3 className="font-serif text-3xl font-black">ISKCON Ahmedabad</h3>
          <p className="mt-1 font-bold text-[#d4a853]">Donation Receipt</p>
        </div>
      </div>

      <div className="p-7">
        <h3 className="font-serif text-4xl font-black text-[#1a0a00]">
          Thank You For Your Seva
        </h3>

        <p className="mt-2 font-bold text-[#5c3d1a]">
          Your generous donation supports Krishna consciousness and temple
          services.
        </p>

        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <ReceiptInfo label="Receipt No" value={receipt.receipt_no} />
          <ReceiptInfo label="Donation Date" value={receipt.date} />
          <ReceiptInfo
            label="Donor Name"
            value={
              receipt.is_anonymous ? "Anonymous Donor" : receipt.donor_name
            }
          />
          <ReceiptInfo label="Email" value={receipt.donor_email || "-"} />
          <ReceiptInfo label="Phone" value={receipt.donor_phone || "-"} />
          <ReceiptInfo label="Seva Type" value={receipt.seva_type} />
          <ReceiptInfo label="Amount" value={`INR ${receipt.amount}`} />
          <ReceiptInfo
            label="Payment ID"
            value={receipt.razorpay_payment_id || "-"}
          />
          <ReceiptInfo
            label="Order ID"
            value={receipt.razorpay_order_id || "-"}
          />
        </div>

        <div className="mt-6 rounded-2xl bg-[#f5e8c8] p-5">
          <p className="font-black text-[#1a0a00]">Hare Krishna 🙏</p>
          <p className="mt-1 text-sm font-bold text-[#5c3d1a]">
            This is a computer generated receipt for your donation.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReceiptInfo({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs font-black uppercase tracking-wider text-[#9a7a4a]">
        {label}
      </p>
      <p className="mt-1 break-words font-black text-[#1a0a00]">
        {String(value || "-")}
      </p>
    </div>
  );
}
