export type MenuItem = { id: string; name: string; desc: string; price: number };
export type Restaurant = { id: string; name: string; cuisine: string; area: string; eta: string; rating: number; fee: number; hue: number; menu: MenuItem[] };

export const restaurants: Restaurant[] = [
  { id: "r-mcdonalds", name: "McDonald's", cuisine: "Burgers & fries", area: "Demo listing", eta: "25-35 min", rating: 4.5, fee: 0.5, hue: 42, menu: [
    { id: "m1", name: "Big Mac-style Burger Meal", desc: "Illustrative burger, fries and soft drink", price: 2.75 },
    { id: "m2", name: "Chicken Burger Meal", desc: "Illustrative crispy chicken burger, fries and drink", price: 2.5 },
    { id: "m3", name: "Chicken Nuggets", desc: "Illustrative six-piece portion with dipping sauce", price: 1.25 },
    { id: "m4", name: "Fries", desc: "Illustrative medium portion", price: 0.65 } ] },
  { id: "r-kfc", name: "KFC", cuisine: "Fried chicken", area: "Demo listing", eta: "25-40 min", rating: 4.4, fee: 0.5, hue: 2, menu: [
    { id: "m1", name: "Spicy Chicken Burger Meal", desc: "Illustrative spicy chicken sandwich, fries and drink", price: 2.6 },
    { id: "m2", name: "Chicken Strips Meal", desc: "Illustrative chicken strips, fries and dip", price: 2.25 },
    { id: "m3", name: "Family Chicken Bucket", desc: "Illustrative sharing selection with sides", price: 6.9 },
    { id: "m4", name: "Coleslaw", desc: "Illustrative small side", price: 0.45 } ] },
  { id: "r-burgerking", name: "Burger King", cuisine: "Flame-grilled burgers", area: "Demo listing", eta: "25-35 min", rating: 4.3, fee: 0.5, hue: 25, menu: [
    { id: "m1", name: "Whopper-style Burger Meal", desc: "Illustrative beef burger, fries and drink", price: 2.85 },
    { id: "m2", name: "Chicken Burger", desc: "Illustrative chicken sandwich with lettuce and sauce", price: 1.65 },
    { id: "m3", name: "Onion Rings", desc: "Illustrative crispy onion ring portion", price: 0.85 },
    { id: "m4", name: "Cheeseburger", desc: "Illustrative beef patty with cheese", price: 1.1 } ] },
  { id: "r-pizzahut", name: "Pizza Hut", cuisine: "Pizza & pasta", area: "Demo listing", eta: "30-45 min", rating: 4.5, fee: 0.75, hue: 355, menu: [
    { id: "m1", name: "Pepperoni Pizza", desc: "Illustrative medium pizza with cheese and pepperoni", price: 3.5 },
    { id: "m2", name: "Vegetable Pizza", desc: "Illustrative medium pizza with mixed vegetables", price: 3.25 },
    { id: "m3", name: "Chicken Pasta", desc: "Illustrative baked pasta with creamy sauce", price: 2.75 },
    { id: "m4", name: "Garlic Bread", desc: "Illustrative four-piece side", price: 0.95 } ] },
  { id: "r-dasma", name: "Bait Dasma Kitchen", cuisine: "Kuwaiti", area: "Dasma", eta: "35-45 min", rating: 4.7, fee: 0.5, hue: 36, menu: [
    { id: "m1", name: "Machboos Laham", desc: "Spiced rice, slow-cooked lamb, daqqus", price: 4.75 },
    { id: "m2", name: "Mutabbaq Zubaidi", desc: "Pomfret over saffron rice", price: 6.25 },
    { id: "m3", name: "Jireesh", desc: "Cracked wheat, chicken, caramelized onion", price: 2.9 },
    { id: "m4", name: "Gers Ogaily", desc: "Cardamom saffron cake slice", price: 1.25 } ] },
  { id: "r-shawarma", name: "Salmiya Shawarma Lab", cuisine: "Levantine", area: "Salmiya", eta: "20-30 min", rating: 4.5, fee: 0.25, hue: 14, menu: [
    { id: "m1", name: "Chicken Shawarma Wrap", desc: "Toum, pickles, fries inside", price: 1.1 },
    { id: "m2", name: "Beef Arabi Platter", desc: "Cut wrap, fries, tahini", price: 2.85 },
    { id: "m3", name: "Fattoush", desc: "Sumac, crisp bread, pomegranate", price: 1.5 },
    { id: "m4", name: "Ayran", desc: "Cold salted yogurt drink", price: 0.4 } ] },
  { id: "r-sushi", name: "Gulf Road Sushi Bar", cuisine: "Japanese", area: "Sharq", eta: "40-55 min", rating: 4.6, fee: 0.75, hue: 168, menu: [
    { id: "m1", name: "Salmon Aburi Roll", desc: "8 pcs, torched, spicy mayo", price: 4.2 },
    { id: "m2", name: "Chicken Katsu Bowl", desc: "Rice, curry sauce, pickles", price: 3.65 },
    { id: "m3", name: "Edamame", desc: "Sea salt and chili", price: 1.35 } ] },
  { id: "r-burger", name: "Jabriya Smash Club", cuisine: "Burgers", area: "Jabriya", eta: "25-35 min", rating: 4.4, fee: 0.5, hue: 0, menu: [
    { id: "m1", name: "Double Smash", desc: "Two patties, cheddar, house sauce", price: 2.95 },
    { id: "m2", name: "Truffle Fries", desc: "Parmesan, parsley", price: 1.4 },
    { id: "m3", name: "Karak Milkshake", desc: "Cardamom tea, soft serve", price: 1.6 } ] },
];
