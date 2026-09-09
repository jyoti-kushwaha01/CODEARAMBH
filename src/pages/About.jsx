import { useState } from "react";
import { Link } from "react-router-dom";
import { Bot, ChevronDown, Heart, Lock, Mail, MapPin, Send, ShieldCheck, Sparkles, Target } from "lucide-react";
import { Eyebrow, Reveal, SectionHead } from "../components/ui";
import Counter from "../components/Counter";
import { useEco } from "../lib/store";

const FACTORS = [
  ["Petrol car", "192 g CO₂e / km", "#b8761f"],
  ["City bus (per passenger)", "62 g / km", "#2b9fd6"],
  ["Metro / tram", "41 g / km", "#2b9fd6"],
  ["Bike & walking", "0–5 g / km", "#17694f"],
  ["Grid electricity (avg)", "420 g / kWh", "#d9a12b"],
  ["100% renewable tariff", "≈ 0 g / kWh", "#17694f"],
  ["Meat-heavy diet", "3.6 t / yr", "#b8761f"],
  ["Mixed diet", "2.6 t / yr", "#d9a12b"],
  ["Vegetarian", "1.65 t / yr", "#4e9c5f"],
  ["Mostly plant-based", "0.95 t / yr", "#17694f"],
];

const VALUES = [
  { Icon: Target, t: "Honest numbers", b: "Every estimate shows its working. Where a figure is a modelled average, we say so — no invented precision, no guilt-driven design." },
  { Icon: Heart, t: "Access over status", b: "The core calculator, action library and streak tracking stay free. Badges measure effort, not spending power." },
  { Icon: ShieldCheck, t: "Your data stays yours", b: "This prototype writes to your own browser's storage. No ad trackers, no selling of behaviour profiles, ever." },
];

const FAQ = [
  ["Is my footprint calculation scientifically valid?", "It's a behaviour-change estimate, not a certified lifecycle assessment. We use published per-capita factors for the four big buckets — transport, home energy, food and goods — and add them linearly. Real footprints vary with household size, grid mix and supply chains, so treat the number as a direction, then measure against your actual bills once a year."],
  ["How do Eco Points work?", "Each action carries points roughly proportional to the effort-to-impact ratio: high-impact, low-effort actions score well so the system rewards habits you can keep. Points never expire and unlock levels at 500, 1,500 and 4,000."],
  ["Does EcoSphere connect to my utility or bank account?", "Not in this prototype. The calculator, challenges and logging are all manual, which keeps the model transparent and means nothing is shared with third parties."],
  ["Can schools or workplaces run their own board?", "That's the plan for the next build: private cohorts with their own leaderboard, shared challenges and aggregate reporting that never exposes individual habits."],
];

