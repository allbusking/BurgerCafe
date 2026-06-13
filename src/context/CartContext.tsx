import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image_url: string;
};

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  deliveryFee: number;
  tax: number;
  grandTotal: number;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_KEY = "hotbb_cart";

const roundToTwo = (value: number) => Math.round(value * 100) / 100;

const getInitialItems = () => {
  try {
    const storedCart = localStorage.getItem(CART_KEY);
    if (!storedCart) return [];

    const parsedCart = JSON.parse(storedCart);
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(getInitialItems);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => roundToTwo(items.reduce((sum, item) => sum + item.price * item.quantity, 0)),
    [items],
  );

  const deliveryFee = useMemo(() => (totalPrice >= 499 ? 0 : 40), [totalPrice]);

  const tax = useMemo(() => roundToTwo(totalPrice * 0.05), [totalPrice]);

  const grandTotal = useMemo(
    () => roundToTwo(totalPrice + deliveryFee + tax),
    [deliveryFee, tax, totalPrice],
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      totalPrice,
      deliveryFee,
      tax,
      grandTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [deliveryFee, grandTotal, items, tax, totalItems, totalPrice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
