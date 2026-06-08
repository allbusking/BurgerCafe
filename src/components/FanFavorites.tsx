import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Star } from "lucide-react";
import { useCartContext } from "@/context/CartContext";
import { LoadingButton } from "@/components/LoadingButton";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useToast } from "@/context/ToastContext";
import smashBurgerImg from "@/assets/product-smash-burger.jpg";
import shawarmaImg from "@/assets/product-shawarma.jpg";
import taroBobaImg from "@/assets/product-taro-boba.jpg";
import beefShawarmaImg from "@/assets/product-beef-shawarma.jpg";
import oreoCoffeeImg from "@/assets/product-oreo-coffee.jpg";
import towerBurgerImg from "@/assets/product-tower-burger.jpg";

const products = [
  {
    id: "b1",
    name: "Smash Double Burger",
    price: 349,
    category: "Burgers",
    rating: 4.9,
    badge: "BESTSELLER",
    image: smashBurgerImg,
    gradient: "linear-gradient(135deg, #2a1a0a 0%, #0a0a0a 100%)",
  },
  {
    id: "s1",
    name: "Classic Chicken Shawarma",
    price: 249,
    category: "Shawarma",
    rating: 4.8,
    badge: "BESTSELLER",
    image: shawarmaImg,
    gradient: "linear-gradient(135deg, #2a1a05 0%, #0a0a0a 100%)",
  },
  {
    id: "t1",
    name: "Taro Bubble Tea",
    price: 199,
    category: "Bubble Tea",
    rating: 4.7,
    badge: "NEW",
    image: taroBobaImg,
    gradient: "linear-gradient(135deg, #1a0a2a 0%, #0a0a0a 100%)",
  },
  {
    id: "s2",
    name: "Beef Cheese Shawarma",
    price: 289,
    category: "Shawarma",
    rating: 4.8,
    badge: "BESTSELLER",
    image: beefShawarmaImg,
    gradient: "linear-gradient(135deg, #2a1505 0%, #0a0a0a 100%)",
  },
  {
    id: "cc1",
    name: "Oreo Cold Coffee",
    price: 179,
    category: "Coffee",
    rating: 4.9,
    badge: "NEW",
    image: oreoCoffeeImg,
    gradient: "linear-gradient(135deg, #1a1208 0%, #0a0a0a 100%)",
  },
  {
    id: "b2",
    name: "Tower Burger",
    price: 399,
    category: "Burgers",
    rating: 4.9,
    badge: "BESTSELLER",
    image: towerBurgerImg,
    gradient: "linear-gradient(135deg, #2a1a0a 0%, #0a0a0a 100%)",
  },
];

export function FanFavorites() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [adding, setAdding] = useState<Record<string, boolean>>({});
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const { addItem } = useCartContext();
  const { showToast } = useToast();

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 340;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 350);
  };

  const handleAdd = (product: (typeof products)[number]) => {
    setAdding((s) => ({ ...s, [product.id]: true }));
    addItem({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
    });
    showToast("Item added to cart! 🍔", "success");
    window.setTimeout(() => {
      setAdding((s) => ({ ...s, [product.id]: false }));
      setAdded((s) => ({ ...s, [product.id]: true }));
      window.setTimeout(() => setAdded((s) => ({ ...s, [product.id]: false })), 1200);
    }, 300);
  };

  return (
    <section id="full-menu" className="relative w-full bg-background py-24 md:py-32">
      <div
        className="pointer-events-none absolute left-0 right-0 top-px z-0 -translate-y-full leading-[0]"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          className="h-16 w-full md:h-24"
        >
          <path
            d="M0 38C96 55 188 62 292 53C426 42 548 12 684 27C815 42 905 68 1076 58C1211 50 1322 38 1440 50V90H0V38Z"
            fill="var(--background)"
          />
        </svg>
      </div>
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 translate-y-px leading-[0]"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          className="h-16 w-full md:h-24"
        >
          <path
            d="M0 48C120 35 229 43 356 52C520 64 624 78 773 49C911 23 1030 33 1162 49C1265 62 1357 58 1440 42V90H0V48Z"
            fill="var(--cream)"
          />
        </svg>
      </div>
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute -left-32 top-1/3 h-[400px] w-[400px] rounded-full opacity-[0.07] blur-[120px]"
        style={{ backgroundColor: "#C8F135" }}
      />
      <div
        className="pointer-events-none absolute -right-32 bottom-1/3 h-[300px] w-[300px] rounded-full opacity-[0.05] blur-[100px]"
        style={{ backgroundColor: "#FF6B00" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4">
        {/* Section label */}
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full bg-neon px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-background">
            THE CLASSICS
          </span>
        </div>

        {/* Heading + arrows */}
        <div className="mb-12 flex items-end justify-between">
          <h2 className="font-display text-[14vw] leading-[0.9] text-cream sm:text-[10vw] md:text-[80px] lg:text-[100px]">
            FAN FAVORITES
          </h2>

          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream transition-all duration-300 hover:border-neon hover:text-neon disabled:cursor-not-allowed disabled:opacity-20"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream transition-all duration-300 hover:border-neon hover:text-neon disabled:cursor-not-allowed disabled:opacity-20"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Product scroll row */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product, index) => (
            <ScrollReveal
              key={product.id}
              className="shrink-0 snap-start"
              delay={Math.min(index * 60, 300)}
            >
            <div
              className="group relative flex w-[280px] flex-col overflow-hidden rounded-2xl bg-[#1A1A1A] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(200,241,53,0.15)] sm:w-[300px]"
            >
              {/* Hover glow border */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    boxShadow: "inset 0 0 0 1.5px rgba(200,241,53,0.25)",
                  }}
                />
              </div>

              {/* Image area */}
              <div
                className="relative h-[250px] w-full overflow-hidden [mask-image:linear-gradient(to_bottom,black_0%,black_78%,transparent_100%)] sm:h-[280px]"
                style={{ background: product.gradient }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 opacity-45 mix-blend-multiply"
                  style={{ background: product.gradient }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_22%,rgba(255,255,255,0.2),transparent_34%),linear-gradient(to_top,rgba(0,0,0,0.45),transparent_55%)]" />

                {/* Badge */}
                <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-neon px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-background">
                  {product.badge}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-1 flex-col p-5">
                <span className="mb-1.5 text-[11px] font-medium uppercase tracking-wider text-cream/40">
                  {product.category}
                </span>

                <h3 className="mb-2 text-base font-bold leading-tight text-cream sm:text-lg">
                  {product.name}
                </h3>

                <div className="mb-4 flex items-center gap-1.5">
                  <span className="text-lg font-extrabold text-neon">
                    ₹{product.price}
                  </span>
                  <span className="mx-1.5 h-3 w-px bg-cream/15" />
                  <Star className="h-3.5 w-3.5 fill-amber-glow text-amber-glow" />
                  <span className="text-[13px] font-semibold text-cream/70">
                    {product.rating}
                  </span>
                </div>

                {/* Add to Cart button */}
                <LoadingButton
                  isLoading={adding[product.id]}
                  onClick={() => handleAdd(product)}
                  className={[
                    "mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-extrabold uppercase tracking-wider text-background transition-all duration-300 hover:shadow-[0_0_20px_rgba(200,241,53,0.4)] hover:scale-[1.02] active:scale-[0.98]",
                    added[product.id] ? "bg-emerald-500" : "bg-neon",
                  ].join(" ")}
                >
                  {added[product.id] ? "Added" : "Add to Cart"}
                  <Plus className="h-4 w-4" strokeWidth={3} />
                </LoadingButton>
              </div>
            </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
