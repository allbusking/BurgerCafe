import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Star, Check, Plus } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCartContext } from "@/context/CartContext";
import { EmptyState } from "@/components/EmptyStates";
import { LoadingButton } from "@/components/LoadingButton";
import { PageTransition } from "@/components/PageTransition";
import { ProductCardSkeleton } from "@/components/SkeletonLoaders";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useToast } from "@/context/ToastContext";
import categoryBurgerImg from "@/assets/category-burger.jpg";
import categoryBubbleTeaImg from "@/assets/category-bubbletea.jpg";
import categoryCoffeeImg from "@/assets/category-coffee.jpg";
import categoryShawarmaImg from "@/assets/category-shawarma.jpg";
import productBeefShawarmaImg from "@/assets/product-beef-shawarma.jpg";
import productOreoCoffeeImg from "@/assets/product-oreo-coffee.jpg";
import productShawarmaImg from "@/assets/product-shawarma.jpg";
import productSmashBurgerImg from "@/assets/product-smash-burger.jpg";
import productTaroBobaImg from "@/assets/product-taro-boba.jpg";
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

type Category =
  | "Burgers"
  | "Shawarma"
  | "Bubble Tea"
  | "Coffee"
  | "Cold Coffee"
  | "Combos";

type Badge = "BESTSELLER" | "NEW" | "SPICY 🌶️" | null;

interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  description: string;
  rating: number;
  reviews: number;
  badge: Badge;
  image?: string;
}

const CATEGORY_GRADIENTS: Record<Category, string> = {
  Burgers: "from-orange-600 via-red-700 to-amber-900",
  Shawarma: "from-amber-600 via-orange-700 to-yellow-900",
  "Bubble Tea": "from-pink-500 via-fuchsia-600 to-purple-800",
  Coffee: "from-amber-900 via-stone-800 to-neutral-900",
  "Cold Coffee": "from-stone-700 via-amber-800 to-neutral-900",
  Combos: "from-lime-500 via-emerald-600 to-teal-800",
};

const CATEGORY_IMAGES: Record<Category, string> = {
  Burgers: categoryBurgerImg,
  Shawarma: categoryShawarmaImg,
  "Bubble Tea": categoryBubbleTeaImg,
  Coffee: categoryCoffeeImg,
  "Cold Coffee": productOreoCoffeeImg,
  Combos: productTowerBurgerImg,
};

