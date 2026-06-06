import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Lock, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  cartStore,
  computeTotals,
  useCart,
  useDeliveryMode,
} from "@/lib/cart-store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — House of Tea" },
      { name: "description", content: "Complete your order securely." },
    ],
  }),
  component: CheckoutPage,
});

const baseSchema = {
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s-]{7,15}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(255),
  instructions: z.string().trim().max(500).optional().or(z.literal("")),
};

const deliverySchema = z.object({
  ...baseSchema,
  address: z
    .string()
    .trim()
    .min(10, "Please enter a full delivery address")
    .max(500),
});
const pickupSchema = z.object({
  ...baseSchema,
  address: z.string().optional().or(z.literal("")),
});

type FormState = {
  name: string;
  phone: string;
  email: string;
  address: string;
  instructions: string;
};

function CheckoutPage() {
  const items = useCart();
  const mode = useDeliveryMode();
  const totals = computeTotals(items, mode);
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    address: "",
    instructions: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 grid place-items-center pt-32 pb-16 text-center px-4">
          <div>
            <h1 className="font-display text-5xl">NOTHING TO CHECK OUT</h1>
            <p className="mt-2 text-muted-foreground">
              Your cart is empty.
            </p>
            <Link
              to="/menu"
              className="mt-6 inline-flex rounded-full bg-neon px-6 py-3 text-sm font-bold text-black"
            >
              Browse Menu
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const schema = mode === "Delivery" ? deliverySchema : pickupSchema;
    const result = schema.safeParse(form);
    if (!result.success) {
      const errs: Partial<Record<keyof FormState, string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof FormState;
        if (!errs[k]) errs[k] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const orderId = `HOT-2024-${String(Math.floor(1000 + Math.random() * 9000))}`;
      const order = {
        id: orderId,
        items: items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
        total: totals.total,
        address: mode === "Delivery" ? form.address : undefined,
        mode,
        createdAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem("hotbb-last-order", JSON.stringify(order));
      } catch {}
      cartStore.clear();
      navigate({ to: "/order-confirmation" });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 md:pt-36 pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="font-display text-5xl md:text-7xl tracking-tight">
            ALMOST THERE 🚀
          </h1>
          <p className="mt-3 text-muted-foreground">
            Just a few details and we'll start cooking.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-8"
            noValidate
          >
            {/* Form */}
            <div className="lg:col-span-3 space-y-5">
              <Field
                label="Full Name"
                value={form.name}
                onChange={(v) => set("name", v)}
                error={errors.name}
                placeholder="Aryan Mehra"
              />
              <Field
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={(v) => set("phone", v)}
                error={errors.phone}
                placeholder="+91 98765 43210"
              />
              <Field
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(v) => set("email", v)}
                error={errors.email}
                placeholder="you@example.com"
              />
              {mode === "Delivery" && (
                <Field
                  label="Delivery Address"
                  multiline
                  value={form.address}
                  onChange={(v) => set("address", v)}
                  error={errors.address}
                  placeholder="Flat / House no., Street, Area, City, PIN"
                />
              )}
              <Field
                label="Special Instructions (optional)"
                multiline
                value={form.instructions}
                onChange={(v) => set("instructions", v)}
                error={errors.instructions}
                placeholder="Extra spicy, no onions, ring twice..."
              />
            </div>

            {/* Summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-28 rounded-3xl bg-[#1A1A1A] border border-white/10 p-6 space-y-5">
                <h2 className="font-display text-3xl tracking-wide">
                  ORDER SUMMARY
                </h2>
                <span className="inline-block text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                  {mode}
                </span>

                <ul className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {items.map((i) => (
                    <li key={i.id} className="flex items-start justify-between gap-3 text-sm">
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground font-semibold truncate">{i.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {i.category} × {i.qty}
                        </p>
                      </div>
                      <span className="font-display text-lg text-neon shrink-0">
                        ₹{i.price * i.qty}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                  <Row label="Subtotal" value={`₹${totals.subtotal}`} />
                  <Row
                    label="Delivery fee"
                    value={
                      totals.delivery === 0 ? (
                        <span className="text-neon font-bold">FREE</span>
                      ) : (
                        `₹${totals.delivery}`
                      )
                    }
                  />
                  <Row label="GST (5%)" value={`₹${totals.gst}`} />
                </div>

                <div className="pt-4 border-t border-white/10 flex items-end justify-between">
                  <span className="text-sm uppercase tracking-widest text-muted-foreground">
                    Total
                  </span>
                  <span className="font-display text-4xl text-neon">
                    ₹{totals.total}
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#0D2A6B]">
                    <span className="text-white font-display text-sm tracking-tighter">
                      R
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">Razorpay</p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <ShieldCheck size={11} /> Secure Payment
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-full bg-neon py-5 text-base font-extrabold text-black transition-all duration-300 hover:shadow-[0_0_28px_rgba(200,241,53,0.6)] hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "Processing..." : `Place Order & Pay ₹${totals.total}`}
                </button>

                <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
                  <Lock size={11} /> 100% Secure • Powered by Razorpay
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
}) {
  const base =
    "w-full rounded-xl bg-white/5 border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:bg-white/10";
  const border = error
    ? "border-red-500 focus:border-red-500"
    : "border-white/10 focus:border-neon";

  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={`${base} ${border} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${base} ${border}`}
        />
      )}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
