import { createFileRoute } from "@tanstack/react-router";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  Instagram,
  Linkedin,
  Trophy,
  Flame,
  Heart,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — House of Tea Bubble & Burgers" },
      {
        name: "description",
        content: "The story, values, people, and obsession behind House of Tea Bubble & Burgers.",
      },
    ],
  }),
  component: AboutPage,
});

const marqueeItems = [
  "BOLD FLAVORS",
  "NO SHORTCUTS",
  "FRESH DAILY",
  "MADE WITH OBSESSION",
  "BURGERS",
  "SHAWARMA",
  "BUBBLE TEA",
  "COFFEE",
  "COMBOS",
];

const values = [
  {
    number: "01",
    icon: Trophy,
    emoji: "🏆",
    title: "QUALITY FIRST",
    description:
      "Every ingredient is handpicked. Every item is made fresh. We don't cut corners because you don't deserve corners.",
  },
  {
    number: "02",
    icon: Flame,
    emoji: "🔥",
    title: "GO BOLD OR GO HOME",
    description:
      "Mild is not in our vocabulary. Every flavor is crafted to leave an impression. We make food people talk about.",
  },
  {
    number: "03",
    icon: Heart,
    emoji: "❤️",
    title: "BUILT FOR YOU",
    description:
      "This place exists because of the people who showed up, shared their first bite, and kept coming back.",
  },
];

const team = [
  {
    name: "Aryan Shah",
    role: "Founder & Head Chef",
    quote: "I cook the way I feel. Loud, bold, and never boring.",
    image:
      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Zara Malik",
    role: "Co-Founder & Creative Director",
    quote: "Every detail — the packaging, the plating, the vibe — it matters.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
  },
  {
    name: "Rohan Verma",
    role: "Operations & Delivery Head",
    quote: "If it's not hot and on time, it's not from us.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
  },
];

const stats = [
  { value: 10000, suffix: "+", label: "Happy Customers" },
  { value: 50, suffix: "+", label: "Menu Items" },
  { value: 4.9, suffix: " ★", label: "Average Rating", decimals: 1 },
  { value: 1, suffix: "", label: "City. For now. 😉" },
];

const gallery = [
  {
    caption: "The smash that started it all 🍔",
    className: "md:row-span-2 min-h-[420px]",
    gradient: "from-amber-500 via-red-700 to-neutral-950",
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=80",
  },
  {
    caption: "Late night bubble tea runs 🧋",
    className: "min-h-[220px]",
    gradient: "from-purple-600 via-fuchsia-700 to-neutral-950",
    image:
      "https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=900&q=80",
  },
  {
    caption: "Our kitchen in full chaos ☁️🔥",
    className: "min-h-[220px]",
    gradient: "from-emerald-700 via-stone-900 to-black",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
  },
  {
    caption: "The shawarma wrap of your dreams 🌯",
    className: "min-h-[260px]",
    gradient: "from-orange-500 via-amber-800 to-neutral-950",
    image:
      "https://images.unsplash.com/photo-1662116765994-1e4200c43589?auto=format&fit=crop&w=900&q=80",
  },
  {
    caption: "Cold coffee, warm vibes ☕",
    className: "min-h-[260px]",
    gradient: "from-stone-700 via-amber-950 to-black",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=80",
  },
];

export function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main>
          <HeroSection />
          <BrandStory />
          <MarqueeStrip />
          <ValuesSection />
          <TeamSection />
          <StatsSection />
          <GallerySection />
          <CtaSection />
          <LocationSection />
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}

