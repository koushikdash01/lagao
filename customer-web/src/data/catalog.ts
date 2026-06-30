export type Plant = {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice?: number;
  rating: number;
  stock: number;
  type: "Indoor" | "Outdoor";
  sunlight: string;
  image: string;
  description: string;
};

export const categories = ["Indoor Plants", "Outdoor Plants", "Flowering Plants", "Succulents", "Air Purifying Plants", "Pots & Accessories"];

export const plants: Plant[] = [
  {
    id: "snake-plant",
    name: "Snake Plant",
    category: "Air Purifying Plants",
    price: 399,
    discountPrice: 299,
    rating: 4.8,
    stock: 18,
    type: "Indoor",
    sunlight: "Low to bright indirect",
    image: "https://images.unsplash.com/photo-1593482892290-f54927ae2b7f?q=80&w=900&auto=format&fit=crop",
    description: "A sculptural, resilient houseplant that forgives missed watering and low light."
  },
  {
    id: "peace-lily",
    name: "Peace Lily",
    category: "Flowering Plants",
    price: 549,
    discountPrice: 449,
    rating: 4.7,
    stock: 9,
    type: "Indoor",
    sunlight: "Medium indirect",
    image: "https://images.unsplash.com/photo-1598880940080-ff9a29891b85?q=80&w=900&auto=format&fit=crop",
    description: "Elegant white blooms and glossy leaves for calm corners and workspaces."
  },
  {
    id: "jade-plant",
    name: "Jade Plant",
    category: "Succulents",
    price: 499,
    rating: 4.6,
    stock: 22,
    type: "Indoor",
    sunlight: "Bright indirect",
    image: "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?q=80&w=900&auto=format&fit=crop",
    description: "Glossy succulent leaves, compact growth, and a long-lived tabletop presence."
  },
  {
    id: "areca-palm",
    name: "Areca Palm",
    category: "Indoor Plants",
    price: 899,
    discountPrice: 749,
    rating: 4.9,
    stock: 5,
    type: "Indoor",
    sunlight: "Bright filtered",
    image: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?q=80&w=900&auto=format&fit=crop",
    description: "A lush palm that softens rooms and adds tropical height without heaviness."
  }
];

export const testimonials = [
  "The plants arrived healthy, packed beautifully, and already made my balcony feel alive.",
  "Clear care notes, fast delivery, and the Snake Plant is thriving.",
  "Lagao feels premium without becoming complicated. Lovely shopping experience."
];
