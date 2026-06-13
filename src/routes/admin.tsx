import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  PlusCircle,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Search,
  ChevronDown,
  Pencil,
  Trash2,
  Upload,
  Flame,
  TrendingUp,
  Clock,
  IndianRupee,
} from "lucide-react";
import { LoadingButton } from "@/components/LoadingButton";
import { PageTransition } from "@/components/PageTransition";
import { useAuth } from "@/context/AuthContext";
import { useAdminCustomers } from "@/hooks/useAdminCustomers";
import { useAdminProducts, type ProductRecord } from "@/hooks/useAdminProducts";
import { useAdminOrders, type OrderRecord, type OrderStatus } from "@/hooks/useOrders";
import { useCategories } from "@/hooks/useProducts";
import { formatDate, formatPrice, getStatusColor, getStatusLabel } from "@/utils/formatPrice";
import { getProductImage } from "@/utils/productImages";
import supabase from "../lib/supabaseClient";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — HOT B&B" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminDashboard,
});

type Section = "dashboard" | "orders" | "menu" | "add" | "customers" | "settings";

export function AdminDashboard() {
  const [section, setSection] = useState<Section>("dashboard");
  const navigate = useNavigate();
  const { isAdmin, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading || !isAdmin) return null;

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-[#111111] text-foreground">
        <Sidebar section={section} setSection={setSection} />
        <main className="flex-1 min-h-screen pb-24 md:ml-[260px] md:pb-0">
          <TopBar section={section} />
          <div className="p-4 md:p-8">
            {section === "dashboard" && <Dashboard />}
            {section === "orders" && <Orders />}
            {section === "menu" && <MenuItems />}
            {section === "add" && <AddProduct />}
            {section === "customers" && <Customers />}
            {section === "settings" && <SettingsPanel />}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}

/* ---------------- Sidebar ---------------- */

const NAV: { id: Section; label: string; icon: typeof LayoutDashboard; emoji: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, emoji: "📊" },
  { id: "orders", label: "Orders", icon: ShoppingBag, emoji: "🛒" },
  { id: "menu", label: "Menu Items", icon: UtensilsCrossed, emoji: "🍔" },
  { id: "add", label: "Add Product", icon: PlusCircle, emoji: "➕" },
  { id: "customers", label: "Customers", icon: Users, emoji: "👥" },
  { id: "settings", label: "Settings", icon: SettingsIcon, emoji: "⚙️" },
];

