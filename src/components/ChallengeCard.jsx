import { Check, Flag, Trophy, Users, Zap } from "lucide-react";
import { CATEGORIES } from "../data/actions";
import { Bar } from "./ui";
import { useEco } from "../lib/store";
import { compact } from "../lib/hooks";

export default function ChallengeCard({ challenge, index = 0 }) {
  const eco = useEco();
  const entry = eco.joined[challenge.id];
  const cat = CATEGORIES.find((c) => c.id === challenge.category);
  const pct = entry ? (entry.progress / entry.days) * 100 : 0;
  const complete = entry && entry.progress >= entry.days;
  const left = entry ? Math.max(0, entry.days - entry.progress) : challenge.days;

  return (
    <article
      className="card lift relative flex flex-col overflow-hidden"
      style={{ animation: `rise .6s cubic-bezier(.2,.8,.2,1) ${index * 70}ms both` }}
    >
      <div className="flex items-start gap-4 p-5 pb-4">
        <span
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-[26px]"
          style={{ background: `color-mix(in srgb, ${cat.tint} 16%, var(--c-surface-2))` }}
          aria-hidden="true"
        >
          {challenge.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="chip bg-surface-2 text-muted">{challenge.difficulty}</span>
            <span className="chip" style={{ background: "var(--c-sky-soft)", color: "#1d84b8" }}>
              {challenge.days} days
            </span>
            {complete && (
              <span className="chip bg-mint-soft text-forest">
                <Check size={12} strokeWidth={3} /> Completed
              </span>
            )}
          </div>
          <h3 className="font-display mt-2 text-[19px] font-semibold leading-tight">{challenge.title}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{challenge.blurb}</p>
        </div>
      </div>

      <ul className="mx-5 mb-4 space-y-1.5">
        {challenge.what.map((w) => (
          <li key={w} className="flex items-start gap-2 text-[12.5px] text-ink-soft">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: cat.tint }} />
            {w}
          </li>
        ))}
      </ul>

      <div className="mt-auto space-y-4 border-t p-5 pt-4" style={{ borderColor: "var(--c-line)" }}>
        <div>
          <div className="mb-1.5 flex items-center justify-between text-[11.5px] font-bold uppercase tracking-[0.12em] text-muted">
            <span>Progress</span>
            <span className="font-mono text-[12px] text-ink">
              {entry ? entry.progress : 0}/{challenge.days} days
            </span>
          </div>
          <Bar pct={pct} tone={complete ? "mint" : "eco"} height={9} />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] font-semibold text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Users size={14} className="text-sky" /> {compact(challenge.participants)} joined
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Flag size={14} className="text-forest" /> {left} day{left === 1 ? "" : "s"} left
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Zap size={14} className="text-amber" /> ~{challenge.co2} kg CO₂e
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 font-display text-[17px] font-semibold text-forest">
            <Trophy size={16} /> {challenge.reward} pts
          </span>
          <div className="flex gap-2">
            {entry && !complete && (
              <button onClick={() => eco.logChallengeDay(challenge)} className="btn btn-sky px-3.5! py-2! text-[12.5px]!">
                Log day {entry.progress + 1}
              </button>
            )}
            <button
              onClick={() => eco.joinChallenge(challenge)}
              className={`btn ${entry ? "btn-ghost" : "btn-primary"} px-3.5! py-2! text-[12.5px]!`}
            >
              {complete ? "Claim & exit" : entry ? "Leave" : "Join Challenge"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
