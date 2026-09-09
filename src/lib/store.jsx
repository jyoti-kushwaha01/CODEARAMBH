import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { DAILY_CHALLENGES } from "../data/actions";
import { BADGES, levelFor } from "../data/challenges";
import { NEWS } from "../data/community";

const KEY = "ecosphere:state:v2";
const THEME_KEY = "ecosphere:theme";

export const dayKey = (offset = 0) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - offset);
  return d.toISOString().slice(0, 10);
};

const seedHistory = () => {
  const demo = [3.1, 2.4, 4.8, 1.9, 3.6, 2.7];
  const out = {};
  demo.forEach((v, i) => {
    out[dayKey(i + 1)] = { co2: v, count: i % 3 === 0 ? 2 : 1 };
  });
  return out;
};

const DEMO_STATE = {
  user: null,
  ecoPoints: 1850,
  co2Saved: 42.6,
  actionsCompleted: 27,
  streak: 12,
  lastActive: dayKey(1),
  counts: { transport: 11, energy: 6, waste: 7, food: 3, consumption: 0, water: 0 },
  actionCounts: {},
  actionDays: {},
  history: seedHistory(),
  daily: { date: dayKey(0), status: "pending" },
  joined: { "green-transport-week": { progress: 4, days: 7, joinedOn: dayKey(3) } },
  completedBadges: ["first-step", "streak-keeper"],
  footprint: null,
  notifications: NEWS.map((n) => ({ ...n, read: false })),
};

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEMO_STATE };
    const parsed = JSON.parse(raw);
    return {
      ...DEMO_STATE,
      ...parsed,
      counts: { ...DEMO_STATE.counts, ...(parsed.counts || {}) },
      daily: { ...DEMO_STATE.daily, ...(parsed.daily || {}) },
    };
  } catch {
    return { ...DEMO_STATE };
  }
}

const Ctx = createContext(null);
export const useEco = () => useContext(Ctx);

const metricsOf = (s) => ({
  ...s.counts,
  actionsCompleted: s.actionsCompleted,
  co2Saved: s.co2Saved,
  ecoPoints: s.ecoPoints,
  streak: s.streak,
});

