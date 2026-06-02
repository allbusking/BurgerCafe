import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Menu", to: "/" },
  { label: "Burgers", to: "/" },
  { label: "Bubble Tea", to: "/" },
  { label: "Combos", to: "/" },
  { label: "About", to: "/" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 inset-x-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-4",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-4">
        <nav
          className={[
            "flex items-center justify-between gap-4 rounded-2xl px-4 md:px-6 h-14 md:h-16",
            "transition-all duration-500",
            scrolled ? "glass-dark glow-neon/0 shadow-lg shadow-black/40" : "bg-transparent",
          ].join(" ")}
        >
          <Link to="/" className="group flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-display text-lg leading-none transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-110">
              HT
            </span>
            <div className="leading-none">
              <div className="font-display text-lg tracking-wide">
                House of Tea
              </div>
              <div className="font-accent text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Bubble · Burgers
              </div>
            </div>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="relative px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors group"
                >
                  {item.label}
                  <span className="pointer-events-none absolute left-3 right-3 -bottom-0.5 h-px bg-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button className="hidden md:inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:glow-neon">
              Order Now
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden grid h-10 w-10 place-items-center rounded-xl glass-dark"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="md:hidden mt-2 rounded-2xl glass-dark p-4 animate-fade-in">
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 text-base font-medium hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <button className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
                  Order Now
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
