import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Calculator,
  ChartLine as LineChart,
  CircleCheck as CheckCircle2,
  Gauge,
  Leaf,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import HeroArt from "../components/HeroArt";
import ActionCard from "../components/ActionCard";
import DailyChallenge from "../components/DailyChallenge";
import Counter from "../components/Counter";
import { Eyebrow, Reveal, SectionHead } from "../components/ui";
import { ACTIONS } from "../data/actions";
import { COMMUNITY_STATS, LEADERBOARD } from "../data/community";
import { useEco } from "../lib/store";
import { useInterval } from "../lib/hooks";

const FEED = [
  { who: "Jonas · Freiburg", what: "cycled 6 km to work", co2: "1.5 kg" },
  { who: "Aanya · Bengaluru", what: "switched to a renewable tariff", co2: "21.0 kg" },
  { who: "Marta · São Paulo", what: "composted a week of scraps", co2: "6.8 kg" },
  { who: "Kenji · Kyoto", what: "took the rail link instead of flying", co2: "46.0 kg" },
  { who: "Amara · Lagos", what: "repaired a mixer instead of replacing it", co2: "3.2 kg" },
  { who: "Lena · Ljubljana", what: "ran five cold-wash loads", co2: "2.5 kg" },
];

const STEPS = [
  { n: "01", Icon: Gauge, title: "Measure what you actually spend", body: "Six minutes on the footprint calculator gives you a baseline across transport, energy, food and lifestyle — no smart-meter required." },
  { n: "02", Icon: CheckCircle2, title: "Pick actions you'll repeat", body: "Every action carries a verified-style CO₂e estimate, a difficulty label and Eco Points, so you can start with the easy wins that stick." },
  { n: "03", Icon: LineChart, title: "Watch the curve bend", body: "Your dashboard charts daily savings, streaks and category mix — progress you can point at when friends ask why you took the bus." },
  { n: "04", Icon: Trophy, title: "Compete with your city", body: "Challenges, badges and leaderboards turn a personal habit into a social one. Community totals update as members log." },
];

function HeroStats() {
  const rows = [
    { label: "Actions completed", to: 1.2, decimals: 1, suffix: "M+", note: "logged by members since launch", tone: "#17694f" },
    { label: "kg CO₂ saved", to: 850, decimals: 0, suffix: "K+", note: "additive, modelled estimates", tone: "#2b9fd6" },
    { label: "Climate champions", to: 75, decimals: 0, suffix: "K+", note: "people in 96 countries", tone: "#b8761f" },
  ];
  return (
    <div className="card mx-auto grid max-w-[1000px] grid-cols-1 divide-y divide-[var(--c-line)] overflow-hidden sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {rows.map((r, i) => (
        <div key={r.label} className="group relative p-6 text-center transition-colors duration-300 hover:bg-surface-2 sm:text-left">
          <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ background: r.tone }} />
          <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-muted">{r.label}</p>
          <p className="font-display mt-2 text-[clamp(2.1rem,5vw,3.1rem)] font-semibold leading-none tracking-[-.05em]">
            <Counter to={r.to} suffix={r.suffix} decimals={r.decimals} duration={1500 + i * 180} />
          </p>
          <p className="mt-2 text-[12.5px] text-muted">{r.note}</p>
        </div>
      ))}
    </div>
  );
}

function LiveFeed() {
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(true);
  useInterval(() => {
    setFade(false);
    setTimeout(() => {
      setI((x) => (x + 1) % FEED.length);
      setFade(true);
    }, 220);
  }, 3200);
  const f = FEED[i];
  return (
    <div className="flex items-center gap-3 rounded-full border py-2 pl-2 pr-4" style={{ borderColor: "var(--c-line)", background: "var(--c-surface)" }}>
      <span className="relative grid h-8 w-8 place-items-center rounded-full bg-mint-soft text-forest">
        <span className="absolute inset-0 rounded-full ring-1 ring-forest" style={{ animation: "pulseRing 2.4s ease-out infinite" }} />
        <Activity />
      </span>
      <span
        className={`flex min-w-0 items-baseline gap-1.5 text-[12.5px] transition-opacity duration-200 ${fade ? "opacity-100" : "opacity-0"}`}
      >
        <strong className="truncate font-bold text-ink">{f.who}</strong>
        <span className="truncate text-muted">{f.what}</span>
        <span className="chip shrink-0 bg-sky-soft py-0.5! text-sky">−{f.co2}</span>
      </span>
    </div>
  );
}
const Activity = () => <span className="h-2 w-2 rounded-full bg-[#3aa76c]" />;

