import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bus, Car, Footprints, Gauge, Leaf, Recycle, RotateCcw, Save, Bike } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { Bar, Eyebrow, Reveal, SectionHead } from "../components/ui";
import ActionCard from "../components/ActionCard";
import { ACTIONS } from "../data/actions";
import { useEco } from "../lib/store";

const MODES = [
  { id: "car", label: "Car / motorbike", emoji: "🚗", icon: Car, factor: 0.192, note: "192 g CO₂e per km" },
  { id: "public", label: "Public transport", emoji: "🚌", icon: Bus, factor: 0.062, note: "62 g per passenger km" },
  { id: "shared", label: "Mixed car + bus", emoji: "🚏", icon: Bus, factor: 0.128, note: "half and half" },
  { id: "active", label: "Bike & walking", emoji: "🚲", icon: Bike, factor: 0.004, note: "almost negligible" },
];

const DIETS = [
  { id: "plant", label: "Mostly plant-based", emoji: "🌱", value: 950, note: "≈ 0.95 t / yr" },
  { id: "veg", label: "Vegetarian", emoji: "🥕", value: 1650, note: "≈ 1.65 t / yr" },
  { id: "mixed", label: "Mixed diet", emoji: "🍽️", value: 2600, note: "≈ 2.60 t / yr" },
  { id: "meat", label: "Meat with most meals", emoji: "🥩", value: 3600, note: "≈ 3.60 t / yr" },
];

const SHOPPING = [
  { id: "low", label: "Rarely — 1–2 buys a month", value: 800 },
  { id: "mid", label: "About once a week", value: 1500 },
  { id: "high", label: "Several times a week", value: 2300 },
];
const RECYCLE = [
  { id: "always", label: "Always, sorted cleanly", value: -180, emoji: "♻️" },
  { id: "sometimes", label: "Mostly, some confusion", value: 0, emoji: "🗑️" },
  { id: "never", label: "Rarely / not at all", value: 190, emoji: "🚮" },
];
const WASTE = [
  { id: "low", label: "Tiny bin, composted", value: 0.86, emoji: "🌿" },
  { id: "mid", label: "Average household", value: 1, emoji: "🗑️" },
  { id: "high", label: "Full general waste weekly", value: 1.18, emoji: "📦" },
];

function Slider({ label, value, onChange, min, max, step = 1, unit, hint }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label className="text-[13px] font-bold text-ink">{label}</label>
        <span className="font-mono text-[13px] font-bold text-forest">
          {value}
          <span className="ml-1 text-[11px] text-muted">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--pct": `${pct}%` }}
        className="mt-3"
      />
      {hint ? <p className="mt-2 text-[11.5px] text-muted">{hint}</p> : null}
    </div>
  );
}

