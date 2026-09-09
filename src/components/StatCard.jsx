import { useCountUp } from "../lib/hooks";

export default function StatCard({ label, value, unit, decimals = 1, icon: Icon, tone = "forest", delta, hint, big = false, index = 0 }) {
  const n = useCountUp(value, { decimals, duration: 1000 + index * 90 });
  const tones = {
    forest: { bg: "var(--c-mint-soft)", fg: "#17694f", stroke: "color-mix(in srgb, var(--c-forest) 26%, transparent)" },
    sky: { bg: "var(--c-sky-soft)", fg: "#1d84b8", stroke: "color-mix(in srgb, var(--c-sky) 30%, transparent)" },
    amber: { bg: "color-mix(in srgb, var(--c-amber) 16%, transparent)", fg: "#b8761f", stroke: "color-mix(in srgb, var(--c-amber) 32%, transparent)" },
    ink: { bg: "var(--c-surface-2)", fg: "var(--c-ink)", stroke: "var(--c-line)" },
  };
  const t = tones[tone] || tones.forest;

  return (
    <div className="card lift card-pad relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full blur-2xl"
        style={{ background: t.bg, opacity: 0.75 }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <span className="text-[11.5px] font-bold uppercase tracking-[0.14em] text-muted">{label}</span>
        {Icon ? (
          <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: t.bg, color: t.fg }}>
            <Icon size={17} strokeWidth={2.2} />
          </span>
        ) : null}
      </div>
      <div className="relative mt-4 flex items-baseline gap-1.5">
        <span
          className={`font-display font-semibold leading-none tracking-[-.045em] text-ink ${big ? "text-[clamp(2.6rem,6vw,3.7rem)]" : "text-[clamp(2.1rem,4.6vw,2.85rem)]"}`}
        >
          {n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
        </span>
        {unit ? <span className="text-[14px] font-bold text-muted">{unit}</span> : null}
      </div>
      <div className="relative mt-3 flex flex-wrap items-center gap-2">
        {delta ? (
          <span className="chip" style={{ background: t.bg, color: t.fg, boxShadow: `inset 0 0 0 1px ${t.stroke}` }}>
            {delta}
          </span>
        ) : null}
        {hint ? <span className="text-[12px] text-muted">{hint}</span> : null}
      </div>
    </div>
  );
}
