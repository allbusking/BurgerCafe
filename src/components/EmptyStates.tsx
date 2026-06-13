import { Link } from "react-router-dom";
import { ShoppingBag, Search, Package } from "lucide-react";

type AppRoute =
  | "/"
  | "/menu"
  | "/cart"
  | "/checkout"
  | "/auth"
  | "/order-confirmation"
  | "/admin";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "cart" | "search" | "package";
  action?: {
    label: string;
    href: AppRoute;
  };
}

function getIcon(type?: string) {
  switch (type) {
    case "search":
      return <Search size={64} className="text-muted-foreground" />;
    case "package":
      return <Package size={64} className="text-muted-foreground" />;
    case "cart":
    default:
      return <ShoppingBag size={64} className="text-muted-foreground" />;
  }
}

export function EmptyState({
  title,
  description,
  icon = "cart",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4">
      <div className="grid h-24 w-24 md:h-32 md:w-32 place-items-center rounded-full bg-white/5 border border-white/10 mb-6 animate-float">
        {getIcon(icon)}
      </div>
      
      <h2 className="font-display text-3xl md:text-5xl text-center text-foreground mb-3">
        {title}
      </h2>
      
      <p className="text-sm md:text-base text-muted-foreground text-center max-w-sm mb-8">
        {description}
      </p>

      {action && (
        <Link
          to={action.href}
          className="inline-flex items-center rounded-full bg-neon px-6 md:px-8 py-3 md:py-4 text-sm md:text-base font-bold text-black transition-all duration-300 hover:shadow-[0_0_24px_rgba(200,241,53,0.5)] hover:scale-105 active:scale-95"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

export function EmptyCart() {
  return (
    <EmptyState
      title="Your cart is empty"
      description="Looks like you haven't added anything yet. Time to fix that with something delicious!"
      icon="cart"
      action={{
        label: "Start Ordering",
        href: "/menu",
      }}
    />
  );
}

export function NoSearchResults({ query }: { query: string }) {
  return (
    <EmptyState
      title={`No results for "${query}"`}
      description="Try a different search term or browse our full menu to find what you're looking for."
      icon="search"
      action={{
        label: "View Full Menu",
        href: "/menu",
      }}
    />
  );
}

export function OrderNotFound() {
  return (
    <EmptyState
      title="Order not found"
      description="We couldn't find the order you're looking for. Please check the order ID and try again."
      icon="package"
      action={{
        label: "View Menu",
        href: "/menu",
      }}
    />
  );
}

export function NotAuthorized() {
  return (
    <EmptyState
      title="Access Denied"
      description="You don't have permission to access this page. Please sign in to continue."
      icon="package"
      action={{
        label: "Sign In",
        href: "/auth",
      }}
    />
  );
}
