export const kwd = (n: number) => `KWD ${n.toFixed(3)}`;
export const fmtDate = (iso: string) => { const d = new Date(iso); return isNaN(+d) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); };
export const uid = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const daysUntil = (iso: string) => Math.ceil((new Date(iso).setHours(0,0,0,0) - new Date().setHours(0,0,0,0)) / 86400000);
