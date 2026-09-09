import { Link } from "react-router-dom";
import { Leaf, Mail } from "lucide-react";
import { Logo } from "./Navbar";
import { GithubIcon, InstagramIcon, LinkedinIcon, XIcon } from "./BrandIcons";

const SOCIALS = [
  { Mark: XIcon, label: "X" },
  { Mark: InstagramIcon, label: "Instagram" },
  { Mark: LinkedinIcon, label: "LinkedIn" },
  { Mark: GithubIcon, label: "GitHub" },
];

const COLS = [
  { title: "Product", links: [["Dashboard", "/dashboard"], ["Climate Actions", "/actions"], ["Challenges", "/challenges"], ["Footprint Calculator", "/calculator"]] },
  { title: "Community", links: [["Leaderboard", "/leaderboard"], ["Global Impact", "/impact"], ["EcoBuddy AI", "/about#ecobuddy"], ["About EcoSphere", "/about"]] },
  { title: "Legal", links: [["Privacy", "/about#privacy"], ["Terms", "/about#privacy"], ["Data sources", "/about#method"], ["Contact", "/about#contact"]] },
];

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden grad-dark-eco text-[#cfe6d8]">
      <div className="pointer-events-none absolute inset-0 topo opacity-40" />
      <div className="relative mx-auto grid max-w-[1240px] gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <Logo tone="dark" />
          <p className="font-display mt-5 text-[clamp(1.6rem,3.4vw,2.3rem)] font-semibold leading-tight text-white">
            Every action counts.
          </p>
          <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-[#a7c6b4]">
            EcoSphere turns small, repeatable choices into measured carbon savings — for one person, one street, one
            country at a time.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.currentTarget.reset();
              e.target.blur();
            }}
            className="mt-6 flex max-w-sm items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5 backdrop-blur"
          >
            <Mail size={16} className="ml-2 shrink-0 text-[#7fdcae]" />
            <input
              type="email"
              required
              placeholder="Email for the weekly nudge"
              className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-[#89a897]"
            />
            <button className="btn btn-primary px-4! py-2! text-[12.5px]!">Join</button>
          </form>
          <div className="mt-6 flex items-center gap-2">
            {SOCIALS.map(({ Mark, label }, i) => (
              <a
                key={label}
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label={label}
                title={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-[#cfe6d8] transition-all duration-200 hover:-translate-y-1 hover:border-[#7fdcae] hover:text-white"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <Mark size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7fdcae]">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map(([label, to]) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="group inline-flex items-center gap-1.5 text-[14px] text-[#cfe6d8] transition-colors hover:text-white"
                    >
                      <span className="h-px w-0 bg-[#7fdcae] transition-all duration-300 group-hover:w-4" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto flex max-w-[1240px] flex-col gap-3 border-t border-white/10 px-5 py-6 text-[12px] text-[#8fae9c] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span className="inline-flex items-center gap-2">
          <Leaf size={14} className="text-[#7fdcae]" /> © {new Date().getFullYear()} EcoSphere — a prototype for
          climate behaviour change.
        </span>
        <span className="font-mono text-[11px]">Figures are illustrative demo data · stored locally on your device</span>
      </div>
    </footer>
  );
}
