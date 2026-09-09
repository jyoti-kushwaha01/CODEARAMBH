import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  CircleCheck as CheckCircle2,
  Droplets,
  Flame,
  Gauge,
  Leaf,
  PiggyBank,
  Sparkles,
  Target,
  Trash as Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Bar as RBar, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart } from "recharts";
import StatCard from "../components/StatCard";
import DailyChallenge from "../components/DailyChallenge";
import BadgeCard from "../components/BadgeCard";
import ActionCard from "../components/ActionCard";
import { Bar, Eyebrow, Reveal, SectionHead } from "../components/ui";
import { ACTIONS, CATEGORIES } from "../data/actions";
import { useEco, dayKey } from "../lib/store";
import { fmt } from "../lib/hooks";

const CHART_TINT = ["#17694f", "#2b9fd6", "#d9a12b", "#4e9c5f", "#9a6bc4", "#3fb6c9"];

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="card px-3.5 py-2.5 text-[12px] shadow-lg">
      <p className="font-bold text-ink">{label}</p>
      <p className="mt-1 text-[12px] text-muted">
        <strong className="font-mono text-forest">{d.co2} kg CO₂e</strong> avoided · {d.actions} action{d.actions === 1 ? "" : "s"}
      </p>
    </div>
  );
}

export default function Dashboard() {
  const eco = useEco();
  const name = eco.user?.name?.split(" ")[0] || "Climate Champion";
  const water = eco.co2Saved * 21;
  const waste = eco.co2Saved * 0.62;
  const impact = [
    { Icon: Leaf, label: "CO₂ saved", value: `${eco.co2Saved.toFixed(1)} kg`, pct: Math.min(100, (eco.co2Saved / 100) * 100), tone: "#17694f", note: "100 kg unlocks Climate Champion" },
    { Icon: Droplets, label: "Water saved", value: `${fmt(water)} L`, pct: Math.min(100, water / 30), tone: "#3fb6c9", note: "from shorter showers & full loads" },
    { Icon: Trash2, label: "Waste avoided", value: `${waste.toFixed(1)} kg`, pct: Math.min(100, (eco.counts.waste / 10) * 100), tone: "#9a6bc4", note: `${eco.counts.waste} of 10 waste actions` },
    { Icon: CheckCircle2, label: "Sustainable actions", value: `${eco.actionsCompleted}`, pct: Math.min(100, (eco.actionsCompleted / 50) * 100), tone: "#2b9fd6", note: "50 actions = Eco Point Runner" },
  ];

  const days14 = Array.from({ length: 14 }, (_, i) => dayKey(13 - i));
  const maxCo2 = Math.max(1, ...days14.map((d) => eco.history[d]?.co2 || 0));
  const quick = ACTIONS.filter((a) => !eco.completedToday.has(a.id)).slice(0, 3);

  const mix = CATEGORIES.map((c, i) => ({ name: c.label, value: eco.counts[c.id] || 0, tint: CHART_TINT[i] }));
  const totalActions = mix.reduce((a, b) => a + b.value, 0) || 1;

  return (
    <>
      <section className="relative overflow-hidden border-b" style={{ background: "var(--c-surface-2)" }}>
        <div className="pointer-events-none absolute inset-0 topo opacity-45" />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(23,105,79,.22), transparent 68%)" }}
        />
        <div className="relative mx-auto flex max-w-[1240px] flex-col gap-8 px-5 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow icon={Sparkles}>{eco.level.emoji} {eco.level.name} · {fmt(eco.ecoPoints)} points</Eyebrow>
            <h1 className="font-display mt-3 text-[clamp(1.9rem,5vw,3.2rem)] font-semibold leading-[1.03] text-balance">
              {greeting()}, {name} 🌱
            </h1>
            <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-ink-soft">
              You're on a <strong className="text-forest">{eco.streak}-day streak</strong> and{" "}
              {eco.weekly.filter((d) => d.active).length} of the last 7 days have an action in them. Today's challenge
              is worth {eco.dailyChallenge.points} points.
            </p>
          </div>
          <div className="card flex w-full max-w-sm items-center gap-4 p-4">
            <div className="relative h-16 w-16 shrink-0">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" stroke="var(--c-line)" strokeWidth="10" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#lvl)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * eco.level.progress) / 100}
                  style={{ transition: "stroke-dashoffset 1s cubic-bezier(.2,.8,.2,1)" }}
                />
                <defs>
                  <linearGradient id="lvl" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#17694f" />
                    <stop offset="100%" stopColor="#2b9fd6" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 grid place-items-center text-[19px]">{eco.level.emoji}</span>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">Next level</p>
              <p className="font-display text-[17px] font-semibold leading-tight">
                {eco.level.next ? `${fmt(eco.level.toNext)} pts → ${eco.level.next.name}` : "Top level reached 🌍"}
              </p>
              <Link to="/profile" className="mt-1 inline-flex items-center gap-1 text-[12.5px] font-bold text-sky hover:underline">
                View profile <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] space-y-6 px-5 py-10 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Carbon saved", value: eco.co2Saved, unit: "kg CO₂", decimals: 1, icon: Leaf, tone: "forest", delta: "+3.4 kg this week", index: 0 },
            { label: "Actions completed", value: eco.actionsCompleted, unit: "", decimals: 0, icon: CheckCircle2, tone: "sky", delta: "+4 this week", index: 1 },
            { label: "Eco points", value: eco.ecoPoints, unit: "pts", decimals: 0, icon: PiggyBank, tone: "amber", delta: "+180 today", index: 2 },
            { label: "Current streak", value: eco.streak, unit: "days 🔥", decimals: 0, icon: Flame, tone: "ink", delta: "Best: 21 days", index: 3 },
          ].map((s) => (
            <Reveal key={s.label} delay={s.index * 60}>
              <StatCard {...s} big />
            </Reveal>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          {/* weekly chart */}
          <Reveal className="card card-pad">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-[20px] font-semibold leading-tight">Weekly carbon saving</h2>
                <p className="mt-1 text-[12.5px] text-muted">kg CO₂e avoided per day · last 7 days</p>
              </div>
              <div className="flex items-center gap-4 text-[11.5px] font-bold">
                <span className="chip bg-mint-soft text-forest">
                  <TrendingUp size={12} /> {fmt(eco.weekly.reduce((a, b) => a + b.co2, 0), 1)} kg this week
                </span>
                <span className="text-muted">avg {fmt(eco.weekly.reduce((a, b) => a + b.co2, 0) / 7, 1)} kg/day</span>
              </div>
            </div>

            <div className="mt-6 h-[268px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eco.weekly} margin={{ top: 8, right: 4, left: -22, bottom: 0 }} barSize={30}>
                  <defs>
                    <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1c8363" />
                      <stop offset="100%" stopColor="#2b9fd6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--c-line)" vertical={false} strokeDasharray="3 6" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--c-muted)", fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--c-muted)" }} axisLine={false} tickLine={false} width={46} unit=" kg" />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(23,105,79,.07)" }} />
                  <RBar dataKey="co2" radius={[9, 9, 4, 4]} animationDuration={900}>
                    {eco.weekly.map((d, i) => (
                      <Cell key={d.key} fill={d.active ? "url(#barG)" : eco.theme === "dark" ? "#21463a" : "#ded8c4"} opacity={i === 6 ? 1 : 0.9} />
                    ))}
                  </RBar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 border-t pt-5" style={{ borderColor: "var(--c-line)" }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">14-day activity</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {days14.map((d) => {
                  const v = eco.history[d]?.co2 || 0;
                  const intensity = v / maxCo2;
                  return (
                    <span
                      key={d}
                      title={`${new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })} · ${v} kg CO₂e`}
                      className="h-7 flex-1 rounded-lg transition-transform duration-200 hover:scale-110"
                      style={{
                        background: v
                          ? `color-mix(in srgb, var(--c-forest) ${Math.round(22 + intensity * 70)}%, var(--c-surface))`
                          : "var(--c-surface-2)",
                        boxShadow: "inset 0 0 0 1px var(--c-line)",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* category mix */}
          <Reveal delay={80} className="card card-pad">
            <h2 className="font-display text-[20px] font-semibold leading-tight">Your action mix</h2>
            <p className="mt-1 text-[12.5px] text-muted">Where your {eco.actionsCompleted} actions landed</p>
            <div className="relative mx-auto mt-4 h-[190px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={mix} margin={{ top: 0, right: 14, left: 0, bottom: 0 }} barSize={13}>
                  <XAxis type="number" hide allowDecimals={false} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11.5, fill: "var(--c-muted)", fontWeight: 700 }} axisLine={false} tickLine={false} width={82} />
                  <RBar dataKey="value" radius={[0, 7, 7, 0]} animationDuration={800}>
                    {mix.map((m) => (
                      <Cell key={m.name} fill={m.tint} fillOpacity={0.4 + (m.value / totalActions) * 0.6} />
                    ))}
                  </RBar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-2 space-y-2.5">
              {mix.map((m) => (
                <li key={m.name} className="flex items-center justify-between text-[12.5px]">
                  <span className="flex items-center gap-2 font-semibold text-ink-soft">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: m.tint }} /> {m.name}
                  </span>
                  <span className="font-mono text-muted">{m.value} · {((m.value / totalActions) * 100).toFixed(0)}%</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* climate impact */}
        <Reveal className="card overflow-hidden">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b p-6 sm:p-7" style={{ borderColor: "var(--c-line)" }}>
            <div>
              <Eyebrow icon={Target}>Your climate impact</Eyebrow>
              <h2 className="font-display mt-3 text-[clamp(1.4rem,3vw,2rem)] font-semibold leading-tight">
                Everything you've shifted, in four numbers
              </h2>
            </div>
            <p className="max-w-xs text-[12.5px] leading-relaxed text-muted">
              Estimates are cumulative and modelled from your logged actions — they update the moment you complete one.
            </p>
          </div>
          <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-7 lg:grid-cols-4">
            {impact.map((m, i) => (
              <div key={m.label} className="group" style={{ animation: `rise .6s cubic-bezier(.2,.8,.2,1) ${i * 80}ms both` }}>
                <span className="grid h-10 w-10 place-items-center rounded-2xl transition-transform duration-300 group-hover:scale-110" style={{ background: `color-mix(in srgb, ${m.tone} 16%, transparent)`, color: m.tone }}>
                  <m.Icon size={18} />
                </span>
                <p className="font-display mt-3 text-[27px] font-semibold leading-none">{m.value}</p>
                <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{m.label}</p>
                <div className="mt-3">
                  <Bar pct={m.pct} tone={i % 2 ? "sky" : "eco"} height={6} delay={i * 100} />
                  <p className="mt-1.5 text-[11.5px] text-muted">{m.note}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <DailyChallenge compact />
        </Reveal>

        {/* badges + next actions */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1.35fr]">
          <Reveal className="card card-pad">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[19px] font-semibold">Badges</h2>
              <Link to="/profile" className="text-[12.5px] font-bold text-sky hover:underline">
                All {eco.badgeProgress.length}
              </Link>
            </div>
            <p className="mt-1 text-[12.5px] text-muted">
              {eco.completedBadges.length} unlocked · keep going for the rest
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {eco.badgeProgress.slice(0, 6).map((b) => (
                <BadgeCard key={b.id} badge={b} compactView />
              ))}
            </div>
          </Reveal>

          <Reveal delay={80} className="card card-pad">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-[19px] font-semibold">Pick one today</h2>
                <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted">
                  <Zap size={13} className="text-amber" /> not logged yet today
                </p>
              </div>
              <Link to="/actions" className="btn btn-ghost py-2! text-[12.5px]!">
                Browse all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {quick.map((a, i) => (
                <ActionCard key={a.id} action={a} index={i} />
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal className="flex flex-wrap items-center justify-between gap-4 card p-6">
          <p className="flex items-center gap-3 text-[14px] font-semibold">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint-soft text-forest">
              <Award size={20} />
            </span>
            <span>
              Your footprint result {eco.footprint ? `is ${eco.footprint.total.toFixed(1)} t CO₂e/yr` : "is missing"}
              <span className="block text-[12.5px] font-normal text-muted">
                {eco.footprint ? "Re-run it after two weeks of actions to see the curve move." : "Run the calculator once and the dashboard can point you at the right category."}
              </span>
            </span>
          </p>
          <Link to="/calculator" className="btn btn-primary">
            <Gauge size={16} /> {eco.footprint ? "Recalculate" : "Run calculator"}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
