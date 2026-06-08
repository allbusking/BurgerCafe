import { Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Menu, X, ShoppingCart, User, Flame } from "lucide-react";
import { useCartContext } from "@/context/CartContext";
import { useAuthContext } from "@/context/AuthContext";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "About", to: "/about" },
  { label: "Cart", to: "/cart" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { getTotalItems } = useCartContext();
  const { user, isLoggedIn, isAdmin, logout } = useAuthContext();
  const cartCount = getTotalItems();
  const initials = user?.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 12);

      // Hide navbar on scroll down, show on scroll up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };

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
          hidden ? "-translate-y-full" : "translate-y-0",
          scrolled ? "py-2" : "py-3 md:py-4",
        ].join(" ")}
      >
        <div className="mx-auto max-w-7xl px-2 md:px-4">
          <nav
            className={[
              "flex items-center justify-between gap-2 md:gap-4 rounded-full px-3 md:px-8 h-12 md:h-16",
              "transition-all duration-500",
              scrolled
                ? "glass-dark shadow-lg shadow-black/40"
                : "bg-transparent",
            ].join(" ")}
          >
            {/* Logo */}
            <Link to="/" className="group flex items-center gap-1 md:gap-1.5 shrink-0">
              <span className="font-display text-lg md:text-3xl tracking-wide text-foreground leading-none">
                HOT B&B
              </span>
              <Flame
                size={16}
                className="text-neon transition-all duration-300 group-hover:scale-125 group-hover:rotate-6"
                strokeWidth={2.5}
              />
            </Link>

            {/* Center Nav */}
            <ul className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="relative px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-foreground/70 hover:text-foreground transition-colors group"
                  >
                    {item.label}
                    <span className="pointer-events-none absolute left-3 md:left-4 right-3 md:right-4 -bottom-0.5 h-[2px] bg-neon scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 md:gap-3 ml-auto">
              {/* Cart */}
              <Link to="/cart" className="relative grid h-9 md:h-10 w-9 md:w-10 place-items-center rounded-full glass hover:bg-white/10 transition-colors active:scale-95">
                <ShoppingCart size={16} className="text-foreground md:size-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 grid h-4 md:h-5 min-w-4 md:min-w-[1.25rem] place-items-center rounded-full bg-neon text-[9px] md:text-[10px] font-bold text-black px-0.5 md:px-1 animate-badge-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Order Now - hidden on mobile */}
              <Link
                to="/menu"
                className="hidden sm:inline-flex items-center rounded-full bg-neon px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-bold text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(200,241,53,0.4)] hover:scale-105 active:scale-95"
              >
                Order Now
              </Link>

              {isLoggedIn ? (
                <div className="relative hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((value) => !value)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-neon text-xs font-extrabold text-background transition-all hover:scale-105 active:scale-95 md:h-10 md:w-10"
                    aria-label="Open account menu"
                  >
                    {initials}
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#111]/95 p-2 shadow-2xl backdrop-blur-xl animate-fade-in">
                      <Link
                        to="/my-orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm text-foreground/80 hover:bg-white/5 hover:text-neon"
                      >
                        My Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="block rounded-xl px-3 py-2 text-sm text-foreground/80 hover:bg-white/5 hover:text-neon"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full rounded-xl px-3 py-2 text-left text-sm text-foreground/80 hover:bg-white/5 hover:text-neon"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="hidden sm:inline-flex items-center gap-2 rounded-full glass px-3 py-2 text-xs font-bold text-foreground transition-colors hover:bg-white/10 active:scale-95 md:px-4 md:text-sm"
                >
                  <User size={16} />
                  Login
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setOpen((v) => !v)}
                className="lg:hidden grid h-9 w-9 place-items-center rounded-full glass active:scale-95"
                aria-label="Toggle menu"
              >
                {open ? (
                  <X size={18} className="text-foreground" />
                ) : (
                  <Menu size={18} className="text-foreground" />
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
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl animate-slide-in-right">
          <div className="flex flex-col h-full px-4 pt-20 pb-6">
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full glass active:scale-95"
              aria-label="Close menu"
            >
              <X size={18} className="text-foreground" />
            </button>

            {/* Logo */}
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1 shrink-0 mb-8 md:mb-12"
            >
              <span className="font-display text-2xl md:text-3xl tracking-wide text-foreground leading-none">
                HOT B&B
              </span>
              <Flame size={18} className="text-neon md:size-5" strokeWidth={2.5} />
            </Link>

            {/* Mobile nav links */}
            <ul className="flex flex-col gap-1 flex-1">
              {NAV.map((item, i) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block py-3 md:py-4 text-2xl md:text-4xl font-display text-foreground/80 hover:text-neon transition-colors"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {isLoggedIn && (
                <li>
                  <Link
                    to="/my-orders"
                    onClick={() => setOpen(false)}
                    className="block py-3 md:py-4 text-2xl md:text-4xl font-display text-foreground/80 hover:text-neon transition-colors"
                  >
                    My Orders
                  </Link>
                </li>
              )}
              {isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    onClick={() => setOpen(false)}
                    className="block py-3 md:py-4 text-2xl md:text-4xl font-display text-foreground/80 hover:text-neon transition-colors"
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>

            {/* Bottom actions */}
            <div className="flex flex-col gap-2 md:gap-3 mt-auto">
              <Link
                to="/menu"
                onClick={() => setOpen(false)}
                className="w-full rounded-full bg-neon py-3 md:py-4 text-center text-sm md:text-base font-bold text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(200,241,53,0.4)] active:scale-95"
              >
                Order Now
              </Link>
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="w-full rounded-full glass py-3 md:py-4 text-sm md:text-base font-medium text-foreground flex items-center justify-center gap-2 active:scale-95"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-full glass py-3 md:py-4 text-sm md:text-base font-medium text-foreground flex items-center justify-center gap-2 active:scale-95"
                >
                  <User size={16} className="md:size-5" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
