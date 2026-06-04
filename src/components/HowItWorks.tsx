import { ShoppingCart, Truck } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "PICK YOUR CRAVING",
    emoji: "🍔",
    description:
      "Browse our menu of handcrafted burgers, shawarmas and drinks.",
  },
  {
    number: "02",
    title: "CUSTOMIZE & ORDER",
    emoji: "🛒",
    description:
      "Add your items, choose your extras, and checkout in seconds.",
  },
  {
    number: "03",
    title: "WE DELIVER",
    emoji: "🚀",
    description:
      "Hot, fresh, and fast delivery right to your door.",
  },
];

export function HowItWorks() {
  return (
    <section id="about" className="relative w-full bg-cream py-24 md:py-32">
      {/* Subtle grain overlay */}
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
            ORDER IN 3 STEPS
          </h2>
        </div>
        <p className="mx-auto mb-16 max-w-md text-center text-sm font-medium text-background/70 md:text-base">
          Fast. Fresh. At your door.
        </p>

        {/* Steps grid with dashed connector line */}
        <div className="relative grid gap-8 md:grid-cols-3 md:gap-6">
          {/* Desktop dashed connector line */}
          <div className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-[120px] hidden h-px border-t-2 border-dashed border-neon/40 md:block lg:left-[18%] lg:right-[18%]" />

          {steps.map((step, i) => (
            <div
              key={step.number}
              className="group relative overflow-hidden rounded-3xl bg-white p-8 transition-all duration-500 hover:border-l-[6px] hover:border-neon md:p-10"
              style={{
                boxShadow:
                  "0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              {/* Decorative large number in background */}
              <span className="pointer-events-none absolute -right-2 -top-6 font-display text-[140px] leading-none text-background/[0.06] select-none md:text-[160px] lg:text-[180px]">
                {step.number}
              </span>

              {/* Neon circle with emoji */}
              <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-neon/10">
                <span className="text-2xl">{step.emoji}</span>
              </div>

              {/* Step number label */}
              <span className="relative z-10 mb-3 inline-block text-xs font-extrabold uppercase tracking-widest text-neon">
                STEP {step.number}
              </span>

              {/* Title */}
              <h3 className="relative z-10 mb-3 font-display text-3xl leading-none text-background md:text-4xl">
                {step.title}
              </h3>

              {/* Description */}
              <p className="relative z-10 text-sm font-medium leading-relaxed text-background/60 md:text-base">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
