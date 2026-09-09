import { useInView } from "../lib/hooks";

export function Reveal({ children, className = "", delay = 0, as: Tag = "div", ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${inView ? "in" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({ children, icon: Icon, tone = "forest" }) {
  const tones = {
    forest: "bg-mint-soft text-forest",
    sky: "bg-sky-soft text-sky",
    dark: "bg-white/12 text-mint",
  };
  return (
    <span className={`chip uppercase ${tones[tone]}`}>
      {Icon ? <Icon size={13} strokeWidth={2.6} /> : null}
      {children}
    </span>
  );
}

export function SectionHead({ eyebrow, title, lead, align = "left", tone = "forest", right }) {
  return (
    <div
      className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${
        align === "center" ? "text-center md:text-left" : ""
      }`}
    >
      <div className={align === "center" ? "mx-auto max-w-2xl" : "max-w-2xl"}>
        {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
        <h2 className="mt-3 text-[clamp(1.85rem,4.4vw,3rem)] font-semibold leading-[1.05] text-balance">{title}</h2>
        {lead ? <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{lead}</p> : null}
      </div>
      {right}
    </div>
  );
}

export function Bar({ pct = 0, tone = "eco", height = 8, delay = 0 }) {
  const tones = {
    eco: "linear-gradient(90deg,#0f4c3a,#17694f 55%,#2b9fd6)",
    sky: "linear-gradient(90deg,#1d84b8,#46b9e8)",
    mint: "linear-gradient(90deg,#17694f,#78c79a)",
    amber: "linear-gradient(90deg,#b8761f,#e0a63f)",
  };
  return (
    <div
      className="w-full overflow-hidden rounded-full bg-surface-2"
      style={{ height, boxShadow: "inset 0 0 0 1px var(--c-line)" }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.max(0, Math.min(100, pct))}%`,
          background: tones[tone] || tones.eco,
          transition: `width 1s cubic-bezier(.2,.8,.2,1) ${delay}ms`,
        }}
      />
    </div>
  );
}

export function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">
      <span className="h-px flex-1 bg-line" />
      {label}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export function Meter({ label, value, unit, pct, tone = "eco", index = 0 }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-semibold text-ink-soft">{label}</span>
        <span className="font-mono text-[13px] font-semibold text-ink">
          {value}
          <span className="ml-0.5 text-[11px] text-muted">{unit}</span>
        </span>
      </div>
      <Bar pct={pct} tone={tone} delay={index * 120} />
    </div>
  );
}

export function Leaf({ className = "", style }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden="true" fill="currentColor">
      <path d="M12 2C7 5 3.5 9 3.5 14a8.5 8.5 0 0 0 17 0C20.5 8 16 4.5 12 2Zm.4 17.2c-3.6-.6-6-3.3-6.3-7 2.6.5 4.9 2.2 6.3 4.6.4-2.9 2.2-5.4 4.9-6.6-.2 4.6-2.1 8.2-4.9 9Z" />
    </svg>
  );
}
