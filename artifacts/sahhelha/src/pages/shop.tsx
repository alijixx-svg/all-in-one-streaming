import { useEffect, useMemo, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Heart, Search, ShoppingBag, Check, Truck, X } from "lucide-react";
import { products, productCategories } from "@/data/products";
import { useStore, type DemoPayment } from "@/lib/store";
import { KnetDemo } from "@/components/app/knet-demo";
import { kwd } from "@/lib/format";
import { PageHeader, Empty, Modal, DemoNote, Art, Qty } from "@/components/app/ui-bits";
import { useToast } from "@/hooks/use-toast";

export default function Shop() {
  const search = useSearch();
  const [, go] = useLocation();
  const { favorites, toggleFav, cart, addToCart, setCartQty, clearCart, createOrder } = useStore();
  const { toast } = useToast();
  const [q, setQ] = useState(() => new URLSearchParams(search).get("q") ?? "");
  const [cat, setCat] = useState<string>("All");
  const [favOnly, setFavOnly] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(() => { const v = new URLSearchParams(search).get("q"); if (v !== null) setQ(v); }, [search]);

  const list = useMemo(() => products.filter((p) => (cat === "All" || p.category === cat) && (!favOnly || favorites.includes(p.id)) && `${p.name} ${p.brand} ${p.spec}`.toLowerCase().includes(q.toLowerCase().trim())), [q, cat, favOnly, favorites]);
  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);

  const checkout = (payment: DemoPayment) => {
    if (!cart.length) return;
    const o = createOrder({ kind: "shop", title: `${cart.length} device${cart.length > 1 ? "s" : ""}`, lines: cart.map((c) => ({ label: products.find((p) => p.id === c.productId)?.name ?? c.productId, detail: c.store, qty: c.qty, unit: c.price })), total, meta: "Demo order, nothing shipped", payment });
    clearCart(); setCartOpen(false);
    toast({ title: "Demo order created", description: `${o.ref} saved in Orders. No payment taken.` });
    go("/orders");
  };

  return (
    <div>
      <PageHeader eyebrow="Compare" title="Shop devices" sub="Each device shows 2-3 store offers side by side. All prices are illustrative examples, not live quotes."
        action={<button className="btn btn-primary" onClick={() => setCartOpen(true)} data-testid="button-open-cart"><ShoppingBag className="h-4 w-4" /> Cart <span className="font-num">{cart.length}</span></button>} />
      <div className="rise mb-5 flex flex-col gap-3">
        <div className="relative"><Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input className="field pl-10" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, brand, spec" data-testid="input-shop-search" />
          {q && <button className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-muted-foreground" onClick={() => { setQ(""); go("/shop"); }} aria-label="Clear"><X className="h-4 w-4" /></button>}</div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {productCategories.map((c) => <button key={c} onClick={() => setCat(c)} data-testid={`filter-${c}`} className={`h-9 shrink-0 rounded-full border px-4 text-sm transition-colors ${cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>{c}</button>)}
          <button onClick={() => setFavOnly(!favOnly)} data-testid="filter-favorites" className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm ${favOnly ? "border-primary text-primary" : "border-border text-muted-foreground"}`}><Heart className={`h-3.5 w-3.5 ${favOnly ? "fill-primary" : ""}`} /> Saved</button>
        </div>
      </div>
      {list.length === 0 ? <Empty icon={Search} title="Nothing matches" text={favOnly ? "You have no saved devices in this view yet." : "Try a brand like Apple or a category like Audio."} action={<button className="btn btn-ghost" onClick={() => { setQ(""); setCat("All"); setFavOnly(false); }}>Clear filters</button>} /> : (
        <div className="stagger grid gap-4 md:grid-cols-2">
          {list.map((p) => { const best = Math.min(...p.offers.map((o) => o.price)); const inCart = cart.find((c) => c.productId === p.id); const fav = favorites.includes(p.id); return (
            <article key={p.id} className="surface p-4 sm:p-5" data-testid={`card-product-${p.id}`}>
              <div className="flex gap-4">
                <Art hue={p.hue} label={p.brand.slice(0, 2)} className="h-20 w-20 shrink-0 sm:h-24 sm:w-24" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="text-xs text-muted-foreground">{p.brand} · {p.category}</p><h3 className="font-display text-lg font-semibold leading-tight">{p.name}</h3></div>
                    <button onClick={() => toggleFav(p.id)} aria-label={fav ? "Remove from saved" : "Save"} data-testid={`button-fav-${p.id}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border transition-transform active:scale-90"><Heart className={`h-4 w-4 transition-colors ${fav ? "fill-primary text-primary" : "text-muted-foreground"}`} /></button></div>
                  <p className="mt-1 text-sm text-muted-foreground">{p.spec}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {[...p.offers].sort((a, b) => a.price - b.price).map((o) => { const sel = inCart?.store === o.store; return (
                  <button key={o.store} onClick={() => { addToCart({ productId: p.id, store: o.store, price: o.price }); toast({ title: "Added to demo cart", description: `${p.name} from ${o.store}` }); }} data-testid={`button-offer-${p.id}-${o.store.replace(/\s/g, "")}`}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-colors ${sel ? "border-primary bg-primary/10" : "border-border hover:border-primary/40"}`}>
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${sel ? "border-primary bg-primary" : "border-input"}`}>{sel && <Check className="h-3 w-3 text-primary-foreground" />}</span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{o.store}</span><span className="flex items-center gap-1 text-xs text-muted-foreground"><Truck className="h-3 w-3" />{o.delivery}{o.note && ` · ${o.note}`}</span></span>
                    <span className="text-right"><span className="font-num block text-sm">{kwd(o.price)}</span>{o.price === best && <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">Lowest</span>}</span>
                  </button>); })}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">Illustrative prices for demo purposes.</p>
            </article>); })}
        </div>)}

      <Modal open={cartOpen} onOpenChange={setCartOpen} title="Demo cart" desc="Review your picks. Placing the order only saves it in this browser.">
        {cart.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">Your cart is empty. Tap an offer to add it.</p> : (
          <div className="space-y-4">
            <ul className="divide-y divide-border">{cart.map((c) => { const p = products.find((x) => x.id === c.productId); return (
              <li key={c.productId} className="flex items-center gap-3 py-3"><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{p?.name}</p><p className="truncate text-xs text-muted-foreground">{c.store} · {kwd(c.price)}</p></div><Qty value={c.qty} onChange={(n) => setCartQty(c.productId, n)} id={c.productId} /></li>); })}</ul>
            <div className="flex items-center justify-between border-t border-border pt-3"><span className="text-sm text-muted-foreground">Total</span><span className="font-num text-lg text-primary" data-testid="text-cart-total">{kwd(total)}</span></div>
            <DemoNote>Demo only: no payment is taken and no store is contacted.</DemoNote>
            <KnetDemo total={total} onApproved={checkout} />
            <button className="btn btn-ghost w-full" onClick={clearCart}>Clear cart</button>
          </div>)}
      </Modal>
    </div>
  );
}
