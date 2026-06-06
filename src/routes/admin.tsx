import { createFileRoute, useNavigate } from "@tanstack/react-router";
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

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin — HOT B&B" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminPage,
});

type Section = "dashboard" | "orders" | "menu" | "add" | "customers" | "settings";

function AdminPage() {
  const [section, setSection] = useState<Section>("dashboard");
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Demo role gate: default to admin so dashboard is viewable.
    let role = localStorage.getItem("hotbb-role");
    if (!role) {
      role = "admin";
      localStorage.setItem("hotbb-role", "admin");
    }
    if (role !== "admin") {
      navigate({ to: "/" });
    } else {
      setAuthorized(true);
    }
  }, [navigate]);

  if (!authorized) return null;

  return (
    <div className="min-h-screen flex bg-[#111111] text-foreground">
      <Sidebar section={section} setSection={setSection} />
      <main className="flex-1 ml-[260px] min-h-screen">
        <TopBar section={section} />
        <div className="p-8">
          {section === "dashboard" && <Dashboard />}
          {section === "orders" && <Orders />}
          {section === "menu" && <MenuItems />}
          {section === "add" && <AddProduct />}
          {section === "customers" && <Customers />}
          {section === "settings" && <SettingsPanel />}
        </div>
      </main>
    </div>
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
  return (
    <aside className="fixed inset-y-0 left-0 w-[260px] bg-[#0D0D0D] border-r border-white/5 flex flex-col z-40">
      <div className="px-6 py-6 flex items-center gap-2 border-b border-white/5">
        <Flame size={18} className="text-neon" strokeWidth={2.5} />
        <span className="font-display text-xl tracking-wide text-neon leading-none">HOT B&B ADMIN</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map((n) => {
          const active = section === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setSection(n.id)}
              className={[
                "relative w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-white/[0.06] text-foreground"
                  : "text-foreground/60 hover:text-foreground hover:bg-white/[0.03]",
              ].join(" ")}
            >
              {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r bg-neon" />}
              <span className="text-base leading-none">{n.emoji}</span>
              <span>{n.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-10 w-10 rounded-full bg-neon text-black grid place-items-center font-bold">
            A
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">Admin User</p>
            <p className="text-xs text-foreground/50 truncate">admin@hotbb.in</p>
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem("hotbb-role");
            navigate({ to: "/" });
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
    <header className="h-16 px-8 border-b border-white/5 flex items-center justify-between bg-[#111111] sticky top-0 z-30">
      <div>
        <h1 className="font-display text-2xl tracking-wide leading-none">{titles[section]}</h1>
        <p className="text-xs text-foreground/40 mt-1">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="hidden md:flex items-center gap-2 text-xs text-foreground/50">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> System online
      </div>
    </header>
  );
}

/* ---------------- Dashboard ---------------- */

interface AdminOrder {
  id: string;
  customer: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: "Pending" | "Preparing" | "Ready" | "Delivered";
  time: string;
}

const SAMPLE_ORDERS: AdminOrder[] = [
  { id: "HOT-2024-1042", customer: "Aryan Mehra", items: [{ name: "Smash Double Burger", qty: 2, price: 349 }, { name: "Taro Bubble Tea", qty: 1, price: 199 }], total: 897, status: "Pending", time: "2 min ago" },
  { id: "HOT-2024-1041", customer: "Priya Sharma", items: [{ name: "Chicken Shawarma", qty: 1, price: 249 }], total: 249, status: "Preparing", time: "8 min ago" },
  { id: "HOT-2024-1040", customer: "Rohan Kapoor", items: [{ name: "Family Feast", qty: 1, price: 999 }], total: 999, status: "Ready", time: "12 min ago" },
  { id: "HOT-2024-1039", customer: "Neha Singh", items: [{ name: "Oreo Cold Coffee", qty: 2, price: 179 }], total: 358, status: "Delivered", time: "25 min ago" },
  { id: "HOT-2024-1038", customer: "Karan Patel", items: [{ name: "Classic Burger", qty: 1, price: 249 }, { name: "Cappuccino", qty: 1, price: 149 }], total: 398, status: "Delivered", time: "38 min ago" },
  { id: "HOT-2024-1037", customer: "Ishita Joshi", items: [{ name: "Mango Bubble Tea", qty: 3, price: 189 }], total: 567, status: "Preparing", time: "44 min ago" },
  { id: "HOT-2024-1036", customer: "Vikram Rao", items: [{ name: "Double Trouble", qty: 1, price: 749 }], total: 749, status: "Delivered", time: "1 hr ago" },
  { id: "HOT-2024-1035", customer: "Sanya Gupta", items: [{ name: "Veg Shawarma", qty: 2, price: 199 }], total: 398, status: "Pending", time: "1 hr ago" },
  { id: "HOT-2024-1034", customer: "Aditya Verma", items: [{ name: "Hazelnut Cold Coffee", qty: 1, price: 179 }], total: 179, status: "Delivered", time: "2 hr ago" },
  { id: "HOT-2024-1033", customer: "Meera Iyer", items: [{ name: "Burger + Bubble Tea Combo", qty: 1, price: 499 }], total: 499, status: "Ready", time: "2 hr ago" },
];

function Dashboard() {
  const stats = useMemo(() => {
    const today = SAMPLE_ORDERS.length;
    const revenue = SAMPLE_ORDERS.reduce((s, o) => s + o.total, 0);
    const pending = SAMPLE_ORDERS.filter((o) => o.status === "Pending").length;
    return { today, revenue, pending, menu: 28 };
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Today's Orders" value={stats.today.toString()} accent="text-neon" icon={<ShoppingBag size={18} />} trend="+12%" />
        <StatCard label="Revenue Today" value={`₹${stats.revenue.toLocaleString("en-IN")}`} accent="text-emerald-400" icon={<IndianRupee size={18} />} trend="+8%" />
        <StatCard label="Pending Orders" value={stats.pending.toString()} accent="text-amber-400" icon={<Clock size={18} />} trend="3 urgent" />
        <StatCard label="Menu Items" value={stats.menu.toString()} accent="text-blue-400" icon={<UtensilsCrossed size={18} />} trend="2 new" />
      </div>

      <Panel title="Recent Orders" subtitle="Latest 10 orders across all channels">
        <OrdersTable orders={SAMPLE_ORDERS} compact />
      </Panel>
    </div>
  );
}

function StatCard({ label, value, accent, icon, trend }: { label: string; value: string; accent: string; icon: React.ReactNode; trend: string }) {
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

function Panel({ title, subtitle, children, action }: { title: string; subtitle?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-[#161616] border border-white/5 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between gap-4">
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

const STATUS_STYLES: Record<AdminOrder["status"], string> = {
  Pending: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  Preparing: "bg-blue-400/10 text-blue-300 border-blue-400/20",
  Ready: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  Delivered: "bg-white/5 text-foreground/50 border-white/10",
};

function StatusBadge({ status }: { status: AdminOrder["status"] }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  );
}

function OrdersTable({ orders, compact, expandable }: { orders: AdminOrder[]; compact?: boolean; expandable?: boolean }) {
  const [data, setData] = useState(orders);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => setData(orders), [orders]);

  const setStatus = (id: string, status: AdminOrder["status"]) => {
    setData((d) => d.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div className="overflow-x-auto">
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
        <tbody>
          {data.map((o) => {
            const isOpen = openId === o.id;
            return (
              <>
                <tr
                  key={o.id}
                  onClick={() => expandable && setOpenId(isOpen ? null : o.id)}
                  className={`border-b border-white/5 transition-colors ${expandable ? "cursor-pointer" : ""} hover:bg-white/[0.03]`}
                >
                  <td className="px-6 py-4 font-mono text-xs text-neon">{o.id}</td>
                  <td className="px-6 py-4">{o.customer}</td>
                  <td className="px-6 py-4 text-foreground/70">
                    {o.items.reduce((s, i) => s + i.qty, 0)} item{o.items.length > 1 ? "s" : ""}
                  </td>
                  <td className="px-6 py-4 font-semibold">₹{o.total}</td>
                  <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                  <td className="px-6 py-4 text-foreground/50 text-xs">{o.time}</td>
                  <td className="px-6 py-4 text-right">
                    <StatusDropdown current={o.status} onChange={(s) => setStatus(o.id, s)} />
                  </td>
                </tr>
                {expandable && isOpen && (
                  <tr className="bg-black/30">
                    <td colSpan={7} className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wider text-foreground/40 mb-2">Items</p>
                        {o.items.map((it, i) => (
                          <div key={i} className="flex justify-between text-sm text-foreground/80">
                            <span>{it.name} × {it.qty}</span>
                            <span>₹{it.price * it.qty}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StatusDropdown({ current, onChange }: { current: AdminOrder["status"]; onChange: (s: AdminOrder["status"]) => void }) {
  const [open, setOpen] = useState(false);
  const opts: AdminOrder["status"][] = ["Pending", "Preparing", "Ready", "Delivered"];
  return (
    <div className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1.5 text-xs font-medium text-foreground/80 hover:bg-white/5"
      >
        Update <ChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-36 rounded-md border border-white/10 bg-[#1a1a1a] shadow-xl z-20 overflow-hidden">
          {opts.map((o) => (
            <button
              key={o}
              onClick={() => { onChange(o); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-white/5 ${o === current ? "text-neon" : "text-foreground/70"}`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Orders page ---------------- */

function Orders() {
  const [filter, setFilter] = useState<"All" | AdminOrder["status"]>("All");
  const [q, setQ] = useState("");

  const filtered = SAMPLE_ORDERS.filter((o) => {
    if (filter !== "All" && o.status !== filter) return false;
    if (q && !`${o.id} ${o.customer}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <Panel
      title="All Orders"
      subtitle={`${filtered.length} order${filtered.length === 1 ? "" : "s"} found`}
      action={
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
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
        {(["All", "Pending", "Preparing", "Ready", "Delivered"] as const).map((f) => (
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
            {f}
          </button>
        ))}
      </div>
      <OrdersTable orders={filtered} expandable />
    </Panel>
  );
}

/* ---------------- Menu Items ---------------- */

interface MenuRow {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  gradient: string;
}

const MENU_ROWS: MenuRow[] = [
  { id: "1", name: "Smash Double Burger", category: "Burgers", price: 349, available: true, gradient: "from-amber-500/40 to-red-600/40" },
  { id: "2", name: "Chicken Shawarma", category: "Shawarma", price: 249, available: true, gradient: "from-orange-500/40 to-yellow-600/40" },
  { id: "3", name: "Taro Bubble Tea", category: "Bubble Tea", price: 199, available: true, gradient: "from-purple-500/40 to-pink-500/40" },
  { id: "4", name: "Oreo Cold Coffee", category: "Cold Coffee", price: 179, available: false, gradient: "from-stone-700/40 to-amber-900/40" },
  { id: "5", name: "Cappuccino", category: "Coffee", price: 149, available: true, gradient: "from-amber-800/40 to-stone-700/40" },
  { id: "6", name: "Family Feast", category: "Combos", price: 999, available: true, gradient: "from-rose-500/40 to-fuchsia-600/40" },
  { id: "7", name: "Mango Bubble Tea", category: "Bubble Tea", price: 189, available: true, gradient: "from-yellow-400/40 to-orange-500/40" },
  { id: "8", name: "Veg Shawarma", category: "Shawarma", price: 199, available: true, gradient: "from-lime-500/40 to-emerald-600/40" },
];

function MenuItems() {
  const [rows, setRows] = useState(MENU_ROWS);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const toggle = (id: string) => setRows((r) => r.map((m) => (m.id === id ? { ...m, available: !m.available } : m)));
  const del = (id: string) => { setRows((r) => r.filter((m) => m.id !== id)); setConfirmId(null); };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {rows.map((m) => (
          <div key={m.id} className="rounded-2xl bg-[#161616] border border-white/5 overflow-hidden hover:border-white/10 transition-colors">
            <div className={`h-32 bg-gradient-to-br ${m.gradient} grid place-items-center`}>
              <span className="text-4xl">🍔</span>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{m.name}</h3>
                  <p className="text-xs text-foreground/50">{m.category}</p>
                </div>
                <span className="font-display text-xl text-neon">₹{m.price}</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Toggle checked={m.available} onChange={() => toggle(m.id)} />
                <div className="flex items-center gap-1">
                  <button className="grid h-8 w-8 place-items-center rounded-md hover:bg-white/5 text-foreground/60 hover:text-foreground">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setConfirmId(m.id)} className="grid h-8 w-8 place-items-center rounded-md hover:bg-red-500/10 text-red-400/80 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirmId && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#161616] border border-white/10 p-6">
            <h3 className="font-display text-2xl">Delete this item?</h3>
            <p className="mt-2 text-sm text-foreground/60">This action cannot be undone.</p>
            <div className="mt-5 flex gap-2 justify-end">
              <button onClick={() => setConfirmId(null)} className="rounded-md border border-white/10 px-4 py-2 text-xs font-semibold hover:bg-white/5">
                Cancel
              </button>
              <button onClick={() => del(confirmId)} className="rounded-md bg-red-500 hover:bg-red-600 px-4 py-2 text-xs font-semibold text-white">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label?: string }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <button
        type="button"
        onClick={onChange}
        className={`relative h-5 w-9 rounded-full transition-colors ${checked ? "bg-neon" : "bg-white/10"}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-black transition-transform ${checked ? "translate-x-[18px]" : "translate-x-0.5"}`} />
      </button>
      <span className="text-xs text-foreground/70">{label ?? (checked ? "Available" : "Unavailable")}</span>
    </label>
  );
}

/* ---------------- Add Product ---------------- */

function AddProduct() {
  const [form, setForm] = useState({ name: "", category: "Burgers", price: "", description: "", available: true, featured: false });
  const [image, setImage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleFile = (file: File) => {
    const r = new FileReader();
    r.onload = () => setImage(r.result as string);
    r.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl">
      <form
        onSubmit={(e) => { e.preventDefault(); setSaved(true); setTimeout(() => setSaved(false), 2400); }}
        className="rounded-2xl bg-[#161616] border border-white/5 p-6 md:p-8 space-y-5"
      >
        <Input label="Product Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Smash Double Burger" required />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={["Burgers", "Shawarma", "Bubble Tea", "Coffee", "Cold Coffee", "Combo"]} />
          <Input label="Price (₹)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} placeholder="349" required />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-foreground/50 mb-2">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="Juicy double patty smashed to perfection…"
            className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2 text-sm outline-none focus:border-neon"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-foreground/50 mb-2">Product Image</label>
          <label className="relative flex flex-col items-center justify-center h-44 rounded-xl border-2 border-dashed border-white/15 hover:border-neon/60 transition-colors cursor-pointer overflow-hidden">
            {image ? (
              <img src={image} alt="preview" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <>
                <Upload size={22} className="text-foreground/40" />
                <p className="mt-2 text-sm text-foreground/60">Click to upload image</p>
                <p className="text-xs text-foreground/40">PNG, JPG up to 5MB</p>
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          <Toggle checked={form.available} onChange={() => setForm({ ...form, available: !form.available })} label="Available" />
          <Toggle checked={form.featured} onChange={() => setForm({ ...form, featured: !form.featured })} label="Featured on homepage" />
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          {saved ? (
            <span className="text-sm text-emerald-400 font-semibold">✓ Added to menu</span>
          ) : (
            <span className="text-xs text-foreground/40">Item will appear in your live menu</span>
          )}
          <button className="rounded-full bg-neon px-6 py-3 text-sm font-bold text-black hover:shadow-[0_0_20px_rgba(200,241,53,0.4)] transition-all">
            Add to Menu
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder, required }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-foreground/50 mb-2">{label}</label>
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

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wider text-foreground/50 mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg bg-white/[0.04] border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-neon"
      >
        {options.map((o) => <option key={o} value={o} className="bg-[#161616]">{o}</option>)}
      </select>
    </div>
  );
}

/* ---------------- Customers / Settings (placeholders) ---------------- */

function Customers() {
  const data = [
    { name: "Aryan Mehra", email: "aryan@example.com", orders: 12, spent: 4280 },
    { name: "Priya Sharma", email: "priya@example.com", orders: 8, spent: 3120 },
    { name: "Rohan Kapoor", email: "rohan@example.com", orders: 21, spent: 9870 },
    { name: "Neha Singh", email: "neha@example.com", orders: 5, spent: 1450 },
  ];
  return (
    <Panel title="Customers" subtitle={`${data.length} active customers`}>
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
          {data.map((c) => (
            <tr key={c.email} className="border-b border-white/5 hover:bg-white/[0.03]">
              <td className="px-6 py-4 flex items-center gap-3">
                <span className="h-8 w-8 rounded-full bg-neon/20 text-neon grid place-items-center text-xs font-bold">{c.name[0]}</span>
                {c.name}
              </td>
              <td className="px-6 py-4 text-foreground/70">{c.email}</td>
              <td className="px-6 py-4">{c.orders}</td>
              <td className="px-6 py-4 font-semibold text-neon">₹{c.spent.toLocaleString("en-IN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}

function SettingsPanel() {
  return (
    <Panel title="Settings" subtitle="Store and account preferences">
      <div className="p-6 space-y-4 text-sm text-foreground/70">
        <p>Customize store hours, payment integrations, delivery zones and team access from here.</p>
        <p className="text-foreground/40">Settings module coming soon.</p>
      </div>
    </Panel>
  );
}
