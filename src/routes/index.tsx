import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MarqueeStrip } from "@/components/MarqueeStrip";
import { WhatWeServe } from "@/components/WhatWeServe";
import { FanFavorites } from "@/components/FanFavorites";
import { HowItWorks } from "@/components/HowItWorks";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "House of Tea — Bubble & Burgers" },
      {
        name: "description",
        content:
          "Gourmet burgers, shawarma, bubble tea & cold coffee. Bold flavors. No compromises. Just legendary food.",
      },
      { property: "og:title", content: "House of Tea — Bubble & Burgers" },
      {
        property: "og:description",
        content: "Gourmet burgers, bubble tea, shawarma & cold coffee.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <MarqueeStrip />
        <WhatWeServe />
        <FanFavorites />
        <HowItWorks />
        <Testimonials />
      </main>
    </div>
  );
}
