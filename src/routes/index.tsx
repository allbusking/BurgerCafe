import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "House of Tea — Bubble & Burgers" },
      {
        name: "description",
        content:
          "Gourmet burgers, shawarma, bubble tea & cold coffee. Luxurious street food with a Gen-Z edge.",
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

      <main className="relative pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-4">
          <p className="font-accent text-xs uppercase tracking-[0.4em] text-primary">
            Foundation Ready
          </p>
          <h1 className="mt-4 font-display text-6xl md:text-8xl leading-[0.9]">
            House of <span className="text-gradient-brand">Tea</span>
            <br />
            Bubble & Burgers
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Design system, fonts, and sticky navbar wired up. Pages coming next.
          </p>
        </div>
      </main>
    </div>
  );
}
