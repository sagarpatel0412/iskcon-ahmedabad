import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  CalendarPlus,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  QrCode,
  UserPlus,
  UserRound,
  Activity,
  ChartNoAxesColumn,
  ScrollText,
  Landmark,
  Info,
  Luggage,
  PlusCircle,
  GraduationCap,
  Users,
  Menu,
  X,
  CreditCard,
  UserCheck,
  Crown,
  HeartHandshake,
  MessageSquareWarning,
  LifeBuoy,
  Smartphone,
  LocateIcon,
  AlertTriangle,
  BarChart3,
  Boxes,
  FolderTree,
  Heart,
  Package,
  Package2,
  RotateCcw,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  Star,
  TicketPercent,
  Truck,
  Warehouse,
} from "lucide-react";

import { logout } from "../services/authService";
import useAuth from "../hooks/useAuth";
import { PremiumBadge } from "../components/premium-badge/PremiumBadge";
import { useState } from "react";
import { MdMoney } from "react-icons/md";

export default function MainLayout() {
  return (
    <div
      className="min-h-screen bg-[#fdfaf5] text-slate-900"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      <TopMantraBar />
      <Header />

      <main className="mx-auto min-h-screen max-w-7xl px-5 py-8">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

function TopMantraBar() {
  return (
    <div className="bg-[#1a0a00] px-4 py-1.5 text-center text-xs font-medium tracking-widest text-[#d4a853]">
      ॐ नमो भगवते वासुदेवाय · Hare Kṛṣṇa Hare Kṛṣṇa Kṛṣṇa Kṛṣṇa Hare Hare · Hare
      Rama Hare Rama Rama Rama Hare Hare
    </div>
  );
}

function MobileNavItem({ to, label, icon: Icon, onClick }: any) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#3d2200] shadow-sm"
    >
      <Icon className="h-4 w-4 text-[#c8902a]" />
      {label}
    </Link>
  );
}

