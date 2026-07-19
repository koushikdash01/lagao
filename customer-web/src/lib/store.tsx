import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { plants as defaultPlants, type Plant } from "../data/catalog";
import { apiRequest } from "./api";

type CartItem = Plant & { quantity: number };
type StoreState = {
  plants: Plant[];
  loadPlants: () => Promise<void>;
  cart: CartItem[];
  wishlist: Plant[];
  addToCart: (plant: Plant, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleWishlist: (plant: Plant) => void;
  cartCount: number;
  cartTotal: number;
  clearCart: () => void;
};

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [plantsState, setPlantsState] = useState<Plant[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Plant[]>([]);

  const loadPlants = async () => {
    try {
      const res = await apiRequest<{ data: any[] }>("/demo/plants");
      if (res.data && res.data.length > 0) {
        const mapped: Plant[] = res.data.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category_name || "Other Greens",
          price: Number(p.price),
          discountPrice: p.discount_price ? Number(p.discount_price) : undefined,
          rating: 4.8,
          stock: p.stock_quantity,
          type: p.type === "outdoor" ? "Outdoor" : "Indoor",
          sunlight: p.sunlight_requirement || "Low to bright indirect",
          image: p.image_url || "https://images.unsplash.com/photo-1593482892290-f54927ae2b7f?q=80&w=900&auto=format&fit=crop",
          description: p.description,
          categoryId: p.category_id
        }));
        setPlantsState(mapped);
      } else {
        setPlantsState(defaultPlants);
      }
    } catch (e) {
      console.error("Failed to load plants from database", e);
      setPlantsState(defaultPlants);
    }
  };

  useEffect(() => {
    loadPlants();
  }, []);

  const value = useMemo<StoreState>(() => ({
    plants: plantsState,
    loadPlants,
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
    cartTotal: cart.reduce((total, item) => total + (item.discountPrice ?? item.price) * item.quantity, 0),
    clearCart: () => setCart([])
  }), [plantsState, cart, wishlist]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}
