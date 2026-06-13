import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Star, Check, Plus } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "../context/CartContext";
import { EmptyState } from "@/components/EmptyStates";
import { LoadingButton } from "@/components/LoadingButton";
import { PageTransition } from "@/components/PageTransition";
import { ProductCardSkeleton } from "@/components/SkeletonLoaders";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useToast } from "@/context/ToastContext";
import { useCategories, useProducts } from "../hooks/useProducts";
import { formatPrice } from "../utils/formatPrice";
import categoryBurgerImg from "@/assets/category-burger.jpg";
import categoryBubbleTeaImg from "@/assets/category-bubbletea.jpg";
import categoryCoffeeImg from "@/assets/category-coffee.jpg";
import categoryShawarmaImg from "@/assets/category-shawarma.jpg";
import productOreoCoffeeImg from "@/assets/product-oreo-coffee.jpg";
import productTowerBurgerImg from "@/assets/product-tower-burger.jpg";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — House of Tea Bubble & Burgers" },
      {
        name: "description",
        content:
          "Explore our full menu: smash burgers, shawarma, bubble tea, coffee, cold coffee, and combos. Handcrafted with obsession.",
      },
      { property: "og:title", content: "Menu — House of Tea" },
      {
        property: "og:description",
        content: "Burgers, shawarma, bubble tea & more. Bold flavors only.",
      },
    ],
  }),
  component: MenuPage,
});

type MenuProduct = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  badge: string | null;
  image_url?: string;
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  Burgers: "from-orange-600 via-red-700 to-amber-900",
  Shawarma: "from-amber-600 via-orange-700 to-yellow-900",
  "Bubble Tea": "from-pink-500 via-fuchsia-600 to-purple-800",
  Coffee: "from-amber-900 via-stone-800 to-neutral-900",
  "Cold Coffee": "from-stone-700 via-amber-800 to-neutral-900",
  Combos: "from-lime-500 via-emerald-600 to-teal-800",
};

const CATEGORY_IMAGES: Record<string, string> = {
  Burgers: categoryBurgerImg,
  Shawarma: categoryShawarmaImg,
  "Bubble Tea": categoryBubbleTeaImg,
  Coffee: categoryCoffeeImg,
  "Cold Coffee": productOreoCoffeeImg,
  Combos: productTowerBurgerImg,
};

const BADGE_STYLES: Record<string, string> = {
  BESTSELLER: "bg-neon text-black",
  NEW: "bg-amber-glow text-black",
  "SPICY 🌶️": "bg-red-600 text-white",
};

