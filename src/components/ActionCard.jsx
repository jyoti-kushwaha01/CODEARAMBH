import { useState } from "react";
import { Check, Clock, Leaf, Sparkles } from "lucide-react";
import { CATEGORIES } from "../data/actions";
import { useEco } from "../lib/store";

export default function ActionCard({ action, index = 0 }) {
  const eco = useEco();
  const cat = CATEGORIES.find((c) => c.id === action.category);
  const done = eco.completedToday.has(action.id);
  const times = eco.actionCounts[action.id] || 0;
  const [justDone, setJustDone] = useState(false);

  const handle = () => {
    if (done) return;
    eco.completeAction(action);
    setJustDone(true);
    setTimeout(() => setJustDone(false), 900);
  };

  return (
    <article
      className="card lift group relative flex flex-col overflow-hidden"
      style={{ animation: `rise .55s cubic-bezier(.2,.8,.2,1) ${Math.min(index, 8) * 55}ms both` }}
    >
      <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg,${cat.tint},transparent)` }} />

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-[19px] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
            style={{ background: `color-mix(in srgb, ${cat.tint} 15%, var(--c-surface-2))` }}
            aria-hidden="true"
          >
            {cat.emoji}
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-[17.5px] font-semibold leading-tight text-ink">{action.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{action.blurb}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[11.5px] font-bold">
          <span className="chip bg-surface-2 text-ink-soft">{action.difficulty}</span>
          <span className="chip bg-surface-2 text-ink-soft">
            <Clock size={12} /> {action.minutes === 0 ? "No extra time" : `${action.minutes} min`}
          </span>
          {times > 1 && (
            <span className="chip bg-mint-soft text-forest">
              <Sparkles size={12} /> {times}× logged
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t pt-4" style={{ borderColor: "var(--c-line)" }}>
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted">Save approx.</p>
            <p className="font-display mt-0.5 text-[22px] font-semibold leading-none text-ink">
              {action.co2} <span className="text-[12.5px] font-bold text-muted">kg CO₂</span>
            </p>
            <p className="mt-1 text-[11.5px] font-bold text-forest">+{action.points} Eco Points</p>
          </div>
          <button
            onClick={handle}
            className={`btn ${done ? "btn-ghost text-forest!" : "btn-primary"} px-4! py-2.5! text-[13px]!`}
            aria-disabled={done}
          >
            {done ? (
              <>
                <Check size={15} strokeWidth={3} /> Done today
              </>
            ) : (
              <>
                <Leaf size={15} /> Complete Action
              </>
            )}
          </button>
        </div>
      </div>

      {justDone && (
        <span className="pointer-events-none absolute inset-0 rounded-[22px] ring-2 ring-forest animate-pop" aria-hidden="true" />
      )}
    </article>
  );
}
