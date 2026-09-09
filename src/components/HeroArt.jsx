import { Bike, Droplets, Recycle, Sun, Sprout, Bus } from "lucide-react";

const NODES = [
  { Icon: Sprout, label: "Plant-forward meals", x: "2%", y: "10%", tilt: "-6deg", tint: "#17694f" },
  { Icon: Sun, label: "Rooftop solar", x: "72%", y: "0%", tilt: "8deg", tint: "#d9a12b" },
  { Icon: Bike, label: "Car-free commute", x: "-4%", y: "62%", tilt: "5deg", tint: "#2b9fd6" },
  { Icon: Recycle, label: "Loop the waste", x: "78%", y: "70%", tilt: "-9deg", tint: "#0f4c3a" },
  { Icon: Bus, label: "Shared transit", x: "46%", y: "88%", tilt: "4deg", tint: "#3fb6c9" },
  { Icon: Droplets, label: "Rainwater", x: "86%", y: "32%", tilt: "-4deg", tint: "#4e9c5f" },
];

/** Original EcoSphere planet illustration: living globe, orbit rings, action nodes. */
export default function HeroArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px] select-none">
      {/* halo */}
      <div
        className="absolute inset-[-8%] rounded-full blur-2xl"
        style={{ background: "radial-gradient(circle at 50% 45%, rgba(43,159,214,.30), rgba(23,105,79,.22) 45%, transparent 68%)" }}
      />

      {/* orbit rings */}
      <svg viewBox="0 0 100 100" className="absolute inset-[-6%] animate-spin-slow" aria-hidden="true">
        <circle cx="50" cy="50" r="46" fill="none" stroke="var(--c-forest)" strokeOpacity=".35" strokeWidth=".5" strokeDasharray="3 5" />
        <circle cx="50" cy="4" r="1.6" fill="var(--c-sky)" />
      </svg>
      <svg viewBox="0 0 100 100" className="absolute inset-[2%] animate-spin-rev" aria-hidden="true">
        <circle cx="50" cy="50" r="47" fill="none" stroke="var(--c-sky)" strokeOpacity=".28" strokeWidth=".4" strokeDasharray="1 7" />
        <circle cx="97" cy="50" r="1.1" fill="var(--c-forest)" />
      </svg>

      {/* planet */}
      <div className="absolute inset-[12%] animate-float-slow">
        <svg viewBox="0 0 200 200" className="h-full w-full drop-shadow-[0_28px_46px_rgba(9,48,36,.38)]" role="img" aria-label="Illustration of a healthy planet with forests, renewable energy and clean water">
          <defs>
            <radialGradient id="ocean" cx="36%" cy="28%" r="82%">
              <stop offset="0%" stopColor="#8fd7f2" />
              <stop offset="52%" stopColor="#3ea0cf" />
              <stop offset="100%" stopColor="#0f4c6b" />
            </radialGradient>
            <linearGradient id="land" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a5dfa9" />
              <stop offset="55%" stopColor="#42a163" />
              <stop offset="100%" stopColor="#14563d" />
            </linearGradient>
            <linearGradient id="leafG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#b8ecc2" />
              <stop offset="100%" stopColor="#1c8363" />
            </linearGradient>
            <clipPath id="ball">
              <circle cx="100" cy="100" r="74" />
            </clipPath>
          </defs>

          <circle cx="100" cy="100" r="74" fill="url(#ocean)" />

          <g clipPath="url(#ball)">
            {/* continents */}
            <path d="M28 76c14-16 34-14 44-24s34-6 40 6-8 24-22 26-20 12-34 10-34-6-28-18Z" fill="url(#land)" opacity=".95" />
            <path d="M112 122c12-6 28-2 32 8s-8 26-22 26-24-6-24-16 6-14 14-18Z" fill="url(#land)" opacity=".92" />
            <path d="M52 130c10-4 22 2 24 10s-6 18-16 18-18-6-18-14 4-12 10-14Z" fill="url(#land)" opacity=".8" />
            {/* cloud bands */}
            <ellipse cx="70" cy="52" rx="42" ry="7" fill="#ffffff" opacity=".22" />
            <ellipse cx="132" cy="88" rx="34" ry="6" fill="#ffffff" opacity=".16" />
            <ellipse cx="92" cy="152" rx="46" ry="8" fill="#ffffff" opacity=".14" />
            {/* grid meridians */}
            <g stroke="#ffffff" strokeOpacity=".16" fill="none">
              <ellipse cx="100" cy="100" rx="28" ry="74" />
              <ellipse cx="100" cy="100" rx="56" ry="74" />
              <path d="M26 100h148M32 72h136M32 128h136" />
            </g>
            {/* turbine + solar field */}
            <g transform="translate(74 96)">
              <rect x="-1.2" y="0" width="2.4" height="20" rx="1.2" fill="#f2fbf5" opacity=".9" />
              <g fill="#eaf7ee" opacity=".95">
                <path d="M0 0 14 -5 -1 -3Z" />
                <path d="M0 0 -8 13 -2 -1Z" />
                <path d="M0 0 -8 -13 2 1Z" />
              </g>
              <circle r="2" fill="#cfe9d8" />
            </g>
            <g transform="translate(96 138)" fill="#123a4d" opacity=".8">
              <rect x="0" y="0" width="9" height="6" rx="1" />
              <rect x="11" y="0" width="9" height="6" rx="1" />
              <rect x="0" y="8" width="9" height="6" rx="1" />
            </g>
            {/* people */}
            <g fill="#f4fbf6" opacity=".92">
              <circle cx="58" cy="112" r="3" />
              <path d="M54 118c1-4 7-4 8 0l1 7h-10Z" />
              <circle cx="140" cy="106" r="2.6" />
              <path d="M136 112c1-4 7-4 8 0l1 6h-10Z" />
            </g>
          </g>

          {/* leaf cradling the planet */}
          <path d="M158 44c16 20 12 54-10 72-8 6-18 10-28 11 6-14 6-28-2-40-8-13-22-20-38-22 16-10 34-14 50-10 12 3 22 9 28 19-8-6-18-9-28-9 12 4 22 11 28 21" fill="url(#leafG)" opacity=".9" transform="translate(4 -6) scale(.96)" />
          <circle cx="100" cy="100" r="74" fill="none" stroke="#ffffff" strokeOpacity=".3" strokeWidth="1.2" />
        </svg>
      </div>

      {/* floating action nodes */}
      {NODES.map((n, i) => (
        <div
          key={n.label}
          className="group absolute animate-float"
          style={{ left: n.x, top: n.y, animationDelay: `${i * 0.7}s`, animationDuration: `${7 + i}s` }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl border shadow-[0_18px_30px_-18px_rgba(9,48,36,.6)] transition-all duration-300 group-hover:scale-110 sm:h-14 sm:w-14"
            style={{ background: "var(--c-surface)", borderColor: "var(--c-line)", transform: `rotate(${n.tilt})` }}
          >
            <n.Icon size={22} strokeWidth={2.1} style={{ color: n.tint }} />
          </div>
          <span
            className="pointer-events-none absolute left-1/2 top-[110%] -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: "var(--c-forest)", color: "#f4fbf6" }}
          >
            {n.label}
          </span>
        </div>
      ))}
    </div>
  );
}
