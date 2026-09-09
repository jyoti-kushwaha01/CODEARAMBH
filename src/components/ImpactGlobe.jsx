import { useEffect, useMemo, useRef, useState } from "react";
import { HOTSPOTS } from "../data/community";
import { fmt } from "../lib/hooks";

const CONTINENTS = [
  "M18 40c9-13 26-16 36-8s6 22-4 29-26 9-33 2-8-10 1-23Z",
  "M74 62c8-7 22-5 27 4s0 21-9 26-22 2-25-7 0-16 7-23Z",
  "M112 26c11-8 29-5 34 6s-2 24-13 28-25 0-29-10 0-16 8-24Z",
  "M132 84c9-5 21-1 24 8s-4 18-13 21-19-1-21-9 1-16 10-20Z",
  "M36 96c9-4 19 2 20 10s-7 14-15 13-15-6-14-13 4-8 9-10Z",
  "M96 108c8-4 18 0 20 7s-5 13-13 13-14-4-14-10 3-8 7-10Z",
];

/** Original rotating globe with interactive community hotspots (no external imagery). */
export default function ImpactGlobe({ onSelect, selectedId }) {
  const [internal, setInternal] = useState(HOTSPOTS[0].id);
  const selected = selectedId ?? internal;
  const svgRef = useRef(null);

  useEffect(() => {
    const i = HOTSPOTS.findIndex((h) => h.id === selected);
    if (i >= 0) onSelect?.(HOTSPOTS[i]);
  }, [selected, onSelect]);

  const pins = useMemo(() => HOTSPOTS, []);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <div
        className="absolute inset-[-10%] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle at 45% 40%, rgba(43,159,214,.35), rgba(23,105,79,.3) 48%, transparent 70%)" }}
      />
      <svg ref={svgRef} viewBox="0 0 200 200" className="relative h-full w-full" role="img" aria-label="Globe showing EcoSphere activity hotspots">
        <defs>
          <radialGradient id="g-ocean" cx="34%" cy="26%" r="86%">
            <stop offset="0%" stopColor="#12556f" />
            <stop offset="55%" stopColor="#0c3f57" />
            <stop offset="100%" stopColor="#072533" />
          </radialGradient>
          <linearGradient id="g-land" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7fdcae" />
            <stop offset="100%" stopColor="#17694f" />
          </linearGradient>
          <clipPath id="g-clip">
            <circle cx="100" cy="100" r="86" />
          </clipPath>
          <radialGradient id="g-shade" cx="72%" cy="76%" r="70%">
            <stop offset="0%" stopColor="#000" stopOpacity=".55" />
            <stop offset="60%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="100" r="86" fill="url(#g-ocean)" />

        <g clipPath="url(#g-clip)">
          {/* drifting landmasses = rotation illusion */}
          {[0, 1].map((rep) => (
            <g key={rep} style={{ animation: `drift 46s linear infinite`, animationDelay: `${-rep * 23}s` }}>
              {CONTINENTS.map((d, i) => (
                <path key={i} d={d} fill="url(#g-land)" opacity={0.72 - (i % 3) * 0.06} transform="translate(0 20) scale(1.1)" />
              ))}
            </g>
          ))}
          {/* meridians */}
          <g stroke="#a8dcbc" strokeOpacity=".22" fill="none" strokeWidth=".6">
            {[26, 52, 78].map((r, i) => (
              <ellipse key={r} cx="100" cy="100" rx={r} ry="86">
                <animate attributeName="rx" values={`${r};0;${r}`} dur="19s" begin={`${i * 2}s`} repeatCount="indefinite" />
              </ellipse>
            ))}
            {[46, 68, 84].map((y) => (
              <path key={y} d={`M${100 - y} ${100 + (y - 100) * 0.15} Q100 ${100 + 26} ${100 + y} ${100 + (y - 100) * 0.15}`} />
            ))}
          </g>
          <circle cx="100" cy="100" r="86" fill="url(#g-shade)" />
        </g>

        <circle cx="100" cy="100" r="86" fill="none" stroke="#7fdcae" strokeOpacity=".45" strokeWidth=".9" />
        <circle cx="100" cy="100" r="97" fill="none" stroke="#7cc7ef" strokeOpacity=".22" strokeDasharray="2 6" strokeWidth=".8" className="animate-spin-slow" style={{ transformOrigin: "100px 100px" }} />
      </svg>

      <style>{`@keyframes drift { from { transform: translateX(-200px);} to { transform: translateX(0);} }`}</style>

      {/* hotspots */}
      {pins.map((p, i) => (
        <button
          key={p.id}
          onClick={() => {
            setInternal(p.id);
            onSelect?.(p);
          }}
          className="group absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${i * 0.4}s` }}
          aria-label={`${p.city}, ${p.country}`}
        >
          <span className="relative grid place-items-center">
            <span
              className="absolute h-6 w-6 rounded-full ring-1"
              style={{
                background: selected === p.id ? "rgba(124,199,239,.4)" : "rgba(127,220,174,.28)",
                animation: `pulseRing 2.8s ease-out ${i * 0.24}s infinite`,
              }}
            />
            <span
              className="relative h-2.5 w-2.5 rounded-full transition-transform duration-300 group-hover:scale-150"
              style={{ background: selected === p.id ? "#7cc7ef" : "#a8dcbc", boxShadow: "0 0 12px 2px rgba(124,199,239,.6)" }}
            />
          </span>
          <span className="pointer-events-none absolute left-1/2 top-[125%] -translate-x-1/2 whitespace-nowrap rounded-full bg-[#072533] px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#c9f0d8] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {p.city}
          </span>
        </button>
      ))}

      {selected && (
        <div className="pointer-events-none absolute -bottom-2 left-1/2 w-[min(94%,320px)] -translate-x-1/2 translate-y-full">
          {pins.filter((p) => p.id === selected).map((p) => (
            <div key={p.id} className="card animate-pop px-4 py-3 text-left">
              <p className="font-display text-[15px] font-semibold">{p.city}</p>
              <p className="text-[11.5px] text-muted">{p.country}</p>
              <div className="mt-2 flex items-center gap-4 text-[11.5px] font-semibold">
                <span className="text-forest">{fmt(p.co2)} kg saved</span>
                <span className="text-sky">{fmt(p.actions)} actions</span>
                <span className="text-amber">{fmt(p.champions)} members</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
