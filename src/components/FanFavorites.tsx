import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Star } from "lucide-react";
import smashBurgerImg from "@/assets/product-smash-burger.jpg";
import shawarmaImg from "@/assets/product-shawarma.jpg";
import taroBobaImg from "@/assets/product-taro-boba.jpg";
import beefShawarmaImg from "@/assets/product-beef-shawarma.jpg";
import oreoCoffeeImg from "@/assets/product-oreo-coffee.jpg";
import towerBurgerImg from "@/assets/product-tower-burger.jpg";

const products = [
  {
    id: 1,
    name: "Smash Double Burger",
    price: 349,
    category: "Burger",
    rating: 4.9,
    badge: "BESTSELLER",
    image: smashBurgerImg,
    gradient: "linear-gradient(135deg, #2a1a0a 0%, #0a0a0a 100%)",
  },
  {
    id: 2,
    name: "Classic Chicken Shawarma",
    price: 249,
    category: "Shawarma",
    rating: 4.8,
    badge: "BESTSELLER",
    image: shawarmaImg,
    gradient: "linear-gradient(135deg, #2a1a05 0%, #0a0a0a 100%)",
  },
  {
    id: 3,
    name: "Taro Bubble Tea",
    price: 199,
    category: "Bubble Tea",
    rating: 4.7,
    badge: "NEW",
    image: taroBobaImg,
    gradient: "linear-gradient(135deg, #1a0a2a 0%, #0a0a0a 100%)",
  },
  {
    id: 4,
    name: "Beef Cheese Shawarma",
    price: 289,
    category: "Shawarma",
    rating: 4.8,
    badge: "BESTSELLER",
    image: beefShawarmaImg,
    gradient: "linear-gradient(135deg, #2a1505 0%, #0a0a0a 100%)",
  },
  {
    id: 5,
    name: "Oreo Cold Coffee",
    price: 179,
    category: "Coffee",
    rating: 4.9,
    badge: "NEW",
    image: oreoCoffeeImg,
    gradient: "linear-gradient(135deg, #1a1208 0%, #0a0a0a 100%)",
  },
  {
    id: 6,
    name: "Tower Burger",
    price: 399,
    category: "Burger",
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

  return (
    <section id="full-menu" className="relative w-full bg-background py-24 md:py-32">
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
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-[#1A1A1A] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(200,241,53,0.15)] sm:w-[300px]"
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
                className="relative flex h-[240px] w-full items-center justify-center overflow-hidden sm:h-[260px]"
                style={{ background: product.gradient }}
              >
                {/* Badge */}
                <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full bg-neon px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-background">
                  {product.badge}
                </span>

                <img
                  src={product.image}
                  alt={product.name}
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="h-[85%] w-[85%] object-contain transition-transform duration-700 group-hover:scale-110"
                />
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
                <button className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-neon py-3 text-sm font-extrabold uppercase tracking-wider text-background transition-all duration-300 hover:shadow-[0_0_20px_rgba(200,241,53,0.4)] hover:scale-[1.02] active:scale-[0.98]">
                  Add to Cart
                  <Plus className="h-4 w-4" strokeWidth={3} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