function Choice({ title, options, value, onChange, cols = 2 }) {
  return (
    <div>
      <p className="text-[13px] font-bold text-ink">{title}</p>
      <div className={`mt-3 grid gap-2 ${cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className={`group flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all duration-200 ${
                active ? "border-forest bg-mint-soft shadow-[0_10px_22px_-16px_rgba(9,51,37,.8)]" : "hover:-translate-y-0.5"
              }`}
              style={{ borderColor: active ? "var(--c-forest)" : "var(--c-line)", background: active ? undefined : "var(--c-surface-2)" }}
            >
              {o.emoji ? <span className="text-[18px]">{o.emoji}</span> : null}
              <span className="min-w-0">
                <span className={`block text-[13px] font-bold ${active ? "text-forest" : "text-ink"}`}>{o.label}</span>
                {o.note ? <span className="block font-mono text-[10.5px] text-muted">{o.note}</span> : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const GROUPS = [
  { key: "transport", label: "Transport", tint: "#2b9fd6" },
  { key: "energy", label: "Home energy", tint: "#d9a12b" },
  { key: "food", label: "Food", tint: "#4e9c5f" },
  { key: "lifestyle", label: "Lifestyle", tint: "#17694f" },
];

export default function Calculator() {
  const eco = useEco();
  const [mode, setMode] = useState("car");
  const [km, setKm] = useState(14);
  const [kwh, setKwh] = useState(210);
  const [renew, setRenew] = useState(18);
  const [diet, setDiet] = useState("mixed");
  const [shop, setShop] = useState("mid");
  const [recycle, setRecycle] = useState("sometimes");
  const [waste, setWaste] = useState("mid");
  const [result, setResult] = useState(eco.footprint);

  const calc = useMemo(() => {
    const m = MODES.find((x) => x.id === mode);
    const transport = km * m.factor * 300;
    const energy = kwh * 12 * 0.42 * (1 - renew / 100);
    const food = DIETS.find((d) => d.id === diet).value;
    const shopV = SHOPPING.find((s) => s.id === shop).value;
    const recycleV = RECYCLE.find((r) => r.id === recycle).value;
    const wasteV = WASTE.find((w) => w.id === waste).value;
    const lifestyle = Math.max(150, shopV * wasteV + recycleV);
    const raw = { transport, energy, food, lifestyle };
    const total = Object.values(raw).reduce((a, b) => a + b, 0);
    const parts = GROUPS.map((g) => ({
      key: g.key,
      label: g.label,
      name: g.label,
      tint: g.tint,
      value: raw[g.key] / 1000,
      kg: raw[g.key],
      pct: (raw[g.key] / total) * 100,
    }));
    const biggest = parts.reduce((a, b) => (b.kg > a.kg ? b : a));
    return { tonnes: total / 1000, parts, biggest, raw };
  }, [mode, km, kwh, renew, diet, shop, recycle, waste]);

  const live = calc.parts;
  const saved = result;
  const avg = 4.8;
  const recommended = ACTIONS.filter((a) => {
    const map = { transport: "transport", energy: "energy", food: "food", lifestyle: "consumption" };
    return a.category === map[saved?.biggestKey || calc.biggest.key];
  })
    .sort((a, b) => b.co2 - a.co2)
    .slice(0, 3);

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      total: calc.tonnes,
      biggest: calc.biggest.label,
      biggestKey: calc.biggest.key,
      biggestValue: calc.biggest.value,
      parts: calc.parts.map((p) => ({ key: p.key, label: p.label, value: p.value, pct: p.pct, tint: p.tint })),
      inputs: { mode, km, kwh, renew, diet, shop, recycle, waste },
    };
    setResult(payload);
    eco.saveFootprint(payload);
    document.getElementById("result")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className="relative overflow-hidden border-b grad-paper py-14 sm:py-16">
        <div className="pointer-events-none absolute inset-0 topo opacity-60" />
        <div className="relative mx-auto max-w-[1240px] px-5 sm:px-6">
          <Eyebrow icon={Gauge}>Carbon footprint calculator</Eyebrow>
          <h1 className="font-display mt-4 max-w-3xl text-[clamp(2.1rem,5.6vw,3.7rem)] font-semibold leading-[1.02] text-balance">
            Where do your tonnes actually come from?
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            Answer seven quick questions. The model weights transport, home energy, diet and lifestyle into a demo
            score you can act on — and saves it to your profile on this device.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.55fr_1fr] lg:items-start">
          <form onSubmit={submit} className="space-y-5">
            {/* transport */}
            <Reveal className="card card-pad space-y-5">
              <header className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-soft text-sky">
                  <Car size={19} />
                </span>
                <div>
                  <h2 className="font-display text-[18px] font-semibold">Transport</h2>
                  <p className="text-[12px] text-muted">How you get around on a normal day</p>
                </div>
              </header>
              <Choice title="Main way you travel" options={MODES} value={mode} onChange={setMode} />
              <Slider
                label="Daily travel distance"
                value={km}
                onChange={setKm}
                min={0}
                max={90}
                unit="km / day"
                hint="Round trip — door to door. Assume 300 travel days a year."
              />
            </Reveal>

            {/* energy */}
            <Reveal delay={60} className="card card-pad space-y-5">
              <header className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: "color-mix(in srgb,#d9a12b 18%, transparent)", color: "#b8761f" }}>
                  <Gauge size={19} />
                </span>
                <div>
                  <h2 className="font-display text-[18px] font-semibold">Home energy</h2>
                  <p className="text-[12px] text-muted">Electricity use and how much of it is renewable</p>
                </div>
              </header>
              <Slider label="Monthly electricity usage" value={kwh} onChange={setKwh} min={20} max={1200} step={10} unit="kWh" hint="Check a recent bill — a 1–2 bedroom flat usually sits near 150–250 kWh." />
              <Slider label="Renewable share of your tariff" value={renew} onChange={setRenew} min={0} max={100} step={5} unit="%" hint="Green tariffs count as 100% renewable electricity." />
            </Reveal>

            {/* food */}
            <Reveal delay={100} className="card card-pad space-y-5">
              <header className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-mint-soft text-forest">
                  <Leaf size={19} />
                </span>
                <div>
                  <h2 className="font-display text-[18px] font-semibold">Food</h2>
                  <p className="text-[12px] text-muted">Pick the pattern that describes most weeks</p>
                </div>
              </header>
              <Choice title="Typical diet" options={DIETS} value={diet} onChange={setDiet} cols={2} />
            </Reveal>

            {/* lifestyle */}
            <Reveal delay={140} className="card card-pad space-y-5">
              <header className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: "var(--c-surface-2)", color: "var(--c-ink)" }}>
                  <Recycle size={19} />
                </span>
                <div>
                  <h2 className="font-display text-[18px] font-semibold">Lifestyle</h2>
                  <p className="text-[12px] text-muted">Shopping, recycling and waste</p>
                </div>
              </header>
              <Choice title="New things you buy" options={SHOPPING} value={shop} onChange={setShop} cols={3} />
              <Choice title="Recycling habits" options={RECYCLE} value={recycle} onChange={setRecycle} cols={3} />
              <Choice title="Waste you generate" options={WASTE} value={waste} onChange={setWaste} cols={3} />
            </Reveal>

            <Reveal className="flex flex-wrap items-center gap-3">
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Calculate my footprint
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("car");
                  setKm(14);
                  setKwh(210);
                  setRenew(18);
                  setDiet("mixed");
                  setShop("mid");
                  setRecycle("sometimes");
                  setWaste("mid");
                  setResult(null);
                }}
                className="btn btn-ghost"
              >
                <RotateCcw size={15} /> Reset
              </button>
              <p className="text-[12px] text-muted">Demo model · not a certified lifecycle assessment</p>
            </Reveal>
          </form>

          {/* live preview */}
          <div className="lg:sticky lg:top-24">
            <Reveal delay={80} className="card overflow-hidden">
              <div className="grad-dark-eco p-6 text-[#dcefe2]">
                <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-[#8fb6a1]">Live estimate</p>
                <p className="font-display mt-2 flex items-baseline gap-2 text-[52px] font-semibold leading-none text-white">
                  {calc.tonnes.toFixed(1)}
                  <span className="text-[14px] font-bold text-[#a8dcbc]">t CO₂e / yr</span>
                </p>
                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/12">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (calc.tonnes / 12) * 100)}%`, background: "linear-gradient(90deg,#7fdcae,#7cc7ef)" }}
                  />
                </div>
                <p className="mt-2.5 text-[12px] text-[#a9c9b8]">
                  {calc.tonnes > avg
                    ? `${((calc.tonnes / avg - 1) * 100).toFixed(0)}% above the ${avg} t regional average`
                    : `${((1 - calc.tonnes / avg) * 100).toFixed(0)}% below the ${avg} t regional average`}
                </p>
              </div>
              <ul className="divide-y" style={{ borderColor: "var(--c-line)" }}>
                {live.map((p) => (
                  <li key={p.key} className="p-5">
                    <div className="mb-2 flex items-center justify-between text-[12.5px] font-bold">
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.tint }} />
                        {p.label}
                      </span>
                      <span className="font-mono text-muted">{p.pct.toFixed(0)}%</span>
                    </div>
                    <Bar pct={p.pct} tone={p.key === "food" ? "mint" : p.key === "energy" ? "amber" : "eco"} />
                    <p className="mt-1.5 text-[11.5px] text-muted">
                      {p.kg.toLocaleString("en-US", { maximumFractionDigits: 0 })} kg CO₂e · {p.value.toFixed(2)} t
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* RESULT */}
      <section id="result" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 pb-20 sm:px-6">
        <Reveal className="card overflow-hidden">
          <div className="grid gap-10 p-7 lg:grid-cols-[1fr_1.15fr] lg:items-center sm:p-10">
            <div>
              {saved ? (
                <>
                  <Eyebrow>Your estimated carbon footprint</Eyebrow>
                  <p className="font-display mt-4 flex items-baseline gap-2 text-[clamp(3.2rem,9vw,5.4rem)] font-semibold leading-none tracking-[-.05em]">
                    {saved.total.toFixed(1)}
                    <span className="text-[16px] font-bold text-muted">tonnes CO₂e / year</span>
                  </p>
                  <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
                    That's about {Math.round(saved.total * 1000 / 0.192).toLocaleString()} km driven in a petrol car,
                    or {Math.round(saved.total * 18)} mature trees working for a year to offset it.
                  </p>

                  <div className="mt-6 rounded-2xl p-4" style={{ background: "var(--c-mint-soft)" }}>
                    <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.1em] text-forest">
                      <Footprints size={15} /> Your biggest opportunity: {saved.biggest}
                    </p>
                    <p className="mt-1.5 text-[13.5px] text-ink-soft">
                      {saved.biggestValue.toFixed(2)} t of your {saved.total.toFixed(1)} t lives here — roughly{" "}
                      {saved.parts.find((p) => p.key === saved.biggest)?.pct.toFixed(0)}%. Two or three habitual swaps
                      beat one heroic gesture.
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Start with these</p>
                    <Link to={`/actions?category=${saved.biggestKey || "transport"}`} className="btn btn-ghost mt-3">
                      Open {saved.biggest.toLowerCase()} actions <ArrowRight size={15} />
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <Eyebrow>Result</Eyebrow>
                  <h3 className="font-display mt-4 text-[26px] font-semibold leading-snug">
                    Fill the form and your score lands here — with a donut breakdown and the exact actions to try.
                  </h3>
                </>
              )}
            </div>

            <div className="relative h-[320px]">
              {saved ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={saved.parts}
                        dataKey="value"
                        nameKey="label"
                        innerRadius="62%"
                        outerRadius="92%"
                        paddingAngle={3}
                        cornerRadius={7}
                        stroke="none"
                      >
                        {saved.parts.map((p) => (
                          <Cell key={p.key} fill={p.tint} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
                    <p className="font-display text-[34px] font-semibold leading-none">{saved.total.toFixed(1)}</p>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">tonnes / yr</p>
                  </div>
                  <ul className="absolute inset-x-0 -bottom-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
                    {saved.parts.map((p) => (
                      <li key={p.key} className="flex items-center gap-1.5 text-[11.5px] font-semibold text-muted">
                        <span className="h-2 w-2 rounded-full" style={{ background: p.tint }} /> {p.label}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <div className="grid h-full place-items-center rounded-[20px] text-center" style={{ background: "var(--c-surface-2)" }}>
                  <p className="max-w-[240px] text-[13px] text-muted">
                    A four-slice donut showing transport, energy, food and lifestyle shares appears here after your
                    first calculation.
                  </p>
                </div>
              )}
            </div>
          </div>

          {saved && (
            <div className="border-t p-7 sm:p-10" style={{ borderColor: "var(--c-line)" }}>
              <SectionHead eyebrow="Recommended next" title={`Attack ${saved.biggest.toLowerCase()} first`} />
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {recommended.map((a, i) => (
                  <ActionCard key={a.id} action={a} index={i} />
                ))}
              </div>
            </div>
          )}
        </Reveal>
      </section>
    </>
  );
}
