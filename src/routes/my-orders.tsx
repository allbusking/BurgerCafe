import { createFileRoute } from "@tanstack/react-router";
import { Link, useNavigate } from "react-router-dom";
import { RotateCcw } from "lucide-react";

import { EmptyState } from "@/components/EmptyStates";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useCart } from "../context/CartContext";
import { useMyOrders } from "../hooks/useOrders";
import { useToast } from "@/context/ToastContext";
import { formatDate, formatPrice, getStatusColor, getStatusLabel } from "../utils/formatPrice";
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

type OrderItem = {
  id: string;
  name: string;
  category?: string;
  quantity?: number;
  qty?: number;
  price: number;
  image?: string;
  image_url?: string;
};

export function MyOrdersPage() {
  const { orders, loading } = useMyOrders();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const getItems = (items: unknown): OrderItem[] =>
    Array.isArray(items) ? (items as OrderItem[]) : [];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 pt-32 pb-20 md:pt-40">
          <ScrollReveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-display text-6xl leading-none text-cream md:text-8xl">
                  MY ORDERS
                </h1>
                <p className="mt-3 text-muted-foreground">
                  Everything you&apos;ve ordered, all in one place.
                </p>
              </div>
              <Link
                to="/my-addresses"
                className="text-sm font-bold text-neon transition-colors hover:text-neon/80"
              >
                Manage Addresses →
              </Link>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="mt-10 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-white/5 bg-[#1A1A1A] p-5 md:p-6"
                >
                  <div className="h-7 w-44 animate-pulse rounded bg-white/10" />
                  <div className="mt-3 h-4 w-32 animate-pulse rounded bg-white/10" />
                  <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
                    <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                  </div>
                  <div className="mt-6 h-10 w-full animate-pulse rounded-full bg-white/10 sm:w-40" />
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <EmptyState
              title="No orders yet. Time to fix that. 🍔"
              description="Your future cravings will live here once you place an order."
              icon="package"
              action={{ label: "Start Ordering", href: "/menu" }}
            />
          ) : (
            <div className="mt-10 space-y-4">
              {orders.map((order, index) => {
                const items = getItems(order.items);
                return (
                  <ScrollReveal key={order.id} delay={Math.min(index * 80, 300)}>
                    <article className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-neon/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] md:p-6">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="font-display text-3xl text-neon">
                            #{order.order_number ?? order.id}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.created_at ?? "")}
                          </p>
                        </div>
                        <span
                          className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(order.status)}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>

                      <ul className="mt-5 space-y-2 border-t border-white/10 pt-5">
                        {items.map((item) => (
                          <li
                            key={`${order.id}-${item.id}`}
                            className="flex items-center justify-between gap-4 text-sm"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              {getProductImage(
                                item.id,
                                item.category,
                                item.image_url || item.image,
                              ) && (
                                <img
                                  src={getProductImage(
                                    item.id,
                                    item.category,
                                    item.image_url || item.image,
                                  )}
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
                          {formatPrice(order.total_amount)}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            items.forEach((item) => {
                              const quantity = item.quantity ?? item.qty ?? 1;
                              Array.from({ length: quantity }).forEach(() =>
                                addToCart({
                                  id: item.id,
                                  name: item.name,
                                  category: item.category ?? "Combos",
                                  price: item.price,
                                  image_url: getProductImage(
                                    item.id,
                                    item.category,
                                    item.image_url || item.image,
                                  ) ?? "",
                                }),
                              );
                            });
                            showToast("Items added to cart!", "success");
                            navigate("/cart");
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
