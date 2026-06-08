import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { RotateCcw } from "lucide-react";

import { EmptyState } from "@/components/EmptyStates";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useAuthContext } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatDate } from "@/utils/formatDate";
import { formatPrice } from "@/utils/formatPrice";
import { getProductImage } from "@/utils/productImages";

export const Route = createFileRoute("/my-orders")({
  head: () => ({
    meta: [
      { title: "My Orders — HOT B&B" },
      { name: "description", content: "Review your House of Tea orders." },
    ],
  }),
  component: MyOrdersPage,
});

type OrderStatus = "Pending" | "Preparing" | "Ready" | "Delivered";

interface SavedOrder {
  id: string;
  createdAt: string;
  total: number;
  status?: OrderStatus;
  items: {
    id: string;
    name: string;
    category?: string;
    qty?: number;
    quantity?: number;
    price: number;
    image?: string;
  }[];
}

const ORDERS_KEY = "hotbb-orders-v1";

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: "bg-yellow-400/15 text-yellow-300 border-yellow-400/25",
  Preparing: "bg-blue-400/15 text-blue-300 border-blue-400/25",
  Ready: "bg-emerald-400/15 text-emerald-300 border-emerald-400/25",
  Delivered: "bg-white/10 text-foreground/60 border-white/10",
};

function MyOrdersPage() {
  const { isLoggedIn, isLoading } = useAuthContext();
  const { addToCart } = useCartContext();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) navigate({ to: "/auth" });
  }, [isLoading, isLoggedIn, navigate]);

  const orders = useMemo<SavedOrder[]>(() => {
    try {
      const raw = localStorage.getItem(ORDERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  if (isLoading || !isLoggedIn) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 pt-32 pb-20 md:pt-40">
          <ScrollReveal>
            <h1 className="font-display text-6xl leading-none text-cream md:text-8xl">MY ORDERS</h1>
            <p className="mt-3 text-muted-foreground">
              Everything you&apos;ve ordered, all in one place.
            </p>
          </ScrollReveal>

          {orders.length === 0 ? (
            <EmptyState
              title="No orders yet. Time to fix that. 🍔"
              description="Your future cravings will live here once you place an order."
              icon="package"
              action={{ label: "Start Ordering", href: "/menu" }}
            />
          ) : (
            <div className="mt-10 space-y-4">
              {orders.map((order, index) => {
                const status = order.status ?? "Pending";
                return (
                  <ScrollReveal key={order.id} delay={Math.min(index * 80, 300)}>
                    <article className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-neon/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] md:p-6">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="font-display text-3xl text-neon">#{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <span
                          className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${STATUS_STYLES[status]}`}
                        >
                          {status}
                        </span>
                      </div>

                      <ul className="mt-5 space-y-2 border-t border-white/10 pt-5">
                        {order.items.map((item) => (
                          <li
                            key={`${order.id}-${item.id}`}
                            className="flex items-center justify-between gap-4 text-sm"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              {getProductImage(item.id, item.category, item.image) && (
                                <img
                                  src={getProductImage(item.id, item.category, item.image)}
                                  alt={item.name}
                                  loading="lazy"
                                  className="h-11 w-11 shrink-0 rounded-xl object-cover"
                                />
                              )}
                              <span className="min-w-0 truncate text-foreground/80">
                                {item.name}{" "}
                                <span className="text-muted-foreground">
                                  x {item.quantity ?? item.qty ?? 1}
                                </span>
                              </span>
                            </div>
                            <span className="text-muted-foreground">
                              {formatPrice(item.price * (item.quantity ?? item.qty ?? 1))}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                        <span className="font-display text-4xl text-neon">
                          {formatPrice(order.total)}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            order.items.forEach((item) => {
                              const quantity = item.quantity ?? item.qty ?? 1;
                              Array.from({ length: quantity }).forEach(() =>
                                addToCart({
                                  id: item.id,
                                  name: item.name,
                                  category: item.category ?? "Combos",
                                  price: item.price,
                                  image: getProductImage(item.id, item.category, item.image),
                                }),
                              );
                            });
                            showToast("Items added back to cart! 🍔", "success");
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-neon/50 px-5 py-3 text-sm font-bold text-neon transition-all hover:bg-neon hover:text-background hover:scale-[1.03] active:scale-[0.97]"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Reorder
                        </button>
                      </div>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
