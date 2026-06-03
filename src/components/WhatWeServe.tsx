import { ArrowRight } from "lucide-react";
import burgerImg from "@/assets/category-burger.jpg";
import shawarmaImg from "@/assets/category-shawarma.jpg";
import bubbleteaImg from "@/assets/category-bubbletea.jpg";
import coffeeImg from "@/assets/category-coffee.jpg";

const categories = [
  {
    title: "BURGERS",
    subtitle: "Gourmet. Loaded. Unapologetic.",
    tag: "15+ varieties",
    image: burgerImg,
    bgClass: "bg-[#0A0A0A]",
    accentColor: "#C8F135",
  },
  {
    title: "SHAWARMA",
    subtitle: "Wrapped in perfection.",
    tag: "Chicken & Beef",
    image: shawarmaImg,
    bgClass: "bg-gradient-to-br from-[#FF6B00] to-[#cc4400]",
    accentColor: "#ffffff",
  },
  {
    title: "BUBBLE TEA",
    subtitle: "100+ flavor combos.",
    tag: "Cold & Fresh",
    image: bubbleteaImg,
    bgClass: "bg-gradient-to-br from-[#7c3aed] to-[#db2777]",
    accentColor: "#ffffff",
  },
  {
    title: "COFFEE & MORE",
    subtitle: "Hot. Cold. Always perfect.",
    tag: "Cold Coffee \u2022 Mocktails",
    image: coffeeImg,
    bgClass: "bg-[#2a1b12]",
    accentColor: "#F5F0E8",
  },
];

export function WhatWeServe() {
  return (
    <section
      id="menu"
      className="relative w-full bg-cream py-24 md:py-32"
    >
      {/* Subtle grain overlay for this section */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.7'/></svg>")`,
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        {/* Heading */}
        <div className="mb-4 text-center">
          <h2 className="font-display text-[15vw] leading-[0.9] text-background sm:text-[12vw] md:text-[10vw] lg:text-[100px]">
            WHAT WE SERVE
          </h2>
        </div>
        <p className="mx-auto mb-14 max-w-xl text-center text-sm font-medium text-background/70 md:text-base">
          From fire-grilled burgers to silky bubble teas — we've got your cravings covered.
        </p>

        {/* Cards */}
        <div className="grid snap-x snap-mandatory auto-cols-[85%] grid-flow-col gap-5 overflow-x-auto pb-6 md:auto-cols-auto md:grid-flow-row md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className="group relative flex snap-center flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-2"
              style={{
                minHeight: "480px",
                animationDelay: `${i * 0.12}s`,
              }}
            >
              {/* Background */}
              <div className={`absolute inset-0 ${cat.bgClass}`} />

              {/* Hover glow border */}
              <div
                className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  boxShadow: `0 0 40px ${cat.accentColor}44, inset 0 0 0 2px ${cat.accentColor}33`,
                }}
              />

              {/* Image */}
              <div className="relative flex flex-1 items-center justify-center overflow-hidden p-6">
                <img
                  src={cat.image}
                  alt={cat.title}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="h-auto max-h-[200px] w-auto max-w-[80%] object-contain transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col gap-2 p-6 pt-0">
                <span
                  className="inline-flex w-fit items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: cat.accentColor,
                    color:
                      cat.bgClass.includes("from") || cat.bgClass === "bg-[#2a1b12]"
                        ? "#0A0A0A"
                        : "#0A0A0A",
                  }}
                >
                  {cat.tag}
                </span>

                <h3 className="font-display text-4xl leading-none text-white md:text-5xl lg:text-[52px]">
                  {cat.title}
                </h3>
                <p className="text-sm font-medium text-white/80">
                  {cat.subtitle}
                </p>

                <a
                  href="#"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider transition-all duration-300 group-hover:gap-3"
                  style={{ color: cat.accentColor }}
                >
                  Explore <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex justify-center">
          <a
            href="#full-menu"
            className="group inline-flex items-center gap-2.5 rounded-full bg-background px-8 py-4 text-sm font-bold uppercase tracking-wider text-cream transition-all duration-300 hover:bg-charcoal hover:shadow-[0_0_30px_rgba(200,241,53,0.3)]"
          >
            See Full Menu
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