function HeroSection() {
  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-4 pt-32 pb-24 text-center">
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <span className="font-display text-[34vw] leading-none text-cream/[0.05] md:text-[24vw]">
          HOT B&amp;B
        </span>
      </div>
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-neon/[0.08] blur-[120px]" />

      <ScrollReveal className="relative z-10 mx-auto max-w-5xl">
        <span className="inline-flex rounded-full bg-neon px-5 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-background shadow-neon">
          🔥 Our Story
        </span>
        <h1 className="mt-8 font-display text-[18vw] leading-[0.83] text-cream sm:text-[13vw] md:text-[120px] lg:text-[150px]">
          <span className="block">WE DIDN&apos;T OPEN</span>
          <span className="block text-stroke-neon text-transparent">A CAFE.</span>
          <span className="mt-4 block text-[12vw] text-cream sm:text-[8vw] md:text-[78px] lg:text-[96px]">
            WE STARTED A MOVEMENT.
          </span>
        </h1>
        <p className="mx-auto mt-8 max-w-[600px] text-base leading-relaxed text-muted-foreground md:text-lg">
          House of Tea Bubble &amp; Burgers was born from one obsession — food that hits different.
          No shortcuts. No compromises. Just bold, unapologetic flavor.
        </p>
      </ScrollReveal>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-neon">
        <ArrowDown className="h-7 w-7" />
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="relative overflow-hidden bg-cream px-4 py-24 text-background md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <ScrollReveal>
          <div className="relative min-h-[520px] overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-950 via-amber-950 to-black shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80"
              alt="A busy restaurant kitchen where House of Tea Bubble & Burgers began"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(200,241,53,0.28),transparent_34%),linear-gradient(to_top,rgba(0,0,0,0.78),transparent_54%)]" />
            <div className="absolute bottom-8 left-8">
              <p className="font-display text-7xl leading-none text-white md:text-8xl">EST. 2024</p>
            </div>
          </div>
          <p className="mt-4 text-sm italic text-background/50">
            Where it all started — our first kitchen.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="border-l-4 border-neon pl-6 md:pl-8">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-neon">
              THE ORIGIN
            </p>
            <h2 className="mt-4 font-display text-5xl leading-[0.92] text-background sm:text-6xl md:text-8xl">
              BUILT IN A KITCHEN. FUELED BY OBSESSION.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-8 text-background/70 md:text-lg">
              <p>
                It started with a single smash burger made at midnight. No recipe book. Just
                instinct, heat, and a craving that wouldn&apos;t quit. That burger changed
                everything.
              </p>
              <p>
                We built House of Tea Bubble &amp; Burgers because we were tired of settling. Tired
                of average food in average places. We wanted every bite to feel like the first time.
              </p>
              <p>
                Today we serve thousands of customers across the city — but the obsession
                hasn&apos;t changed. Same fire. Same flavors. Every single day.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function MarqueeStrip() {
  const text = marqueeItems.join(" • ");
  return (
    <div className="overflow-hidden bg-background py-5">
      <div className="flex w-max animate-marquee-reverse gap-8 whitespace-nowrap font-display text-4xl leading-none text-neon md:text-6xl">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i}>{text} •</span>
        ))}
      </div>
    </div>
  );
}

