import { useState } from "react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useToast } from "@/context/ToastContext";
import { useAddresses, type AddressRecord } from "../hooks/useAddresses";

type AddressForm = {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  address_type: string;
  is_default: boolean;
};

const emptyForm: AddressForm = {
  full_name: "",
  phone: "",
  address_line: "",
  city: "",
  state: "",
  pincode: "",
  address_type: "home",
  is_default: false,
};

const addressTypeLabels: Record<string, string> = {
  home: "🏠 Home",
  work: "💼 Work",
  other: "📍 Other",
};

export function MyAddressesPage() {
  const {
    addresses,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAddresses();
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressRecord | null>(null);
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressForm, string>>>({});
  const [saving, setSaving] = useState(false);

  const openAddModal = () => {
    setEditingAddress(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEditModal = (address: AddressRecord) => {
    setEditingAddress(address);
    setForm({
      full_name: address.full_name ?? "",
      phone: address.phone ?? "",
      address_line: address.address_line ?? "",
      city: address.city ?? "",
      state: address.state ?? "",
      pincode: address.pincode ?? "",
      address_type: address.address_type ?? "home",
      is_default: Boolean(address.is_default),
    });
    setErrors({});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingAddress(null);
    setForm(emptyForm);
    setErrors({});
  };

  const set = <K extends keyof AddressForm>(key: K, value: AddressForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const nextErrors: Partial<Record<keyof AddressForm, string>> = {};

    if (!form.full_name.trim()) nextErrors.full_name = "Full name is required";
    if (!/^[0-9]{10}$/.test(form.phone)) nextErrors.phone = "Enter exactly 10 digits";
    if (!form.address_line.trim()) nextErrors.address_line = "Address line is required";
    if (!form.city.trim()) nextErrors.city = "City is required";
    if (!form.state.trim()) nextErrors.state = "State is required";
    if (!/^[0-9]{6}$/.test(form.pincode)) nextErrors.pincode = "Enter a 6 digit pincode";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (editingAddress) {
        await updateAddress(editingAddress.id, form);
        showToast("Address updated", "success");
      } else {
        await addAddress(form);
        showToast("Address added", "success");
      }
      closeModal();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not save address", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (address: AddressRecord) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      await deleteAddress(address.id);
      showToast("Address deleted", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not delete address", "error");
    }
  };

  const handleSetDefault = async (address: AddressRecord) => {
    try {
      await setDefaultAddress(address.id);
      showToast("Default address updated", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Could not update default address", "error");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 pt-32 pb-20 md:pt-40">
          <ScrollReveal>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-display text-6xl leading-none text-cream md:text-8xl">
                  MY ADDRESSES
                </h1>
                <p className="mt-3 text-muted-foreground">
                  Manage your saved delivery addresses
                </p>
              </div>
              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center justify-center rounded-full bg-neon px-6 py-3 text-sm font-bold text-black transition-all hover:shadow-[0_0_24px_rgba(200,241,53,0.5)] hover:scale-[1.02] active:scale-[0.97]"
              >
                Add New Address
              </button>
            </div>
          </ScrollReveal>

          {loading ? (
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5 md:p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-7 w-28 animate-pulse rounded-full bg-white/10" />
                    <div className="h-7 w-20 animate-pulse rounded-full bg-white/10" />
                  </div>
                  <div className="mt-6 h-5 w-44 animate-pulse rounded bg-white/10" />
                  <div className="mt-3 h-4 w-32 animate-pulse rounded bg-white/10" />
                  <div className="mt-5 space-y-3">
                    <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                  </div>
                  <div className="mt-6 flex gap-2">
                    <div className="h-10 w-28 animate-pulse rounded-full bg-white/10" />
                    <div className="h-10 w-20 animate-pulse rounded-full bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : addresses.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-white/5 bg-[#1A1A1A] p-8 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-neon/10 text-3xl">
                📍
              </div>
              <h2 className="mt-5 font-display text-4xl text-cream">No saved addresses yet</h2>
              <button
                type="button"
                onClick={openAddModal}
                className="mt-6 inline-flex rounded-full bg-neon px-6 py-3 text-sm font-bold text-black transition-all hover:shadow-[0_0_24px_rgba(200,241,53,0.5)] hover:scale-[1.02] active:scale-[0.97]"
              >
                Add Your First Address
              </button>
            </div>
          ) : (
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {addresses.map((address, index) => (
                <ScrollReveal key={address.id} delay={Math.min(index * 60, 240)}>
                  <article className="rounded-2xl border border-white/5 bg-[#1A1A1A] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-neon/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] md:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-foreground/80">
                        {addressTypeLabels[address.address_type] ?? addressTypeLabels.other}
                      </span>
                      {address.is_default && (
                        <span className="rounded-full bg-neon px-3 py-1 text-xs font-extrabold text-black">
                          DEFAULT
                        </span>
                      )}
                    </div>

                    <div className="mt-5">
                      <h2 className="text-lg font-bold text-foreground">{address.full_name}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{address.phone}</p>
                      <p className="mt-4 text-sm leading-6 text-muted-foreground">
                        {address.address_line}
                        <br />
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
                      {!address.is_default && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(address)}
                          className="rounded-full border border-neon/60 px-4 py-2 text-xs font-bold text-neon transition-colors hover:bg-neon hover:text-black"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => openEditModal(address)}
                        className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold text-foreground transition-colors hover:bg-white/5"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(address)}
                        className="rounded-full border border-red-500/50 px-4 py-2 text-xs font-bold text-red-400 transition-colors hover:bg-red-500 hover:text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}
        </main>
        <Footer />

        {modalOpen && (
          <div className="fixed inset-0 z-[80] grid place-items-center bg-black/75 p-4 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#161616] p-6 shadow-2xl md:p-8">
              <h2 className="font-display text-4xl text-cream">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="Full Name"
                    value={form.full_name}
                    onChange={(value) => set("full_name", value)}
                    error={errors.full_name}
                  />
                  <Field
                    label="Phone Number"
                    value={form.phone}
                    onChange={(value) => set("phone", value)}
                    error={errors.phone}
                    inputMode="numeric"
                  />
                </div>
                <Field
                  label="Address Line"
                  value={form.address_line}
                  onChange={(value) => set("address_line", value)}
                  error={errors.address_line}
                  multiline
                />
                <div className="grid gap-5 md:grid-cols-3">
                  <Field
                    label="City"
                    value={form.city}
                    onChange={(value) => set("city", value)}
                    error={errors.city}
                  />
                  <Field
                    label="State"
                    value={form.state}
                    onChange={(value) => set("state", value)}
                    error={errors.state}
                  />
                  <Field
                    label="Pincode"
                    value={form.pincode}
                    onChange={(value) => set("pincode", value)}
                    error={errors.pincode}
                    inputMode="numeric"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
                    Address Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(["home", "work", "other"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => set("address_type", type)}
                        className={[
                          "rounded-full border px-4 py-2 text-xs font-bold transition-colors",
                          form.address_type === type
                            ? "border-neon bg-neon text-black"
                            : "border-white/10 text-foreground/70 hover:bg-white/5",
                        ].join(" ")}
                      >
                        {addressTypeLabels[type]}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="text-sm font-semibold text-foreground">Set as Default</span>
                  <button
                    type="button"
                    onClick={() => set("is_default", !form.is_default)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${form.is_default ? "bg-neon" : "bg-white/10"}`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-black transition-transform ${form.is_default ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </button>
                </label>

                <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-neon px-6 py-3 text-sm font-bold text-black transition-all hover:shadow-[0_0_24px_rgba(200,241,53,0.5)] hover:scale-[1.02] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  multiline = false,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  multiline?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const base =
    "min-h-12 w-full rounded-xl bg-white/[0.04] border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:bg-white/10";
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
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className={`${base} ${border} resize-none`}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          inputMode={inputMode}
          className={`${base} ${border}`}
        />
      )}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
