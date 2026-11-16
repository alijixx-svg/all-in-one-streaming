import { useMemo, useState, type FormEvent } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowLeftRight, Plane, PlaneTakeoff } from "lucide-react";
import { airports, searchFlights, cityOf, type FlightResult } from "@/data/flights";
import { useStore, type DemoPayment } from "@/lib/store";
import { KnetDemo } from "@/components/app/knet-demo";
import { kwd, fmtDate } from "@/lib/format";
import { PageHeader, Label, Modal, DemoNote, Empty } from "@/components/app/ui-bits";
import { useToast } from "@/hooks/use-toast";

const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

export default function Flights() {
  const search = useSearch();
  const [, go] = useLocation();
  const { createOrder } = useStore();
  const { toast } = useToast();
  const [from, setFrom] = useState("KWI");
  const [to, setTo] = useState(() => new URLSearchParams(search).get("to") ?? "DXB");
  const [date, setDate] = useState(tomorrow);
  const [pax, setPax] = useState(1);
  const [query, setQuery] = useState<{ from: string; to: string; date: string; pax: number } | null>(() => new URLSearchParams(search).get("to") ? { from: "KWI", to: new URLSearchParams(search).get("to")!, date: tomorrow, pax: 1 } : null);
  const [err, setErr] = useState("");
  const [pick, setPick] = useState<FlightResult | null>(null);
  const results = useMemo(() => query ? searchFlights(query.from, query.to, query.date) : [], [query]);

  const submit = (e: FormEvent) => { e.preventDefault(); if (from === to) return setErr("Origin and destination must differ."); if (!date) return setErr("Choose a date."); setErr(""); setQuery({ from, to, date, pax }); };
  const book = (payment: DemoPayment) => {
    if (!pick || !query) return;
    const o = createOrder({ kind: "flight", title: `${cityOf(pick.from)} to ${cityOf(pick.to)}`, lines: [{ label: `${pick.carrier} ${pick.flightNo}`, detail: `${fmtDate(pick.date)} · ${pick.depart}-${pick.arrive}`, qty: query.pax, unit: pick.pricePerPax }], total: pick.pricePerPax * query.pax, meta: `${query.pax} passenger${query.pax > 1 ? "s" : ""} · demo booking, no ticket issued`, payment });
    setPick(null); toast({ title: "Demo booking saved", description: `${o.ref}. No airline was contacted.` }); go("/orders");
  };
  const sel = (v: string, set: (s: string) => void, id: string) => <select id={id} className="field" value={v} onChange={(e) => set(e.target.value)} data-testid={`select-${id}`}>{airports.map((a) => <option key={a.code} value={a.code}>{a.city} ({a.code})</option>)}</select>;

  return (
    <div>
      <PageHeader eyebrow="Travel" title="Find a flight" sub="Results are generated for demo purposes from your search. Airlines and fares are illustrative." />
      <form onSubmit={submit} className="surface rise grid gap-4 p-4 sm:p-5 md:grid-cols-[1fr_auto_1fr] lg:grid-cols-[1fr_auto_1fr_170px_120px_auto] lg:items-end">
        <div><Label htmlFor="from">From</Label>{sel(from, setFrom, "from")}</div>
        <button type="button" onClick={() => { setFrom(to); setTo(from); }} aria-label="Swap" data-testid="button-swap" className="mx-auto grid h-11 w-11 place-items-center self-end rounded-full border border-border bg-secondary text-primary transition-transform hover:rotate-180"><ArrowLeftRight className="h-4 w-4" /></button>
        <div><Label htmlFor="to">To</Label>{sel(to, setTo, "to")}</div>
        <div className="grid grid-cols-2 gap-4 md:col-span-3 lg:contents">
          <div><Label htmlFor="date">Date</Label><input id="date" type="date" min={new Date().toISOString().slice(0, 10)} className="field" value={date} onChange={(e) => setDate(e.target.value)} data-testid="input-date" /></div>
          <div><Label htmlFor="pax">Passengers</Label><select id="pax" className="field" value={pax} onChange={(e) => setPax(Number(e.target.value))} data-testid="select-pax">{[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}</select></div>
        </div>
        <button className="btn btn-primary h-11 md:col-span-3 lg:col-span-1" data-testid="button-search-flights"><PlaneTakeoff className="h-4 w-4" /> Search</button>
        {err && <p className="text-sm text-destructive md:col-span-3 lg:col-span-6" role="alert">{err}</p>}
      </form>
      <div className="mt-6">
        {!query ? <Empty icon={Plane} title="Where to next?" text="Pick a route and date. We will show four demo options that match your search." /> : (<>
          <p className="mb-3 text-sm text-muted-foreground" data-testid="text-results-summary">{cityOf(query.from)} to {cityOf(query.to)} · {fmtDate(query.date)} · {query.pax} passenger{query.pax > 1 ? "s" : ""}</p>
          <ul className="stagger space-y-2.5" key={JSON.stringify(query)}>{results.map((f, i) => (
            <li key={f.id} className="surface lift flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5" data-testid={`card-flight-${i}`}>
              <div className="sm:w-40"><p className="text-sm font-medium">{f.carrier}</p><p className="font-num text-xs text-muted-foreground">{f.flightNo}</p></div>
              <div className="flex flex-1 items-center gap-3">
                <div><p className="font-num text-xl">{f.depart}</p><p className="text-xs text-muted-foreground">{f.from}</p></div>
                <div className="relative flex-1 text-center"><div className="h-px bg-border" /><p className="mt-1 text-[11px] text-muted-foreground">{Math.floor(f.durationMin / 60)}h {f.durationMin % 60}m · {f.stops ? "1 stop" : "Direct"}</p></div>
                <div className="text-right"><p className="font-num text-xl">{f.arrive}</p><p className="text-xs text-muted-foreground">{f.to}</p></div>
              </div>
              <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
                <div className="sm:text-right"><p className="font-num text-primary">{kwd(f.pricePerPax * query.pax)}</p><p className="text-[11px] text-muted-foreground">{kwd(f.pricePerPax)} / person</p></div>
                <button className="btn btn-ghost h-10" onClick={() => setPick(f)} data-testid={`button-select-flight-${i}`}>Select</button>
              </div>
            </li>))}</ul></>)}
      </div>
      <Modal open={!!pick} onOpenChange={() => setPick(null)} title="Confirm demo booking" desc="We do not collect passport or card details in this demo.">
        {pick && query && <div className="space-y-4">
          <div className="rounded-xl border border-border p-4 text-sm"><p className="font-medium">{cityOf(pick.from)} to {cityOf(pick.to)}</p><p className="text-muted-foreground">{pick.carrier} {pick.flightNo} · {fmtDate(pick.date)} · {pick.depart}-{pick.arrive}</p>
            <div className="mt-3 flex justify-between border-t border-border pt-3"><span>{query.pax} x {kwd(pick.pricePerPax)}</span><span className="font-num text-primary">{kwd(pick.pricePerPax * query.pax)}</span></div></div>
          <DemoNote>No ticket is issued and no airline is contacted. Fares are illustrative.</DemoNote>
          <KnetDemo total={pick.pricePerPax * query.pax} onApproved={book} />
          <button className="btn btn-ghost w-full" onClick={() => setPick(null)}>Back</button>
        </div>}
      </Modal>
    </div>
  );
}
