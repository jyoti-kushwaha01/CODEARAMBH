import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { useEco } from "../lib/store";
import { SUGGESTED_QUESTIONS, getEcoReply } from "../data/ecoBuddy";

function BotAvatar({ size = 34 }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-2xl"
      style={{ width: size, height: size, background: "linear-gradient(140deg,#0f4c3a,#17694f 50%,#2b9fd6)" }}
    >
      <Bot size={size * 0.55} className="text-[#c9f0d8]" />
    </span>
  );
}

function Bubble({ text, typing }) {
  const [shown, setShown] = useState(typing ? 0 : text.length);
  useEffect(() => {
    if (!typing) return;
    let i = 0;
    const id = setInterval(() => {
      i += Math.max(2, Math.round(text.length / 60));
      setShown(Math.min(i, text.length));
      if (i >= text.length) {
        clearInterval(id);
        setShown(text.length);
      }
    }, 16);
    return () => clearInterval(id);
  }, [text, typing]);
  return <span>{text.slice(0, typing ? shown : text.length)}</span>;
}

export default function EcoBuddy() {
  const eco = useEco();
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([
    {
      role: "bot",
      typing: false,
      text: "I'm EcoBuddy 🌱 I read your logged actions and your footprint, then suggest the next move with the biggest payoff.",
    },
  ]);
  const scroller = useRef(null);

  useEffect(() => {
    const opener = () => setOpen(true);
    window.addEventListener("ecobuddy:open", opener);
    return () => window.removeEventListener("ecobuddy:open", opener);
  }, []);

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [msgs, typing, open]);

  const send = (raw) => {
    const text = (raw || "").trim();
    if (!text || typing) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    const ctx = {
      level: eco.level.name,
      streak: eco.streak,
      co2Saved: eco.co2Saved,
      actionsCompleted: eco.actionsCompleted,
      footprint: eco.footprint,
      commute: eco.commute,
    };
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { role: "bot", text: getEcoReply(text, ctx), typing: true }]);
    }, 620);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="group fixed bottom-4 left-4 z-[68] flex items-center gap-2.5 rounded-full py-2 pl-2 pr-4 text-[#eaf7ee] shadow-[0_18px_36px_-16px_rgba(9,48,36,.9)] transition-transform duration-300 hover:-translate-y-1"
          style={{ background: "linear-gradient(135deg,#0f4c3a,#17694f 55%,#1d84b8)" }}
          aria-label="Open EcoBuddy assistant"
        >
          <span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/12">
            <Bot size={18} />
            <span className="absolute inset-0 rounded-full ring-1 ring-[#7fdcae]" style={{ animation: "pulseRing 2.6s ease-out infinite" }} />
          </span>
          <span className="hidden pr-1 text-[13px] font-bold sm:block">Ask EcoBuddy</span>
        </button>
      )}

      <div
        className={`fixed z-[69] flex flex-col overflow-hidden card transition-all duration-300 ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        } inset-x-3 bottom-3 max-h-[86vh] sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-h-[640px] sm:w-[392px]`}
      >
        <header className="flex items-center gap-3 border-b p-3.5" style={{ borderColor: "var(--c-line)", background: "var(--c-surface-2)" }}>
          <BotAvatar />
          <div className="min-w-0 flex-1">
            <p className="font-display text-[15.5px] font-semibold leading-none">EcoBuddy 🤖🌱</p>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3aa76c]" /> online · knows your {eco.actionsCompleted} actions
            </p>
          </div>
          <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink" aria-label="Close assistant">
            <X size={16} />
          </button>
        </header>

        <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto p-4" style={{ background: "var(--c-canvas)" }}>
          {msgs.map((m, i) => (
            <div key={i} className={`flex items-end gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "bot" && <BotAvatar size={26} />}
              <div
                className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  m.role === "user" ? "text-[#eaf7ee]" : "text-ink"
                }`}
                style={
                  m.role === "user"
                    ? { background: "linear-gradient(135deg,#17694f,#1d84b8)" }
                    : { background: "var(--c-surface)", border: "1px solid var(--c-line)" }
                }
              >
                {m.role === "bot" ? <Bubble text={m.text} typing={m.typing} /> : m.text}
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex items-center gap-2">
              <BotAvatar size={26} />
              <span className="flex items-center gap-1 rounded-2xl px-3 py-2.5" style={{ background: "var(--c-surface)", border: "1px solid var(--c-line)" }}>
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="h-1.5 w-1.5 rounded-full bg-forest"
                    style={{ animation: `float 1s ease-in-out ${d * 0.15}s infinite` }}
                  />
                ))}
              </span>
            </div>
          )}

          <div className="pt-1">
            <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-muted">
              <Sparkles size={11} /> suggested
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  className="rounded-full border px-2.5 py-1.5 text-left text-[11.5px] font-semibold text-ink-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-forest hover:text-forest"
                  style={{ borderColor: "var(--c-line)", background: "var(--c-surface)" }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t p-3"
          style={{ borderColor: "var(--c-line)", background: "var(--c-surface)" }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. I travel 8 km to college by car"
            className="min-w-0 flex-1 rounded-full bg-transparent px-3 py-2.5 text-[13px] outline-none ring-focus"
            style={{ background: "var(--c-surface-2)", boxShadow: "inset 0 0 0 1px var(--c-line)" }}
          />
          <button type="submit" className="btn btn-primary px-3.5! py-2.5!" aria-label="Send message">
            <Send size={15} />
          </button>
        </form>
      </div>
    </>
  );
}