export default function Home() {
  const eco = useEco();
  const featured = ["walk-instead-of-driving", "meat-free-day", "switch-green-tariff", "compost-food"].map(
    (id) => ACTIONS.find((a) => a.id === id)
  );
  const podium = LEADERBOARD.slice(0, 3);

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="grad-paper relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 topo opacity-70" />
        <span className="animate-leaf pointer-events-none absolute left-[6%] top-0 text-[22px] opacity-70" style={{ animationDuration: "19s" }}>🍃</span>
        <span className="animate-leaf pointer-events-none absolute left-[42%] top-0 text-[16px] opacity-60" style={{ animationDuration: "25s", animationDelay: "6s" }}>🍃</span>

        <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 pb-14 pt-10 sm:px-6 lg:grid-cols-[1.06fr_.94fr] lg:pb-20 lg:pt-16">
          <div>
            <Reveal>
              <span className="chip border border-[var(--c-line)] bg-surface/70 uppercase text-forest backdrop-blur">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3aa76c]" />
                Live · {eco.co2Saved.toFixed(1)} kg of your savings already counted
              </span>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="mt-6 font-display text-[clamp(2.8rem,7.6vw,5.3rem)] font-semibold leading-[0.92] tracking-[-.05em] text-balance">
                Small Actions.
                <br />
                <em className="font-display italic text-forest">Big Impact.</em>
              </h1>
            </Reveal>

            <Reveal delay={130}>
              <p className="mt-6 max-w-xl text-[clamp(1rem,1.5vw,1.15rem)] leading-relaxed text-ink-soft">
                Track your carbon footprint, take climate-positive actions, and see how your everyday choices can help
                create a healthier planet.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/calculator" className="btn btn-primary">
                  <Sparkles size={16} /> Start Your Climate Journey
                </Link>
                <Link to="/actions" className="btn btn-ghost">
                  Explore Actions <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="flex -space-x-2.5">
                  {["AR", "RM", "PN", "MO", "JW"].map((n, i) => (
                    <span
                      key={n}
                      className="grid h-9 w-9 place-items-center rounded-full border-2 font-mono text-[11px] font-bold text-white transition-transform duration-300 hover:-translate-y-1"
                      style={{
                        borderColor: "var(--c-canvas)",
                        background: `linear-gradient(140deg,#0f4c3a,#17694f ${40 + i * 10}%,#2b9fd6)`,
                      }}
                    >
                      {n}
                    </span>
                  ))}
                </div>
                <p className="text-[13px] leading-snug text-muted">
                  <strong className="font-bold text-ink">75,000+ people</strong> are logging actions here this month.
                  <br className="hidden sm:block" /> Pick a habit. Keep the streak.
                </p>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-7 max-w-md">
                <LiveFeed />
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} className="relative">
            <HeroArt />
          </Reveal>
        </div>

        <div className="relative mx-auto max-w-[1240px] px-5 pb-14 sm:px-6 lg:pb-20">
          <Reveal>
            <HeroStats />
          </Reveal>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-6">
        <Reveal>
          <SectionHead
            eyebrow="The loop"
            title="Measure, act, repeat — with the receipts."
            lead="EcoSphere is built around one idea: a number you can see is a habit you can keep. Here's the whole product in four moves."
            right={
              <Link to="/dashboard" className="btn btn-ghost self-start">
                See a sample dashboard <ArrowRight size={16} />
              </Link>
            }
          />
        </Reveal>

        <div className="relative mt-12 grid gap-6 lg:grid-cols-4">
          <div className="pointer-events-none absolute inset-x-8 top-[46px] hidden h-px lg:block" style={{ background: "repeating-linear-gradient(90deg,var(--c-line) 0 8px,transparent 8px 16px)" }} />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="card lift relative h-full p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint-soft text-forest">
                    <s.Icon size={20} />
                  </span>
                  <span className="font-display text-[26px] font-semibold text-line">{s.n}</span>
                </div>
                <h3 className="font-display mt-5 text-[18px] font-semibold leading-snug">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- FEATURED ACTIONS ---------------- */}
      <section className="relative overflow-hidden border-y py-20" style={{ background: "var(--c-canvas-2)" }}>
        <div className="pointer-events-none absolute inset-0 topo opacity-50" />
        <div className="relative mx-auto max-w-[1240px] px-5 sm:px-6">
          <Reveal>
            <SectionHead
              eyebrow="Start here"
              title="Four actions that pay off this week"
              lead="Each one is a real, repeatable behaviour with an honest CO₂e estimate behind it."
              right={
                <Link to="/actions" className="btn btn-ghost self-start">
                  All {ACTIONS.length} actions <ArrowRight size={16} />
                </Link>
              }
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((a, i) => (
              <ActionCard key={a.id} action={a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- DAILY CHALLENGE ---------------- */}
      <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-6">
        <Reveal>
          <DailyChallenge />
        </Reveal>
      </section>

      {/* ---------------- CALCULATOR + ECOBUDDY ---------------- */}
      <section className="mx-auto max-w-[1240px] px-5 pb-20 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Reveal className="card overflow-hidden">
            <div className="grid gap-8 p-7 sm:grid-cols-[1.1fr_1fr] sm:p-9">
              <div>
                <Eyebrow icon={Calculator}>Footprint calculator</Eyebrow>
                <h3 className="font-display mt-4 text-[clamp(1.5rem,2.8vw,2.1rem)] font-semibold leading-tight text-balance">
                  Six minutes in, you know where your tonnes come from.
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">
                  Travel, electricity, diet, shopping, recycling and waste — we weight them into a personal score and
                  tell you plainly which single lever moves most.
                </p>
                <Link to="/calculator" className="btn btn-primary mt-6">
                  Calculate my footprint <ArrowRight size={16} />
                </Link>
              </div>
              <div className="rounded-[20px] p-5" style={{ background: "var(--c-surface-2)", boxShadow: "inset 0 0 0 1px var(--c-line)" }}>
                {eco.footprint ? (
                  <div>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-muted">Your last result</p>
                    <p className="font-display mt-1 text-[38px] font-semibold leading-none">
                      {eco.footprint.total.toFixed(1)}
                      <span className="ml-1 text-[14px] font-bold text-muted">t CO₂e/yr</span>
                    </p>
                    <ul className="mt-4 space-y-2.5">
                      {eco.footprint.parts.map((p) => (
                        <li key={p.key}>
                          <div className="flex justify-between text-[11.5px] font-semibold">
                            <span className="text-ink-soft">{p.label}</span>
                            <span className="font-mono text-muted">{p.value.toFixed(2)} t</span>
                          </div>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-canvas-2">
                            <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.tint, transition: "width .9s" }} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex h-full flex-col justify-center">
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-muted">No result yet</p>
                    <p className="font-display mt-2 text-[19px] font-semibold leading-snug">
                      The average footprint in your region is roughly 4.8 tonnes a year.
                    </p>
                    <p className="mt-2 text-[13px] text-muted">Most first-time members land between 3 and 6 t — and find their biggest slice is rarely what they guessed.</p>
                  </div>
                )}
                <p className="mt-4 flex items-center gap-2 text-[12px] font-semibold text-forest">
                  <Target size={14} /> Your biggest opportunity {eco.footprint ? `: ${eco.footprint.biggest}` : "appears after one run"}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={110} className="card relative overflow-hidden grad-dark-eco p-7 text-[#dcefe2]">
            <div className="pointer-events-none absolute inset-0 topo opacity-25" />
            <div className="relative">
              <span className="chip bg-white/12 text-[#a8dcbc]">
                <Bot size={13} /> EcoBuddy 🤖🌱
              </span>
              <h3 className="font-display mt-4 text-[22px] font-semibold leading-tight text-white">
                An assistant that reads your data, not the weather.
              </h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-[#a9c9b8]">
                Tell it how you get to campus, what you eat, how your house is heated. It replies with the swap worth
                making and links you to the matching challenge.
              </p>
              <div className="mt-5 space-y-2">
                {["“I travel 8 km to college every day by car.”", "“What should I change first?”", "“How much CO₂ can I save?”"].map((q) => (
                  <p key={q} className="rounded-2xl border border-white/12 bg-white/5 px-3.5 py-2 text-[12.5px]">
                    {q}
                  </p>
                ))}
              </div>
              <button onClick={() => window.dispatchEvent(new Event("ecobuddy:open"))} className="btn mt-6 w-full bg-[#7fdcae] text-[#062018] hover:bg-[#96e9bd]">
                Ask EcoBuddy now <ArrowRight size={16} />
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- COMMUNITY BAND ---------------- */}
      <section className="relative overflow-hidden border-y py-20" style={{ background: "var(--c-surface-2)" }}>
        <div className="relative mx-auto max-w-[1240px] px-5 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <Reveal>
                <Eyebrow tone="sky" icon={Users}>Together, we make an impact</Eyebrow>
                <h2 className="font-display mt-4 text-[clamp(1.9rem,4.6vw,3.1rem)] font-semibold leading-[1.03] text-balance">
                  {COMMUNITY_STATS.countries} countries. {COMMUNITY_STATS.cities.toLocaleString()} cities. One ledger.
                </h2>
                <p className="mt-4 max-w-lg text-[14.5px] leading-relaxed text-ink-soft">
                  Every action adds to a shared total — the same total you can bend with one car-free Tuesday. Your
                  contribution is counted, never averaged away.
                </p>
              </Reveal>

              <Reveal delay={90}>
                <div className="mt-8 grid grid-cols-2 gap-5">
                  {[
                    { l: "kg CO₂ saved", v: COMMUNITY_STATS.co2Saved, s: "+", c: "text-forest" },
                    { l: "Sustainable actions", v: 2.4, s: "M", c: "text-sky", d: 1 },
                    { l: "Climate champions", v: COMMUNITY_STATS.champions, s: "+", c: "text-amber" },
                    { l: "kg waste avoided", v: COMMUNITY_STATS.wasteAvoided, s: "", c: "text-forest" },
                  ].map((x) => (
                    <div key={x.l}>
                      <p className={`font-display text-[clamp(1.7rem,4vw,2.4rem)] font-semibold leading-none ${x.c}`}>
                        <Counter to={x.v} suffix={x.s} decimals={x.d || 0} />
                      </p>
                      <p className="mt-1.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-muted">{x.l}</p>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={160}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/impact" className="btn btn-primary">
                    Open global impact <ArrowRight size={16} />
                  </Link>
                  <Link to="/leaderboard" className="btn btn-ghost">
                    <Trophy size={16} /> Leaderboard
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120}>
              <div className="card overflow-hidden">
                <div className="flex items-center justify-between border-b px-5 py-3.5" style={{ borderColor: "var(--c-line)" }}>
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted">Global podium · this month</span>
                  <TrendingUp size={15} className="text-forest" />
                </div>
                <ul>
                  {podium.map((u, i) => (
                    <li key={u.id} className="flex items-center gap-3 border-b px-5 py-4 transition-colors last:border-0 hover:bg-surface-2" style={{ borderColor: "var(--c-line)" }}>
                      <span className="text-[22px]">{["🥇", "🥈", "🥉"][i]}</span>
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-mint-soft font-display text-[14px] font-bold text-forest">
                        {u.name.slice(0, 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[14px] font-bold">{u.name}</span>
                        <span className="block text-[11.5px] text-muted">{u.city}, {u.country} · {u.streak}-day streak</span>
                      </span>
                      <span className="text-right">
                        <span className="block font-mono text-[14px] font-bold text-ink">{u.points.toLocaleString()}</span>
                        <span className="block text-[11px] text-muted">pts</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between gap-3 px-5 py-4" style={{ background: "var(--c-surface-2)" }}>
                  <span className="flex items-center gap-2 text-[13px]">
                    <Leaf size={14} className="text-forest" />
                    {eco.user ? `You, ${eco.user.name.split(" ")[0]}` : "You (demo profile)"}
                  </span>
                  <span className="font-mono text-[13px] font-bold">{eco.ecoPoints.toLocaleString()} pts</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- CLOSING CTA ---------------- */}
      <section className="mx-auto max-w-[1240px] px-5 py-20 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] p-8 text-center sm:p-14" style={{ background: "linear-gradient(120deg,#0f4c3a,#17694f 42%,#1d84b8)" }}>
            <div className="pointer-events-none absolute inset-0 topo opacity-20" />
            <span className="animate-float pointer-events-none absolute left-8 top-8 text-[26px] opacity-70">🌿</span>
            <span className="animate-float-slow pointer-events-none absolute bottom-8 right-10 text-[24px] opacity-60">♻️</span>
            <h2 className="font-display relative text-[clamp(1.9rem,4.6vw,3rem)] font-semibold leading-[1.05] text-white text-balance">
              Your next action is worth about a kilogram.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#d5f0e0]">
              Create a free profile, keep your streak alive, and turn 27 small choices into 42 kg of avoided emissions.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <Link to={eco.user ? "/dashboard" : "/signup"} className="btn bg-white text-[#0f4c3a] hover:bg-[#e6f7ec]">
                {eco.user ? "Go to my dashboard" : "Create my profile"} <ArrowRight size={16} />
              </Link>
              <Link to="/actions" className="btn border border-white/25 text-white hover:bg-white/10">
                Browse climate actions
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
