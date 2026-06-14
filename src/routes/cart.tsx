import { createFileRoute } from "@tanstack/react-router";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { EmptyCart } from "@/components/EmptyStates";
import { LoadingButton } from "@/components/LoadingButton";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";

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

export function CartPage() {
  const { items, totalPrice, deliveryFee, tax, grandTotal, updateQuantity, removeFromCart } =
    useCart();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const { showToast } = useToast();

  const goToCheckout = () => {
    setCheckingOut(true);
    setTimeout(() => navigate("/checkout"), 350);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />

        <main className="flex-1 pt-32 md:pt-36 pb-16">
          <div className="mx-auto max-w-7xl px-4">
            <h1 className="font-display text-5xl md:text-7xl text-foreground tracking-tight">
              YOUR ORDER 🛒
            </h1>

            {items.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Items */}
                <div className="lg:col-span-2 space-y-4">
                  {items.map((item, index) => (
                    <ScrollReveal key={item.id} delay={Math.min(index * 45, 240)}>
                      <div
                        key={item.id}
                        className="group relative flex gap-4 p-4 rounded-2xl bg-[#1A1A1A] border border-white/5 hover:border-neon/30 transition-all duration-300 animate-fade-in"
                      >
                        <div
                          className={`relative h-24 w-24 shrink-0 rounded-xl bg-gradient-to-br ${CATEGORY_GRADIENTS[item.category] || "from-neutral-700 to-neutral-900"} overflow-hidden`}
                        >
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 grid place-items-center font-display text-3xl text-white/20">
                              {item.category.charAt(0)}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.34),transparent_58%),radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_60%)]" />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                            {item.category}
                          </span>
                          <h3 className="font-body font-bold text-foreground leading-tight truncate">
                            {item.name}
                          </h3>
                          <span className="text-sm text-muted-foreground">₹{item.price} each</span>

                          <div className="mt-auto flex items-center gap-2 pt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease"
                              className="grid h-8 w-8 place-items-center rounded-full bg-neon/20 text-neon hover:bg-neon hover:text-black transition-colors"
                            >
                              <Minus size={14} strokeWidth={3} />
                            </button>
                            <span className="w-8 text-center font-bold text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase"
                              className="grid h-8 w-8 place-items-center rounded-full bg-neon/20 text-neon hover:bg-neon hover:text-black transition-colors"
                            >
                              <Plus size={14} strokeWidth={3} />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => {
                              removeFromCart(item.id);
                              showToast("Item removed from cart", "neutral");
                            }}
                            aria-label="Remove"
                            className="text-muted-foreground hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                          <span className="font-display text-2xl text-neon">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-1">
                  <div className="sticky top-28 rounded-3xl bg-[#1A1A1A] border border-white/10 p-6 space-y-5">
                    <h2 className="font-display text-3xl tracking-wide">ORDER SUMMARY</h2>

                    <div className="space-y-2 text-sm">
                      <Row label="Subtotal" value={`₹${totalPrice}`} />
                      <Row
                        label="Delivery fee"
                        value={
                          deliveryFee === 0 ? (
                            <span className="text-neon font-bold">FREE</span>
                          ) : (
                            `₹${deliveryFee}`
                          )
                        }
                      />
                      <Row label="GST (5%)" value={`₹${tax}`} />
                    </div>

                    {totalPrice > 0 && totalPrice < 499 && (
                      <p className="text-xs text-muted-foreground">
                        Add ₹{499 - totalPrice} more for FREE delivery 🚚
                      </p>
                    )}

                    <div className="pt-4 border-t border-white/10 flex items-end justify-between">
                      <span className="text-sm uppercase tracking-widest text-muted-foreground">
                        Total
                      </span>
                      <span className="font-display text-4xl text-neon">₹{grandTotal}</span>
                    </div>

                    <LoadingButton
                      isLoading={checkingOut}
                      onClick={goToCheckout}
                      className="fixed bottom-safe-4 left-4 right-4 z-50 rounded-full bg-neon py-4 text-base font-bold text-black transition-all duration-300 hover:shadow-[0_0_24px_rgba(200,241,53,0.55)] hover:scale-[1.02] active:scale-95 disabled:opacity-70 lg:static lg:w-full"
                    >
                      Proceed to Checkout
                    </LoadingButton>

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
    </PageTransition>
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
