import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Crown, Earth as Globe2, Flame, Medal, TrendingUp, UserCheck } from "lucide-react";
import { Eyebrow, Reveal } from "../components/ui";
import { LEADERBOARD } from "../data/community";
import { useEco } from "../lib/store";
import { fmt } from "../lib/hooks";

const TABS = [
  { id: "global", label: "Global", icon: Globe2, note: "All 75,402 members" },
  { id: "country", label: "India", icon: Crown, note: "18,904 members" },
  { id: "friends", label: "Friends", icon: UserCheck, note: "6 in your circle" },
];

const MEDALS = ["🥇", "🥈", "🥉"];

function Avatar({ name, size = 40, tone = 0 }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-2xl font-display font-bold text-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `linear-gradient(140deg, hsl(${150 + tone * 26} 46% 24%), hsl(${188 + tone * 18} 52% 42%))`,
      }}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export default function Leaderboard() {
  const eco = useEco();
  const [tab, setTab] = useState("global");

  const you = {
    id: "you",
    name: eco.user?.name || "You (demo profile)",
    handle: eco.user?.email?.split("@")[0] || "you",
    country: "India",
    city: eco.user?.city || "Your city",
    points: eco.ecoPoints,
    co2: eco.co2Saved,
    streak: eco.streak,
    you: true,
  };

  const rows = useMemo(() => {
    let base = [...LEADERBOARD];
    if (tab === "country") base = base.filter((u) => u.country === "India").concat(LEADERBOARD.filter((u) => u.country !== "India").slice(0, 3));
    if (tab === "friends") base = base.filter((u) => u.circle === "friends");
    return [...base, you].sort((a, b) => b.points - a.points);
  }, [tab, eco.ecoPoints, eco.co2Saved, eco.streak, eco.user]);

  const myRank = rows.findIndex((r) => r.you) + 1;
  const podium = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <>
      <section className="relative overflow-hidden border-b grad-paper py-12">
        <div className="pointer-events-none absolute inset-0 topo opacity-60" />
        <div className="relative mx-auto max-w-[1240px] px-5 sm:px-6">
          <Eyebrow icon={Crown}>Leaderboard · updated hourly</Eyebrow>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-display max-w-2xl text-[clamp(2rem,5.2vw,3.4rem)] font-semibold leading-[1.03] text-balance">
              Points are personal. Rankings are friendly.
            </h1>
            <Link
              to="/profile"
              className="card flex items-center gap-3 px-4 py-3 transition-transform duration-300 hover:-translate-y-1"
            >
              <span className="text-[26px]">🌿</span>
              <span>
                <span className="block text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted">Your position</span>
                <span className="font-display block text-[19px] font-semibold leading-none">
                  #{myRank} <span className="text-[12px] font-bold text-forest">· {fmt(you.points)} pts</span>
                </span>
              </span>
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-1.5">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-[13px] font-bold transition-all duration-200 hover:-translate-y-0.5 ${
                    active ? "border-forest bg-mint-soft text-forest" : "text-ink-soft"
                  }`}
                  style={{ borderColor: active ? "var(--c-forest)" : "var(--c-line)", background: active ? undefined : "var(--c-surface)" }}
                >
                  <t.icon size={15} />
                  {t.label}
                  <span className="font-mono text-[10.5px] font-semibold text-muted">{t.note}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-10 sm:px-6">
        {/* podium */}
        <div className="grid gap-4 sm:grid-cols-3">
          {podium.map((u, i) => (
            <Reveal
              key={u.id}
              delay={i * 80}
              className={`card relative overflow-hidden p-6 ${u.you ? "border-forest!" : ""} ${i === 0 ? "sm:-mt-5" : ""}`}
            >
              <span
                className="pointer-events-none absolute -right-10 -top-14 h-32 w-32 rounded-full blur-2xl"
                style={{ background: ["#d9a12b", "#7f96a3", "#b07b45"][i], opacity: 0.24 }}
              />
              <div className="relative flex items-center justify-between">
                <Avatar name={u.name} size={i === 0 ? 54 : 44} tone={i + 1} />
                <span className="text-[30px]">{MEDALS[i]}</span>
              </div>
              <p className="font-display relative mt-4 text-[19px] font-semibold leading-tight">
                {u.name} {u.you && <span className="chip ml-1 bg-mint-soft align-middle text-forest">you</span>}
              </p>
              <p className="relative text-[12px] text-muted">
                @{u.handle} · {u.city}
              </p>
              <div className="relative mt-4 flex items-end justify-between">
                <p>
                  <span className="font-display block text-[26px] font-semibold leading-none text-forest">{fmt(u.points)}</span>
                  <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted">eco points</span>
                </p>
                <p className="text-right">
                  <span className="font-mono block text-[14px] font-bold">{u.co2.toFixed(1)}</span>
                  <span className="text-[10px] uppercase tracking-wide text-muted">kg CO₂e</span>
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.7fr_1fr] lg:items-start">
          {/* table */}
          <Reveal className="card overflow-hidden">
            <div className="grid grid-cols-[54px_1fr_92px_86px] items-center gap-3 border-b px-5 py-3 text-[10.5px] font-bold uppercase tracking-[0.14em] text-muted sm:grid-cols-[58px_1fr_110px_96px_84px]" style={{ borderColor: "var(--c-line)", background: "var(--c-surface-2)" }}>
              <span>Rank</span>
              <span>Member</span>
              <span className="text-right">Eco points</span>
              <span className="text-right">CO₂ saved</span>
              <span className="hidden text-right sm:block">Streak</span>
            </div>
            <ul>
              {rest.map((u, i) => (
                <li
                  key={u.id}
                  className={`grid grid-cols-[54px_1fr_92px_86px] items-center gap-3 border-b px-5 py-3 transition-colors last:border-0 hover:bg-surface-2 sm:grid-cols-[58px_1fr_110px_96px_84px] ${
                    u.you ? "border-forest! bg-mint-soft/60" : ""
                  }`}
                  style={{ borderColor: "var(--c-line)" }}
                >
                  <span className="font-mono text-[14px] font-bold text-muted">{i + 4}</span>
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar name={u.name} size={36} tone={(i + 2) % 7} />
                    <span className="min-w-0">
                      <span className="block truncate text-[13.5px] font-bold">
                        {u.name} {u.you && <span className="chip bg-forest text-white px-2! py-0.5! text-[10px]">you</span>}
                      </span>
                      <span className="block truncate text-[11.5px] text-muted">
                        {u.city}, {u.country}
                      </span>
                    </span>
                  </span>
                  <span className="text-right font-mono text-[13.5px] font-bold">{fmt(u.points)}</span>
                  <span className="text-right font-mono text-[13px] text-forest">{u.co2.toFixed(1)} kg</span>
                  <span className="hidden text-right text-[12px] font-bold text-amber sm:block">
                    <span className="inline-flex items-center gap-1">
                      <Flame size={12} /> {u.streak}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4" style={{ background: "var(--c-surface-2)" }}>
              <p className="text-[12.5px] text-muted">
                {tab === "friends" ? "Friends ranking uses your mutual circle only." : "Ranking weights Eco Points; CO₂ saved breaks ties."}
              </p>
              <span className="chip bg-sky-soft text-sky">
                <TrendingUp size={12} /> You moved up 5 places this week
              </span>
            </div>
          </Reveal>

          <div className="space-y-6">
            <Reveal className="card card-pad">
              <h3 className="font-display text-[17px] font-semibold">Movers of the week</h3>
              <ul className="mt-4 space-y-3">
                {[
                  { n: "Sofia Rossi", d: "+38 places", p: 8740 },
                  { n: "Tomas Eriksen", d: "+21 places", p: 5870 },
                  { n: "Hana Yusuf", d: "+14 places", p: 7020 },
                  { n: "You", d: "+5 places", p: eco.ecoPoints },
                ].map((m, i) => (
                  <li key={m.n} className={`flex items-center gap-3 rounded-2xl p-2 ${m.n === "You" ? "bg-mint-soft" : ""}`}>
                    <Avatar name={m.n} size={32} tone={i + 3} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-bold">{m.n}</span>
                      <span className="block text-[11px] text-muted">{fmt(m.p)} pts</span>
                    </span>
                    <span className="chip bg-sky-soft text-sky">{m.d}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={80} className="card card-pad">
              <h3 className="font-display text-[17px] font-semibold">Level ladder</h3>
              <ul className="mt-4 space-y-3">
                {[
                  { e: "🌱", n: "Seedling", r: "0 – 499 pts" },
                  { e: "🌿", n: "Sprout", r: "500 – 1,499 pts" },
                  { e: "🌳", n: "Green Guardian", r: "1,500 – 3,999 pts" },
                  { e: "🌍", n: "Climate Champion", r: "4,000 pts +" },
                ].map((l, i) => {
                  const reached = eco.ecoPoints >= [0, 500, 1500, 4000][i];
                  return (
                    <li key={l.n} className={`flex items-center gap-3 ${reached ? "" : "opacity-55"}`}>
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-surface-2 text-[17px]">{l.e}</span>
                      <span className="flex-1">
                        <span className="block text-[13px] font-bold">{l.n}</span>
                        <span className="block font-mono text-[11px] text-muted">{l.r}</span>
                      </span>
                      {eco.level.name === l.n && <Medal size={15} className="text-amber" />}
                    </li>
                  );
                })}
              </ul>
              <Link to="/profile" className="btn btn-ghost mt-5 w-full">
                Open my profile
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
