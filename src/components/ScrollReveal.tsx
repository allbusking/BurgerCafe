import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px",
  });

  return (
    <div
      ref={ref}
      className={[
        "opacity-0",
        isVisible ? "animate-card-fade-up" : "",
        className,
      ].join(" ")}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
