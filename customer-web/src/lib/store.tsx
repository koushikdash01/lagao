import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { plants as defaultPlants, type Plant } from "../data/catalog";
import { apiRequest } from "./api";

export type SavedAddress = {
  id: string;
  type: string;
  name: string;
  phone: string;
  line: string;
  city: string;
  pin: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
};

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
  addresses: SavedAddress[];
  selectedAddressId: string | null;
  selectedAddress?: SavedAddress;
  addAddress: (addr: Omit<SavedAddress, "id">) => SavedAddress;
  updateAddress: (id: string, addr: Partial<SavedAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  selectAddress: (id: string) => void;
};


const StoreContext = createContext<StoreState | null>(null);

const defaultAddresses: SavedAddress[] = [
  {
    id: "addr-home",
    type: "Home",
    name: "Koushik Dash",
    phone: "+91 98765 43210",
    line: "Flat 4B, Greenwood Heights, Salt Lake Sector V",
    city: "Kolkata",
    pin: "700091",
    latitude: 22.5726,
    longitude: 88.3639,
    isDefault: true
  },
  {
    id: "addr-work",
    type: "Work / Office",
    name: "Koushik Dash",
    phone: "+91 98765 43210",
    line: "Tech Park Tower 2, 8th Floor, New Town",
    city: "Kolkata",
    pin: "700156",
    latitude: 22.5855,
    longitude: 88.4688,
    isDefault: false
  }
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [plantsState, setPlantsState] = useState<Plant[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Plant[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("lagao_saved_addresses");
        if (saved) return JSON.parse(saved);
      } catch (e) {}
    }
    return defaultAddresses;
  });

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(() => {
    return addresses.find(a => a.isDefault)?.id || addresses[0]?.id || null;
  });

  useEffect(() => {
    try {
      localStorage.setItem("lagao_saved_addresses", JSON.stringify(addresses));
    } catch (e) {}
  }, [addresses]);

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

  const addAddress = (addrData: Omit<SavedAddress, "id">): SavedAddress => {
    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      ...addrData,
      isDefault: addresses.length === 0 || !!addrData.isDefault
    };
    setAddresses(prev => {
      const updated = addrData.isDefault ? prev.map(a => ({ ...a, isDefault: false })) : prev;
      return [...updated, newAddr];
    });
    setSelectedAddressId(newAddr.id);
    return newAddr;
  };

  const updateAddress = (id: string, addrData: Partial<SavedAddress>) => {
    setAddresses(prev =>
      prev.map(a => {
        if (a.id === id) {
          return { ...a, ...addrData };
        }
        if (addrData.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      })
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => {
      const filtered = prev.filter(a => a.id !== id);
      if (selectedAddressId === id) {
        setSelectedAddressId(filtered[0]?.id || null);
      }
      return filtered;
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev =>
      prev.map(a => ({
        ...a,
        isDefault: a.id === id
      }))
    );
    setSelectedAddressId(id);
  };

  const selectAddress = (id: string) => {
    setSelectedAddressId(id);
  };

  const selectedAddress = useMemo(() => {
    return addresses.find(a => a.id === selectedAddressId) || addresses.find(a => a.isDefault) || addresses[0];
  }, [addresses, selectedAddressId]);

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
    clearCart: () => setCart([]),
    addresses,
    selectedAddressId,
    selectedAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress
  }), [plantsState, cart, wishlist, addresses, selectedAddressId, selectedAddress]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}
