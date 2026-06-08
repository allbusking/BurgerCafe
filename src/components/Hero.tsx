import { Link } from "@tanstack/react-router";
import { ArrowRight, Star, Zap } from "lucide-react";
import heroBurger from "@/assets/hero-burger.png";

export function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background pt-28 pb-24">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-40 right-[-10%] h-[60vh] w-[60vh] rounded-full bg-[color-mix(in_oklab,var(--neon)_22%,transparent)] blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-[-10%] h-[40vh] w-[40vh] rounded-full bg-[color-mix(in_oklab,var(--amber-glow)_18%,transparent)] blur-[140px]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-2 lg:gap-8">
        {/* LEFT */}
        <div className="relative z-10">
          <div className="animate-slide-up inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-neon" style={{ animationDelay: "0.05s" }}>
            <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
            Est. 2024 • Mumbai's Finest
          </div>

          <h1 className="mt-6 font-display text-[14vw] leading-[0.85] sm:text-[10vw] lg:text-[7.5vw] xl:text-[120px]">
            <span className="block animate-slide-up text-cream" style={{ animationDelay: "0.15s" }}>
              BURGERS.
            </span>
            <span className="block animate-slide-up text-stroke-neon" style={{ animationDelay: "0.35s" }}>
              SHAWARMA.
            </span>
            <span className="block animate-slide-up text-cream" style={{ animationDelay: "0.55s" }}>
              BUBBLE TEA.
            </span>
          </h1>

          <p className="animate-slide-up mt-7 max-w-md text-base text-muted-foreground sm:text-lg" style={{ animationDelay: "0.75s" }}>
            Bold flavors. No compromises. Just legendary food.
          </p>

          <div className="animate-slide-up mt-8 flex flex-wrap items-center gap-4" style={{ animationDelay: "0.9s" }}>
            <Link
              to="/menu"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-primary-foreground transition-all duration-300 hover:shadow-neon hover:-translate-y-0.5"
            >
              Explore Menu
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-cream transition-all duration-300 hover:border-cream hover:bg-cream hover:text-background"
            >
              Our Story
            </Link>
          </div>

          <div className="animate-slide-up mt-6 flex items-center gap-2 text-xs text-muted-foreground" style={{ animationDelay: "1.05s" }}>
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="font-semibold text-cream">4.9 rating</span>
            <span className="opacity-50">•</span>
            <span>10,000+ happy customers</span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative mx-auto flex aspect-square w-full max-w-[560px] items-center justify-center">
          {/* Neon glow */}
          <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--neon)_45%,transparent),transparent_70%)] blur-3xl" />

          {/* Circle frame */}
          <div className="relative aspect-square w-[88%] rounded-full bg-gradient-to-br from-charcoal to-background ring-1 ring-cream/10">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_120deg,color-mix(in_oklab,var(--neon)_25%,transparent),transparent_40%,color-mix(in_oklab,var(--amber-glow)_22%,transparent),transparent_75%)] opacity-60 blur-2xl" />
            <div className="absolute inset-2 rounded-full border border-cream/10" />
            <div className="absolute inset-6 rounded-full border border-dashed border-cream/10" />

            {/* Burger */}
            <img
              src={heroBurger}
              alt="Gourmet beef burger with melted cheese"
              width={1024}
              height={1024}
              className="animate-float-slow absolute inset-0 h-full w-full scale-110 object-contain drop-shadow-[0_30px_60px_rgba(200,241,53,0.25)]"
            />
          </div>

          {/* Floating badges */}
          <div
            className="glass-dark animate-float-slow absolute right-0 top-6 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-cream"
            style={{ animationDelay: "0.4s" }}
          >
            <span className="text-xl">🧋</span> Bubble Tea
          </div>
          <div
            className="glass-dark animate-float-slow absolute left-0 top-1/2 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-cream"
            style={{ animationDelay: "1.2s" }}
          >
            <span className="text-xl">🌯</span> Shawarma
          </div>
          <div
            className="glass-dark animate-float-slow absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-cream"
            style={{ animationDelay: "2s" }}
          >
            <Zap className="h-4 w-4 fill-primary text-primary" /> 30 min delivery
          </div>
        </div>
      </div>

      {/* Wavy divider */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 leading-[0]">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="h-[60px] w-full sm:h-[90px]" aria-hidden>
          <path
            d="M0,40 C240,90 480,0 720,40 C960,80 1200,20 1440,50 L1440,90 L0,90 Z"
            fill="var(--cream)"
          />
        </svg>
      </div>
    </section>
  );
}
