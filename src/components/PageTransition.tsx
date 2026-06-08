export function PageTransition({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-fade-in">{children}</div>;
}