export default function About() {
  const eco = useEco();
  const [open, setOpen] = useState(0);

  return (
    <>
      <section className="relative overflow-hidden border-b grad-paper py-16">
        <div className="pointer-events-none absolute inset-0 topo opacity-60" />
        <div className="relative mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <Eyebrow icon={Sparkles}>About EcoSphere</Eyebrow>
            <h1 className="font-display mt-4 text-[clamp(2.1rem,5.6vw,3.7rem)] font-semibold leading-[1.02] text-balance">
              A tool for people who'd rather act than argue.
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
              EcoSphere began as a simple question: why do climate calculators end at a guilt number and stop there? We
              built the missing half — a place where a measurement turns into a short list of actions, and an action
              turns into a streak, a badge and a visibly lower number next month.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/calculator" className="btn btn-primary">
                Try the calculator
              </Link>
              <Link to="/actions" className="btn btn-ghost">
                Browse the action library
              </Link>
            </div>
          </div>
          <Reveal className="card p-6">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-muted">By the numbers</p>
            <ul className="mt-4 space-y-5">
              {[
                { l: "Actions in the library", v: 26, s: "" },
                { l: "kg CO₂e saved by members", v: 850000, s: "+" },
                { l: "Countries represented", v: 96, s: "" },
                { l: "Your personal saving", v: eco.co2Saved, s: " kg", d: 1 },
              ].map((x) => (
                <li key={x.l} className="flex items-end justify-between gap-4 border-b pb-4 last:border-0 last:pb-0" style={{ borderColor: "var(--c-line)" }}>
                  <span className="text-[13px] font-semibold text-muted">{x.l}</span>
                  <span className="font-display text-[26px] font-semibold leading-none">
                    <Counter to={x.v} suffix={x.s} decimals={x.d || 0} duration={1400} />
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-16 sm:px-6">
        <Reveal>
          <SectionHead eyebrow="Principles" title="What we optimise for" lead="Three rules decide every feature we ship and every one we refuse." />
        </Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={i * 80} className={`card lift card-pad ${i === 0 ? "lg:mt-6" : ""} ${i === 2 ? "lg:-mt-4" : ""}`}>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint-soft text-forest">
                <v.Icon size={19} />
              </span>
              <h3 className="font-display mt-4 text-[19px] font-semibold">{v.t}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{v.b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* method */}
      <section id="method" className="scroll-mt-24 border-y py-16" style={{ background: "var(--c-surface-2)" }}>
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <div>
            <Eyebrow icon={Target}>Method</Eyebrow>
            <h2 className="font-display mt-4 text-[clamp(1.6rem,3.6vw,2.4rem)] font-semibold leading-tight text-balance">
              The factors behind your score
            </h2>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
              The calculator multiplies what you report by the values on the right, converts to tonnes CO₂e per year,
              then ranks the four buckets so it can name your biggest opportunity. Action savings use the same factors,
              which is why a 14 km car commute and a 14 km bike trip are worth so differently.
            </p>
            <p className="mt-4 rounded-2xl bg-surface p-4 text-[12.5px] leading-relaxed text-muted shadow-[var(--shadow-soft)]">
              <strong className="text-ink">Note:</strong> these are demo figures for a prototype. In a production
              build they'd be swapped for region-specific grids, DEFRA/IEA-style factors and your utility's own data.
            </p>
          </div>
          <Reveal className="card overflow-hidden">
            <ul className="divide-y" style={{ borderColor: "var(--c-line)" }}>
              {FACTORS.map(([label, value, tint]) => (
                <li key={label} className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-surface-2">
                  <span className="flex items-center gap-2.5 text-[13.5px] font-semibold">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: tint }} /> {label}
                  </span>
                  <span className="font-mono text-[12.5px] font-bold text-muted">{value}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ecobuddy */}
      <section id="ecobuddy" className="mx-auto max-w-[1240px] scroll-mt-24 px-5 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <Reveal className="card relative overflow-hidden grad-dark-eco p-7 text-[#dcefe2]">
            <div className="pointer-events-none absolute inset-0 topo opacity-25" />
            <div className="relative space-y-3">
              {[
                { r: "user", t: "I travel 8 km to college every day by car." },
                { r: "bot", t: "Switching two trips a week to cycling or public transport trims roughly 1.6–2.5 kg CO₂e per swap. Try the 7-Day Green Transport Challenge — it's 500 points and it fixes the habit in one go." },
                { r: "user", t: "What should I change first?" },
                { r: "bot", t: "Your calculator result says it: transport is 41% of your total. Start there, then take the standby-power action — it's free, takes eight minutes and repeats weekly." },
              ].map((m, i) => (
                <p
                  key={i}
                  className={`max-w-[86%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                    m.r === "user" ? "ml-auto bg-white/12 text-[#eaf7ee]" : "bg-white/[.06] text-[#c3ddcb]"
                  }`}
                >
                  {m.t}
                </p>
              ))}
            </div>
          </Reveal>
          <div>
            <Eyebrow icon={Bot}>EcoBuddy 🤖🌱</Eyebrow>
            <h2 className="font-display mt-4 text-[clamp(1.7rem,4vw,2.6rem)] font-semibold leading-tight text-balance">
              A coach that reads your own numbers back to you.
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
              EcoBuddy is a rules-based assistant for this prototype: it matches what you tell it against the topics
              that matter (transport, food, energy, waste, water, consumption) and answers with the specific swap, the
              approximate kilograms, and the challenge that will make it stick. No account, no training data, no
              hallucinated statistics.
            </p>
            <button onClick={() => window.dispatchEvent(new Event("ecobuddy:open"))} className="btn btn-primary mt-7">
              <Sparkles size={16} /> Open EcoBuddy
            </button>
          </div>
        </div>
      </section>

      {/* privacy + contact */}
      <section className="border-t py-16" style={{ background: "var(--c-surface-2)" }}>
        <div className="mx-auto grid max-w-[1240px] gap-10 px-5 sm:px-6 lg:grid-cols-2">
          <div id="privacy" className="card scroll-mt-24 card-pad">
            <Eyebrow icon={Lock}>Privacy</Eyebrow>
            <h3 className="font-display mt-4 text-[22px] font-semibold">What EcoSphere stores</h3>
            <ul className="mt-4 space-y-2.5 text-[13.5px] text-ink-soft">
              {[
                "Everything lives in localStorage on this device: your name, points, streak, logged actions and calculator result.",
                "No cookies, no third-party analytics, no advertising identifiers in this prototype.",
                "Community totals are demo aggregates — they don't come from a server and can't see into your account.",
                "Clearing your browser storage resets the app to its seeded demo state.",
              ].map((t) => (
                <li key={t} className="flex gap-2.5">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div id="contact" className="card scroll-mt-24 card-pad">
            <Eyebrow icon={Send}>Contact</Eyebrow>
            <h3 className="font-display mt-4 text-[22px] font-semibold">Talk to the team</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                eco.toast({ tone: "success", icon: "📨", title: "Message queued", body: "Prototype demo — nothing leaves your browser." });
                e.currentTarget.reset();
              }}
              className="mt-4 space-y-3"
            >
              {[
                ["Your name", "text", "Priya Nair"],
                ["Email", "email", "priya@example.com"],
              ].map(([l, type, ph]) => (
                <label key={l} className="block">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{l}</span>
                  <input
                    required
                    type={type}
                    placeholder={ph}
                    className="ring-focus mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-[13.5px] outline-none"
                    style={{ borderColor: "var(--c-line)", background: "var(--c-surface)" }}
                  />
                </label>
              ))}
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">Message</span>
                <textarea
                  required
                  rows={4}
                  placeholder="We're building a school cohort feature — tell us what you'd need…"
                  className="ring-focus mt-1.5 w-full resize-none rounded-xl border px-3.5 py-2.5 text-[13.5px] outline-none"
                  style={{ borderColor: "var(--c-line)", background: "var(--c-surface)" }}
                />
              </label>
              <button className="btn btn-primary w-full">
                <Mail size={15} /> Send message
              </button>
            </form>
          </div>
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-14 max-w-[900px] px-5 sm:px-6">
          <SectionHead eyebrow="FAQ" title="Questions people actually ask" align="center" />
          <div className="mt-8 space-y-3">
            {FAQ.map(([q, a], i) => {
              const isOpen = open === i;
              return (
                <Reveal key={q} delay={i * 60}>
                  <div className="card overflow-hidden">
                    <button
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-center gap-3 text-[14.5px] font-bold">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint-soft font-mono text-[11px] font-bold text-forest">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {q}
                      </span>
                      <ChevronDown size={17} className={`shrink-0 text-forest transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    <div className="overflow-hidden transition-[max-height] duration-500" style={{ maxHeight: isOpen ? 260 : 0 }}>
                      <p className="px-5 pb-5 text-[13.5px] leading-relaxed text-muted">{a}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
