export const airports = [
  { code: "KWI", city: "Kuwait City" }, { code: "DXB", city: "Dubai" }, { code: "DOH", city: "Doha" },
  { code: "IST", city: "Istanbul" }, { code: "LHR", city: "London" }, { code: "CAI", city: "Cairo" },
  { code: "BEY", city: "Beirut" }, { code: "BKK", city: "Bangkok" }, { code: "RUH", city: "Riyadh" },
];
const carriers = ["Sahel Air (demo)", "Gulf Wings (demo)", "Bayan Airways (demo)", "Failaka Jet (demo)"];
const baseKwd: Record<string, number> = { DXB: 48, DOH: 42, RUH: 39, IST: 96, LHR: 178, CAI: 71, BEY: 82, BKK: 154, KWI: 55 };
const durMin: Record<string, number> = { DXB: 110, DOH: 85, RUH: 95, IST: 260, LHR: 400, CAI: 175, BEY: 165, BKK: 420, KWI: 120 };

export type FlightResult = { id: string; carrier: string; flightNo: string; from: string; to: string; date: string; depart: string; arrive: string; durationMin: number; stops: number; pricePerPax: number };

function hash(s: string) { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
export function cityOf(code: string) { return airports.find((a) => a.code === code)?.city ?? code; }

export function searchFlights(from: string, to: string, date: string): FlightResult[] {
  const key = from === "KWI" ? to : from;
  const base = baseKwd[key] ?? 60, dur = durMin[key] ?? 150;
  const seed = hash(from + to + date);
  return [0, 1, 2, 3].map((i) => {
    const h = (seed >> (i * 3)) % 1000;
    const depMin = (6 * 60 + i * 230 + (h % 90)) % (24 * 60);
    const stops = i === 3 && dur > 200 ? 1 : 0;
    const d = dur + stops * 95;
    const arr = (depMin + d) % (24 * 60);
    const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    const price = Math.round((base * (0.85 + (h % 45) / 100) - stops * 9) * 1000) / 1000;
    return { id: `${from}-${to}-${date}-${i}`, carrier: carriers[(seed + i) % carriers.length], flightNo: `SH${100 + ((h + i * 17) % 800)}`, from, to, date, depart: fmt(depMin), arrive: fmt(arr), durationMin: d, stops, pricePerPax: price };
  }).sort((a, b) => a.pricePerPax - b.pricePerPax);
}