function MobileSection({ title, links = [], onClick }: any) {
  if (!links.length) return null;

  return (
    <div className="rounded-2xl border border-[#e8d5b0] bg-white p-3 shadow-sm">
      <p className="mb-2 px-2 text-xs font-black uppercase tracking-widest text-[#8b6914]">
        {title}
      </p>

      <div className="space-y-1">
        {links.map((link: any) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={onClick}
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-[#3d2200] hover:bg-orange-50"
            >
              <Icon className="h-4 w-4 text-[#c8902a]" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Header() {
  const navigate = useNavigate();
  // const token = getToken();

  const { roles, loading, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  const isLoggedIn = !!user;
  const isSeeker = roles.includes("SEEKER");
  const isDevotee = roles.includes("DEVOTEE");
  const isAdmin = roles.includes("ADMIN");

  const canManage = isDevotee || isAdmin;

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const eventLinks = !isLoggedIn
    ? [{ to: "/events", label: "All Events", icon: CalendarDays }]
    : canManage
      ? [
          { to: "/events", label: "All Events", icon: CalendarDays },
          { to: "/events/create", label: "Create Event", icon: CalendarPlus },
          { to: "/events/my-events", label: "My Events", icon: FileText },
          { to: "/events/scan-qr", label: "Scan QR", icon: QrCode },
          {
            to: "/events/my-registrations",
            label: "My Registrations",
            icon: QrCode,
          },
          {
            to: "/events/manage-registrations",
            label: "Manage Registrations",
            icon: QrCode,
          },
        ]
      : [
          { to: "/events", label: "All Events", icon: CalendarDays },
          {
            to: "/events/my-registrations",
            label: "My Registrations",
            icon: QrCode,
          },
        ];

  const contentLinks = !isLoggedIn
    ? [
        { to: "/journals", label: "Journals", icon: BookOpen },
        { to: "/newsletters", label: "Newsletters", icon: Newspaper },
      ]
    : canManage
      ? [
          { to: "/journals", label: "Journals", icon: BookOpen },
          { to: "/newsletters", label: "Newsletters", icon: Newspaper },
          { to: "/content/manage", label: "My Content", icon: FileText },
          {
            to: "/content/create",
            label: "Create Journal / Newsletter",
            icon: CalendarPlus,
          },
        ]
      : [
          { to: "/journals", label: "Journals", icon: BookOpen },
          { to: "/newsletters", label: "Newsletters", icon: Newspaper },
        ];

  const progresLink = [
    { to: "/progress/daily", label: "Log Daily Progress", icon: Activity },
    {
      to: "/progress/track",
      label: "Track My Progress",
      icon: ChartNoAxesColumn,
    },
  ];

  const tripsLinks = !isLoggedIn
    ? [{ to: "/trips", label: "Trips / Yatras", icon: MapPin }]
    : canManage
      ? [
          { to: "/trips", label: "Trips / Yatras", icon: MapPin },
          { to: "/trips/my-created", label: "My Created Trips", icon: Luggage },
          {
            to: "/trips/create",
            label: "Create Trip / Yatra",
            icon: PlusCircle,
          },
          {
            to: "/trips/manage-registrations",
            label: "Manage Registrations",
            icon: QrCode,
          },
        ]
      : [
          { to: "/trips", label: "Trips / Yatras", icon: MapPin },
          {
            to: "/trips/my-registrations",
            label: "My Registered Trips",
            icon: Luggage,
          },
        ];

  const courseLinks = !isLoggedIn
    ? [{ to: "/courses", label: "Courses", icon: BookOpen }]
    : canManage
      ? [
          { to: "/courses", label: "Courses", icon: BookOpen },

          {
            to: "/courses/my-created",
            label: "My Created Courses",
            icon: GraduationCap,
          },

          {
            to: "/courses/create",
            label: "Create Course",
            icon: PlusCircle,
          },
          {
            to: "/courses/manage-registrations",
            label: "Manage Registrations",
            icon: QrCode,
          },
        ]
      : [
          { to: "/courses", label: "Courses", icon: BookOpen },

          {
            to: "/courses/my-registered",
            label: "My Registered Courses",
            icon: GraduationCap,
          },
        ];

  const supportLinks = [
    {
      to: "/contact",
      label: "Contact Us",
      icon: Mail,
    },
    {
      to: "/report-problem",
      label: "Report Problem",
      icon: MessageSquareWarning,
    },
  ];

  const shopLinks = !isLoggedIn
  ? [
      { to: "/shop", label: "Shop", icon: ShoppingBag },
    ]
  : canManage
    ? [
        { to: "/shop", label: "Shop", icon: ShoppingBag },

        { to: "/shop/cart", label: "Cart", icon: ShoppingCart },
        { to: "/shop/wishlist", label: "Wishlist", icon: Heart },
        { to: "/shop/my-orders", label: "My Orders", icon: Package },

        { to: "/shop/manage", label: "Dashboard", icon: LayoutDashboard },

        {
          to: "/shop/manage/products",
          label: "Manage Products",
          icon: Package2,
        },

        {
          to: "/shop/manage/my-products",
          label: "My Products",
          icon: Boxes,
        },

        {
          to: "/shop/manage/categories",
          label: "Categories",
          icon: FolderTree,
        },

        {
          to: "/shop/manage/orders",
          label: "Orders",
          icon: ShoppingBasket,
        },

        {
          to: "/shop/manage/shipping",
          label: "Shipping",
          icon: Truck,
        },

        {
          to: "/shop/manage/refunds",
          label: "Refunds",
          icon: RotateCcw,
        },

        {
          to: "/shop/manage/inventory",
          label: "Inventory",
          icon: Warehouse,
        },

        {
          to: "/shop/manage/low-stock",
          label: "Low Stock",
          icon: AlertTriangle,
        },

        {
          to: "/shop/manage/coupons",
          label: "Coupons",
          icon: TicketPercent,
        },

        {
          to: "/shop/manage/reviews",
          label: "Reviews",
          icon: Star,
        },

        {
          to: "/shop/manage/reports",
          label: "Reports",
          icon: BarChart3,
        },
      ]
    : [
        { to: "/shop", label: "Shop", icon: ShoppingBag },
        { to: "/shop/cart", label: "Cart", icon: ShoppingCart },
        { to: "/shop/wishlist", label: "Wishlist", icon: Heart },
        { to: "/shop/my-orders", label: "My Orders", icon: Package },
      ];

  const mainMenuLinks = [
    {
      title: "Seva & Donation",
      items: [
        {
          to: "/donate",
          label: "Donations",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Shop",
      items: shopLinks
    },
    {
      title: "Events",
      items: eventLinks,
    },
    {
      title: "Trips / Yatras",
      items: tripsLinks,
    },
    {
      title: "Courses",
      items: courseLinks,
    },
    {
      title: "Content",
      items: contentLinks,
    },
    {
      title: "Progress",
      items: progresLink,
    },
    {
      title: "About",
      items: [
        {
          to: "/about",
          label: "About ISKCON Ahmedabad",
          icon: Landmark,
        },
        {
          to: "/about/prabhupada",
          label: "About Srila Prabhupada",
          icon: ScrollText,
        },
        {
          to:"/about/about-glory-of-krishna-and-chaitanya-mahaprabhu",
          label: "Glory of Krishna and Chaitanya Mahaprabhu",
          icon: ScrollText,
        }
      ],
    },
    {
      title: "Support",
      items: supportLinks,
    },
  ].filter((group) => group.items && group.items.length > 0);

  return (
    <header className="sticky top-0 z-50 border-b border-[#e8d5b0] bg-[#fdfaf5]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-[#c8902a] p-0.5">
            <img
              src="https://iskconahmedabad.com/images/logo.png"
              alt="ISKCON Ahmedabad"
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          <div>
            <h1 className="text-sm font-bold leading-tight tracking-wide text-[#1a0a00] transition-colors group-hover:text-[#c8902a] sm:text-base">
              ISKCON Ahmedabad
            </h1>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#8b6914]">
              Hare Krishna &nbsp; {user?.isSubscribed && <PremiumBadge />}{" "}
              {isAdmin && `Admin`}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {loading && <p>Loading dynamic header...</p>}
          {isAdmin && (
            <>
              <NavItem
                to="/meta-idx"
                label="Admin Dashboard"
                icon={LayoutDashboard}
              />
              <NavItem to="/meta-idx/users" label="Users" icon={UserRound} />
              <NavItem
                to="/meta-idx/devotee-requests"
                label="Devotee Requests"
                icon={UserCheck}
              />
              <NavItem
                to="/meta-idx/payments"
                label="Payments"
                icon={CreditCard}
              />
            </>
          )}

          {isLoggedIn && !loading && !isAdmin && (
            <>
              <NavItem
                to="/dashboard"
                label="Dashboard"
                icon={LayoutDashboard}
              />
              <MegaDropdown
                label="Menu"
                icon={BookOpen}
                groups={mainMenuLinks}
              />
              <NavItem to="/centres" label="Centres" icon={LocateIcon} />
              <NavItem to="/get-app" label="Get App" icon={Smartphone} />
              <NavItem
                to="/content/subscriptions"
                label="Content Pricing"
                icon={MdMoney}
              />
            </>
          )}

          {!isLoggedIn && !loading && (
            <>
              <NavItem to="/get-app" label="Get App" icon={Smartphone} />
              <NavItem to="/centres" label="Centres" icon={LocateIcon} />
              <MegaDropdown
                label="Explore"
                icon={BookOpen}
                groups={mainMenuLinks.filter(
                  (group) => group.title !== "Progress",
                )}
              />
            </>
          )}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 rounded-lg border border-[#e8d5b0] bg-white px-3 py-2 text-sm font-medium text-[#3d2200] hover:border-[#c8902a] hover:text-[#c8902a]"
              >
                <LogIn className="h-4 w-4" />
                Login
              </button>

              <button
                onClick={() => navigate("/register/seeker")}
                className="flex items-center gap-2 rounded-lg bg-[#1a0a00] px-4 py-2 text-sm font-medium text-[#d4a853] hover:bg-[#c8902a] hover:text-white"
              >
                <UserPlus className="h-4 w-4" />
                Register
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 rounded-lg border border-[#e8d5b0] bg-white px-3 py-2 text-sm font-medium text-[#3d2200] hover:border-[#c8902a] hover:text-[#c8902a]"
              >
                <UserRound className="h-4 w-4" />
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-[#1a0a00] px-4 py-2 text-sm font-medium text-[#d4a853] hover:bg-[#c8902a] hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e8d5b0] bg-white text-[#3d2200] xl:hidden"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="
            xl:hidden
            border-t border-[#e8d5b0]
            bg-[#fdfaf5]
            px-4 py-4
            max-h-[calc(100vh-80px)]
            overflow-y-auto
          "
        >
          <div className="space-y-2">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-black text-[#1a0a00]">Hare Krishna 🙏</h2>

              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 hover:bg-orange-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {isAdmin && (
              <>
                <MobileNavItem
                  to="/meta-idx"
                  label="Admin Dashboard"
                  icon={LayoutDashboard}
                  onClick={closeMobile}
                />
                <MobileNavItem
                  to="/meta-idx/users"
                  label="Users"
                  icon={UserRound}
                  onClick={closeMobile}
                />
                <MobileNavItem
                  to="/meta-idx/devotee-requests"
                  label="Devotee Requests"
                  icon={UserCheck}
                  onClick={closeMobile}
                />
                <MobileNavItem
                  to="/meta-idx/events"
                  label="Events"
                  icon={CalendarDays}
                  onClick={closeMobile}
                />
                <MobileNavItem
                  to="/meta-idx/trips"
                  label="Trips"
                  icon={MapPin}
                  onClick={closeMobile}
                />
                <MobileNavItem
                  to="/meta-idx/courses"
                  label="Courses"
                  icon={BookOpen}
                  onClick={closeMobile}
                />
                <MobileNavItem
                  to="/meta-idx/content"
                  label="Content"
                  icon={FileText}
                  onClick={closeMobile}
                />
                <MobileNavItem
                  to="/meta-idx/payments"
                  label="Payments"
                  icon={CreditCard}
                  onClick={closeMobile}
                />
                <MobileNavItem
                  to="/meta-idx/subscriptions"
                  label="Subscriptions"
                  icon={Crown}
                  onClick={closeMobile}
                />
                <MobileNavItem
                  to="/meta-idx/donations"
                  label="Donations"
                  icon={HeartHandshake}
                  onClick={closeMobile}
                />

                <button
                  onClick={() => {
                    closeMobile();
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl bg-[#1a0a00] px-4 py-3 text-sm font-bold text-[#d4a853]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}
            {isLoggedIn && !loading && !isAdmin && (
              <>
                <MobileNavItem
                  to="/dashboard"
                  label="Dashboard"
                  icon={LayoutDashboard}
                  onClick={closeMobile}
                />
                <MobileNavItem
                  to="/donate"
                  label="Donations"
                  icon={LayoutDashboard}
                  onClick={closeMobile}
                />

                <MobileSection
                  title="Events"
                  links={eventLinks}
                  onClick={closeMobile}
                />
                <MobileSection
                  title="Trips"
                  links={tripsLinks}
                  onClick={closeMobile}
                />
                <MobileSection
                  title="Courses"
                  links={courseLinks}
                  onClick={closeMobile}
                />
                <MobileSection
                  title="Content"
                  links={contentLinks}
                  onClick={closeMobile}
                />
                <MobileSection
                  title="Progress"
                  links={progresLink}
                  onClick={closeMobile}
                />

                <MobileSection
                  title="About"
                  links={[
                    {
                      to: "/about",
                      label: "About ISKCON Ahmedabad",
                      icon: Landmark,
                    },
                    {
                      to: "/about/prabhupada",
                      label: "About Srila Prabhupada",
                      icon: ScrollText,
                    },
                  ]}
                  onClick={closeMobile}
                />

                <MobileNavItem
                  to="/profile"
                  label="Profile"
                  icon={UserRound}
                  onClick={closeMobile}
                />

                <button
                  onClick={() => {
                    closeMobile();
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl bg-[#1a0a00] px-4 py-3 text-sm font-bold text-[#d4a853]"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}

            {!isLoggedIn && !loading && (
              <>
                <MobileNavItem
                  to="/dashboard"
                  label="Dashboard"
                  icon={LayoutDashboard}
                  onClick={closeMobile}
                />
                <MobileNavItem
                  to="/donate"
                  label="Donations"
                  icon={LayoutDashboard}
                  onClick={closeMobile}
                />
                <MobileSection
                  title="Events"
                  links={eventLinks}
                  onClick={closeMobile}
                />
                <MobileSection
                  title="Content"
                  links={contentLinks}
                  onClick={closeMobile}
                />

                <button
                  onClick={() => {
                    closeMobile();
                    navigate("/login");
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl border border-[#e8d5b0] bg-white px-4 py-3 text-sm font-bold text-[#3d2200]"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>

                <button
                  onClick={() => {
                    closeMobile();
                    navigate("/register/seeker");
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl bg-[#1a0a00] px-4 py-3 text-sm font-bold text-[#d4a853]"
                >
                  <UserPlus className="h-4 w-4" />
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#c8902a] to-transparent opacity-40" />
    </header>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
}: {
  to: string;
  label: string;
  icon: any;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
          isActive
            ? "bg-[#f5e8c8] text-[#c8902a]"
            : "text-[#3d2200] hover:bg-[#f5e8c8] hover:text-[#c8902a]"
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}

function Dropdown({
  label,
  icon: Icon,
  links,
}: {
  label: string;
  icon: any;
  links: { to: string; label: string; icon: any }[];
}) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-[#3d2200] transition-all hover:bg-[#f5e8c8] hover:text-[#c8902a]">
        <Icon className="h-4 w-4" />
        {label}
        <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" />
      </button>

      <div className="invisible absolute left-0 top-full z-50 mt-2 min-w-[245px] rounded-2xl border border-[#e8d5b0] bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100">
        {links.map(({ to, label, icon: LinkIcon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#f5e8c8] text-[#c8902a]"
                  : "text-[#3d2200] hover:bg-[#fdfaf5] hover:text-[#c8902a]"
              }`
            }
          >
            <LinkIcon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

function MegaDropdown({
  label,
  icon: Icon,
  groups,
}: {
  label: string;
  icon: any;
  groups: any[];
}) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-[#5c3d1a] transition hover:bg-[#f5e8c8]">
        <Icon className="h-4 w-4" />
        {label}
      </button>

      <div className="invisible absolute left-1/2 top-full z-50 mt-3 max-h-[75vh] w-[calc(100vw-2rem)] max-w-6xl -translate-x-1/2 overflow-y-auto rounded-[2rem] border border-[#ede0c8] bg-white p-5 opacity-0 shadow-2xl transition-all group-hover:visible group-hover:opacity-100">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title} className="rounded-2xl bg-[#fdfaf5] p-4">
              <h3 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#c8902a]">
                {group.title}
              </h3>

              <div className="space-y-1">
                {group.items.map((item: any) => {
                  const ItemIcon = item.icon;

                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-[#1a0a00] transition hover:bg-[#f5e8c8]"
                    >
                      {ItemIcon && (
                        <ItemIcon className="h-4 w-4 shrink-0 text-[#c8902a]" />
                      )}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#e8d5b0] bg-[#1a0a00] text-[#c9a96e]">
      <div className="mx-auto grid max-w-[1800px] gap-10 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-[#c8902a] p-0.5">
              <img
                src="https://iskconahmedabad.com/images/logo.png"
                alt="ISKCON Ahmedabad"
                className="h-full w-full rounded-full object-cover"
              />
            </div>

            <div>
              <p className="text-sm font-bold text-[#f0d090]">
                ISKCON Ahmedabad
              </p>
              <p className="text-[10px] uppercase tracking-widest text-[#8b6914]">
                Since 1975
              </p>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-[#9a7a4a]">
            Dedicated to the teachings of His Divine Grace A. C. Bhaktivedanta
            Swami Prabhupāda and the loving service of Śrī Śrī Rādhā Govinda
            Dev.
          </p>
        </div>

        <FooterLinks
          title="Events"
          links={[
            { to: "/events", label: "All Events" },
            { to: "/events/my-registrations", label: "My Registrations" },
          ]}
        />

        <FooterLinks
          title="Content"
          links={[
            { to: "/journals", label: "Journals" },
            { to: "/newsletters", label: "Newsletters" },
            { to: "/content/create", label: "Create Journal / Newsletter" },
          ]}
        />

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#f0d090]">
            Contact
          </h3>

          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-3.5 w-3.5 text-[#c8902a]" />
              <span className="text-xs leading-relaxed text-[#9a7a4a]">
                Satellite Road, Jodhpur Village,
                <br />
                Ahmedabad, Gujarat 380015
              </span>
            </li>

            <li className="flex items-center gap-2.5">
              <Phone className="h-3.5 w-3.5 text-[#c8902a]" />
              <span className="text-xs text-[#9a7a4a]">+91 79 2397 0005</span>
            </li>

            <li className="flex items-center gap-2.5">
              <Mail className="h-3.5 w-3.5 text-[#c8902a]" />
              <span className="text-xs text-[#9a7a4a]">
                info@iskconahmedabad.com
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#3d2200] to-transparent" />

      <div className="mx-auto flex max-w-[1800px] flex-col items-center justify-between gap-2 px-6 py-4 md:flex-row">
        <p className="text-[11px] text-[#6b4c1e]">
          © {new Date().getFullYear()} ISKCON Ahmedabad. All rights reserved.
        </p>

        <p className="text-[11px] italic text-[#6b4c1e]">
          Built for seekers, devotees and spiritual growth.
        </p>

        <p className="text-[11px] tracking-widest text-[#6b4c1e]">Hare Kṛṣṇa</p>
      </div>
    </footer>
  );
}

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#f0d090]">
        {title}
      </h3>

      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-xs text-[#9a7a4a] transition-colors hover:text-[#d4a853]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
