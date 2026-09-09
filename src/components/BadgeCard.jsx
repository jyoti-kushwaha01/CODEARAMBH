import { Lock } from "lucide-react";
import { Bar } from "./ui";

const TIER = {
  Bronze: "#b07b45",
  Silver: "#7f96a3",
  Gold: "#c08a1e",
};

export default function BadgeCard({ badge, compactView = false }) {
  const unlocked = badge.unlocked;
  const tier = TIER[badge.tier] || TIER.Silver;

  return (
    <div
      className={`card lift relative flex flex-col items-center overflow-hidden text-center ${
        compactView ? "gap-1 p-3.5" : "gap-1.5 p-5"
      } ${unlocked ? "" : "opacity-[.92]"}`}
      style={unlocked ? { borderColor: `color-mix(in srgb, ${tier} 45%, var(--c-line))` } : undefined}
    >
      {unlocked && (
        <span
          className="pointer-events-none absolute inset-x-0 -top-16 h-32 blur-2xl"
          style={{ background: `radial-gradient(circle, ${tier}55, transparent 68%)`, opacity: 0.55 }}
        />
      )}
      <span
        className={`relative grid place-items-center rounded-full transition-transform duration-500 group-hover:scale-110 ${
          compactView ? "h-12 w-12 text-[22px]" : "h-16 w-16 text-[30px]"
        }`}
        style={{
          background: unlocked ? `radial-gradient(circle at 35% 28%, color-mix(in srgb, ${tier} 40%, white), var(--c-mint-soft))` : "var(--c-surface-2)",
          boxShadow: unlocked ? `inset 0 0 0 2px color-mix(in srgb, ${tier} 55%, transparent)` : "inset 0 0 0 1px var(--c-line)",
          filter: unlocked ? "none" : "grayscale(1)",
        }}
        aria-hidden="true"
      >
        <span className={unlocked ? "" : "opacity-45"}>{badge.emoji}</span>
        {!unlocked && (
          <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-surface shadow-sm">
            <Lock size={11} className="text-muted" />
          </span>
        )}
      </span>

      <h4 className={`font-display pt-1 text-[14.5px] font-semibold leading-tight ${unlocked ? "text-ink" : "text-muted"}`}>
        {badge.name}
      </h4>
      {!compactView && <p className="text-[12px] leading-snug text-muted">{badge.blurb}</p>}

      <div className="mt-2 w-full">
        <Bar pct={badge.pct} tone={unlocked ? "mint" : "eco"} height={6} />
        <p className="mt-1.5 font-mono text-[10.5px] uppercase tracking-wide text-muted">
          {unlocked ? "Unlocked" : `${Math.floor(badge.value)} / ${badge.goal} · ${badge.tier}`}
        </p>
      </div>
    </div>
  );
}
