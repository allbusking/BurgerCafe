import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

export interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  quantity: number;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  deliveryMode: "Delivery" | "Pickup";
  totalItems: number;
  totalPrice: number;
  addToCart: (item: CartProduct) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  addItem: (item: CartProduct) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  setDeliveryMode: (mode: "Delivery" | "Pickup") => void;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "hotbb-cart-v1";
const DELIVERY_KEY = "hotbb-delivery-v1";

type CartProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
};

function normalizeItem(item: Partial<CartItem> & CartProduct): CartItem {
  const quantity = item.quantity ?? item.qty ?? 1;
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    price: item.price,
    image: item.image,
    quantity,
    qty: quantity,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryMode, setDeliveryModeState] = useState<"Delivery" | "Pickup">(
    "Delivery"
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_KEY);
      const savedDelivery = localStorage.getItem(DELIVERY_KEY);

      if (savedCart) {
        setItems(JSON.parse(savedCart).map(normalizeItem));
      }
      if (savedDelivery) {
        setDeliveryModeState(
          savedDelivery as "Delivery" | "Pickup"
        );
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
    setIsHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(DELIVERY_KEY, deliveryMode);
    }
  }, [deliveryMode, isHydrated]);

  const addToCart = (item: CartProduct) => {
    setItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === item.id);
      if (existing) {
        return prevItems.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1, qty: i.qty + 1 }
            : i
        );
      }
      return [...prevItems, normalizeItem(item)];
    });
  };

  const addItem = (item: CartProduct) => addToCart(item);

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== id));
  };

  const removeItem = removeFromCart;

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setItems((prevItems) =>
        prevItems.map((i) =>
          i.id === id ? { ...i, quantity, qty: quantity } : i
        )
      );
    }
  };

  const setQuantity = updateQuantity;

  const clearCart = () => {
    setItems([]);
  };

  const setDeliveryMode = (mode: "Delivery" | "Pickup") => {
    setDeliveryModeState(mode);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const getTotalItems = () => totalItems;

  return (
    <CartContext.Provider
      value={{
        items,
        deliveryMode,
        totalItems,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        addItem,
        removeItem,
        setQuantity,
        clearCart,
        setDeliveryMode,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within CartProvider");
  }
  return context;
}