export function EcoProvider({ children }) {
  const [state, setState] = useState(load);
  const [toasts, setToasts] = useState([]);
  const [burst, setBurst] = useState(null);
  const [theme, setTheme] = useState(() => (typeof localStorage !== "undefined" && localStorage.getItem(THEME_KEY)) || "light");
  const timers = useRef([]);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable — the demo keeps running in memory */
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const toast = useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((list) => [...list.slice(-2), { ...t, id }]);
    timers.current.push(setTimeout(() => setToasts((list) => list.filter((x) => x.id !== id)), 4200));
  }, []);

  const dismissToast = useCallback((id) => setToasts((list) => list.filter((x) => x.id !== id)), []);

  const fireBurst = useCallback(() => {
    const id = Math.random().toString(36).slice(2);
    setBurst({ id });
    timers.current.push(setTimeout(() => setBurst((b) => (b && b.id === id ? null : b)), 1100));
  }, []);

  const dailyChallenge = DAILY_CHALLENGES[new Date().getDate() % DAILY_CHALLENGES.length];

  /* ---------------- rewards ---------------- */
  const applyReward = useCallback(
    (reward, source) => {
      const today = dayKey(0);
      const streak = state.lastActive === today ? state.streak : state.lastActive === dayKey(1) ? state.streak + 1 : 1;
      const history = { ...state.history };
      const entry = history[today] || { co2: 0, count: 0 };
      history[today] = { co2: +(entry.co2 + reward.co2).toFixed(2), count: entry.count + 1 };

      let next = {
        ...state,
        ecoPoints: state.ecoPoints + reward.points,
        co2Saved: +(state.co2Saved + reward.co2).toFixed(1),
        actionsCompleted: state.actionsCompleted + 1,
        streak,
        lastActive: today,
        history,
        counts: { ...state.counts, [reward.category]: (state.counts[reward.category] || 0) + 1 },
        actionCounts: { ...state.actionCounts, [reward.id]: (state.actionCounts[reward.id] || 0) + 1 },
        actionDays: { ...state.actionDays, [reward.id]: today },
        daily: source === "daily" ? { ...state.daily, status: "done", date: today } : state.daily,
      };

      const m = metricsOf(next);
      const newly = BADGES.filter((b) => !next.completedBadges.includes(b.id) && (m[b.metric] || 0) >= b.goal);
      if (newly.length) {
        next = {
          ...next,
          completedBadges: [...next.completedBadges, ...newly.map((b) => b.id)],
          notifications: [
            ...newly.map((b) => ({ id: b.id + Date.now(), icon: b.emoji, title: `Badge unlocked: ${b.name}`, body: b.blurb, time: "just now", read: false, kind: "badge" })),
            ...next.notifications,
          ].slice(0, 12),
        };
      }

      setState(next);
      fireBurst();
      toast({ tone: "success", icon: "✅", title: `${reward.title} — logged`, body: `+${reward.points} Eco Points · ${reward.co2.toFixed(1)} kg CO₂e avoided` });
      if (newly.length) toast({ tone: "gold", icon: "🏅", title: `Badge unlocked — ${newly[0].name}`, body: newly.map((b) => b.blurb).join(" ") });
    },
    [fireBurst, state, toast]
  );

  const completedToday = useMemo(
    () => new Set(Object.entries(state.actionDays || {}).filter(([, d]) => d === dayKey(0)).map(([id]) => id)),
    [state.actionDays]
  );

  const completeAction = useCallback(
    (action) => {
      if (completedToday.has(action.id)) {
        toast({
          tone: "info",
          icon: "👍",
          title: "Already logged today",
          body: `${action.title} counts once a day — come back tomorrow to bank it again.`,
        });
        return;
      }
      applyReward({ ...action }, "action");
    },
    [applyReward, completedToday, toast]
  );

  const completeDailyChallenge = useCallback(() => {
    if (state.daily.date === dayKey(0) && state.daily.status === "done") return;
    applyReward({ id: `daily-${dayKey(0)}`, category: dailyChallenge.category, co2: dailyChallenge.co2, points: dailyChallenge.points, title: dailyChallenge.title }, "daily");
  }, [applyReward, dailyChallenge, state.daily]);

  const skipDailyChallenge = useCallback(() => {
    setState((s) => ({ ...s, daily: { ...s.daily, status: "skipped", date: dayKey(0) } }));
    toast({ tone: "info", icon: "💨", title: "Challenge skipped", body: "No points today — your streak stays intact." });
  }, [toast]);

  const joinChallenge = useCallback(
    (challenge) => {
      const joined = { ...state.joined };
      if (joined[challenge.id]) {
        delete joined[challenge.id];
        toast({ tone: "info", icon: "🚪", title: "Left challenge", body: `${challenge.title} removed from your active list.` });
      } else {
        joined[challenge.id] = { progress: 0, days: challenge.days, joinedOn: dayKey(0) };
        toast({ tone: "success", icon: "🎯", title: `Joined ${challenge.title}`, body: `Log a day to start earning — ${challenge.reward} points at the finish line.` });
      }
      setState((s) => ({ ...s, joined }));
    },
    [state.joined, toast]
  );

  const logChallengeDay = useCallback(
    (challenge) => {
      const entry = state.joined[challenge.id];
      if (!entry) return;
      const progress = Math.min(entry.days, entry.progress + 1);
      const finished = progress >= entry.days;
      const today = dayKey(0);
      const streak = state.lastActive === today ? state.streak : state.lastActive === dayKey(1) ? state.streak + 1 : state.streak;

      const next = {
        ...state,
        joined: { ...state.joined, [challenge.id]: { ...entry, progress } },
        ecoPoints: state.ecoPoints + (finished ? challenge.reward : 40),
        co2Saved: +(state.co2Saved + (finished ? challenge.co2 : +(challenge.co2 / entry.days).toFixed(1))).toFixed(1),
        streak,
        lastActive: today,
      };
      setState(next);
      fireBurst();
      toast({
        tone: finished ? "gold" : "success",
        icon: finished ? "🏆" : "📈",
        title: finished ? `${challenge.title} complete` : `Day ${progress} of ${entry.days} logged`,
        body: finished ? `+${challenge.reward} Eco Points · ${challenge.co2} kg CO₂e` : "+40 Eco Points for showing up",
      });
    },
    [fireBurst, state, toast]
  );

  const saveFootprint = useCallback(
    (result) => {
      setState((s) => ({ ...s, footprint: { ...result, date: dayKey(0) } }));
      toast({ tone: "success", icon: "🧮", title: "Footprint saved to your profile", body: `${result.total.toFixed(1)} t CO₂e/year · biggest lever: ${result.biggest}` });
    },
    [toast]
  );

  const login = useCallback(
    (name, email, city) => {
      setState((s) => ({ ...s, user: { name, email, city: city || s.user?.city, since: s.user?.since || dayKey(0) } }));
      toast({ tone: "success", icon: "🌿", title: `Welcome, ${name.split(" ")[0]}`, body: "Your climate dashboard is ready." });
    },
    [toast]
  );

  const logout = useCallback(() => {
    setState((s) => ({ ...s, user: null }));
    toast({ tone: "info", icon: "👋", title: "Signed out", body: "Progress is saved on this device." });
  }, [toast]);

  const resetProgress = useCallback(() => {
    setState((s) => ({ ...DEMO_STATE, user: s.user, history: seedHistory(), notifications: NEWS.map((n) => ({ ...n, read: false })) }));
    toast({ tone: "info", icon: "🔄", title: "Demo progress reset", body: "Stats restored to the starting point." });
  }, [toast]);

  const notify = useCallback((n) => {
    setState((s) => ({ ...s, notifications: [{ id: Math.random().toString(36).slice(2), time: "just now", read: false, ...n }, ...s.notifications].slice(0, 12) }));
  }, []);

  const markAllRead = useCallback(() => setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })), []);

  const level = useMemo(() => levelFor(state.ecoPoints), [state.ecoPoints]);

  const weekly = useMemo(() => {
    const rows = [];
    for (let i = 6; i >= 0; i--) {
      const k = dayKey(i);
      const e = state.history[k];
      rows.push({
        key: k,
        day: new Date(k + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" }),
        co2: e ? +e.co2.toFixed(1) : 0,
        actions: e ? e.count : 0,
        active: !!e,
      });
    }
    return rows;
  }, [state.history]);

  const metrics = useMemo(() => metricsOf(state), [state]);

  const badgeProgress = useMemo(
    () =>
      BADGES.map((b) => {
        const value = metrics[b.metric] || 0;
        return { ...b, value, unlocked: state.completedBadges.includes(b.id) || value >= b.goal, pct: Math.min(100, (value / b.goal) * 100) };
      }),
    [metrics, state.completedBadges]
  );

  const value = useMemo(
    () => ({
      ...state,
      today: dayKey(0),
      dailyChallenge,
      level,
      weekly,
      badgeProgress,
      completedToday,
      toasts,
      burst,
      theme,
      setTheme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      toast,
      dismissToast,
      completeAction,
      completeDailyChallenge,
      skipDailyChallenge,
      joinChallenge,
      logChallengeDay,
      saveFootprint,
      login,
      logout,
      resetProgress,
      notify,
      markAllRead,
      fireBurst,
    }),
    [state, dailyChallenge, level, weekly, badgeProgress, completedToday, toasts, burst, theme, toast, dismissToast, completeAction, completeDailyChallenge, skipDailyChallenge, joinChallenge, logChallengeDay, saveFootprint, login, logout, resetProgress, notify, markAllRead, fireBurst]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