function Sidebar({ section, setSection }: { section: Section; setSection: (s: Section) => void }) {
  const navigate = useNavigate();
  const { logout, profile, user } = useAuth();
  const adminName =
    profile?.full_name ||
    profile?.name ||
    (typeof user?.user_metadata?.full_name === "string" ? user.user_metadata.full_name : "") ||
    (typeof user?.user_metadata?.name === "string" ? user.user_metadata.name : "") ||
    user?.email?.split("@")[0] ||
    "Admin";
  const adminEmail = user?.email || profile?.email || "";
  const initials = adminName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <aside className="fixed inset-x-0 bottom-0 md:inset-y-0 md:left-0 md:w-[260px] bg-[#0D0D0D] border-t md:border-t-0 md:border-r border-white/5 flex flex-col z-40">
      <div className="hidden px-4 md:px-6 py-4 md:py-6 md:flex items-center gap-2 border-b border-white/5">
        <Flame size={18} className="text-neon" strokeWidth={2.5} />
        <span className="font-display text-xl tracking-wide text-neon leading-none">
          HOT B&B ADMIN
        </span>
      </div>

      <nav className="flex md:flex-1 gap-1 md:block px-2 md:px-3 py-2 md:py-4 md:space-y-1 overflow-x-auto md:overflow-y-auto">
        {NAV.map((n) => {
          const active = section === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setSection(n.id)}
              className={[
                "relative flex md:w-full shrink-0 flex-col md:flex-row items-center gap-1 md:gap-3 px-3 md:px-4 py-2.5 rounded-lg text-[10px] md:text-sm font-medium transition-all",
                active
                  ? "bg-white/[0.06] text-foreground"
                  : "text-foreground/60 hover:text-foreground hover:bg-white/[0.03]",
              ].join(" ")}
            >
              {active && (
                <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-neon" />
              )}
              <span className="text-base leading-none">{n.emoji}</span>
              <span className="whitespace-nowrap">{n.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="hidden md:block p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-neon text-black grid place-items-center font-bold">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{adminName}</p>
            <p className="text-xs text-foreground/50 truncate">{adminEmail}</p>
          </div>
        </div>
        <button
          onClick={async () => {
            await logout();
            navigate("/");
          }}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs font-semibold text-foreground/70 hover:text-foreground hover:bg-white/5 transition-colors"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function TopBar({ section }: { section: Section }) {
  const titles: Record<Section, string> = {
    dashboard: "Dashboard",
    orders: "Orders",
    menu: "Menu Items",
    add: "Add Product",
    customers: "Customers",
    settings: "Settings",
  };
  return (
    <header className="h-16 px-4 md:px-8 border-b border-white/5 flex items-center justify-between bg-[#111111] md:sticky md:top-0 z-30">
      <div>
        <h1 className="font-display text-2xl tracking-wide leading-none">{titles[section]}</h1>
        <p className="text-xs text-foreground/40 mt-1">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-2 text-xs text-foreground/50">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> System online
      </div>
    </header>
  );
}

/* ---------------- Dashboard ---------------- */

interface AdminOrder {
  id: string;
  orderId: string;
  customer: string;
  customerEmail: string;
  items: { name: string; qty: number; price: number }[];
  rawItems: unknown;
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  time: string;
  createdAt?: string;
  deliveryType: string;
  deliveryAddress?: string | null;
  estimatedTime?: unknown;
}

function normalizeOrder(order: OrderRecord): AdminOrder {
  const items = Array.isArray(order.items)
    ? (order.items as { name?: string; quantity?: number; qty?: number; price?: number }[])
    : [];

  return {
    id: order.order_number ?? order.id,
    orderId: order.id,
    customer: order.customer_name || order.customer_email || "Guest Customer",
    customerEmail: order.customer_email,
    items: items.map((item) => ({
      name: item.name ?? "Item",
      qty: item.quantity ?? item.qty ?? 1,
      price: Number(item.price ?? 0),
    })),
    rawItems: order.items,
    subtotal: Number(order.subtotal ?? 0),
    deliveryFee: Number(order.delivery_fee ?? 0),
    total: Number(order.total_amount ?? 0),
    status: order.status,
    time: order.created_at ? formatDate(order.created_at) : "",
    createdAt: order.created_at,
    deliveryType: order.delivery_type,
    deliveryAddress: order.delivery_address,
    estimatedTime: order.estimated_time,
  };
}

function getCategoryName(product: ProductRecord) {
  const category = product.categories as { name?: string } | null | undefined;
  return category?.name ?? "Uncategorized";
}

function getProductGradient(category: string) {
  if (category === "Shawarma") return "from-orange-500/40 to-yellow-600/40";
  if (category === "Bubble Tea") return "from-purple-500/40 to-pink-500/40";
  if (category === "Coffee" || category === "Cold Coffee")
    return "from-amber-800/40 to-stone-700/40";
  if (category === "Combos") return "from-rose-500/40 to-fuchsia-600/40";
  return "from-amber-500/40 to-red-600/40";
}

function Dashboard() {
  const { orders: rawOrders, loading, updateOrderStatus } = useAdminOrders();
  const { products } = useAdminProducts();
  const orders = useMemo(() => rawOrders.map(normalizeOrder), [rawOrders]);
  const stats = useMemo(() => {
    const todayKey = new Date().toDateString();
    const today = rawOrders.filter((order) =>
      order.created_at ? new Date(order.created_at).toDateString() === todayKey : false,
    ).length;
    const revenue = rawOrders.reduce((sum, order) => sum + Number(order.total_amount ?? 0), 0);
    const pending = rawOrders.filter((order) => order.status === "pending").length;
    return { today, revenue, pending, total: rawOrders.length };
  }, [rawOrders]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Today's Orders"
          value={stats.today.toString()}
          accent="text-neon"
          icon={<ShoppingBag size={18} />}
          trend="+12%"
        />
        <StatCard
          label="Revenue Today"
          value={formatPrice(stats.revenue)}
          accent="text-emerald-400"
          icon={<IndianRupee size={18} />}
          trend="+8%"
        />
        <StatCard
          label="Pending Orders"
          value={stats.pending.toString()}
          accent="text-amber-400"
          icon={<Clock size={18} />}
          trend="3 urgent"
        />
        <StatCard
          label="Total Orders"
          value={stats.total.toString()}
          accent="text-blue-400"
          icon={<UtensilsCrossed size={18} />}
          trend="all time"
        />
      </div>

      <Panel title="Recent Orders" subtitle="Latest 10 orders across all channels" allowOverflow>
        {orders.length === 0 && !loading ? (
          <div className="px-6 py-8 text-sm text-foreground/50">No orders yet</div>
        ) : (
          <OrdersTable orders={orders.slice(0, 10)} compact updateOrderStatus={updateOrderStatus} />
        )}
      </Panel>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
  icon,
  trend,
}: {
  label: string;
  value: string;
  accent: string;
  icon: React.ReactNode;
  trend: string;
}) {
  return (
    <div className="rounded-2xl bg-[#161616] border border-white/5 p-5 hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between text-foreground/50 text-xs">
        <span className="uppercase tracking-wider">{label}</span>
        <span className="grid place-items-center h-7 w-7 rounded-md bg-white/5">{icon}</span>
      </div>
      <p className={`mt-3 font-display text-4xl tracking-wide ${accent}`}>{value}</p>
      <p className="mt-2 text-xs text-foreground/50 flex items-center gap-1">
        <TrendingUp size={12} className="text-emerald-400" /> {trend} vs yesterday
      </p>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
  action,
  allowOverflow = false,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  allowOverflow?: boolean;
}) {
  return (
    <section
      className={`rounded-2xl bg-[#161616] border border-white/5 ${allowOverflow ? "overflow-visible" : "overflow-hidden"}`}
    >
      <div className="px-4 md:px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-semibold">{title}</h2>
          {subtitle && <p className="text-xs text-foreground/50 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div>{children}</div>
    </section>
  );
}

/* ---------------- Orders Table ---------------- */

function StatusBadge({ status }: { status: AdminOrder["status"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getStatusColor(status)}`}
    >
      {getStatusLabel(status)}
    </span>
  );
}

function OrdersTable({
  orders,
  compact,
  expandable,
  updateOrderStatus,
}: {
  orders: AdminOrder[];
  compact?: boolean;
  expandable?: boolean;
  updateOrderStatus?: (orderId: string, status: OrderStatus) => Promise<void>;
}) {
  const [data, setData] = useState(orders);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => setData(orders), [orders]);

  const setStatus = async (id: string, status: AdminOrder["status"]) => {
    setData((d) => d.map((o) => (o.id === id ? { ...o, status } : o)));
    const order = data.find((o) => o.id === id);
    if (order && updateOrderStatus) {
      try {
        await updateOrderStatus(order.orderId, status);
        try {
          await supabase.functions.invoke("send-order-email", {
            body: {
              to: order.customerEmail,
              customerName: order.customer,
              orderNumber: order.id,
              items: order.rawItems,
              subtotal: order.subtotal,
              deliveryFee: order.deliveryFee,
              total: order.total,
              deliveryType: order.deliveryType,
              address: order.deliveryAddress,
              estimatedTime: order.estimatedTime,
            },
          });
        } catch (emailError) {
          console.error("Failed to send order status email:", emailError);
        }
      } catch (error) {
        console.error("Failed to update order status:", error);
        setData(orders);
      }
    }
  };

  return (
    <div className="overflow-x-auto md:overflow-visible">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wider text-foreground/40 border-b border-white/5">
            <th className="px-6 py-3 font-medium">Order ID</th>
            <th className="px-6 py-3 font-medium">Customer</th>
            {!compact && <th className="px-6 py-3 font-medium">Items</th>}
            {compact && <th className="px-6 py-3 font-medium">Items</th>}
            <th className="px-6 py-3 font-medium">Total</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Time</th>
            <th className="px-6 py-3 font-medium text-right">Action</th>
          </tr>
        </thead>
        {data.map((o) => {
          const isOpen = openId === o.id;
          return (
            <tbody key={o.id}>
              <tr
                onClick={() => expandable && setOpenId(isOpen ? null : o.id)}
                className={`border-b border-white/5 transition-colors ${expandable ? "cursor-pointer" : ""} hover:bg-white/[0.03]`}
              >
                <td className="px-6 py-4 font-mono text-xs text-neon">{o.id}</td>
                <td className="px-6 py-4">{o.customer}</td>
                <td className="px-6 py-4 text-foreground/70">
                  {o.items.map((item) => `${item.name} x ${item.qty}`).join(", ")}
                </td>
                <td className="px-6 py-4 font-semibold">{formatPrice(o.total)}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-6 py-4 text-foreground/50 text-xs">{o.time}</td>
                <td className="px-6 py-4 text-right">
                  <StatusDropdown current={o.status} onChange={(s) => setStatus(o.id, s)} />
                </td>
              </tr>
              {expandable && isOpen && (
                <tr className="bg-black/30">
                  <td colSpan={7} className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-wider text-foreground/40 mb-2">
                        Items
                      </p>
                      {o.items.map((it, i) => (
                        <div key={i} className="flex justify-between text-sm text-foreground/80">
                          <span>
                            {it.name} × {it.qty}
                          </span>
                          <span>{formatPrice(it.price * it.qty)}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          );
        })}
      </table>
    </div>
  );
}

function StatusDropdown({
  current,
  onChange,
}: {
  current: AdminOrder["status"];
  onChange: (s: AdminOrder["status"]) => void;
}) {
  const [open, setOpen] = useState(false);
  const opts: AdminOrder["status"][] = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "delivered",
    "cancelled",
  ];
  return (
    <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1.5 text-xs font-medium text-foreground/80 hover:bg-white/5"
      >
        Update <ChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-[#1a1a1a] shadow-2xl shadow-black/40 z-50 overflow-hidden">
          {opts.map((o) => (
            <button
              key={o}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-white/5 ${o === current ? "text-neon" : "text-foreground/70"}`}
            >
              {getStatusLabel(o)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Orders page ---------------- */

function Orders() {
  const { orders: rawOrders, loading, updateOrderStatus } = useAdminOrders();
  const orders = useMemo(() => rawOrders.map(normalizeOrder), [rawOrders]);
  const [filter, setFilter] = useState<"All" | AdminOrder["status"]>("All");
  const [q, setQ] = useState("");

  const filtered = orders.filter((o) => {
    if (filter !== "All" && o.status !== filter) return false;
    if (q && !`${o.id} ${o.customer}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <Panel
      title="All Orders"
      subtitle={`${filtered.length} order${filtered.length === 1 ? "" : "s"} found`}
      allowOverflow
      action={
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search ID or customer…"
              className="w-64 rounded-md bg-white/5 border border-white/10 pl-9 pr-3 py-2 text-xs outline-none focus:border-neon"
            />
          </div>
        </div>
      }
    >
      <div className="px-6 pt-4 flex flex-wrap gap-2">
        {(["All", "pending", "confirmed", "preparing", "ready", "delivered", "cancelled"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={[
              "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
              filter === f
                ? "bg-neon text-black border-neon"
                : "border-white/10 text-foreground/70 hover:bg-white/5",
            ].join(" ")}
          >
            {f === "All" ? "All" : getStatusLabel(f)}
          </button>
        ))}
      </div>
      {filtered.length === 0 && !loading ? (
        <div className="px-6 py-8 text-sm text-foreground/50">No orders yet</div>
      ) : (
        <OrdersTable orders={filtered} expandable updateOrderStatus={updateOrderStatus} />
      )}
    </Panel>
  );
}

/* ---------------- Menu Items ---------------- */

function MenuItems() {
  const { products, loading, toggleAvailability, deleteProduct } = useAdminProducts();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const del = async (id: string) => {
    await deleteProduct(id);
    setConfirmId(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading &&
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl bg-[#161616] border border-white/5 overflow-hidden"
            >
              <div className="h-32 animate-pulse bg-white/10" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          ))}
        {!loading &&
          products.map((m) => {
            const category = getCategoryName(m);
            const imageUrl = getProductImage(m.id, category, m.image_url ?? undefined, m.name);
            return (
              <div
                key={m.id}
                className="rounded-2xl bg-[#161616] border border-white/5 overflow-hidden hover:border-white/10 transition-colors"
              >
                <div
                  className={`h-32 bg-gradient-to-br ${getProductGradient(category)} grid place-items-center overflow-hidden p-2`}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={m.name}
                      className="h-full w-full object-contain object-center"
                    />
                  ) : (
                    <span className="text-4xl">🍔</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">{m.name}</h3>
                      <p className="text-xs text-foreground/50">{category}</p>
                    </div>
                    <span className="font-display text-xl text-neon">{formatPrice(m.price)}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <Toggle
                      checked={m.is_available}
                      onChange={() => toggleAvailability(m.id, m.is_available).catch(console.error)}
                    />
                    <div className="flex items-center gap-1">
                      <button className="grid h-8 w-8 place-items-center rounded-md hover:bg-white/5 text-foreground/60 hover:text-foreground">
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setConfirmId(m.id)}
                        className="grid h-8 w-8 place-items-center rounded-md hover:bg-red-500/10 text-red-400/80 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {confirmId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#161616] border border-white/10 p-6">
            <h3 className="font-display text-2xl">Delete this item?</h3>
            <p className="mt-2 text-sm text-foreground/60">This action cannot be undone.</p>
            <div className="mt-5 flex gap-2 justify-end">
              <button
                onClick={() => setConfirmId(null)}
                className="rounded-md border border-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => del(confirmId)}
                className="rounded-md bg-red-500 hover:bg-red-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label?: string;
}) {
  return (
    <label className="inline-flex min-w-[124px] items-center gap-3 cursor-pointer">
      <button
        type="button"
        onClick={onChange}
        className={`relative h-5 w-10 shrink-0 rounded-full transition-colors ${checked ? "bg-neon" : "bg-white/10"}`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-black transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
      <span className="whitespace-nowrap text-xs text-foreground/70">
        {label ?? (checked ? "Available" : "Unavailable")}
      </span>
    </label>
  );
}

/* ---------------- Add Product ---------------- */

function AddProduct() {
  const { categories } = useCategories();
  const { addProduct, uploadProductImage } = useAdminProducts();
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    price: "",
    description: "",
    available: true,
    featured: false,
    bestseller: false,
    badge: "",
  });
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFile = (file: File) => {
    setImageFile(file);
    const r = new FileReader();
    r.onload = () => setImage(r.result as string);
    r.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            const imageUrl = imageFile ? await uploadProductImage(imageFile) : null;
            await addProduct({
              name: form.name,
              description: form.description,
              price: Number(form.price),
              category_id: form.categoryId || null,
              image_url: imageUrl,
              is_available: form.available,
              is_featured: form.featured,
              is_bestseller: form.bestseller,
              badge: form.badge || null,
            });
            setForm({
              name: "",
              categoryId: "",
              price: "",
              description: "",
              available: true,
              featured: false,
              bestseller: false,
              badge: "",
            });
            setImage(null);
            setImageFile(null);
            setSaving(false);
            setSaved(true);
            window.setTimeout(() => setSaved(false), 2400);
          } catch (error) {
            console.error("Failed to add product:", error);
            setSaving(false);
          }
        }}
        className="rounded-2xl bg-[#161616] border border-white/5 p-6 md:p-8 space-y-5"
      >
        <Input
          label="Product Name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
          placeholder="Smash Double Burger"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select
            label="Category"
            value={form.categoryId}
            onChange={(v) => setForm({ ...form, categoryId: v })}
            options={categories.map((category) => ({ label: category.name, value: category.id }))}
          />
          <Input
            label="Price (₹)"
            type="number"
            value={form.price}
            onChange={(v) => setForm({ ...form, price: v })}
            placeholder="349"
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-foreground/50 mb-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Juicy double patty smashed to perfection…"
            className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2 text-sm outline-none focus:border-neon"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-foreground/50 mb-2">
            Product Image
          </label>
          <label className="relative flex flex-col items-center justify-center h-44 rounded-xl border-2 border-dashed border-white/15 hover:border-neon/60 transition-colors cursor-pointer overflow-hidden">
            {image ? (
              <img
                src={image}
                alt="preview"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <>
                <Upload size={22} className="text-foreground/40" />
                <p className="mt-2 text-sm text-foreground/60">Click to upload image</p>
                <p className="text-xs text-foreground/40">PNG, JPG up to 5MB</p>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <Toggle
            checked={form.available}
            onChange={() => setForm({ ...form, available: !form.available })}
            label="Available"
          />
          <Toggle
            checked={form.featured}
            onChange={() => setForm({ ...form, featured: !form.featured })}
            label="Featured on homepage"
          />
          <Toggle
            checked={form.bestseller}
            onChange={() => setForm({ ...form, bestseller: !form.bestseller })}
            label="Bestseller"
          />
        </div>

        <Input
          label="Badge (optional)"
          value={form.badge}
          onChange={(v) => setForm({ ...form, badge: v })}
          placeholder="NEW"
        />

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          {saved ? (
            <span className="text-sm text-emerald-400 font-semibold">✓ Added to menu</span>
          ) : (
            <span className="text-xs text-foreground/40">Item will appear in your live menu</span>
          )}
          <LoadingButton
            isLoading={saving}
            className="rounded-full bg-neon px-6 py-3 text-sm font-bold text-black hover:shadow-[0_0_20px_rgba(200,241,53,0.4)] transition-all active:scale-95 disabled:opacity-70"
          >
            Add to Menu
          </LoadingButton>
        </div>
      </form>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-foreground/50 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-neon"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-foreground/50 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-neon"
      >
        <option value="" className="bg-[#161616]">
          Select category
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-[#161616]">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------------- Customers / Settings (placeholders) ---------------- */

function Customers() {
  const { customers, loading } = useAdminCustomers();
  return (
    <Panel title="Customers" subtitle={`${customers.length} active customers`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-foreground/40 border-b border-white/5">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Orders</th>
              <th className="px-6 py-3 font-medium">Lifetime Value</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="px-6 py-4">
                    <div className="h-4 w-40 animate-pulse rounded bg-white/10" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-52 animate-pulse rounded bg-white/10" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-10 animate-pulse rounded bg-white/10" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
                  </td>
                </tr>
              ))}
            {!loading &&
              customers.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <span className="h-8 w-8 rounded-full bg-neon/20 text-neon grid place-items-center text-xs font-bold">
                      {c.name[0]}
                    </span>
                    {c.name}
                  </td>
                  <td className="px-6 py-4 text-foreground/70">{c.email}</td>
                  <td className="px-6 py-4">{c.orders}</td>
                  <td className="px-6 py-4 font-semibold text-neon">{formatPrice(c.spent)}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function SettingsPanel() {
  return (
    <Panel title="Settings" subtitle="Store and account preferences">
      <div className="p-6 space-y-4 text-sm text-foreground/70">
        <p>
          Customize store hours, payment integrations, delivery zones and team access from here.
        </p>
        <p className="text-foreground/40">Settings module coming soon.</p>
      </div>
    </Panel>
  );
}