export function MenuPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [adding, setAdding] = useState<Record<string, boolean>>({});
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const { categories } = useCategories();
  const { products, loading } = useProducts(activeCategory);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const menuProducts = useMemo<MenuProduct[]>(
    () =>
      products.map((product) => {
        const categoryName = product.categories?.name ?? "Burgers";
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          category: categoryName,
          description: product.description ?? "",
          rating: Number(product.rating ?? 4.8),
          reviews: Number(product.reviews ?? 0),
          badge:
            product.badge ||
            (product.is_bestseller ? "BESTSELLER" : product.is_featured ? "NEW" : null),
          image_url: product.image_url ?? CATEGORY_IMAGES[categoryName],
        };
      }),
    [products],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return menuProducts.filter((p) => {
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchQ;
    });
  }, [menuProducts, query]);

  const handleAdd = (p: MenuProduct) => {
    setAdding((s) => ({ ...s, [p.id]: true }));
    addToCart({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      image_url: p.image_url ?? "",
    });
    showToast("Added to cart!", "success");
    window.setTimeout(() => {
      setAdding((s) => ({ ...s, [p.id]: false }));
      setAdded((s) => ({ ...s, [p.id]: true }));
      window.setTimeout(() => setAdded((s) => ({ ...s, [p.id]: false })), 1500);
    }, 300);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        {/* HEADER */}
        <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-neon/10 blur-3xl pointer-events-none" />
          <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-amber-glow/10 blur-3xl pointer-events-none" />
          <div className="mx-auto max-w-7xl px-4 text-center relative">
            <h1 className="font-display text-6xl sm:text-8xl md:text-[10rem] text-foreground leading-none tracking-tight">
              OUR{" "}
              <span className="relative inline-block">
                MENU
                <span className="absolute left-0 -bottom-2 md:-bottom-4 h-1.5 md:h-2 w-full bg-neon rounded-full origin-left animate-[slide-up_1s_ease-out_forwards]" />
              </span>
            </h1>
            <p className="mt-6 text-base md:text-xl text-muted-foreground font-body">
              Handcrafted with obsession. Served with attitude.
            </p>
          </div>
        </section>

        {/* STICKY FILTER + SEARCH BAR */}
        <div className="sticky top-0 z-[55] border-y border-white/10 bg-background/90 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="mx-auto max-w-7xl px-4 py-4 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Filters */}
            <div className="flex-1 -mx-1 overflow-x-auto">
              <div className="flex gap-2 px-1 min-w-max">
                <button
                  onClick={() => setActiveCategory(null)}
                  className={[
                    "relative px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300",
                    activeCategory === null
                      ? "bg-neon text-black shadow-[0_0_20px_rgba(200,241,53,0.4)] scale-105"
                      : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10",
                  ].join(" ")}
                >
                  All
                </button>
                {categories.map((category) => {
                  const isActive = activeCategory === category.slug;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.slug)}
                      className={[
                        "relative px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300",
                        isActive
                          ? "bg-neon text-black shadow-[0_0_20px_rgba(200,241,53,0.4)] scale-105"
                          : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10",
                      ].join(" ")}
                    >
                      {category.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className="relative md:w-80 shrink-0">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search burgers, shawarma, drinks..."
                className="w-full rounded-full bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon/60 focus:bg-white/10 transition-all"
              />
            </div>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div>
              <EmptyState
                title={query.trim() ? `No results for "${query.trim()}"` : "Nothing matches"}
                description="Try another search, switch categories, or reset the menu to browse everything."
                icon="search"
              />
              <div className="-mt-12 flex justify-center">
                <button
                  onClick={() => {
                    setActiveCategory(null);
                    setQuery("");
                  }}
                  className="rounded-full bg-neon px-6 py-3 text-sm font-bold text-black transition-all duration-300 hover:shadow-[0_0_24px_rgba(200,241,53,0.5)] active:scale-95"
                >
                  Reset Menu
                </button>
              </div>
            </div>
          ) : (
            <div
              key={`${activeCategory ?? "all"}-${query}`}
              className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
            >
              {filtered.map((p, i) => (
                <ScrollReveal key={p.id} delay={Math.min(i * 45, 360)}>
                  <article
                    key={p.id}
                    className="group relative rounded-2xl bg-[#1A1A1A] border border-white/5 overflow-hidden flex flex-col hover:-translate-y-2 hover:border-neon/40 hover:shadow-[0_10px_40px_-10px_rgba(200,241,53,0.3)] transition-all duration-500 sm:rounded-3xl"
                  >
                    {/* Image placeholder */}
                    <div
                      className={`relative aspect-square w-full bg-gradient-to-br ${CATEGORY_GRADIENTS[p.category]} overflow-hidden`}
                    >
                      <img
                        src={p.image_url ?? CATEGORY_IMAGES[p.category]}
                        alt={p.name}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.5),transparent_55%),radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_60%)]" />
                      <div className="absolute inset-0 grid place-items-center mix-blend-overlay">
                        <span className="font-display text-3xl text-white/15 tracking-wider sm:text-7xl">
                          {p.category.split(" ")[0].toUpperCase()}
                        </span>
                      </div>
                      {p.badge && (
                        <span
                          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${BADGE_STYLES[p.badge] ?? "bg-neon text-black"}`}
                        >
                          {p.badge}
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-3 sm:p-5 flex flex-col gap-2 flex-1">
                      <span className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                        {p.category}
                      </span>
                      <h3 className="font-body text-sm font-bold text-foreground leading-tight sm:text-lg">
                        {p.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 sm:text-sm">
                        {p.description}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-display text-2xl text-neon sm:text-3xl">
                          {formatPrice(p.price)}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star size={14} className="fill-neon text-neon" />
                          <span className="font-semibold text-foreground">{p.rating}</span>
                          <span>({p.reviews})</span>
                        </div>
                      </div>

                      {/* Add to cart */}
                      <LoadingButton
                        isLoading={adding[p.id]}
                        onClick={() => handleAdd(p)}
                        className={[
                          "mt-4 w-full rounded-full py-3 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 sm:text-sm",
                          added[p.id]
                            ? "bg-emerald-500 text-black"
                            : "bg-neon text-black hover:shadow-[0_0_24px_rgba(200,241,53,0.55)] hover:scale-[1.02]",
                        ].join(" ")}
                      >
                        {added[p.id] ? (
                          <>
                            <Check size={16} strokeWidth={3} />
                            Added!
                          </>
                        ) : (
                          <>
                            Add to Cart
                            <Plus size={16} strokeWidth={3} />
                          </>
                        )}
                      </LoadingButton>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}
