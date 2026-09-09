import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Bell, LogIn, Menu, Moon, Sprout, Sun, User, X, ChevronRight } from "lucide-react";
import { useEco } from "../lib/store";

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/actions", label: "Climate Actions" },
  { to: "/challenges", label: "Challenges" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/impact", label: "Impact" },
  { to: "/about", label: "About" },
];

export function Logo({ size = 36, tone = "light" }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        className="relative grid place-items-center rounded-[13px] shadow-[0_10px_22px_-12px_rgba(9,48,36,.85)]"
        style={{ width: size, height: size, background: "linear-gradient(140deg,#0f4c3a,#17694f 48%,#2b9fd6)" }}
      >
        <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} aria-hidden="true">
          <circle cx="12" cy="12" r="8.4" fill="none" stroke="#dff3e6" strokeOpacity=".65" strokeWidth="1.3" />
          <path d="M12 4.2c-4 2.4-6.3 5.2-6.3 8.4A8.4 8.4 0 0 0 19.7 15c-1.8-6-4.5-9.2-7.7-10.8Z" fill="#a8dcbc" fillOpacity=".9" />
          <path d="M12 19.5c.2-3.6 1.9-6.6 4.6-8.4" stroke="#0b2b20" strokeOpacity=".5" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        </svg>
      </span>
      <span className={`font-display text-[19px] font-semibold tracking-[-.03em] ${tone === "dark" ? "text-white" : "text-ink"}`}>
        Eco<span className={tone === "dark" ? "text-mint" : "text-forest"}>Sphere</span>
      </span>
    </span>
  );
}

export default function Navbar() {
  const eco = useEco();
  const [open, setOpen] = useState(false);
  const [bell, setBell] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();
  const wrap = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setBell(false);
  }, [loc.pathname]);

  useEffect(() => {
    const onClick = (e) => {
      if (wrap.current && !wrap.current.contains(e.target)) setBell(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const unread = eco.notifications.filter((n) => !n.read).length;

  return (
    <header
      ref={wrap}
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl" : ""
      }`}
      style={{
        background: scrolled ? "color-mix(in srgb, var(--c-canvas) 82%, transparent)" : "var(--c-canvas)",
        borderColor: scrolled ? "var(--c-line)" : "transparent",
        boxShadow: scrolled ? "0 10px 30px -26px rgba(9,48,36,.7)" : "none",
      }}
    >
      <nav className="mx-auto flex h-[68px] max-w-[1240px] items-center gap-3 px-4 sm:px-6">
        <Link to="/" className="ring-focus rounded-xl">
          <Logo />
        </Link>

        <ul className="ml-4 hidden items-center gap-0.5 lg:flex">
          {NAV.map((n) => (
            <li key={n.to}>
              <NavLink
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `relative block rounded-full px-3 py-2 text-[13.5px] font-semibold transition-colors duration-200 ${
                    isActive ? "text-forest" : "text-ink-soft hover:text-ink"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    <span
                      className={`absolute inset-x-3 -bottom-[3px] h-[3px] origin-left rounded-full transition-transform duration-300 ${
                        isActive ? "scale-x-100" : "scale-x-0"
                      }`}
                      style={{ background: "linear-gradient(90deg,var(--c-forest),var(--c-sky))" }}
                    />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={eco.toggleTheme}
            aria-label="Toggle colour theme"
            className="ring-focus grid h-10 w-10 place-items-center rounded-full border transition-colors duration-200 hover:-translate-y-0.5"
            style={{ borderColor: "var(--c-line)", background: "var(--c-surface)", color: "var(--c-ink)" }}
          >
            {eco.theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <div className="relative">
            <button
              onClick={() => setBell((b) => !b)}
              aria-label="Notifications"
              className="ring-focus relative grid h-10 w-10 place-items-center rounded-full border transition-colors duration-200 hover:-translate-y-0.5"
              style={{ borderColor: "var(--c-line)", background: "var(--c-surface)", color: "var(--c-ink)" }}
            >
              <Bell size={17} />
              {unread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-sky px-1 font-mono text-[10px] font-bold text-white">
                  {unread}
                </span>
              )}
            </button>

            {bell && (
              <div className="animate-pop absolute right-0 top-[calc(100%+10px)] w-[min(92vw,364px)] overflow-hidden card">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <span className="font-display text-[15px] font-semibold">Notifications</span>
                  <button onClick={eco.markAllRead} className="text-[11px] font-bold uppercase tracking-wide text-sky hover:underline">
                    Mark all read
                  </button>
                </div>
                <ul className="max-h-[340px] overflow-y-auto">
                  {eco.notifications.slice(0, 8).map((n) => (
                    <li
                      key={n.id}
                      className="flex gap-3 border-b px-4 py-3 last:border-0 transition-colors hover:bg-surface-2"
                      style={{ borderColor: "var(--c-line)" }}
                    >
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-mint-soft text-[15px]">{n.icon}</span>
                      <span className="min-w-0">
                        <span className={`block text-[13px] leading-snug ${n.read ? "text-muted" : "font-bold text-ink"}`}>{n.title}</span>
                        <span className="mt-0.5 block text-[12px] leading-snug text-muted">{n.body}</span>
                        <span className="mt-1 block font-mono text-[10.5px] uppercase tracking-wide text-muted">{n.time}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {eco.user ? (
            <Link to="/profile" className="ring-focus flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 transition-colors hover:border-forest" style={{ borderColor: "var(--c-line)", background: "var(--c-surface)" }}>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-forest font-display text-[13px] font-bold text-white">
                {eco.user.name.slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden text-[13px] font-bold sm:block">{eco.user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link to="/profile" className="ring-focus hidden h-10 w-10 place-items-center rounded-full border sm:grid" style={{ borderColor: "var(--c-line)", color: "var(--c-ink)" }} aria-label="Profile">
              <User size={17} />
            </Link>
          )}

          {!eco.user && (
            <Link to="/login" className="btn btn-primary hidden md:inline-flex">
              <LogIn size={15} /> Login / Sign Up
            </Link>
          )}

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="ring-focus grid h-10 w-10 place-items-center rounded-full border lg:hidden"
            style={{ borderColor: "var(--c-line)", background: "var(--c-surface)" }}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* mobile sheet */}
      <div
        className="overflow-hidden border-t transition-[max-height,opacity] duration-500 lg:hidden"
        style={{ maxHeight: open ? 560 : 0, opacity: open ? 1 : 0, borderColor: open ? "var(--c-line)" : "transparent", background: "var(--c-canvas)" }}
      >
        <ul className="px-4 py-3 sm:px-6">
          {NAV.map((n, i) => (
            <li key={n.to} style={{ transitionDelay: `${i * 30}ms` }}>
              <NavLink
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-2xl px-3 py-3 text-[15px] font-semibold transition-colors ${
                    isActive ? "bg-mint-soft text-forest" : "text-ink hover:bg-surface-2"
                  }`
                }
              >
                {n.label}
                <ChevronRight size={16} className="opacity-50" />
              </NavLink>
            </li>
          ))}
          <li className="mt-2 flex gap-2">
            {!eco.user && (
              <Link to="/login" className="btn btn-primary flex-1">
                Login / Sign Up
              </Link>
            )}
            <Link to="/calculator" className="btn btn-ghost flex-1">
              <Sprout size={15} /> Calculator
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
