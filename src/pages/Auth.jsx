import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles, User } from "lucide-react";
import { GithubIcon, GoogleIcon } from "../components/BrandIcons";
import { Logo } from "../components/Navbar";
import { useEco } from "../lib/store";

const QUOTES = [
  { q: "The average household can cut a tonne and a half a year without giving up anything it loves. We just make the cuts visible.", who: "EcoSphere research note" },
  { q: "Two car-free days a week beat one perfect year. Habit beats heroics.", who: "Community insight #14" },
  { q: "A number you can see is a habit you can keep.", who: "Product principle" },
];

export default function Auth({ mode }) {
  const signup = mode === "signup";
  const eco = useEco();
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [i, setI] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (signup && form.name.trim().length < 2) err.name = "Please enter at least 2 characters.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "That email doesn't look right.";
    if (form.password.length < 6) err.password = "Use at least 6 characters.";
    setErrors(err);
    if (Object.keys(err).length) return;
    eco.login(signup ? form.name.trim() : form.email.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), form.email);
    eco.toast({
      tone: "success",
      icon: signup ? "🌱" : "🌿",
      title: signup ? "Profile created" : "Signed in",
      body: signup ? "Your demo data has been attached to this profile." : "Welcome back — your streak is still alive.",
    });
    nav("/dashboard");
  };

  const demo = () => {
    eco.login("Climate Champion", "champion@ecosphere.earth");
    eco.toast({ tone: "info", icon: "✨", title: "Exploring with demo data", body: "Nothing is uploaded anywhere." });
    nav("/dashboard");
  };

  return (
    <section className="grid min-h-[calc(100vh-68px)] lg:grid-cols-[1.05fr_1fr]">
      {/* brand side */}
      <div className="relative hidden overflow-hidden grad-dark-eco p-10 text-[#dcefe2] lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="pointer-events-none absolute inset-0 topo opacity-25" />
        <div className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full blur-3xl" style={{ background: "radial-gradient(circle, rgba(43,159,214,.32), transparent 66%)" }} />

        <div className="relative">
          <Logo tone="dark" size={40} />
        </div>

        <div className="relative max-w-lg">
          <span className="chip bg-white/12 uppercase text-[#a8dcbc]">
            <Sparkles size={12} /> join 75,000 members
          </span>
          <h2 className="font-display mt-6 text-[clamp(2rem,3.6vw,2.9rem)] font-semibold leading-[1.05] text-white text-balance">
            Small actions, measured, become a different kind of normal.
          </h2>
          <blockquote key={i} className="animate-rise mt-8 border-l-2 border-[#7fdcae] pl-5">
            <p className="text-[15px] italic leading-relaxed text-[#c3ddcb]">“{QUOTES[i].q}”</p>
            <footer className="mt-3 text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#8fb6a1]">{QUOTES[i].who}</footer>
          </blockquote>
          <div className="mt-5 flex gap-1.5">
            {QUOTES.map((_, k) => (
              <button
                key={k}
                onClick={() => setI(k)}
                aria-label={`Quote ${k + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${k === i ? "w-8 bg-[#7fdcae]" : "w-3 bg-white/25"}`}
              />
            ))}
          </div>
        </div>

        <div className="relative flex gap-8">
          {[
            { l: "kg CO₂e saved", v: "850K+" },
            { l: "actions logged", v: "2.4M" },
            { l: "cities", v: "1,240" },
          ].map((x) => (
            <p key={x.l}>
              <span className="font-display block text-[24px] font-semibold text-white">{x.v}</span>
              <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#8fb6a1]">{x.l}</span>
            </p>
          ))}
        </div>
      </div>

      {/* form side */}
      <div className="relative flex items-center justify-center px-5 py-14 sm:px-10">
        <div className="pointer-events-none absolute inset-0 topo opacity-40" />
        <div className="relative w-full max-w-[420px]">
          <h1 className="font-display text-[clamp(1.9rem,4.4vw,2.5rem)] font-semibold leading-tight">
            {signup ? "Create your climate profile" : "Welcome back"}
          </h1>
          <p className="mt-2.5 text-[14px] leading-relaxed text-muted">
            {signup
              ? "Name, email and a password — that's the whole thing. Progress is stored on this device."
              : "Sign in to pick up your streak, points and footprint where you left them."}
          </p>

          <form onSubmit={submit} className="mt-7 space-y-3.5">
            {signup && (
              <Field label="Name" error={errors.name} icon={User}>
                <input value={form.name} onChange={set("name")} placeholder="Aanya Rao" autoComplete="name" className="input" />
              </Field>
            )}
            <Field label="Email" error={errors.email} icon={Mail}>
              <input value={form.email} onChange={set("email")} type="email" placeholder="you@example.com" autoComplete="email" className="input" />
            </Field>
            <Field label="Password" error={errors.password} icon={Lock}>
              <div className="flex items-center">
                <input
                  value={form.password}
                  onChange={set("password")}
                  type={show ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete={signup ? "new-password" : "current-password"}
                  className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-muted"
                />
                <button type="button" onClick={() => setShow((s) => !s)} className="text-muted transition-colors hover:text-ink" aria-label="Toggle password visibility">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>

            {!signup && (
              <div className="flex items-center justify-between text-[12.5px]">
                <label className="flex items-center gap-2 font-semibold text-muted">
                  <input type="checkbox" className="h-3.5 w-3.5 accent-[var(--c-forest)]" defaultChecked /> Keep me signed in
                </label>
                <button type="button" onClick={() => eco.toast({ tone: "info", icon: "📮", title: "Demo build", body: "Password reset isn't wired up in this prototype." })} className="font-bold text-sky hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <button className="btn btn-primary w-full py-3.5!">
              {signup ? "Start my climate journey" : "Sign in"} <ArrowRight size={16} />
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
            <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2">
            {[
              { Icon: GoogleIcon, label: "Google" },
              { Icon: GithubIcon, label: "GitHub" },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => eco.toast({ tone: "info", icon: "🔌", title: `${p.label} sign-in is off in the demo`, body: "Use the local form or the demo profile below." })}
                className="btn btn-ghost"
              >
                <p.Icon size={16} /> {p.label}
              </button>
            ))}
          </div>

          <button onClick={demo} className="btn mt-2.5 w-full border border-[var(--c-line)] bg-mint-soft text-forest hover:brightness-105">
            🌱 Explore with demo data
          </button>

          <p className="mt-6 text-center text-[13px] text-muted">
            {signup ? "Already have a profile?" : "New to EcoSphere?"}{" "}
            <Link to={signup ? "/login" : "/signup"} className="font-bold text-forest hover:underline">
              {signup ? "Sign in" : "Create an account"}
            </Link>
          </p>
          <p className="mt-3 text-center text-[11.5px] leading-relaxed text-muted">
            By continuing you agree this is a prototype — no data leaves your browser.{" "}
            <Link to="/about#privacy" className="font-bold text-sky hover:underline">
              Privacy
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        .input { width:100%; border-radius:14px; border:1px solid var(--c-line); background:var(--c-surface); padding:12px 14px 12px 40px; font-size:13.5px; color:var(--c-ink); outline:none; transition:border-color .2s ease, box-shadow .2s ease; }
        .input:focus { border-color: var(--c-forest); box-shadow:0 0 0 3px color-mix(in srgb, var(--c-forest) 16%, transparent); }
        .input::placeholder { color: var(--c-muted); }
      `}</style>
    </section>
  );
}

function Field({ label, error, icon: Icon, children }) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{label}</span>
      <span className="relative mt-1.5 block">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
          <Icon size={16} />
        </span>
        {children}
      </span>
      {error ? <span className="mt-1.5 block text-[11.5px] font-bold text-[#c0562f]">{error}</span> : null}
    </label>
  );
}
