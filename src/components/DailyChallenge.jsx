import { Check, Flame, SkipForward, Sparkles, Zap } from "lucide-react";
import { useEco, dayKey } from "../lib/store";

export default function DailyChallenge({ compact = false }) {
  const eco = useEco();
  const c = eco.dailyChallenge;
  const status = eco.daily.date === eco.today ? eco.daily.status : "pending";
  const days = eco.weekly;

  return (
    <section className="relative overflow-hidden rounded-[26px] grad-dark-eco text-[#e6f5ea] shadow-[0_30px_60px_-34px_rgba(7,40,29,.85)]">
      <div className="pointer-events-none absolute inset-0 topo opacity-30" />
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(43,159,214,.42), transparent 66%)" }}
      />
      <span className="animate-leaf pointer-events-none absolute left-[12%] top-0 text-[18px]" style={{ animationDuration: "16s" }}>
        🍃
      </span>
      <span className="animate-leaf pointer-events-none absolute left-[58%] top-0 text-[14px]" style={{ animationDuration: "21s", animationDelay: "5s" }}>
        🍃
      </span>

      <div className={`relative grid gap-8 p-6 sm:p-8 ${compact ? "" : "lg:grid-cols-[1.35fr_1fr] lg:items-center"}`}>
        <div>
          <span className="chip bg-white/12 text-[#a8dcbc] uppercase">
            <Sparkles size={12} /> Today's Challenge 🌎
          </span>
          <h3 className="font-display mt-4 text-[clamp(1.5rem,3.6vw,2.15rem)] font-semibold leading-[1.1] text-white">
            {status === "done" ? "Challenge cleared — nicely done." : c.title}
          </h3>
          <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-[#a9c9b8]">{c.detail}</p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span className="rounded-2xl border border-white/12 bg-white/5 px-4 py-2.5">
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#8fb6a1]">Potential impact</span>
              <span className="font-display text-[19px] font-semibold text-[#a8dcbc]">~{c.co2} kg CO₂</span>
            </span>
            <span className="rounded-2xl border border-white/12 bg-white/5 px-4 py-2.5">
              <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#8fb6a1]">Reward</span>
              <span className="font-display text-[19px] font-semibold text-[#7cc7ef]">+{c.points} Eco Points</span>
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {status === "done" ? (
              <span className="btn bg-[#1c5d45] text-[#d7f5e4]">
                <Check size={16} strokeWidth={3} /> Logged today · see you tomorrow
              </span>
            ) : (
              <>
                <button onClick={eco.completeDailyChallenge} className="btn bg-[#7fdcae]! text-[#062018]! hover:bg-[#96e9bd]!">
                  <Check size={16} strokeWidth={3} /> Complete Challenge
                </button>
                <button
                  onClick={eco.skipDailyChallenge}
                  className="btn border border-white/18 bg-white/5 text-[#dcefe2] hover:bg-white/12"
                >
                  <SkipForward size={15} /> Skip
                </button>
              </>
            )}
            {status === "skipped" && <span className="self-center text-[12.5px] font-semibold text-[#9fc2ad]">Skipped — your streak is safe.</span>}
          </div>
        </div>

        {/* 7-day streak strip */}
        <div className="rounded-[22px] border border-white/12 bg-white/[.06] p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#8fb6a1]">7-day streak</span>
            <span className="inline-flex items-center gap-1.5 font-display text-[20px] font-semibold text-white">
              <Flame size={18} className="text-[#f0b25c]" /> {eco.streak}
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between gap-1.5">
            {days.map((d) => {
              const isToday = d.key === dayKey(0);
              return (
                <div key={d.key} className="flex flex-1 flex-col items-center gap-2">
                  <span className="font-mono text-[10px] text-[#8fb6a1]">{d.co2 ? `${d.co2}` : ""}</span>
                  <span
                    className={`grid h-10 w-full place-items-center rounded-xl border text-[15px] transition-all duration-300 ${
                      d.active ? "border-[#7fdcae] bg-[#1c6b4d]" : "border-white/12 bg-white/5"
                    } ${isToday ? "ring-2 ring-[#7cc7ef]" : ""}`}
                    title={`${d.day} · ${d.co2} kg CO₂e`}
                  >
                    {d.active ? "🌿" : isToday ? "🌱" : "·"}
                  </span>
                  <span className={`text-[10.5px] font-bold uppercase ${isToday ? "text-[#7cc7ef]" : "text-[#8fb6a1]"}`}>
                    {d.day.slice(0, 1)}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 flex items-center gap-2 text-[12px] leading-snug text-[#a9c9b8]">
            <Zap size={13} className="text-[#f0b25c]" />
            {days.filter((d) => d.active).length >= 7
              ? "Perfect week — every day has at least one logged action."
              : `7 of 7 days lit keeps your ${eco.streak}-day streak growing. One action today is enough.`}
          </p>
        </div>
      </div>
    </section>
  );
}
