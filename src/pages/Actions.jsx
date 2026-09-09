import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowRight, ListFilter as Filter, Search, SlidersHorizontal, Sparkles, Trophy, X, Zap } from "lucide-react";
import ActionCard from "../components/ActionCard";
import { Eyebrow, Reveal } from "../components/ui";
import { ACTIONS, CATEGORIES } from "../data/actions";
import { useEco } from "../lib/store";

const SORTS = [
  { id: "impact", label: "Biggest saving" },
  { id: "points", label: "Most points" },
  { id: "easy", label: "Quickest win" },
];

export default function Actions() {
  const eco = useEco();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState("");
  const [diff, setDiff] = useState("all");
  const [sort, setSort] = useState("impact");
  const [hideDone, setHideDone] = useState(false);
  const cat = params.get("category") || "all";

  const setCat = (id) => {
    const next = new URLSearchParams(params);
    if (id === "all") next.delete("category");
    else next.set("category", id);
    setParams(next, { replace: true });
  };

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = ACTIONS.filter((a) => {
      if (cat !== "all" && a.category !== cat) return false;
      if (diff !== "all" && a.difficulty !== diff) return false;
      if (hideDone && eco.completedToday.has(a.id)) return false;
      if (!needle) return true;
      const c = CATEGORIES.find((x) => x.id === a.category);
      return (a.title + a.blurb + c.label + a.difficulty).toLowerCase().includes(needle);
    });
    const rank = { Easy: 0, Medium: 1, Focused: 2 };
    list = [...list].sort((a, b) =>
      sort === "impact" ? b.co2 - a.co2 : sort === "points" ? b.points - a.points : rank[a.difficulty] - rank[b.difficulty] || b.co2 - a.co2
    );
    return list;
  }, [q, cat, diff, sort, hideDone, eco.completedToday]);

  const potential = filtered.reduce((s, a) => s + a.co2, 0);
  const points = filtered.reduce((s, a) => s + a.points, 0);
  const countsByCat = useMemo(() => {
    const o = { all: ACTIONS.length };
    CATEGORIES.forEach((c) => (o[c.id] = ACTIONS.filter((a) => a.category === c.id).length));
    return o;
  }, []);

  return (
    <>
      <section className="relative overflow-hidden border-b grad-paper py-12 sm:py-14">
        <div className="pointer-events-none absolute inset-0 topo opacity-60" />
        <span className="animate-leaf pointer-events-none absolute left-[22%] top-0 text-[18px] opacity-60">🍃</span>
        <div className="relative mx-auto max-w-[1240px] px-5 sm:px-6">
          <Eyebrow icon={Sparkles}>Climate actions library</Eyebrow>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-display max-w-2xl text-[clamp(2rem,5vw,3.4rem)] font-semibold leading-[1.03] text-balance">
              {ACTIONS.length} things you can do before dinner.
            </h1>
            <div className="flex gap-6">
              <p>
                <span className="font-display block text-[26px] font-semibold leading-none text-forest">{potential.toFixed(1)}</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">kg CO₂e in view</span>
              </p>
              <p>
                <span className="font-display block text-[26px] font-semibold leading-none text-sky">{points.toLocaleString()}</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">points available</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* filter bar */}
      <div className="sticky top-[68px] z-30 border-b backdrop-blur-xl" style={{ background: "color-mix(in srgb, var(--c-canvas) 88%, transparent)", borderColor: "var(--c-line)" }}>
        <div className="mx-auto max-w-[1240px] px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex min-w-[210px] flex-1 items-center gap-2 rounded-full border px-3.5 py-2.5 transition-colors focus-within:border-forest" style={{ borderColor: "var(--c-line)", background: "var(--c-surface)" }}>
              <Search size={15} className="shrink-0 text-muted" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search actions — bike, cold wash, compost…"
                className="min-w-0 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-muted"
              />
              {q && (
                <button onClick={() => setQ("")} className="text-muted hover:text-ink" aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </label>

            <select
              value={diff}
              onChange={(e) => setDiff(e.target.value)}
              className="ring-focus rounded-full border px-3.5 py-2.5 text-[12.5px] font-bold"
              style={{ borderColor: "var(--c-line)", background: "var(--c-surface)", color: "var(--c-ink)" }}
              aria-label="Filter by difficulty"
            >
              <option value="all">All difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Focused">Focused</option>
            </select>

            <div className="flex items-center gap-1 rounded-full border p-1" style={{ borderColor: "var(--c-line)", background: "var(--c-surface)" }}>
              <SlidersHorizontal size={13} className="mx-1.5 text-muted" />
              {SORTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSort(s.id)}
                  className={`rounded-full px-2.5 py-1.5 text-[11.5px] font-bold transition-colors ${sort === s.id ? "bg-forest text-white" : "text-muted hover:text-ink"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setHideDone((v) => !v)}
              className={`chip border transition-colors ${hideDone ? "border-forest bg-mint-soft text-forest" : "text-muted"}`}
              style={{ borderColor: "var(--c-line)", padding: "9px 12px" }}
            >
              <Filter size={12} /> Hide done today
            </button>
          </div>

          <div className="mt-2.5 flex gap-1.5 overflow-x-auto pb-1">
            {[{ id: "all", label: "All", emoji: "🌍", tint: "#17694f" }, ...CATEGORIES].map((c) => {
              const active = cat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setCat(active ? "all" : c.id)}
                  className="shrink-0 rounded-full border px-3 py-1.5 text-[12.5px] font-bold transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    borderColor: active ? c.tint : "var(--c-line)",
                    background: active ? `color-mix(in srgb, ${c.tint} 16%, var(--c-surface))` : "var(--c-surface)",
                    color: active ? c.tint : "var(--c-ink-soft)",
                  }}
                >
                  <span className="mr-1">{c.emoji}</span>
                  {c.label}
                  <span className="ml-1.5 font-mono text-[10.5px] opacity-70">{countsByCat[c.id] || 0}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1240px] px-5 py-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] font-semibold text-muted">
            Showing <strong className="text-ink">{filtered.length}</strong> action{filtered.length === 1 ? "" : "s"}
            {cat !== "all" && ` in ${CATEGORIES.find((c) => c.id === cat)?.label}`} ·{" "}
            <strong className="text-forest">{eco.completedToday.size}</strong> logged by you today
          </p>
          <span className="chip bg-sky-soft text-sky">
            <Zap size={12} /> Each action can be logged once per day
          </span>
        </div>

        {filtered.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((a, i) => (
              <ActionCard key={a.id} action={a} index={i} />
            ))}
          </div>
        ) : (
          <Reveal className="card grid place-items-center gap-3 p-14 text-center">
            <span className="text-[34px]">🔍</span>
            <h3 className="font-display text-[20px] font-semibold">Nothing matches that yet</h3>
            <p className="max-w-sm text-[13px] text-muted">
              Try another keyword, clear the difficulty filter, or browse everything — there are {ACTIONS.length} actions
              in the library.
            </p>
            <button
              onClick={() => {
                setQ("");
                setDiff("all");
                setHideDone(false);
                setCat("all");
              }}
              className="btn btn-primary mt-2"
            >
              Reset filters
            </button>
          </Reveal>
        )}

        <Reveal className="card mt-8 flex flex-wrap items-center justify-between gap-5 p-6">
          <p className="flex items-center gap-3 text-[14.5px] font-semibold">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-soft text-sky">
              <Trophy size={20} />
            </span>
            <span>
              Repeat actions build category badges
              <span className="block text-[12.5px] font-normal text-muted">
                10 waste actions → Waste Warrior · 15 transport actions → Green Commuter
              </span>
            </span>
          </p>
          <a href="#/challenges" className="btn btn-ghost">
            See the 7-day challenges <ArrowRight size={15} />
          </a>
        </Reveal>
      </section>
    </>
  );
}
