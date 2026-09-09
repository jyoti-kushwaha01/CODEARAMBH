import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Earth as Globe2, Handshake, MapPin, Sparkles, TrendingUp, Users } from "lucide-react";
import Counter from "../components/Counter";
import ImpactGlobe from "../components/ImpactGlobe";
import { Bar, Eyebrow, Reveal, SectionHead } from "../components/ui";
import { COMMUNITY_STATS, COUNTRY_ROWS, HOTSPOTS } from "../data/community";
import { useEco } from "../lib/store";
import { fmt } from "../lib/hooks";

const METRICS = [
  { label: "kg CO₂ saved", to: COMMUNITY_STATS.co2Saved, suffix: "+", tone: "#7fdcae", note: "cumulative, all members" },
  { label: "Sustainable actions", to: 2.4, suffix: "M", decimals: 1, tone: "#7cc7ef", note: "logged since launch" },
  { label: "Climate champions", to: COMMUNITY_STATS.champions, suffix: "+", tone: "#f0b25c", note: "1,500 pts or more" },
  { label: "kg waste avoided", to: COMMUNITY_STATS.wasteAvoided, suffix: "", tone: "#a8dcbc", note: "refused, reused, recycled" },
];

export default function Impact() {
  const eco = useEco();
  const [city, setCity] = useState(HOTSPOTS[0]);
  const [pledge, setPledge] = useState("");
  const [pledges, setPledges] = useState([
    { who: "Nadia · Dhaka", text: "I'll take the bus twice a week" },
    { who: "Elias · Aarhus", text: "No new clothes until April" },
    { who: "Mei · Penang", text: "Cold wash, full loads, always" },
  ]);
  const maxCo2 = Math.max(...COUNTRY_ROWS.map((c) => c.co2));
  const share = (eco.co2Saved / COMMUNITY_STATS.co2Saved) * 100;

  return (
    <>
      {/* ---------------- hero counters ---------------- */}
      <section className="relative overflow-hidden grad-dark-eco py-16 text-[#dcefe2] sm:py-20">
        <div className="pointer-events-none absolute inset-0 topo opacity-25" />
        <div className="pointer-events-none absolute -right-32 top-[-10%] h-96 w-96 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(43,159,214,.34), transparent 66%)" }} />
        <span className="animate-leaf pointer-events-none absolute left-[8%] top-0 text-[20px] opacity-50">🍃</span>

        <div className="relative mx-auto max-w-[1240px] px-5 sm:px-6">
          <span className="chip bg-white/12 uppercase text-[#a8dcbc]">
            <Globe2 size={12} /> Global impact
          </span>
          <h1 className="font-display mt-5 max-w-3xl text-[clamp(2.2rem,6.4vw,4.2rem)] font-semibold leading-[1.0] text-white text-balance">
            Together, We Make an Impact
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-[#a9c9b8]">
            One ledger, {fmt(COMMUNITY_STATS.countries)} countries, {fmt(COMMUNITY_STATS.cities)} cities. Every figure
            below is the sum of individual actions — including yours.
          </p>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[24px] border border-white/12 bg-white/[.06] sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map((m, i) => (
              <div key={m.label} className="group relative bg-[#0a2419]/55 p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-[#12352a]/70" style={{ animation: `rise .7s cubic-bezier(.2,.8,.2,1) ${i * 90}ms both` }}>
                <p className="font-display text-[clamp(2rem,4.6vw,2.9rem)] font-semibold leading-none" style={{ color: m.tone }}>
                  <Counter to={m.to} suffix={m.suffix} decimals={m.decimals || 0} duration={1700} />
                </p>
                <p className="mt-2.5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#8fb6a1]">{m.label}</p>
                <p className="mt-1.5 text-[12px] text-[#a9c9b8]">{m.note}</p>
                <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-white/60 transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- globe ---------------- */}
      <section className="mx-auto max-w-[1240px] px-5 py-16 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <ImpactGlobe onSelect={setCity} selectedId={city.id} />
            <p className="mt-24 text-center text-[12px] text-muted">Tap a pulse to inspect a city · globe is decorative-original</p>
          </Reveal>

          <Reveal delay={100}>
            <SectionHead eyebrow="Where it's happening" title="Nine of the busiest hubs right now" lead="Activity is weighted by members actively logging in the last 30 days." />
            <ul className="mt-7 space-y-2.5">
              {HOTSPOTS.map((h, i) => {
                const active = h.id === city.id;
                return (
                  <li key={h.id}>
                    <button
                      onClick={() => setCity(h)}
                      className={`flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                        active ? "border-forest bg-mint-soft" : ""
                      }`}
                      style={{ borderColor: active ? "var(--c-forest)" : "var(--c-line)", background: active ? undefined : "var(--c-surface)" }}
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: `color-mix(in srgb, ${["#17694f", "#2b9fd6", "#d9a12b"][i % 3]} 16%, transparent)`, color: ["#17694f", "#2b9fd6", "#d9a12b"][i % 3] }}>
                        <MapPin size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[13.5px] font-bold">
                          {h.city} <span className="font-normal text-muted">· {h.country}</span>
                        </span>
                        <span className="mt-1 block max-w-[220px]">
                          <Bar pct={(h.co2 / 61400) * 100} tone={active ? "eco" : "sky"} height={5} delay={i * 40} />
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="font-mono block text-[13px] font-bold">{fmt(h.co2)}</span>
                        <span className="text-[10px] uppercase tracking-wide text-muted">kg saved</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------------- countries + your contribution ---------------- */}
      <section className="border-y py-16" style={{ background: "var(--c-surface-2)" }}>
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <Reveal className="card overflow-hidden">
            <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--c-line)" }}>
              <h2 className="font-display text-[19px] font-semibold">Top participating countries</h2>
              <span className="chip bg-mint-soft text-forest">
                <TrendingUp size={12} /> kg CO₂e · 30 days
              </span>
            </div>
            <ul className="divide-y" style={{ borderColor: "var(--c-line)" }}>
              {COUNTRY_ROWS.map((c, i) => (
                <li key={c.country} className="group px-6 py-4 transition-colors hover:bg-surface-2">
                  <div className="flex items-center justify-between gap-4 text-[13.5px]">
                    <span className="flex items-center gap-2.5 font-bold">
                      <span className="text-[18px]">{c.flag}</span> {c.country}
                    </span>
                    <span className="flex items-center gap-4">
                      <span className="font-mono text-[13px] font-bold">{fmt(c.co2)}</span>
                      <span className="hidden w-24 text-right text-[11.5px] text-muted sm:block">{fmt(c.champions)} members</span>
                      <span className={`w-14 text-right text-[11.5px] font-bold ${c.growth > 10 ? "text-forest" : "text-muted"}`}>+{c.growth}%</span>
                    </span>
                  </div>
                  <div className="mt-2">
                    <Bar pct={(c.co2 / maxCo2) * 100} tone={i === 0 ? "eco" : "sky"} height={7} delay={i * 60} />
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={80} className="card relative overflow-hidden p-6">
              <span className="animate-sheen pointer-events-none absolute inset-0 opacity-[.14]" style={{ backgroundImage: "linear-gradient(100deg,transparent 20%,var(--c-mint) 45%,transparent 70%)" }} />
              <Eyebrow icon={Sparkles}>Your contribution</Eyebrow>
              <p className="font-display relative mt-4 text-[clamp(2rem,4.6vw,2.7rem)] font-semibold leading-none">
                {eco.co2Saved.toFixed(1)} <span className="text-[15px] font-bold text-muted">kg CO₂e</span>
              </p>
              <p className="relative mt-3 text-[13.5px] leading-relaxed text-ink-soft">
                Your actions have contributed <strong className="text-forest">{eco.co2Saved.toFixed(1)} kg</strong> of
                CO₂ savings — {share.toFixed(4)}% of the community total,
                across {eco.actionsCompleted} logged actions.
              </p>
              <ul className="relative mt-5 space-y-2 text-[12.5px]">
                {[
                  ["Equivalent to", `${Math.round(eco.co2Saved / 0.192).toLocaleString()} km not driven`],
                  ["Or", `${Math.round(eco.co2Saved / 21)} flights not taken under 700 km`],
                  ["Trees needed", `${Math.round(eco.co2Saved / 18)} mature trees · 1 year`],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between gap-3 border-b pb-2 last:border-0" style={{ borderColor: "var(--c-line)" }}>
                    <span className="text-muted">{k}</span>
                    <span className="font-mono font-bold">{v}</span>
                  </li>
                ))}
              </ul>
              <Link to="/actions" className="btn btn-primary relative mt-6 w-full">
                Add another kilogram <ArrowRight size={15} />
              </Link>
            </Reveal>

            <Reveal delay={140} className="card card-pad">
              <h3 className="font-display flex items-center gap-2 text-[17px] font-semibold">
                <Handshake size={17} className="text-forest" /> Community pledges
              </h3>
              <p className="mt-1 text-[12.5px] text-muted">Public, one sentence, no expiry.</p>
              <ul className="mt-4 space-y-2">
                {pledges.map((p, i) => (
                  <li key={i} className="rounded-2xl px-3.5 py-2.5 text-[12.5px]" style={{ background: "var(--c-surface-2)", boxShadow: "inset 0 0 0 1px var(--c-line)" }}>
                    <strong className="mr-1.5 text-forest">{p.who}</strong>
                    {p.text}
                  </li>
                ))}
              </ul>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const text = pledge.trim();
                  if (!text) return;
                  setPledges((p) => [{ who: `${eco.user?.name?.split(" ")[0] || "You"} · your city`, text }, ...p].slice(0, 5));
                  setPledge("");
                  eco.toast({ tone: "success", icon: "🤝", title: "Pledge posted", body: "Your pledge is now visible to your circle." });
                  eco.notify({ icon: "🤝", title: "New pledge added", body: text, time: "just now", kind: "community" });
                }}
                className="mt-3 flex gap-2"
              >
                <input
                  value={pledge}
                  onChange={(e) => setPledge(e.target.value)}
                  placeholder="I'll…"
                  className="ring-focus min-w-0 flex-1 rounded-full px-4 py-2.5 text-[13px] outline-none"
                  style={{ background: "var(--c-surface-2)", boxShadow: "inset 0 0 0 1px var(--c-line)" }}
                />
                <button className="btn btn-primary px-4!">Add</button>
              </form>
              <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-muted">
                <Users size={12} /> {fmt(COMMUNITY_STATS.champions)} members have pledged
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-16 sm:px-6">
        <Reveal className="card flex flex-wrap items-center justify-between gap-5 p-8">
          <div>
            <h2 className="font-display text-[clamp(1.4rem,3vw,2rem)] font-semibold leading-tight">
              {city.city} is {city.co2 > 40000 ? "leading the week" : "climbing fast"}. Join the board.
            </h2>
            <p className="mt-2 text-[13.5px] text-muted">
              {fmt(city.actions)} actions · {fmt(city.champions)} active members · {fmt(city.co2)} kg CO₂e avoided.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/challenges" className="btn btn-primary">
              Join a challenge
            </Link>
            <Link to="/login" className="btn btn-ghost">
              Create profile
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
