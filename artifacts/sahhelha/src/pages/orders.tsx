import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Package, ShoppingBag, UtensilsCrossed, Plane, Car, LifeBuoy } from "lucide-react";
import { useStore, type Order } from "@/lib/store";
import { kwd, fmtDate } from "@/lib/format";
import { PageHeader, Empty, Modal, DemoNote } from "@/components/app/ui-bits";
import { useToast } from "@/hooks/use-toast";

const icons = { shop: ShoppingBag, food: UtensilsCrossed, flight: Plane, taxi: Car };
const filters = ["all", "shop", "food", "flight", "taxi"] as const;

export function StatusChip({ s }: { s: string }) {
  const map: Record<string, string> = { placed: "text-accent border-accent/30", cancelled: "text-muted-foreground", open: "text-primary border-primary/30", resolved: "text-accent border-accent/30" };
  return <span className={`chip capitalize ${map[s] ?? ""}`}>{s === "placed" ? "Placed (demo)" : s === "cancelled" ? "Cancelled (demo)" : s}</span>;
}

export default function Orders() {
  const { orders, cancelOrder, tickets } = useStore();
  const { toast } = useToast();
  const [, go] = useLocation();
  const [f, setF] = useState<(typeof filters)[number]>("all");
  const [open, setOpen] = useState<Order | null>(null);
  const [confirm, setConfirm] = useState(false);
  const list = orders.filter((o) => f === "all" || o.kind === f);
  const cur = open ? orders.find((o) => o.id === open.id) ?? null : null;
  return (
    <div>
      <PageHeader eyebrow="History" title="Your orders" sub="Every demo order, food basket, flight and taxi booking, saved in this browser." />
      <div className="rise -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">{filters.map((x) => <button key={x} onClick={() => setF(x)} data-testid={`filter-orders-${x}`} className={`h-9 shrink-0 rounded-full border px-4 text-sm capitalize ${f === x ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{x === "flight" ? "Flights" : x}</button>)}</div>
      {list.length === 0 ? <Empty icon={Package} title="No orders here yet" text="Create a demo order from the shop, a food basket, a flight search, or a taxi booking." action={<div className="flex flex-wrap justify-center gap-2"><Link href="/shop" className="btn btn-primary">Shop</Link><Link href="/food" className="btn btn-ghost">Food</Link><Link href="/flights" className="btn btn-ghost">Flights</Link><Link href="/taxi" className="btn btn-ghost">Taxi</Link></div>} /> : (
        <ul className="stagger space-y-2.5">{list.map((o) => { const I = icons[o.kind]; return (
          <li key={o.id}><button onClick={() => setOpen(o)} className="surface lift flex w-full items-center gap-3 p-4 text-left" data-testid={`row-order-${o.id}`}>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary"><I className="h-5 w-5 text-primary" /></span>
            <span className="min-w-0 flex-1"><span className="block truncate font-medium">{o.title}</span><span className="font-num block truncate text-xs text-muted-foreground">{o.ref} · {fmtDate(o.createdAt)}</span></span>
            <span className="flex flex-col items-end gap-1"><span className={`font-num text-sm ${o.status === "cancelled" ? "text-muted-foreground line-through" : ""}`}>{kwd(o.total)}</span><StatusChip s={o.status} /></span>
          </button></li>); })}</ul>)}
      <Modal open={!!cur} onOpenChange={() => { setOpen(null); setConfirm(false); }} title={cur?.title ?? ""} desc={cur ? `${cur.ref} · ${fmtDate(cur.createdAt)}${cur.meta ? ` · ${cur.meta}` : ""}` : ""}>
        {cur && <div className="space-y-4">
          <div className="flex flex-wrap gap-2"><StatusChip s={cur.status} />{cur.example && <span className="chip">Example</span>}</div>
          {cur.payment && <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm" data-testid="knet-demo-receipt">
            <p className="font-medium">KNET · Simulated payment</p>
            <p className="mt-1 break-all font-num text-xs text-muted-foreground">{cur.payment.reference}</p>
            <p className="mt-1 text-xs text-muted-foreground">Demo reference only. No money was charged.</p>
          </div>}
          <ul className="divide-y divide-border rounded-xl border border-border text-sm">{cur.lines.map((l, i) => <li key={i} className="flex justify-between gap-3 p-3"><span className="min-w-0"><span className="block">{l.qty} x {l.label}</span>{l.detail && <span className="block text-xs text-muted-foreground">{l.detail}</span>}</span><span className="font-num shrink-0">{kwd(l.qty * l.unit)}</span></li>)}
            {!!cur.discount && <>
              <li className="flex justify-between p-3"><span>Subtotal</span><span className="font-num">{kwd(cur.originalTotal ?? cur.total + cur.discount)}</span></li>
              <li className="flex justify-between p-3 text-accent"><span>Welcome discount (30%)</span><span className="font-num">−{kwd(cur.discount)}</span></li>
            </>}
            <li className="flex justify-between p-3 font-medium"><span>Total</span><span className="font-num text-primary">{kwd(cur.total)}</span></li></ul>
          {tickets.filter((t) => t.orderId === cur.id).length > 0 && <p className="text-xs text-muted-foreground">{tickets.filter((t) => t.orderId === cur.id).length} support request(s) linked.</p>}
          {confirm ? <div className="space-y-3"><DemoNote>This only marks the order as cancelled in your demo history. Nothing real is cancelled or refunded.</DemoNote>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button className="btn btn-ghost" onClick={() => setConfirm(false)}>Keep order</button><button className="btn btn-danger" onClick={() => { cancelOrder(cur.id); setConfirm(false); toast({ title: "Demo order cancelled" }); }} data-testid="button-confirm-cancel">Cancel demo order</button></div></div>
          : <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button className="btn btn-ghost" onClick={() => go(`/support?order=${cur.id}`)} data-testid="button-report-issue"><LifeBuoy className="h-4 w-4" /> Report an issue</button>
              {cur.status === "placed" && <button className="btn btn-danger" onClick={() => setConfirm(true)} data-testid="button-cancel-order">Cancel order</button>}
            </div>}
        </div>}
      </Modal>
    </div>
  );
}