function ValuesSection() {
  return (
    <section className="bg-background px-4 py-24 md:py-32">
      <ScrollReveal className="mx-auto max-w-4xl text-center">
        <h2 className="font-display text-[15vw] leading-[0.9] text-cream sm:text-[10vw] md:text-[108px]">
          WHAT WE STAND FOR
        </h2>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          Three things we never compromise on.
        </p>
      </ScrollReveal>

      <div className="mx-auto mt-14 grid max-w-7xl gap-6 lg:grid-cols-3">
        {values.map((value, index) => {
          const Icon = value.icon;
          return (
            <ScrollReveal key={value.number} delay={index * 100}>
              <article className="group relative flex min-h-[430px] flex-col overflow-hidden rounded-3xl border border-white/5 bg-[#1A1A1A] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-neon/60 hover:shadow-[0_0_50px_rgba(200,241,53,0.16)] md:p-10">
                <span className="pointer-events-none absolute -right-3 -top-8 font-display text-[170px] leading-none text-white/[0.035]">
                  {value.number}
                </span>
                <div className="relative z-10 grid h-16 w-16 place-items-center rounded-full bg-neon text-background shadow-neon">
                  <Icon className="h-7 w-7" />
                </div>
                <span className="relative z-10 mt-8 text-4xl">{value.emoji}</span>
                <h3 className="relative z-10 mt-4 font-display text-5xl leading-none text-cream">
                  {value.title}
                </h3>
                <p className="relative z-10 mt-5 text-base leading-7 text-muted-foreground">
                  {value.description}
                </p>
                <div className="mt-auto h-1 w-full rounded-full bg-neon" />
              </article>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="bg-cream px-4 py-24 text-background md:py-32">
      <ScrollReveal className="mx-auto max-w-5xl text-center">
        <h2 className="font-display text-[14vw] leading-[0.9] text-background sm:text-[9vw] md:text-[96px]">
          THE PEOPLE BEHIND THE FOOD
        </h2>
        <p className="mt-4 text-base text-background/60 md:text-lg">
          We&apos;re a small team with a big obsession.
        </p>
      </ScrollReveal>

      <div className="mx-auto mt-14 grid max-w-7xl gap-6 md:grid-cols-3">
        {team.map((member, index) => (
          <ScrollReveal key={member.name} delay={index * 100}>
            <article className="rounded-2xl bg-white p-8 text-center shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <div className="mx-auto h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-black ring-4 ring-neon/20">
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-6 text-xl font-extrabold text-background">{member.name}</h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-neon">
                {member.role}
              </p>
              <p className="mt-5 min-h-[84px] text-sm italic leading-7 text-background/60">
                &ldquo;{member.quote}&rdquo;
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <SocialButton label="Instagram">
                  <Instagram className="h-4 w-4" />
                </SocialButton>
                <SocialButton label="LinkedIn">
                  <Linkedin className="h-4 w-4" />
                </SocialButton>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function SocialButton({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full bg-background text-cream transition-all duration-300 hover:bg-neon hover:text-background"
    >
      {children}
    </button>
  );
}

function StatsSection() {
  return (
    <section className="bg-neon px-4 py-24 text-background md:py-28">
      <ScrollReveal className="text-center">
        <h2 className="font-display text-[16vw] leading-none sm:text-[10vw] md:text-[120px]">
          BY THE NUMBERS
        </h2>
      </ScrollReveal>
      <div className="mx-auto mt-12 grid max-w-7xl grid-cols-2 gap-8 md:grid-cols-4 md:gap-0">
        {stats.map((stat, index) => (
          <ScrollReveal
            key={stat.label}
            className={["text-center", index > 0 ? "md:border-l md:border-background/30" : ""].join(
              " ",
            )}
            delay={index * 80}
          >
            <CountUpStat {...stat} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function CountUpStat({
  value,
  suffix,
  label,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.4,
  });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 1100;
    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, value]);

  const display = decimals
    ? current.toFixed(decimals)
    : Math.round(current).toLocaleString("en-IN");

  return (
    <div ref={ref} className="px-4">
      <p className="font-display text-7xl leading-none text-background md:text-8xl">
        {display}
        {suffix}
      </p>
      <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-background/70">
        {label}
      </p>
    </div>
  );
}

function GallerySection() {
  return (
    <section className="bg-background px-4 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <h2 className="font-display text-[16vw] leading-none text-cream sm:text-[10vw] md:text-[108px]">
            THE VIBE 📸
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            Real food. Real moments. Real obsession.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3 md:auto-rows-[220px]">
          {gallery.map((item, index) => (
            <ScrollReveal
              key={item.caption}
              className={index === 0 ? "md:row-span-2" : ""}
              delay={index * 70}
            >
              <div
                className={[
                  "group relative overflow-hidden rounded-3xl bg-gradient-to-br",
                  item.gradient,
                  item.className,
                ].join(" ")}
              >
                <img
                  src={item.image}
                  alt={item.caption}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.4),transparent_60%),radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.22),transparent_35%)]" />
                <div className="absolute inset-0 grid place-items-center bg-black/0 p-6 opacity-0 transition-all duration-500 group-hover:bg-black/55 group-hover:opacity-100">
                  <p className="text-center font-display text-4xl leading-none text-cream">
                    {item.caption}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="bg-[#1A1A1A] px-4 py-24 text-center md:py-32">
      <ScrollReveal className="mx-auto max-w-5xl">
        <h2 className="font-display text-[15vw] leading-[0.88] text-cream sm:text-[10vw] md:text-[104px]">
          READY TO TASTE THE OBSESSION?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
          Order now and see what the hype is about.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/menu"
            className="w-full rounded-full bg-neon px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-background transition-all duration-300 hover:shadow-neon active:scale-95 sm:w-auto"
          >
            Order Now 🔥
          </Link>
          <Link
            to="/menu"
            className="w-full rounded-full border border-cream/50 px-8 py-4 text-sm font-extrabold uppercase tracking-wider text-cream transition-all duration-300 hover:bg-cream hover:text-background active:scale-95 sm:w-auto"
          >
            View Full Menu
          </Link>
        </div>
        <p className="mt-7 text-sm font-medium text-cream/50">
          ⭐ 4.9 rated • 10,000+ orders delivered • Fresh every day
        </p>
      </ScrollReveal>
    </section>
  );
}

function LocationSection() {
  const mapsLocationUrl =
    "https://www.google.com/maps/place/House+of+Shawarma/@27.1855924,88.4982782,15z/data=!4m6!3m5!1s0x39e6a14e5176425d:0xe26fa48af90f3e3!8m2!3d27.1855924!4d88.4982781";

  return (
    <section className="bg-background px-4 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
        <ScrollReveal>
          <div className="flex h-full flex-col justify-between rounded-3xl border border-white/5 bg-[#161616] p-6 md:p-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-neon px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-background">
                <MapPin className="h-4 w-4" />
                Find Us
              </span>
              <h2 className="mt-7 font-display text-5xl leading-none text-cream md:text-7xl">
                HOUSE OF SHAWARMA
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg">
                Siliguri, West Bengal. Visit us, pick up your order, or use the map for directions.
              </p>
            </div>

            <a
              href={mapsLocationUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-neon px-6 py-4 text-sm font-extrabold uppercase tracking-wider text-background transition-all duration-300 hover:shadow-neon active:scale-95 sm:w-fit"
            >
              Open Directions
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={120}>
          <div className="overflow-hidden rounded-3xl border border-neon/30 bg-[#161616] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
            <iframe
              title="House of Shawarma map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d8216.462633209028!2d88.49827817589414!3d27.18559244830948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39e6a14e5176425d%3A0xe26fa48af90f3e3!2sHouse%20of%20Shawarma!5e1!3m2!1sen!2sin!4v1781463801345!5m2!1sen!2sin"
              width="100%"
              height="520"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[420px] w-full border-0 md:h-[520px]"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
