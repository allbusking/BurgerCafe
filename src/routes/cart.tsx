import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, Truck, Store } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  cartStore,
  computeTotals,
  useCart,
  useDeliveryMode,
} from "@/lib/cart-store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — House of Tea" },
      { name: "description", content: "Review your order before checkout." },
    ],
  }),
  component: CartPage,
});

const CATEGORY_GRADIENTS: Record<string, string> = {
  Burgers: "from-orange-600 to-red-800",
  Shawarma: "from-amber-600 to-orange-800",
  "Bubble Tea": "from-pink-500 to-purple-800",
  Coffee: "from-amber-900 to-neutral-900",
  "Cold Coffee": "from-stone-700 to-neutral-900",
  Combos: "from-lime-500 to-teal-800",
};

function CartPage() {
  const items = useCart();
  const mode = useDeliveryMode();
  const navigate = useNavigate();
  const totals = computeTotals(items, mode);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 md:pt-36 pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="font-display text-5xl md:text-7xl text-foreground tracking-tight">
            YOUR ORDER 🛒
          </h1>

          {items.length === 0 ? (
            <div className="mt-16 grid place-items-center text-center">
              <div className="grid h-32 w-32 place-items-center rounded-full bg-white/5 border border-white/10 mb-6">
                <ShoppingBag size={56} className="text-muted-foreground" />
              </div>
              <p className="font-display text-4xl md:text-5xl text-foreground">
                Your cart is lonely 😢
              </p>
              <p className="mt-2 text-muted-foreground">
                Let's fix that. Pick something delicious.
              </p>
              <Link
                to="/menu"
                className="mt-8 inline-flex items-center rounded-full bg-neon px-8 py-3.5 text-sm font-bold text-black transition-all duration-300 hover:shadow-[0_0_24px_rgba(200,241,53,0.5)] hover:scale-105"
              >
                Start Ordering
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex gap-4 p-4 rounded-2xl bg-[#1A1A1A] border border-white/5 hover:border-neon/30 transition-all duration-300 animate-fade-in"
                  >
                    <div
                      className={`relative h-24 w-24 shrink-0 rounded-xl bg-gradient-to-br ${CATEGORY_GRADIENTS[item.category] || "from-neutral-700 to-neutral-900"} overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
                      <div className="absolute inset-0 grid place-items-center font-display text-3xl text-white/20">
                        {item.category.charAt(0)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                        {item.category}
                      </span>
                      <h3 className="font-body font-bold text-foreground leading-tight truncate">
                        {item.name}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        ₹{item.price} each
                      </span>

                      <div className="mt-auto flex items-center gap-2 pt-2">
                        <button
                          onClick={() => cartStore.setQty(item.id, item.qty - 1)}
                          aria-label="Decrease"
                          className="grid h-8 w-8 place-items-center rounded-full bg-neon/20 text-neon hover:bg-neon hover:text-black transition-colors"
                        >
                          <Minus size={14} strokeWidth={3} />
                        </button>
                        <span className="w-8 text-center font-bold text-foreground">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => cartStore.setQty(item.id, item.qty + 1)}
                          aria-label="Increase"
                          className="grid h-8 w-8 place-items-center rounded-full bg-neon/20 text-neon hover:bg-neon hover:text-black transition-colors"
                        >
                          <Plus size={14} strokeWidth={3} />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => cartStore.remove(item.id)}
                        aria-label="Remove"
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <span className="font-display text-2xl text-neon">
                        ₹{item.price * item.qty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-28 rounded-3xl bg-[#1A1A1A] border border-white/10 p-6 space-y-5">
                  <h2 className="font-display text-3xl tracking-wide">
                    ORDER SUMMARY
                  </h2>

                  {/* Toggle */}
                  <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-white/5">
                    {(["Delivery", "Pickup"] as const).map((m) => {
                      const Icon = m === "Delivery" ? Truck : Store;
                      const active = mode === m;
                      return (
                        <button
                          key={m}
                          onClick={() => cartStore.setDelivery(m)}
                          className={[
                            "flex items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold transition-all",
                            active
                              ? "bg-neon text-black"
                              : "text-muted-foreground hover:text-foreground",
                          ].join(" ")}
                        >
                          <Icon size={14} />
                          {m}
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2 text-sm">
                    <Row label="Subtotal" value={`₹${totals.subtotal}`} />
                    <Row
                      label="Delivery fee"
                      value={
                        totals.delivery === 0 ? (
                          <span className="text-neon font-bold">FREE</span>
                        ) : (
                          `₹${totals.delivery}`
                        )
                      }
                    />
                    <Row label="GST (5%)" value={`₹${totals.gst}`} />
                  </div>

                  {mode === "Delivery" && totals.subtotal > 0 && totals.subtotal < 499 && (
                    <p className="text-xs text-muted-foreground">
                      Add ₹{499 - totals.subtotal} more for FREE delivery 🚚
                    </p>
                  )}

                  <div className="pt-4 border-t border-white/10 flex items-end justify-between">
                    <span className="text-sm uppercase tracking-widest text-muted-foreground">
                      Total
                    </span>
                    <span className="font-display text-4xl text-neon">
                      ₹{totals.total}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate({ to: "/checkout" })}
                    className="w-full rounded-full bg-neon py-4 text-base font-bold text-black transition-all duration-300 hover:shadow-[0_0_24px_rgba(200,241,53,0.55)] hover:scale-[1.02]"
                  >
                    Proceed to Checkout
                  </button>

                  <Link
                    to="/menu"
                    className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}