const PRODUCTS: Product[] = [
  // Burgers
  { id: "b1", name: "Smash Double Burger", price: 349, category: "Burgers", description: "Two smashed patties, melted cheese, secret sauce.", rating: 4.9, reviews: 412, badge: "BESTSELLER", image: productSmashBurgerImg },
  { id: "b2", name: "Tower Burger", price: 399, category: "Burgers", description: "Triple-stack legend. Built to topple hunger.", rating: 4.8, reviews: 287, badge: "BESTSELLER", image: productTowerBurgerImg },
  { id: "b3", name: "Crispy Chicken Burger", price: 299, category: "Burgers", description: "Buttermilk-fried chicken, slaw, pickles.", rating: 4.7, reviews: 198, badge: null, image: categoryBurgerImg },
  { id: "b4", name: "BBQ Bacon Burger", price: 379, category: "Burgers", description: "Smoky BBQ glaze, crispy bacon, cheddar.", rating: 4.8, reviews: 156, badge: "NEW", image: productSmashBurgerImg },
  { id: "b5", name: "Mushroom Swiss Burger", price: 329, category: "Burgers", description: "Sautéed mushrooms, Swiss cheese, truffle aioli.", rating: 4.6, reviews: 122, badge: null, image: categoryBurgerImg },
  { id: "b6", name: "Spicy Jalapeño Burger", price: 319, category: "Burgers", description: "Pickled jalapeños, pepper jack, chipotle mayo.", rating: 4.7, reviews: 143, badge: "SPICY 🌶️", image: productTowerBurgerImg },

  // Shawarma
  { id: "s1", name: "Classic Chicken Shawarma", price: 249, category: "Shawarma", description: "Marinated chicken, garlic sauce, fresh wrap.", rating: 4.8, reviews: 356, badge: "BESTSELLER", image: productShawarmaImg },
  { id: "s2", name: "Beef Cheese Shawarma", price: 289, category: "Shawarma", description: "Slow-cooked beef with melted cheese inside.", rating: 4.7, reviews: 189, badge: null, image: productBeefShawarmaImg },
  { id: "s3", name: "Garlic Chicken Shawarma", price: 269, category: "Shawarma", description: "Loaded with creamy garlic toum.", rating: 4.8, reviews: 211, badge: null, image: categoryShawarmaImg },
  { id: "s4", name: "Double Meat Shawarma", price: 319, category: "Shawarma", description: "Twice the meat. Same hand-rolled magic.", rating: 4.9, reviews: 178, badge: "NEW", image: productBeefShawarmaImg },

  // Bubble Tea
  { id: "t1", name: "Taro Bubble Tea", price: 199, category: "Bubble Tea", description: "Creamy taro with chewy tapioca pearls.", rating: 4.9, reviews: 504, badge: "BESTSELLER", image: productTaroBobaImg },
  { id: "t2", name: "Brown Sugar Milk Tea", price: 189, category: "Bubble Tea", description: "Caramelized brown sugar syrup, milk, pearls.", rating: 4.8, reviews: 421, badge: "BESTSELLER", image: categoryBubbleTeaImg },
  { id: "t3", name: "Matcha Latte", price: 209, category: "Bubble Tea", description: "Ceremonial matcha whisked with creamy milk.", rating: 4.7, reviews: 267, badge: null, image: productTaroBobaImg },
  { id: "t4", name: "Strawberry Burst", price: 179, category: "Bubble Tea", description: "Real strawberries, popping boba bursts.", rating: 4.6, reviews: 198, badge: null, image: categoryBubbleTeaImg },
  { id: "t5", name: "Thai Milk Tea", price: 189, category: "Bubble Tea", description: "Classic Thai tea blend, condensed milk.", rating: 4.7, reviews: 223, badge: null, image: productTaroBobaImg },
  { id: "t6", name: "Mango Passion", price: 195, category: "Bubble Tea", description: "Tropical mango & passionfruit explosion.", rating: 4.8, reviews: 187, badge: "NEW", image: categoryBubbleTeaImg },

  // Coffee
  { id: "c1", name: "Espresso", price: 99, category: "Coffee", description: "Bold double shot. Pure intensity.", rating: 4.7, reviews: 134, badge: null, image: categoryCoffeeImg },
  { id: "c2", name: "Cappuccino", price: 149, category: "Coffee", description: "Velvety microfoam over espresso.", rating: 4.8, reviews: 298, badge: null, image: categoryCoffeeImg },
  { id: "c3", name: "Flat White", price: 159, category: "Coffee", description: "Silky milk, double ristretto base.", rating: 4.8, reviews: 187, badge: null, image: productOreoCoffeeImg },
  { id: "c4", name: "Americano", price: 119, category: "Coffee", description: "Espresso lengthened with hot water.", rating: 4.6, reviews: 112, badge: null, image: categoryCoffeeImg },

  // Cold Coffee
  { id: "cc1", name: "Oreo Cold Coffee", price: 179, category: "Cold Coffee", description: "Oreo crumble blended with cold brew.", rating: 4.9, reviews: 389, badge: "BESTSELLER", image: productOreoCoffeeImg },
  { id: "cc2", name: "Caramel Cold Coffee", price: 169, category: "Cold Coffee", description: "Buttery caramel meets bold cold brew.", rating: 4.7, reviews: 234, badge: null, image: productOreoCoffeeImg },
  { id: "cc3", name: "Hazelnut Cold Coffee", price: 179, category: "Cold Coffee", description: "Nutty hazelnut syrup, ice-cold finish.", rating: 4.8, reviews: 198, badge: null, image: categoryCoffeeImg },
  { id: "cc4", name: "Classic Cold Coffee", price: 149, category: "Cold Coffee", description: "Our OG iced coffee. Always reliable.", rating: 4.7, reviews: 312, badge: null, image: productOreoCoffeeImg },

  // Combos
  { id: "co1", name: "Burger + Bubble Tea Combo", price: 499, category: "Combos", description: "Any burger paired with any bubble tea.", rating: 4.9, reviews: 267, badge: "BESTSELLER", image: productSmashBurgerImg },
  { id: "co2", name: "Shawarma + Cold Coffee Combo", price: 399, category: "Combos", description: "Shawarma + any cold coffee. Sorted.", rating: 4.8, reviews: 189, badge: null, image: productShawarmaImg },
  { id: "co3", name: "Double Trouble", price: 749, category: "Combos", description: "2 burgers + 2 drinks. For two.", rating: 4.9, reviews: 156, badge: "NEW", image: productTowerBurgerImg },
  { id: "co4", name: "Family Feast", price: 999, category: "Combos", description: "4 items, endless joy. Feed the crew.", rating: 4.9, reviews: 134, badge: "NEW", image: categoryBurgerImg },
];

const FILTERS: Array<"All" | Category> = [
  "All",
  "Burgers",
  "Shawarma",
  "Bubble Tea",
  "Coffee",
  "Cold Coffee",
  "Combos",
];

const BADGE_STYLES: Record<Exclude<Badge, null>, string> = {
  BESTSELLER: "bg-neon text-black",
  NEW: "bg-amber-glow text-black",
  "SPICY 🌶️": "bg-red-600 text-white",
};

function MenuPage() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState<Record<string, boolean>>({});
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const { addItem } = useCartContext();
  const { showToast } = useToast();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter((p) => {
      const matchCat = active === "All" || p.category === active;
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [active, query]);

  useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => setLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, [active, query]);

  const handleAdd = (p: Product) => {
    setAdding((s) => ({ ...s, [p.id]: true }));
    addItem({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.price,
      image: p.image ?? CATEGORY_IMAGES[p.category],
    });
    showToast("Item added to cart! 🍔", "success");
    window.setTimeout(() => {
      setAdding((s) => ({ ...s, [p.id]: false }));
      setAdded((s) => ({ ...s, [p.id]: true }));
      window.setTimeout(() => setAdded((s) => ({ ...s, [p.id]: false })), 1200);
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
              {FILTERS.map((f) => {
                const isActive = active === f;
                return (
                  <button
                    key={f}
                    onClick={() => setActive(f)}
                    className={[
                      "relative px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300",
                      isActive
                        ? "bg-neon text-black shadow-[0_0_20px_rgba(200,241,53,0.4)] scale-105"
                        : "bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10",
                    ].join(" ")}
                  >
                    {f}
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
                  setActive("All");
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
            key={`${active}-${query}`}
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
                    src={p.image ?? CATEGORY_IMAGES[p.category]}
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
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider ${BADGE_STYLES[p.badge]}`}
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
                      ₹{p.price}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star size={14} className="fill-neon text-neon" />
                      <span className="font-semibold text-foreground">
                        {p.rating}
                      </span>
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
