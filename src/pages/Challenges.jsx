import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, Flame, Trophy, Users, Zap } from "lucide-react";
import ChallengeCard from "../components/ChallengeCard";
import DailyChallenge from "../components/DailyChallenge";
import { Eyebrow, Reveal } from "../components/ui";
import { CHALLENGES } from "../data/challenges";
import { useEco } from "../lib/store";
import { compact } from "../lib/hooks";

const TABS = [
  { id: "all", label: "All challenges" },
  { id: "active", label: "My challenges" },
  { id: "easy", label: "Start easy" },
];

export default function Challenges() {
  const eco = useEco();
  const [tab, setTab] = useState("all");

  const list = CHALLENGES.filter((c) => {
    if (tab === "active") return !!eco.joined[c.id];
    if (tab === "easy") return c.difficulty === "Easy" || c.difficulty === "Medium";
    return true;
  });

  const joinedCount = Object.keys(eco.joined).length;
  const totalPoints = CHALLENGES.reduce((s, c) => s + c.reward, 0);

  return (
    <>
      <section className="relative overflow-hidden border-b grad-dark-eco py-14 text-[#dcefe2]">
        <div className="pointer-events-none absolute inset-0 topo opacity-25" />
        <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(43,159,214,.4), transparent 66%)" }} />
        <div className="relative mx-auto max-w-[1240px] px-5 sm:px-6">
          <span className="chip bg-white/12 text-[#a8dcbc] uppercase">
            <Flame size={12} /> Challenge season · week {Math.ceil((new Date().getDate() + 6) / 7)} of the month
          </span>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-8">
            <h1 className="font-display max-w-2xl text-[clamp(2rem,5.4vw,3.5rem)] font-semibold leading-[1.02] text-white text-balance">
              Seven days is long enough to become a habit.
            </h1>
            <div className="flex gap-7">
              {[
                { l: "Points on the table", v: compact(totalPoints) },
                { l: "Members joined", v: compact(CHALLENGES.reduce((s, c) => s + c.participants, 0)) },
                { l: "You're in", v: `${joinedCount}` },
              ].map((x) => (
                <p key={x.l}>
                  <span className="font-display block text-[27px] font-semibold leading-none text-white">{x.v}</span>
                  <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#8fb6a1]">{x.l}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-10 sm:px-6">
        <Reveal>
          <DailyChallenge compact />
        </Reveal>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-1 rounded-full border p-1" style={{ borderColor: "var(--c-line)", background: "var(--c-surface)" }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full px-4 py-2 text-[12.5px] font-bold transition-all duration-200 ${tab === t.id ? "bg-forest text-white shadow-[0_10px_20px_-12px_rgba(9,51,37,.9)]" : "text-muted hover:text-ink"}`}
              >
                {t.label}
                {t.id === "active" && joinedCount > 0 && <span className="ml-1.5 font-mono text-[11px] opacity-80">{joinedCount}</span>}
              </button>
            ))}
          </div>
          <Link to="/leaderboard" className="btn btn-ghost py-2! text-[12.5px]!">
            <Trophy size={14} /> Where you rank <span className="text-muted">· #198</span>
          </Link>
        </div>

        {list.length ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {list.map((c, i) => (
              <ChallengeCard key={c.id} challenge={c} index={i} />
            ))}
          </div>
        ) : (
          <Reveal className="card mt-6 grid place-items-center gap-3 p-14 text-center">
            <CalendarClock size={30} className="text-forest" />
            <h3 className="font-display text-[20px] font-semibold">You haven't joined a challenge yet</h3>
            <p className="max-w-sm text-[13px] text-muted">Pick one from the full list — 7 days, one habit, a real reward at the end.</p>
            <button onClick={() => setTab("all")} className="btn btn-primary mt-2">
              Show all challenges
            </button>
          </Reveal>
        )}

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {[
            { Icon: Flame, t: "Streak rules", b: "Log at least one action or challenge day each calendar day. Miss one day and the streak resets to zero — the badge tier stays, though.", tone: "#d9a12b" },
            { Icon: Users, t: "Group accountability", b: "Challenges show live participant counts. Invite two friends and your weekly nudge gets sent to all three of you.", tone: "#2b9fd6" },
            { Icon: Zap, t: "How rewards land", b: "40 points per logged day, the full reward on completion, plus the modelled CO₂e for the whole challenge added to your savings.", tone: "#17694f" },
          ].map((x, i) => (
            <Reveal key={x.t} delay={i * 80} className="card card-pad">
              <span className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: `color-mix(in srgb, ${x.tone} 16%, transparent)`, color: x.tone }}>
                <x.Icon size={18} />
              </span>
              <h4 className="font-display mt-4 text-[16px] font-semibold">{x.t}</h4>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">{x.b}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="card mt-6 flex flex-wrap items-center justify-between gap-4 p-6">
          <Eyebrow>Need a smaller start?</Eyebrow>
          <p className="max-w-md text-[13.5px] text-muted">
            The daily challenge is one item, one day, {eco.dailyChallenge.points} points — and it counts towards the
            7-day streak strip on your dashboard.
          </p>
          <Link to="/actions" className="btn btn-primary">
            Browse actions instead
          </Link>
        </Reveal>
      </section>
    </>
  );
}
