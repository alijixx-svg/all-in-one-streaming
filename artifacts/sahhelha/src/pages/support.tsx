import { useState, type FormEvent } from "react";
import { Link, useSearch } from "wouter";
import { LifeBuoy, CheckCircle2, RotateCcw, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { fmtDate, kwd } from "@/lib/format";
import { PageHeader, Empty, Label, DemoNote } from "@/components/app/ui-bits";
import { StatusChip } from "./orders";
import { useToast } from "@/hooks/use-toast";

export default function Support() {
  const search = useSearch();
  const { orders, tickets, addTicket, resolveTicket, deleteTicket } = useStore();
  const { toast } = useToast();
  const [orderId, setOrderId] = useState(() => new URLSearchParams(search).get("order") ?? orders[0]?.id ?? "");
  const [type, setType] = useState<"complaint" | "refund">("complaint");
  const [desc, setDesc] = useState("");
  const [err, setErr] = useState("");
  const [tab, setTab] = useState<"open" | "resolved">("open");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!orders.find((o) => o.id === orderId)) return setErr("Choose an order to link.");
    if (desc.trim().length < 10) return setErr("Describe the issue in at least 10 characters.");
    addTicket({ orderId, type, description: desc.trim() }); setDesc(""); setErr(""); setTab("open");
    toast({ title: "Request logged", description: "Saved in this browser. No provider was contacted." });
  };
  const list = tickets.filter((t) => t.status === tab);
  return (
    <div>
      <PageHeader eyebrow="Help" title="Complaints & refunds" sub="Keep a clear record of issues with your demo orders. Requests are tracked locally; no refund is actually issued." />
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        {orders.length === 0 ? <Empty icon={LifeBuoy} title="No orders to link" text="Create a demo order first, then report issues here." action={<Link href="/shop" className="btn btn-primary">Go to shop</Link>} /> : (
          <form onSubmit={submit} className="surface rise h-fit space-y-4 p-5 lg:sticky lg:top-24">
            <h2 className="font-display text-xl font-semibold">New request</h2>
            <div><Label>Type</Label><div className="grid grid-cols-2 gap-2 rounded-full border border-border bg-background p-1">{(["complaint", "refund"] as const).map((t) => <button type="button" key={t} onClick={() => setType(t)} data-testid={`toggle-type-${t}`} className={`h-10 rounded-full text-sm font-medium capitalize ${type === t ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t === "refund" ? "Refund request" : "Complaint"}</button>)}</div></div>
            <div><Label htmlFor="ord">Linked order</Label><select id="ord" className="field" value={orderId} onChange={(e) => setOrderId(e.target.value)} data-testid="select-order">{orders.map((o) => <option key={o.id} value={o.id}>{o.ref} · {o.title} · {kwd(o.total)}</option>)}</select></div>
            <div><Label htmlFor="desc">What happened?</Label><textarea id="desc" rows={4} className="field resize-none" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. One item was missing from the bag" data-testid="input-description" /></div>
            {err && <p className="text-sm text-destructive" role="alert">{err}</p>}
            <DemoNote>Demo: this is stored only in your browser and sent to no one.</DemoNote>
            <button className="btn btn-primary w-full" data-testid="button-submit-request">Log demo request</button>
          </form>)}
        <div>
          <div className="mb-4 inline-grid grid-cols-2 gap-1 rounded-full border border-border p-1">{(["open", "resolved"] as const).map((t) => <button key={t} onClick={() => setTab(t)} data-testid={`tab-${t}`} className={`h-9 rounded-full px-5 text-sm capitalize ${tab === t ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>{t} <span className="font-num text-xs">{tickets.filter((x) => x.status === t).length}</span></button>)}</div>
          {list.length === 0 ? <Empty icon={CheckCircle2} title={tab === "open" ? "Nothing open" : "Nothing resolved yet"} text={tab === "open" ? "All quiet. Log a request when something goes wrong." : "Resolved requests will show up here."} /> : (
            <ul className="stagger space-y-2.5">{list.map((t) => { const o = orders.find((x) => x.id === t.orderId); return (
              <li key={t.id} className="surface p-4" data-testid={`row-ticket-${t.id}`}>
                <div className="flex flex-wrap items-center gap-2"><span className="chip">{t.type === "refund" ? "Refund request" : "Complaint"}</span><StatusChip s={t.status} /><span className="ml-auto text-xs text-muted-foreground">{fmtDate(t.createdAt)}</span></div>
                <p className="mt-3 break-words text-sm">{t.description}</p>
                <p className="font-num mt-2 truncate text-xs text-muted-foreground">{o ? `${o.ref} · ${o.title}` : "Order removed"}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="btn btn-ghost h-10" onClick={() => resolveTicket(t.id)} data-testid={`button-toggle-${t.id}`}>{t.status === "open" ? <><CheckCircle2 className="h-4 w-4" /> Mark resolved</> : <><RotateCcw className="h-4 w-4" /> Reopen</>}</button>
                  <button className="btn btn-danger h-10" onClick={() => deleteTicket(t.id)} data-testid={`button-delete-${t.id}`}><Trash2 className="h-4 w-4" /> Delete</button>
                </div>
              </li>); })}</ul>)}
        </div>
      </div>
    </div>
  );
}
