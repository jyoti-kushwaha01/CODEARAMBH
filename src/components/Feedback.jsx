import { X } from "lucide-react";
import { useEco } from "../lib/store";

const TONES = {
  success: "#17694f",
  gold: "#b8761f",
  info: "#2b9fd6",
};

export function ToastHost() {
  const eco = useEco();
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[min(92vw,352px)] flex-col gap-2.5"
    >
      {eco.toasts.map((t) => (
        <div
          key={t.id}
          className="animate-rise pointer-events-auto relative flex items-start gap-3 card overflow-hidden p-3.5"
          style={{ borderColor: TONES[t.tone] || TONES.info }}
        >
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[17px]"
            style={{ background: `color-mix(in srgb, ${TONES[t.tone] || TONES.info} 16%, transparent)` }}
          >
            {t.icon || "🌱"}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[13.5px] font-bold leading-snug text-ink">{t.title}</span>
            <span className="mt-0.5 block text-[12.5px] leading-snug text-muted">{t.body}</span>
          </span>
          <button onClick={() => eco.dismissToast(t.id)} className="mt-0.5 text-muted transition-colors hover:text-ink" aria-label="Dismiss">
            <X size={15} />
          </button>
          <span
            className="absolute bottom-0 left-0 h-[3px] w-full origin-left"
            style={{ background: TONES[t.tone] || TONES.info, animation: "barGrow 4.2s linear reverse both" }}
          />
        </div>
      ))}
    </div>
  );
}

const BURST = ["🌱", "🍃", "✨", "♻️", "🌿", "💚", "⭐", "🌍"];

export function SuccessBurst() {
  const eco = useEco();
  if (!eco.burst) return null;
  return (
    <div key={eco.burst.id} className="pointer-events-none fixed inset-0 z-[65] grid place-items-center">
      <div className="relative">
        <span
          className="block rounded-full"
          style={{
            width: 120,
            height: 120,
            background: "radial-gradient(circle, rgba(23,105,79,.34), transparent 70%)",
            animation: "pulseRing .95s ease-out forwards",
          }}
        />
        {BURST.map((emoji, i) => {
          const angle = (i / BURST.length) * Math.PI * 2;
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 text-[18px]"
              style={{
                "--bx": `${Math.cos(angle) * (80 + (i % 3) * 26)}px`,
                "--by": `${Math.sin(angle) * (80 + (i % 3) * 26)}px`,
                animation: `burst .95s cubic-bezier(.2,.8,.2,1) ${i * 22}ms forwards`,
              }}
            >
              {emoji}
            </span>
          );
        })}
      </div>
    </div>
  );
}
