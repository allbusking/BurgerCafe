export function MarqueeStrip() {
  const items = [
    "BURGERS 🍔",
    "SHAWARMA 🌯",
    "BUBBLE TEA 🧋",
    "COLD COFFEE ☕",
    "COMBOS 🔥",
    "FREE DELIVERY 🚀",
    "ORDER NOW ⚡",
  ];

  const text = items.join("  •  ");

  return (
    <div className="w-full overflow-hidden bg-neon py-4 md:py-5">
      <div className="animate-marquee flex whitespace-nowrap">
        {/* Repeat the text multiple times for seamless loop */}
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="font-display px-4 text-[8vw] leading-none tracking-wider text-background sm:text-[6vw] md:text-[48px] lg:text-[56px]"
          >
            {text}  •  {""}
          </span>
        ))}
      </div>
    </div>
  );
}
