import { useMemo, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { ArrowUpDown, CarFront, Clock, MapPin, Navigation, Route, Users } from "lucide-react";
import { areas, areaOf, estimate } from "@/data/taxis";
import { useStore, type DemoPayment } from "@/lib/store";
import { KnetDemo } from "@/components/app/knet-demo";
import { kwd } from "@/lib/format";
import { PageHeader, Label, DemoNote, Empty } from "@/components/app/ui-bits";
import { useToast } from "@/hooks/use-toast";

type Query = { from: string; to: string; pax: number };

export default function Taxi() {
  const [, go] = useLocation();
  const { createOrder } = useStore();
  const { toast } = useToast();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pax, setPax] = useState(1);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState<Query | null>(null);
  const [pickId, setPickId] = useState<string | null>(null);

  const quotes = useMemo(() => (query ? estimate(query.from, query.to, query.pax) : []), [query]);
  const pick = quotes.find((q) => q.vehicle.id === pickId && q.fits) ?? null;

  const invalidate = () => { setQuery(null); setPickId(null); setErr(""); };
  const change = (set: (v: string) => void) => (v: string) => { set(v); invalidate(); };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!from || !to) return setErr("Choose both a pickup and a destination.");
    if (from === to) return setErr("Pickup and destination must be different areas.");
    if (pax < 1 || pax > 6) return setErr("Passengers must be between 1 and 6.");
    setErr(""); setPickId(null); setQuery({ from, to, pax });
  };

  const fromName = query ? areaOf(query.from)?.name ?? "" : "";
  const toName = query ? areaOf(query.to)?.name ?? "" : "";

  const book = (payment: DemoPayment) => {
    if (!pick || !query) return;
    const fare = pick.fare;
    createOrder({
      kind: "taxi",
      title: `${fromName} to ${toName}`,
      lines: [{ label: pick.vehicle.name, detail: `${fromName} to ${toName}; ${query.pax} passenger${query.pax > 1 ? "s" : ""}`, qty: 1, unit: fare }],
      total: fare,
      meta: "Demo taxi booking. No driver dispatched.",
      payment,
    });
    toast({ title: "Demo taxi booking saved", description: "No driver was dispatched. This is a simulation." });
    go("/orders");
  };

  const sel = (id: string, v: string, set: (s: string) => void, placeholder: string) => (
    <select id={id} className="field" value={v} onChange={(e) => set(e.target.value)} data-testid={`select-${id}`} aria-invalid={!!err && (!v || from === to)}>
      <option value="" disabled>{placeholder}</option>
      {areas.map((a) => <option key={a.id} value={a.id}>{a.name} · {a.gov}</option>)}
    </select>
  );

  return (
    <div>
      <PageHeader eyebrow="Getting around" title="Book a taxi" sub="Pick two areas and see illustrative fares. No GPS, no live pricing, and no driver is ever dispatched." />

      <form onSubmit={submit} noValidate className="surface rise grid gap-4 p-4 sm:p-5 md:grid-cols-[1fr_auto_1fr] lg:grid-cols-[1fr_auto_1fr_130px_auto] lg:items-end">
        <div><Label htmlFor="pickup">Pickup area</Label>{sel("pickup", from, change(setFrom), "Select pickup")}</div>
        <button type="button" onClick={() => { setFrom(to); setTo(from); invalidate(); }} aria-label="Swap pickup and destination" data-testid="button-swap" className="mx-auto grid h-11 w-11 place-items-center self-end rounded-full border border-border bg-secondary text-primary transition-transform duration-300 hover:rotate-180">
          <ArrowUpDown className="h-4 w-4 md:rotate-90" />
        </button>
        <div><Label htmlFor="dropoff">Destination area</Label>{sel("dropoff", to, change(setTo), "Select destination")}</div>
        <div className="md:col-span-3 lg:col-span-1">
          <Label htmlFor="pax">Passengers</Label>
          <select id="pax" className="field" value={pax} onChange={(e) => { setPax(Number(e.target.value)); invalidate(); }} data-testid="select-pax">
            {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <button className="btn btn-primary h-11 md:col-span-3 lg:col-span-1" data-testid="button-estimate"><Route className="h-4 w-4" /> Estimate</button>
        {err && <p className="text-sm text-destructive md:col-span-3 lg:col-span-5" role="alert" data-testid="text-taxi-error">{err}</p>}
      </form>

      <div className="mt-6">
        {!query ? (
          <Empty icon={CarFront} title="Where are you heading?" text="Choose a pickup and destination across Kuwait. We will show three illustrative ride options." />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
            <section aria-label="Ride options">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground" data-testid="text-route-summary">
                <span className="text-foreground">{fromName}</span><span aria-hidden>→</span><span className="text-foreground">{toName}</span>
                <span className="chip font-num">{quotes[0]?.km} km est.</span>
                <span className="chip"><Users className="h-3 w-3" />{query.pax}</span>
              </div>
              <ul className="stagger space-y-2.5" key={JSON.stringify(query)} role="radiogroup" aria-label="Vehicle class">
                {quotes.map((q) => {
                  const active = pickId === q.vehicle.id;
                  return (
                    <li key={q.vehicle.id}>
                      <button type="button" role="radio" aria-checked={active} disabled={!q.fits} onClick={() => setPickId(q.vehicle.id)} data-testid={`button-vehicle-${q.vehicle.id}`}
                        className={`surface lift flex w-full items-center gap-4 p-4 text-left sm:p-5 disabled:cursor-not-allowed disabled:opacity-50 ${active ? "!border-primary/60 bg-primary/5" : ""}`}>
                        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-colors ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary text-primary"}`}><CarFront className="h-5 w-5" /></span>
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2"><span className="font-medium">{q.vehicle.name}</span><span className="chip"><Users className="h-3 w-3" />{q.vehicle.seats}</span></span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">{q.fits ? q.vehicle.desc : `Seats up to ${q.vehicle.seats}. Too small for ${query.pax} passengers.`}</span>
                        </span>
                        <span className="text-right">
                          <span className="font-num block text-primary">{kwd(q.fare)}</span>
                          <span className="font-num mt-0.5 flex items-center justify-end gap-1 text-[11px] text-muted-foreground"><Clock className="h-3 w-3" />~{q.minutes} min</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Fares, times and distances are illustrative estimates from a simple area grid, not live data.</p>
            </section>

            <aside className="surface rise p-4 sm:p-5 lg:sticky lg:top-6" aria-label="Ride summary">
              {!pick ? (
                <div className="py-6 text-center text-sm text-muted-foreground"><Navigation className="mx-auto mb-3 h-6 w-6 text-primary" />Select a vehicle to review your demo ride.</div>
              ) : (
                <div className="space-y-4" key={pick.vehicle.id}>
                  <h2 className="font-display text-xl font-semibold">Ride summary</h2>
                  <ol className="relative space-y-3 border-l border-dashed border-primary/40 pl-5 text-sm">
                    <li className="relative"><MapPin className="absolute -left-[27px] top-0.5 h-4 w-4 rounded-full bg-card text-primary" /><p className="text-xs text-muted-foreground">Pickup</p><p>{fromName}</p></li>
                    <li className="relative"><MapPin className="absolute -left-[27px] top-0.5 h-4 w-4 rounded-full bg-card text-accent" /><p className="text-xs text-muted-foreground">Destination</p><p>{toName}</p></li>
                  </ol>
                  <dl className="grid grid-cols-3 gap-2 rounded-xl border border-border p-3 text-center text-xs">
                    <div><dt className="text-muted-foreground">Vehicle</dt><dd className="mt-0.5 font-medium">{pick.vehicle.name}</dd></div>
                    <div><dt className="text-muted-foreground">Distance</dt><dd className="font-num mt-0.5">{pick.km} km</dd></div>
                    <div><dt className="text-muted-foreground">Time</dt><dd className="font-num mt-0.5">~{pick.minutes} min</dd></div>
                  </dl>
                  <div className="flex justify-between border-t border-border pt-3 text-sm"><span>{query.pax} passenger{query.pax > 1 ? "s" : ""} · fare</span><span className="font-num text-primary">{kwd(pick.fare)}</span></div>
                  <DemoNote>Demo only. No driver is assigned or dispatched and no taxi service is contacted.</DemoNote>
                  <KnetDemo total={pick.fare} onApproved={book} />
                </div>
              )}
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
