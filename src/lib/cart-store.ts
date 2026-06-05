import { useSyncExternalStore } from "react";

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  qty: number;
}

const KEY = "hotbb-cart-v1";
const DELIVERY_KEY = "hotbb-delivery-v1";

type Listener = () => void;
let items: CartItem[] = load();
let deliveryMode: "Delivery" | "Pickup" = loadDelivery();
const listeners = new Set<Listener>();

function load(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function loadDelivery(): "Delivery" | "Pickup" {
  if (typeof window === "undefined") return "Delivery";
  return (localStorage.getItem(DELIVERY_KEY) as "Delivery" | "Pickup") || "Delivery";
}
function persist() {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(items));
    localStorage.setItem(DELIVERY_KEY, deliveryMode);
  }
  listeners.forEach((l) => l());
}

export const cartStore = {
  subscribe(l: Listener) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get() {
    return items;
  },
  getDelivery() {
    return deliveryMode;
  },
  setDelivery(m: "Delivery" | "Pickup") {
    deliveryMode = m;
    persist();
  },
  add(item: Omit<CartItem, "qty">) {
    const existing = items.find((i) => i.id === item.id);
    if (existing) {
      items = items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      items = [...items, { ...item, qty: 1 }];
    }
    persist();
  },
  setQty(id: string, qty: number) {
    if (qty <= 0) {
      items = items.filter((i) => i.id !== id);
    } else {
      items = items.map((i) => (i.id === id ? { ...i, qty } : i));
    }
    persist();
  },
  remove(id: string) {
    items = items.filter((i) => i.id !== id);
    persist();
  },
  clear() {
    items = [];
    persist();
  },
};

const emptySnapshot: CartItem[] = [];
export function useCart() {
  return useSyncExternalStore(
    cartStore.subscribe,
    cartStore.get,
    () => emptySnapshot,
  );
}
export function useDeliveryMode() {
  return useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getDelivery,
    () => "Delivery" as const,
  );
}

export function computeTotals(items: CartItem[], mode: "Delivery" | "Pickup") {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = mode === "Pickup" ? 0 : subtotal >= 499 || subtotal === 0 ? 0 : 40;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + gst;
  return { subtotal, delivery, gst, total };
}
