export type Area = { id: string; name: string; gov: string; x: number; y: number };
export type VehicleClass = { id: "economy" | "comfort" | "xl"; name: string; desc: string; seats: number; base: number; perKm: number; speed: number };
export type TaxiQuote = { vehicle: VehicleClass; fare: number; minutes: number; km: number; fits: boolean };

/** Rough illustrative grid positions (km) — not real GPS coordinates. */
export const areas: Area[] = [
  { id: "kuwait-city", name: "Kuwait City", gov: "Capital", x: 0, y: 0 },
  { id: "sharq", name: "Sharq", gov: "Capital", x: 1.5, y: 0.5 },
  { id: "dasman", name: "Dasman", gov: "Capital", x: 3, y: 0.2 },
  { id: "shuwaikh", name: "Shuwaikh", gov: "Capital", x: -5, y: -2 },
  { id: "hawalli", name: "Hawalli", gov: "Hawalli", x: 5, y: -5 },
  { id: "salmiya", name: "Salmiya", gov: "Hawalli", x: 10, y: -6 },
  { id: "jabriya", name: "Jabriya", gov: "Hawalli", x: 7, y: -9 },
  { id: "rumaithiya", name: "Rumaithiya", gov: "Hawalli", x: 11, y: -9 },
  { id: "surra", name: "Surra", gov: "Capital", x: 3, y: -10 },
  { id: "farwaniya", name: "Farwaniya", gov: "Farwaniya", x: -3, y: -14 },
  { id: "khaitan", name: "Khaitan", gov: "Farwaniya", x: 0, y: -14 },
  { id: "airport", name: "Kuwait International Airport", gov: "Farwaniya", x: 0, y: -18 },
  { id: "mishref", name: "Mishref", gov: "Mubarak Al-Kabeer", x: 9, y: -14 },
  { id: "jahra", name: "Jahra", gov: "Jahra", x: -27, y: -6 },
  { id: "fintas", name: "Fintas", gov: "Ahmadi", x: 16, y: -28 },
  { id: "mangaf", name: "Mangaf", gov: "Ahmadi", x: 17, y: -32 },
  { id: "ahmadi", name: "Ahmadi", gov: "Ahmadi", x: 12, y: -34 },
  { id: "fahaheel", name: "Fahaheel", gov: "Ahmadi", x: 18, y: -35 },
];

export const vehicles: VehicleClass[] = [
  { id: "economy", name: "Economy", desc: "Compact sedan for everyday trips", seats: 4, base: 0.75, perKm: 0.12, speed: 1 },
  { id: "comfort", name: "Comfort", desc: "Roomier sedan, quieter ride", seats: 4, base: 1.1, perKm: 0.17, speed: 1 },
  { id: "xl", name: "XL", desc: "Room for up to 6 passengers and luggage", seats: 6, base: 1.5, perKm: 0.22, speed: 0.95 },
];

export const areaOf = (id: string) => areas.find((a) => a.id === id);

export function estimate(fromId: string, toId: string, pax: number): TaxiQuote[] {
  const a = areaOf(fromId), b = areaOf(toId);
  if (!a || !b || a.id === b.id) return [];
  const straight = Math.hypot(a.x - b.x, a.y - b.y);
  const km = Math.max(2.4, Math.round(straight * 1.32 * 10) / 10);
  return vehicles.map((v) => {
    const fare = Math.round((v.base + km * v.perKm) * 4) / 4 + (km > 20 ? 0.25 : 0);
    const minutes = Math.round((6 + km * 1.55) / v.speed);
    return { vehicle: v, fare: Math.max(1.25, Math.round(fare * 1000) / 1000), minutes, km, fits: pax <= v.seats };
  });
}
