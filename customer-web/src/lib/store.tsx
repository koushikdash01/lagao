import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { plants, type Plant } from "../data/catalog";

type CartItem = Plant & { quantity: number };
type StoreState = {
  cart: CartItem[];
  wishlist: Plant[];
  addToCart: (plant: Plant, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleWishlist: (plant: Plant) => void;
  cartCount: number;
  cartTotal: number;
};

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Plant[]>([plants[1]]);

  const value = useMemo<StoreState>(() => ({
    cart,
    wishlist,
    addToCart: (plant, quantity = 1) => {
      setCart((items) => {
        const existing = items.find((item) => item.id === plant.id);
        if (existing) {
          return items.map((item) => item.id === plant.id ? { ...item, quantity: item.quantity + quantity } : item);
        }
        return [...items, { ...plant, quantity }];
      });
    },
    removeFromCart: (id) => setCart((items) => items.filter((item) => item.id !== id)),
    updateQuantity: (id, quantity) => setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
    toggleWishlist: (plant) => setWishlist((items) => items.some((item) => item.id === plant.id) ? items.filter((item) => item.id !== plant.id) : [...items, plant]),
    cartCount: cart.reduce((total, item) => total + item.quantity, 0),
    cartTotal: cart.reduce((total, item) => total + (item.discountPrice ?? item.price) * item.quantity, 0)
  }), [cart, wishlist]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}
