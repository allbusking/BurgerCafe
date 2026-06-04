import { useRef } from "react";
import { Star, TrendingUp, Utensils, Award } from "lucide-react";

const testimonials = [
  {
    name: "Aryan M.",
    rating: 5,
    text: "The smash burger hit different. Best I've had in the city, no cap.",
    tag: "Verified Order \u2022 Smash Double Burger",
    avatar: "A",
  },
  {
    name: "Zara K.",
    rating: 5,
    text: "The taro bubble tea is INSANE. I order it literally every day now.",
    tag: "Verified Order \u2022 Taro Bubble Tea",
    avatar: "Z",
  },
  {
    name: "Rohan T.",
    rating: 5,
    text: "Chicken shawarma was perfectly spiced. Delivery was quick too.",
    tag: "Verified Order \u2022 Chicken Shawarma",
    avatar: "R",
  },
];

const stats = [
  { value: "10K+", label: "Happy Customers", icon: TrendingUp },
  { value: "50+", label: "Menu Items", icon: Utensils },
  { value: "4.9\u2605", label: "Average Rating", icon: Award },
];

export function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative bg-background overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/4 w-72 h-72 rounded-full bg-neon/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-amber-glow/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-cream tracking-wide">
            PEOPLE ARE OBSESSED
          </h2>
          <p className="mt-4 text-muted-foreground text-lg md:text-xl font-body">
            Don&apos;t take our word for it.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-hide md:grid md:grid-cols-3 md:overflow-visible md:pb-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group relative flex-shrink-0 w-[85vw] sm:w-[400px] md:w-auto snap-center rounded-3xl p-8 md:p-10 transition-all duration-500 hover:-translate-y-2"
              style={{
                background:
                  "linear-gradient(145deg, rgba(26,26,26,0.9) 0%, rgba(17,17,17,0.95) 100%)",
                backdropFilter: "blur(20px) saturate(140%)",
                border: "1px solid rgba(245,240,232,0.08)",
              }}
            >
              {/* Hover glow border */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                style={{
                  boxShadow: "inset 0 0 0 1px rgba(200,241,53,0.3), 0 0 40px rgba(200,241,53,0.08)",
                }}
              />

              {/* Giant quote mark */}
              <div className="absolute top-4 right-6 text-8xl font-display text-neon/15 leading-none select-none">
                &rdquo;
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6 relative z-10">
                {Array.from({ length: t.rating }).map((_, si) => (
                  <Star
                    key={si}
                    className="w-5 h-5 fill-neon text-neon"
                  />
                ))}
              </div>

              {/* Review text */}
              <p className="text-lg md:text-xl text-cream/90 font-body italic leading-relaxed mb-8 relative z-10">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Reviewer info */}
              <div className="flex items-center gap-4 relative z-10">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-neon/10 border border-neon/30 flex items-center justify-center text-neon font-bold text-lg font-body">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-body font-bold text-cream text-base">
                    {t.name}
                  </p>
                  {/* Verified tag */}
                  <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-body font-medium border border-emerald-500/20">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {t.tag}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ABOUT SNIPPET */}
        <div className="mt-24 md:mt-32 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Left: Text */}
          <div>
            <h3 className="font-display text-4xl sm:text-5xl md:text-6xl text-cream leading-tight tracking-wide">
              WE&apos;RE NOT JUST A CAFE.
              <br />
              <span className="text-neon">WE&apos;RE A CULTURE.</span>
            </h3>
            <p className="mt-6 text-muted-foreground text-lg md:text-xl font-body leading-relaxed max-w-lg">
              Born in Mumbai, built for flavor lovers. Every item on our menu is crafted with obsession-level care.
            </p>
          </div>

          {/* Right: Stats */}
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center md:text-left group"
              >
                <p className="font-display text-4xl sm:text-5xl md:text-6xl text-neon tracking-wide">
                  {stat.value}
                </p>
                <p className="mt-2 text-muted-foreground text-sm font-body uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar utility */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
