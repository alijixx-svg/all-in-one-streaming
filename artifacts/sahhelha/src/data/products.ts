export type Offer = { store: string; price: number; delivery: string; note?: string };
export type Product = { id: string; name: string; brand: string; category: "Phones" | "Laptops" | "Audio" | "Home" | "Gaming"; spec: string; offers: Offer[]; hue: number };

export const products: Product[] = [
  { id: "p-iph15", name: "iPhone 15 128GB", brand: "Apple", category: "Phones", spec: "6.1in, A16 Bionic, USB-C", hue: 210, offers: [
    { store: "Salmiya Tech House", price: 239.9, delivery: "Same day", note: "Includes case" },
    { store: "Avenues Mobile Corner", price: 244.5, delivery: "Next day" },
    { store: "Fahaheel Digital", price: 236.75, delivery: "2-3 days" } ] },
  { id: "p-s24", name: "Galaxy S24 256GB", brand: "Samsung", category: "Phones", spec: "6.2in, 8GB RAM, 50MP", hue: 265, offers: [
    { store: "Avenues Mobile Corner", price: 219.0, delivery: "Same day" },
    { store: "Hawally Gadget Hub", price: 213.4, delivery: "Next day", note: "Free charger" } ] },
  { id: "p-mba", name: "MacBook Air 13 M3", brand: "Apple", category: "Laptops", spec: "8GB, 256GB SSD", hue: 30, offers: [
    { store: "Salmiya Tech House", price: 329.0, delivery: "Next day" },
    { store: "Kuwait City Computers", price: 322.75, delivery: "2-3 days" },
    { store: "Fahaheel Digital", price: 334.9, delivery: "Same day" } ] },
  { id: "p-xps", name: "XPS 14 Laptop", brand: "Dell", category: "Laptops", spec: "Core Ultra 7, 16GB", hue: 190, offers: [
    { store: "Kuwait City Computers", price: 459.5, delivery: "2-3 days" },
    { store: "Hawally Gadget Hub", price: 448.0, delivery: "Next day" } ] },
  { id: "p-wh1000", name: "WH-1000XM5 Headphones", brand: "Sony", category: "Audio", spec: "Noise cancelling, 30h", hue: 0, offers: [
    { store: "Avenues Mobile Corner", price: 98.5, delivery: "Same day" },
    { store: "Salmiya Tech House", price: 94.25, delivery: "Next day" },
    { store: "Fahaheel Digital", price: 101.0, delivery: "Same day", note: "Gift wrap" } ] },
  { id: "p-airpods", name: "AirPods Pro (2nd gen)", brand: "Apple", category: "Audio", spec: "ANC, USB-C case", hue: 160, offers: [
    { store: "Hawally Gadget Hub", price: 64.9, delivery: "Same day" },
    { store: "Kuwait City Computers", price: 67.25, delivery: "Next day" } ] },
  { id: "p-dyson", name: "V12 Detect Slim Vacuum", brand: "Dyson", category: "Home", spec: "Cordless, laser dust", hue: 300, offers: [
    { store: "Home Bazaar Shuwaikh", price: 179.0, delivery: "2-3 days" },
    { store: "Avenues Home Studio", price: 185.5, delivery: "Next day" } ] },
  { id: "p-airfryer", name: "Dual Basket Air Fryer 8L", brand: "Ninja", category: "Home", spec: "2 zones, 6 modes", hue: 20, offers: [
    { store: "Home Bazaar Shuwaikh", price: 42.75, delivery: "Next day" },
    { store: "Avenues Home Studio", price: 44.9, delivery: "Same day" },
    { store: "Fahaheel Digital", price: 41.5, delivery: "2-3 days" } ] },
  { id: "p-ps5", name: "PlayStation 5 Slim", brand: "Sony", category: "Gaming", spec: "1TB, disc edition", hue: 225, offers: [
    { store: "Game Souq Kuwait", price: 157.0, delivery: "Same day" },
    { store: "Hawally Gadget Hub", price: 162.5, delivery: "Next day" } ] },
  { id: "p-switch", name: "Switch OLED", brand: "Nintendo", category: "Gaming", spec: "7in OLED, 64GB", hue: 350, offers: [
    { store: "Game Souq Kuwait", price: 104.25, delivery: "Same day" },
    { store: "Avenues Mobile Corner", price: 108.0, delivery: "Next day" },
    { store: "Salmiya Tech House", price: 102.9, delivery: "2-3 days" } ] },
];
export const productCategories = ["All", "Phones", "Laptops", "Audio", "Home", "Gaming"] as const;
