import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/order-confirmation")({
  head: () => ({
    meta: [
      { title: "Order Placed — HOT B&B" },
      { name: "description", content: "Your order is on its way." },
    ],
  }),
  component: OrderConfirmationPage,
});

interface PlacedOrder {
  id: string;
  items: { id: string; name: string; qty: number; price: number }[];
  total: number;
  address?: string;
  mode: "Delivery" | "Pickup";
  createdAt: string;
}

function OrderConfirmationPage() {
  const order = useMemo<PlacedOrder>(() => {
    if (typeof window === "undefined") {
      return { id: "HOT-2024-0001", items: [], total: 0, mode: "Delivery", createdAt: new Date().toISOString() };
    }
    try {
      const raw = localStorage.getItem("hotbb-last-order");
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      id: "HOT-2024-0001",
      items: [
        { id: "demo", name: "Smash Double Burger", qty: 1, price: 349 },
      ],
      total: 349,
      mode: "Delivery",
      address: "12 MG Road, Bandra West, Mumbai 400050",
      createdAt: new Date().toISOString(),
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      <Navbar />
      <Confetti />

      <main className="relative z-10 pt-32 pb-24 px-4">
        <div className="mx-auto max-w-2xl text-center">
          {/* Checkmark */}
          <div className="mx-auto mb-8 grid place-items-center">
            <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-[0_0_30px_rgba(74,222,128,0.5)]">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#4ade80"
                strokeWidth="4"
                strokeDasharray="339"
                strokeDashoffset="339"
                style={{ animation: "draw-circle 0.8s ease-out forwards" }}
              />
              <path
                d="M36 62 L54 80 L86 46"
                fill="none"
                stroke="#4ade80"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="80"
                strokeDashoffset="80"
                style={{ animation: "draw-check 0.5s ease-out 0.7s forwards" }}
              />
            </svg>
          </div>

          <h1 className="font-display text-6xl md:text-7xl tracking-wide animate-fade-in">
            ORDER PLACED! 🎉
          </h1>
          <p className="mt-3 text-lg text-foreground/70 animate-fade-in">
            We're already cooking for you.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-neon/10 border border-neon/30 px-5 py-2">
            <span className="text-sm font-semibold text-neon">Order #{order.id}</span>
          </div>

          <div className="mt-3 inline-flex items-center gap-2 text-foreground/70 text-sm">
            <Clock size={16} className="text-neon" />
            Estimated delivery: <span className="font-semibold text-foreground">25–35 minutes</span>
          </div>

          {/* Summary card */}
          <div className="mt-10 text-left glass-dark rounded-3xl p-6 md:p-8 border border-white/5">
            <h2 className="font-display text-2xl tracking-wide mb-4">Order Summary</h2>
            <ul className="divide-y divide-white/5">
              {order.items.map((it) => (
                <li key={it.id} className="flex items-center justify-between py-3 text-sm">
                  <span className="text-foreground/80">
                    {it.name} <span className="text-foreground/40">× {it.qty}</span>
                  </span>
                  <span className="font-semibold">₹{it.price * it.qty}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-foreground/60 text-sm">Total Paid</span>
              <span className="font-display text-3xl text-neon">₹{order.total}</span>
            </div>
            {order.mode === "Delivery" && order.address && (
              <div className="mt-5 flex items-start gap-2 text-sm text-foreground/70">
                <MapPin size={16} className="text-neon mt-0.5 shrink-0" />
                <span>{order.address}</span>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button className="rounded-full bg-neon px-8 py-3.5 text-sm font-bold text-black transition-all duration-300 hover:shadow-[0_0_24px_rgba(200,241,53,0.5)] hover:scale-[1.02]">
              Track Order
            </button>
            <Link
              to="/menu"
              className="rounded-full border border-white/20 px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-white/5 transition-colors"
            >
              Back to Menu
            </Link>
          </div>

          <p className="mt-10 text-foreground/50">
            You made an excellent choice. 🔥
          </p>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes draw-circle {
          to { stroke-dashoffset: 0; }
        }
        @keyframes draw-check {
          to { stroke-dashoffset: 0; }
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

function Confetti() {
  const [pieces] = useState(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 3,
      color: ["#C8F135", "#4ade80", "#facc15", "#f472b6", "#60a5fa", "#ffffff"][i % 6],
      size: 6 + Math.random() * 8,
      rotate: Math.random() * 360,
    })),
  );
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = setTimeout(() => {
      if (ref.current) ref.current.style.display = "none";
    }, 7000);
    return () => clearTimeout(t);
  }, []);
  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.4,
            backgroundColor: p.color,
            transform: `rotate(${p.rotate}deg)`,
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}
