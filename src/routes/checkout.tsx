import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Lock, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useAddresses, type AddressRecord } from "../hooks/useAddresses";
import { usePlaceOrder } from "../hooks/useOrders";
import supabase from "../lib/supabaseClient";
import { LoadingButton } from "@/components/LoadingButton";
import { PageTransition } from "@/components/PageTransition";
import { useToast } from "@/context/ToastContext";
import { calculateOrderTotals, formatPrice } from "../utils/formatPrice";

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
    .regex(/^\d{10}$/, "Enter exactly 10 digits"),
  email: z.string().trim().email("Enter a valid email").max(255),
  instructions: z.string().trim().max(500).optional().or(z.literal("")),
};

const deliverySchema = z.object({
  ...baseSchema,
  address: z.string().trim().min(10, "Please enter a full delivery address").max(500),
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

export function CheckoutPage() {
  const { items, totalPrice, deliveryFee, tax, grandTotal, clearCart } = useCart();
  const { placeOrder, loading } = usePlaceOrder();
  const { user, profile } = useAuth();
  const { addresses, addAddress } = useAddresses();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<FormState & { deliveryType: "delivery" | "pickup" }>({
    name: "",
    email: "",
    phone: "",
    deliveryType: "delivery",
    address: "",
    instructions: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | "deliveryType", string>>>(
    {},
  );
  const [submitError, setSubmitError] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [saveAddress, setSaveAddress] = useState(false);
  const deliveryMode = formData.deliveryType === "delivery" ? "Delivery" : "Pickup";
  const hasSavedAddresses = Boolean(user?.id && addresses.length > 0);

  const formatAddress = (address: AddressRecord) =>
    `${address.address_line}, ${address.city}, ${address.state} - ${address.pincode}`;

  const selectSavedAddress = (address: AddressRecord) => {
    setSelectedAddressId(address.id);
    setSaveAddress(false);
    setFormData((current) => ({
      ...current,
      name: address.full_name,
      phone: address.phone,
      address: formatAddress(address),
    }));
    setErrors((current) => ({
      ...current,
      name: undefined,
      phone: undefined,
      address: undefined,
    }));
  };

  useEffect(() => {
    if (items.length === 0) navigate("/menu");
    if (user) {
      setFormData((current) => ({
        ...current,
        email: user?.email || "",
        name: profile?.full_name || "",
        phone: profile?.phone || "",
      }));
    }
  }, [items.length, navigate, profile?.full_name, profile?.phone, user]);

  useEffect(() => {
    if (!user?.id || addresses.length === 0 || selectedAddressId !== null) return;

    const defaultAddress = addresses.find((address) => address.is_default) ?? addresses[0];
    selectSavedAddress(defaultAddress);
  }, [addresses, selectedAddressId, user?.id]);

  if (items.length === 0) {
    return null;
  }

  const set = <K extends keyof typeof formData>(k: K, v: (typeof formData)[K]) => {
    setFormData((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
    setSubmitError("");
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof FormState | "deliveryType", string>> = {};

    if (formData.name.trim().length < 2) {
      nextErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email";
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      nextErrors.phone = "Enter exactly 10 digits";
    }

    if (formData.deliveryType === "delivery" && !formData.address.trim()) {
      nextErrors.address = "Address is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      return;
    }

    try {
      const orderEmail = user?.email || formData.email;
      const order = await placeOrder({
        name: formData.name,
        email: orderEmail,
        phone: formData.phone,
        deliveryType: formData.deliveryType,
        address: formData.address,
        instructions: formData.instructions,
        items: items,
        subtotal: totalPrice,
        deliveryFee: deliveryFee,
        tax: tax,
        grandTotal: grandTotal,
        userId: user?.id || null,
      });

      if (
        user?.id &&
        selectedAddressId === "manual" &&
        saveAddress &&
        formData.deliveryType === "delivery"
      ) {
        try {
          await addAddress({
            full_name: formData.name,
            phone: formData.phone,
            address_line: formData.address,
            city: "",
            state: "",
            pincode: "",
            address_type: "other",
            is_default: addresses.length === 0,
          });
          showToast("Address saved for future orders", "success");
        } catch (addressError) {
          console.error("Failed to save address:", addressError);
        }
      }

      try {
        await supabase.functions.invoke("send-order-email", {
          body: {
            to: orderEmail,
            customerName: formData.name,
            orderNumber: order.order_number,
            items: items,
            subtotal: totalPrice,
            deliveryFee: deliveryFee,
            total: grandTotal,
            deliveryType: formData.deliveryType,
            address: formData.address,
            estimatedTime: order.estimated_time || 30,
          },
        });
      } catch (emailError) {
        console.error("Failed to send order email:", emailError);
      }

      if (user?.id && formData.phone.trim()) {
        try {
          await supabase
            .from("profiles")
            .update({
              phone: formData.phone,
              full_name: formData.name,
            })
            .eq("id", user.id);
        } catch (profileError) {
          console.error("Failed to update profile phone:", profileError);
        }
      }

      sessionStorage.setItem("lastOrder", JSON.stringify(order));
      clearCart();
      showToast("Order placed successfully! 🎉", "success");
      navigate("/order-confirmation");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not place order. Try again.");
      showToast("Could not place order. Try again.", "error");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />

        <main className="flex-1 pt-32 md:pt-36 pb-16">
          <div className="mx-auto max-w-7xl px-4">
            <h1 className="font-display text-5xl md:text-7xl tracking-tight">ALMOST THERE 🚀</h1>
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
                  value={formData.name}
                  onChange={(v) => set("name", v)}
                  error={errors.name}
                  placeholder="Aryan Mehra"
                />
                <Field
                  label="Phone Number"
                  type="tel"
                  value={formData.phone}
                  onChange={(v) => set("phone", v)}
                  error={errors.phone}
                  placeholder="+91 98765 43210"
                />
                <Field
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(v) => set("email", v)}
                  error={errors.email}
                  placeholder="you@example.com"
                  readOnly={Boolean(user?.email)}
                />
                {deliveryMode === "Delivery" && (
                  <>
                    {hasSavedAddresses && (
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Saved Addresses
                          </h2>
                        </div>
                        <div className="space-y-2">
                          {addresses.map((address) => (
                            <button
                              key={address.id}
                              type="button"
                              onClick={() => selectSavedAddress(address)}
                              className={[
                                "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors",
                                selectedAddressId === address.id
                                  ? "border-neon bg-neon/5"
                                  : "border-white/10 bg-white/[0.03] hover:border-white/20",
                              ].join(" ")}
                            >
                              <span
                                className={[
                                  "mt-1 h-4 w-4 shrink-0 rounded-full border",
                                  selectedAddressId === address.id
                                    ? "border-neon bg-neon shadow-[inset_0_0_0_4px_#111]"
                                    : "border-white/30",
                                ].join(" ")}
                              />
                              <span className="min-w-0 flex-1">
                                <span className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-bold text-foreground">
                                    {address.full_name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {address.phone}
                                  </span>
                                  {address.is_default && (
                                    <span className="rounded-full bg-neon px-2 py-0.5 text-[10px] font-extrabold text-black">
                                      DEFAULT
                                    </span>
                                  )}
                                </span>
                                <span className="mt-1 block truncate text-xs text-muted-foreground">
                                  {formatAddress(address)}
                                </span>
                              </span>
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedAddressId("manual");
                              setSaveAddress(false);
                              set("address", "");
                            }}
                            className={[
                              "flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm font-semibold transition-colors",
                              selectedAddressId === "manual"
                                ? "border-neon bg-neon/5 text-neon"
                                : "border-white/10 bg-white/[0.03] text-foreground/80 hover:border-white/20",
                            ].join(" ")}
                          >
                            <span
                              className={[
                                "h-4 w-4 shrink-0 rounded-full border",
                                selectedAddressId === "manual"
                                  ? "border-neon bg-neon shadow-[inset_0_0_0_4px_#111]"
                                  : "border-white/30",
                              ].join(" ")}
                            />
                            Use a different address
                          </button>
                        </div>
                      </div>
                    )}

                    {(!hasSavedAddresses || selectedAddressId === "manual") && (
                      <>
                        <Field
                          label="Delivery Address"
                          multiline
                          value={formData.address}
                          onChange={(v) => set("address", v)}
                          error={errors.address}
                          placeholder="Flat / House no., Street, Area, City, PIN"
                        />
                        {user?.id && selectedAddressId === "manual" && (
                          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-foreground/80">
                            <input
                              type="checkbox"
                              checked={saveAddress}
                              onChange={(event) => setSaveAddress(event.target.checked)}
                              className="h-4 w-4 accent-[#C8F135]"
                            />
                            Save this address for future orders
                          </label>
                        )}
                      </>
                    )}
                  </>
                )}
                <Field
                  label="Special Instructions (optional)"
                  multiline
                  value={formData.instructions}
                  onChange={(v) => set("instructions", v)}
                  error={errors.instructions}
                  placeholder="Extra spicy, no onions, ring twice..."
                />
              </div>

              {/* Summary */}
              <div className="lg:col-span-2">
                <div className="sticky top-28 rounded-3xl bg-[#1A1A1A] border border-white/10 p-6 space-y-5">
                  <h2 className="font-display text-3xl tracking-wide">ORDER SUMMARY</h2>
                  <span className="inline-block text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
                    {deliveryMode}
                  </span>

                  <ul className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {items.map((i) => (
                      <li key={i.id} className="flex items-start justify-between gap-3 text-sm">
                        {i.image_url && (
                          <img
                            src={i.image_url}
                            alt={i.name}
                            loading="lazy"
                            className="h-12 w-12 shrink-0 rounded-xl object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-foreground font-semibold truncate">{i.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {i.category} × {i.quantity}
                          </p>
                        </div>
                        <span className="font-display text-lg text-neon shrink-0">
                          ₹{i.price * i.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-white/10 pt-4 space-y-2 text-sm">
                    <Row label="Subtotal" value={formatPrice(totalPrice)} />
                    <Row
                      label="Delivery fee"
                      value={
                        deliveryFee === 0 ? (
                          <span className="text-neon font-bold">FREE</span>
                        ) : (
                          formatPrice(deliveryFee)
                        )
                      }
                    />
                    <Row label="GST (5%)" value={formatPrice(tax)} />
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-end justify-between">
                    <span className="text-sm uppercase tracking-widest text-muted-foreground">
                      Total
                    </span>
                    <span className="font-display text-4xl text-neon">
                      {formatPrice(grandTotal)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#0D2A6B]">
                      <span className="text-white font-display text-sm tracking-tighter">R</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-foreground">Razorpay</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <ShieldCheck size={11} /> Secure Payment
                      </p>
                    </div>
                  </div>

                  {submitError && <p className="text-sm text-red-500">{submitError}</p>}

                  <LoadingButton
                    type="submit"
                    disabled={loading}
                    className="fixed bottom-safe-4 left-4 right-4 z-50 rounded-full bg-neon py-5 text-base font-extrabold text-black transition-all duration-300 hover:shadow-[0_0_28px_rgba(200,241,53,0.6)] hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed lg:static lg:w-full"
                  >
                    {loading ? "Placing Order..." : "Place Order"}
                  </LoadingButton>

                  <p className="text-center text-[11px] text-muted-foreground">
                    💵 Pay with cash on delivery / pickup
                  </p>

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
    </PageTransition>
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
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
  readOnly?: boolean;
}) {
  const base =
    "min-h-12 w-full rounded-xl bg-white/5 border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:bg-white/10";
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
          readOnly={readOnly}
          className={`${base} ${border}`}
        />
      )}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
