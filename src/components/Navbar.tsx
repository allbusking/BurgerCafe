import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, User, Flame } from "lucide-react";
import { useCart } from "@/lib/cart-store";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "About", to: "/" },
  { label: "Contact", to: "/" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const cart = useCart();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={[
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled ? "py-2" : "py-4",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-4">
          <nav
            className={[
              "flex items-center justify-between gap-4 rounded-full px-4 md:px-8 h-14 md:h-16",
              "transition-all duration-500",
              scrolled
                ? "glass-dark shadow-lg shadow-black/40"
                : "bg-transparent",
            ].join(" ")}
          >
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-1.5 shrink-0">
              <span className="font-display text-2xl md:text-3xl tracking-wide text-foreground leading-none">
                HOT B&B
              </span>
              <Flame
                size={18}
                className="text-neon transition-all duration-300 group-hover:scale-125 group-hover:rotate-6"
                strokeWidth={2.5}
              />
            </Link>

            {/* Center Nav */}
            <ul className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors group"
                  >
                    {item.label}
                    <span className="pointer-events-none absolute left-4 right-4 -bottom-0.5 h-[2px] bg-neon scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Cart */}
              <Link to="/cart" className="relative grid h-10 w-10 place-items-center rounded-full glass hover:bg-white/10 transition-colors">
                <ShoppingCart size={18} className="text-foreground" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-neon text-[10px] font-bold text-black px-1 animate-badge-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Order Now */}
              <button className="hidden md:inline-flex items-center rounded-full bg-neon px-5 py-2.5 text-sm font-bold text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(200,241,53,0.4)] hover:scale-105">
                Order Now
              </button>

              {/* User */}
              <button className="hidden md:grid h-10 w-10 place-items-center rounded-full glass hover:bg-white/10 transition-colors">
                <User size={18} className="text-foreground" />
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setOpen((v) => !v)}
                className="md:hidden grid h-10 w-10 place-items-center rounded-full glass"
                aria-label="Toggle menu"
              >
                {open ? (
                  <X size={20} className="text-foreground" />
                ) : (
                  <Menu size={20} className="text-foreground" />
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* Bottom neon line */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-neon/80 to-transparent pointer-events-none" />
      </header>

      {/* Mobile full-screen overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl animate-fade-in">
          <div className="flex flex-col h-full px-6 pt-20 pb-8">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 grid h-10 w-10 place-items-center rounded-full glass"
              aria-label="Close menu"
            >
              <X size={20} className="text-foreground" />
            </button>

            {/* Logo */}
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 shrink-0 mb-12"
            >
              <span className="font-display text-3xl tracking-wide text-foreground leading-none">
                HOT B&B
              </span>
              <Flame size={20} className="text-neon" strokeWidth={2.5} />
            </Link>

            {/* Mobile nav links */}
            <ul className="flex flex-col gap-2 flex-1">
              {NAV.map((item, i) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block py-4 text-4xl font-display text-foreground/80 hover:text-neon transition-colors"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Bottom actions */}
            <div className="flex flex-col gap-3 mt-auto">
              <button className="w-full rounded-full bg-neon py-4 text-base font-bold text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(200,241,53,0.4)]">
                Order Now
              </button>
              <button className="w-full rounded-full glass py-4 text-base font-medium text-foreground flex items-center justify-center gap-2">
                <User size={18} />
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
