import { useState } from "react";
import { X, Plus } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";

interface SocialFloatingButtonProps {
  whatsapp?: { phoneNumber: string; message?: string };
  instagram?: string;
  youtube?: string;
  position?: "bottom-left" | "bottom-right";
}

export default function SocialFloatingButton({
  whatsapp,
  instagram,
  youtube,
  position = "bottom-right",
}: SocialFloatingButtonProps) {
  const [open, setOpen] = useState(false);

  const sideClass =
    position === "bottom-right" ? "right-5 sm:right-6" : "left-5 sm:left-6";

  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp.phoneNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
        whatsapp.message || "Hare Krishna! 🙏 I'd like to know more.",
      )}`
    : null;

  // Each sub-button: icon, bg color, link, label, vertical offset when open
  const items = [
    whatsappUrl && {
      key: "whatsapp",
      href: whatsappUrl,
      bg: "bg-[#25D366] hover:bg-[#1ebe5b]",
      icon: <FaWhatsapp size={22} color="white" />,
      label: "WhatsApp",
    },
    instagram && {
      key: "instagram",
      href: instagram,
      bg: "bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] hover:opacity-90",
      icon: <FaInstagram size={22} color="white" />,
      label: "Instagram",
    },
    youtube && {
      key: "youtube",
      href: youtube,
      bg: "bg-[#FF0000] hover:bg-[#d90000]",
      icon: <FaYoutube size={22} color="white" />,
      label: "YouTube",
    },
  ].filter(Boolean) as {
    key: string;
    href: string;
    bg: string;
    icon: React.ReactNode;
    label: string;
  }[];

  return (
    <div
      className={`fixed bottom-24 sm:bottom-28 ${sideClass} z-50 flex flex-col items-center gap-3`}
    >
      {/* Sub buttons */}
      {items.map((item, index) => (
        <a
          key={item.key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          title={item.label}
          className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg
        transition-all duration-300 ease-out ${item.bg}
        ${open ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-50 pointer-events-none"}`}
          style={{ transitionDelay: open ? `${index * 60}ms` : "0ms" }}
        >
          {item.icon}
        </a>
      ))}

      {/* Main toggle button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close menu" : "Open social menu"}
        aria-expanded={open}
        className={`flex items-center justify-center w-14 h-14 rounded-full
      bg-[#25D366] hover:bg-[#1ebe5b]
      shadow-lg hover:shadow-xl
      transition-all duration-300 ease-in-out
      hover:scale-110 active:scale-95`}
      >
        {open ? (
          <X className="w-6 h-6 text-white transition-transform duration-300" />
        ) : (
          <FaPeopleGroup color="white" size={26} />
        )}
      </button>
    </div>
  );
}
