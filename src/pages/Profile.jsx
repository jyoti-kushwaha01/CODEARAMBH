import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  CalendarDays,
  CircleCheck as CheckCircle2,
  Flame,
  Gauge,
  Leaf,
  LogOut,
  Moon,
  Pencil,
  PiggyBank,
  RotateCcw,
  Sun,
  Trophy,
} from "lucide-react";
import StatCard from "../components/StatCard";
import BadgeCard from "../components/BadgeCard";
import { Bar, Eyebrow, Reveal } from "../components/ui";
import { CHALLENGES, LEVELS } from "../data/challenges";
import { ACTIONS } from "../data/actions";
import { useEco } from "../lib/store";
import { fmt } from "../lib/hooks";

export default function Profile() {
  const eco = useEco();
  const nav = useNavigate();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: eco.user?.name || "Climate Champion", city: eco.user?.city || "Bengaluru, India" });

  const unlocked = eco.badgeProgress.filter((b) => b.unlocked);
  const locked = eco.badgeProgress.filter((b) => !b.unlocked);
  const joinedList = Object.entries(eco.joined)
    .map(([id, v]) => ({ ...CHALLENGES.find((c) => c.id === id), ...v }))
    .filter((c) => c.id);
  const perCategory = CATEGORIES_SAFE();

  function CATEGORIES_SAFE() {
    return Object.entries(eco.counts)
      .map(([k, v]) => ({ k, v, label: k[0].toUpperCase() + k.slice(1) }))
      .sort((a, b) => b.v - a.v);
  }

  const save = (e) => {
    e.preventDefault();
    eco.login(draft.name.trim() || "Climate Champion", eco.user?.email || "champion@ecosphere.earth", draft.city);
    setEditing(false);
    eco.toast({ tone: "success", icon: "✏️", title: "Profile updated", body: "Your display name is saved on this device." });
  };

  return (
    <>
      <section className="relative overflow-hidden border-b grad-paper py-12">
        <div className="pointer-events-none absolute inset-0 topo opacity-60" />
        <div className="relative mx-auto max-w-[1240px] px-5 sm:px-6">
          <div className="card overflow-hidden">
            <div className="relative h-28 sm:h-32" style={{ background: "linear-gradient(115deg,#0f4c3a,#17694f 45%,#1d84b8)" }}>
              <div className="pointer-events-none absolute inset-0 topo opacity-30" />
              {["🌱", "🚲", "♻️", "⚡", "💧"].map((e, i) => (
                <span key={i} className="absolute text-[20px] opacity-70" style={{ left: `${12 + i * 19}%`, top: `${20 + (i % 3) * 24}%`, animation: `float ${7 + i}s ease-in-out infinite` }}>
                  {e}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end">
              <div className="relative -mt-16 shrink-0">
                <span className="grid h-24 w-24 place-items-center rounded-[26px] font-display text-[38px] font-bold text-white shadow-[0_18px_36px_-16px_rgba(9,48,36,.8)]" style={{ background: "linear-gradient(150deg,#17694f,#0f4c3a 55%,#2b9fd6)" }}>
                  {(eco.user?.name || "C").slice(0, 1).toUpperCase()}
                </span>
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-surface px-2.5 py-1 text-[11px] font-bold shadow-sm">
                  {eco.level.emoji} {eco.level.name}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                {editing ? (
                  <form onSubmit={save} className="flex flex-wrap items-center gap-2">
                    <input
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      className="ring-focus w-full max-w-[220px] rounded-xl border px-3 py-2 text-[18px] font-bold outline-none"
                      style={{ borderColor: "var(--c-line)", background: "var(--c-surface)" }}
                    />
                    <input
                      value={draft.city}
                      onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                      className="ring-focus w-full max-w-[200px] rounded-xl border px-3 py-2 text-[13px] outline-none"
                      style={{ borderColor: "var(--c-line)", background: "var(--c-surface)" }}
                    />
                    <button className="btn btn-primary py-2!">Save</button>
                    <button type="button" onClick={() => setEditing(false)} className="btn btn-ghost py-2!">
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-display text-[clamp(1.7rem,4vw,2.5rem)] font-semibold leading-none">{eco.user?.name || draft.name}</h1>
                    <button onClick={() => setEditing(true)} className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-ink" aria-label="Edit profile">
                      <Pencil size={14} />
                    </button>
                  </div>
                )}
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
                  <span>📍 {eco.user?.city || draft.city}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={13} /> joined {eco.user?.since || "this month"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-forest">
                    <BadgeCheck size={13} /> {unlocked.length} badges
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {!eco.user && (
                  <Link to="/login" className="btn btn-primary">
                    Log in to sync
                  </Link>
                )}
                {eco.user && (
                  <button
                    onClick={() => {
                      eco.logout();
                      nav("/");
                    }}
                    className="btn btn-ghost"
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                )}
              </div>
            </div>

            <div className="border-t px-6 py-5 sm:px-8" style={{ borderColor: "var(--c-line)" }}>
              <div className="flex flex-wrap items-center gap-4">
                <div className="min-w-[240px] flex-1">
                  <div className="mb-2 flex items-center justify-between text-[12px] font-bold">
                    <span className="text-ink-soft">
                      {eco.level.name} · {fmt(eco.ecoPoints)} pts
                    </span>
                    <span className="text-muted">{eco.level.next ? `${fmt(eco.level.toNext)} pts to ${eco.level.next.name}` : "maxed"}</span>
                  </div>
                  <Bar pct={eco.level.progress} tone="eco" height={9} />
                </div>
                <div className="flex gap-1.5">
                  {LEVELS.map((l, i) => (
                    <span key={l.id} className={`chip ${eco.ecoPoints >= l.min ? "bg-mint-soft text-forest" : "bg-surface-2 text-muted"}`}>
                      {l.emoji} {l.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] space-y-8 px-5 py-10 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Eco points", value: eco.ecoPoints, decimals: 0, icon: PiggyBank, tone: "amber", unit: "pts" },
            { label: "CO₂ saved", value: eco.co2Saved, decimals: 1, icon: Leaf, tone: "forest", unit: "kg" },
            { label: "Actions", value: eco.actionsCompleted, decimals: 0, icon: CheckCircle2, tone: "sky", unit: "done" },
            { label: "Streak", value: eco.streak, decimals: 0, icon: Flame, tone: "ink", unit: "days" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 60}>
              <StatCard {...s} />
            </Reveal>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <Reveal className="card card-pad">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[19px] font-semibold">Badge collection</h2>
              <span className="chip bg-mint-soft text-forest">
                {unlocked.length}/{eco.badgeProgress.length} unlocked
              </span>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {unlocked.concat(locked).map((b) => (
                <BadgeCard key={b.id} badge={b} />
              ))}
            </div>
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={70} className="card card-pad">
              <h2 className="font-display text-[19px] font-semibold">Category breakdown</h2>
              <ul className="mt-4 space-y-3">
                {perCategory.map((c, i) => (
                  <li key={c.k}>
                    <div className="mb-1.5 flex items-center justify-between text-[12.5px] font-bold">
                      <span className="text-ink-soft">{c.label}</span>
                      <span className="font-mono text-muted">{c.v}</span>
                    </div>
                    <Bar pct={(c.v / Math.max(1, eco.actionsCompleted)) * 100} tone={i % 2 ? "sky" : "eco"} height={6} delay={i * 60} />
                  </li>
                ))}
              </ul>
              <Link to="/actions" className="btn btn-ghost mt-5 w-full">
                Keep logging actions <Trophy size={15} className="text-amber" />
              </Link>
            </Reveal>

            <Reveal delay={120} className="card card-pad">
              <h2 className="font-display text-[19px] font-semibold">Footprint result</h2>
              {eco.footprint ? (
                <>
                  <p className="font-display mt-3 text-[34px] font-semibold leading-none">
                    {eco.footprint.total.toFixed(1)} <span className="text-[13px] font-bold text-muted">t CO₂e/yr</span>
                  </p>
                  <p className="mt-2 text-[12.5px] text-muted">
                    Calculated {eco.footprint.date} · biggest lever: <strong className="text-forest">{eco.footprint.biggest}</strong>
                  </p>
                  <Link to="/calculator" className="btn btn-primary mt-4 w-full">
                    <Gauge size={15} /> Recalculate
                  </Link>
                </>
              ) : (
                <>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted">
                    No footprint saved yet. Run the calculator once and it lives here next to your badges.
                  </p>
                  <Link to="/calculator" className="btn btn-primary mt-4 w-full">
                    <Gauge size={15} /> Start the calculator
                  </Link>
                </>
              )}
            </Reveal>
          </div>
        </div>

        <Reveal className="card overflow-hidden">
          <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--c-line)" }}>
            <h2 className="font-display text-[19px] font-semibold">Challenge history</h2>
            <Link to="/challenges" className="text-[12.5px] font-bold text-sky hover:underline">
              {ACTIONS.length > 0 ? "Browse challenges" : ""}
            </Link>
          </div>
          {joinedList.length ? (
            <ul className="divide-y" style={{ borderColor: "var(--c-line)" }}>
              {joinedList.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-surface-2 text-[20px]">{c.emoji}</span>
                  <span className="min-w-[200px] flex-1">
                    <span className="block text-[14px] font-bold">{c.title}</span>
                    <span className="block text-[11.5px] text-muted">
                      joined {c.joinedOn} · {c.progress}/{c.days} days
                    </span>
                  </span>
                  <span className="w-full max-w-[180px]">
                    <Bar pct={(c.progress / c.days) * 100} tone={c.progress >= c.days ? "mint" : "eco"} height={8} />
                  </span>
                  <span className="font-mono text-[13px] font-bold text-forest">
                    {c.progress >= c.days ? `+${c.reward} pts` : `${Math.round((c.reward * c.progress) / c.days)} pts so far`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-[13px] text-muted">You haven't joined a challenge yet.</p>
              <Link to="/challenges" className="btn btn-primary mt-4">
                Find a 7-day challenge
              </Link>
            </div>
          )}
        </Reveal>

        <Reveal className="card flex flex-wrap items-center justify-between gap-4 p-6">
          <Eyebrow icon={Sun}>Preferences</Eyebrow>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={eco.toggleTheme} className="btn btn-ghost">
              {eco.theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              {eco.theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <button onClick={eco.resetProgress} className="btn btn-ghost text-amber!">
              <RotateCcw size={15} /> Reset demo data
            </button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
