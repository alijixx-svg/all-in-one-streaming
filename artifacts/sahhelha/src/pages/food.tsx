import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Star, Clock, ArrowLeft, UtensilsCrossed } from "lucide-react";
import { restaurants } from "@/data/restaurants";
import { useStore, type DemoPayment } from "@/lib/store";
import { KnetDemo } from "@/components/app/knet-demo";
import { kwd } from "@/lib/format";
import { PageHeader, DemoNote, Art, Qty, Empty } from "@/components/app/ui-bits";
import { useToast } from "@/hooks/use-toast";

export default function Food() {
  const search = useSearch();
  const [, go] = useLocation();
  const { foodCart, setFoodQty, clearFood, createOrder } = useStore();
  const { toast } = useToast();
  const [rid, setRid] = useState<string | null>(() => new URLSearchParams(search).get("r"));
  useEffect(() => { const r = new URLSearchParams(search).get("r"); if (r) setRid(r); }, [search]);
  const r = restaurants.find((x) => x.id === rid);

  if (!r) return (
    <div>
      <PageHeader eyebrow="Tonight" title="Order food" sub="Explore familiar restaurant names and local demo kitchens. Build a basket and try a demo order." />
      <div className="mb-5"><DemoNote>Independent demo — not affiliated with or endorsed by these restaurants. Menus, prices, ratings and delivery times are illustrative, not official or live. No restaurant receives your order.</DemoNote></div>
      {foodCart && <button onClick={() => setRid(foodCart.restaurantId)} className="surface rise mb-4 flex w-full items-center justify-between p-4 text-left text-sm" data-testid="button-resume-basket"><span>You have a basket at <b>{restaurants.find((x) => x.id === foodCart.restaurantId)?.name}</b></span><span className="text-primary">Resume</span></button>}
      <div className="stagger grid gap-4 sm:grid-cols-2">
        {restaurants.map((x) => (
          <button key={x.id} onClick={() => setRid(x.id)} className="surface lift p-3 text-left" data-testid={`card-restaurant-${x.id}`}>
            <Art hue={x.hue} label={x.cuisine} className="h-32" />
            <div className="p-2 pt-3"><h3 className="font-display text-lg font-semibold">{x.name}</h3>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground"><span>{x.area}</span><span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-primary text-primary" />{x.rating} demo</span><span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{x.eta} demo</span><span className="font-num">Delivery {kwd(x.fee)}</span></p></div>
          </button>))}
      </div>
    </div>);

  const items = foodCart?.restaurantId === r.id ? foodCart.items : {};
  const otherBasket = foodCart && foodCart.restaurantId !== r.id;
  const sub = r.menu.reduce((a, m) => a + (items[m.id] ?? 0) * m.price, 0);
  const count = Object.values(items).reduce((a, b) => a + b, 0);
  const place = (payment: DemoPayment) => {
    if (!count) return;
    const o = createOrder({ kind: "food", title: r.name, lines: [...r.menu.filter((m) => items[m.id]).map((m) => ({ label: m.name, qty: items[m.id], unit: m.price })), { label: "Delivery fee", qty: 1, unit: r.fee }], total: sub + r.fee, meta: `${r.area} · demo order, nothing delivered`, payment });
    clearFood(); toast({ title: "Demo food order created", description: `${o.ref} saved. The restaurant was not contacted.` }); go("/orders");
  };
  return (
    <div>
      <button onClick={() => { setRid(null); go("/food"); }} className="mb-4 flex h-10 items-center gap-2 text-sm text-muted-foreground hover:text-foreground" data-testid="button-back-restaurants"><ArrowLeft className="h-4 w-4" /> All restaurants</button>
      <div className="rise relative mb-6 overflow-hidden rounded-3xl"><Art hue={r.hue} label="" className="h-36 sm:h-44" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-5"><h1 className="font-display text-3xl font-bold sm:text-4xl">{r.name}</h1><p className="text-sm text-muted-foreground">{r.cuisine} · {r.area} · {r.eta}</p></div></div>
      <div className="mb-4"><DemoNote>Illustrative menu, prices and delivery time only. Not an official restaurant listing; no affiliation, real payment or delivery.</DemoNote></div>
      {otherBasket && <div className="mb-4"><DemoNote>Adding items here will replace your basket from {restaurants.find((x) => x.id === foodCart!.restaurantId)?.name}.</DemoNote></div>}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <ul className="stagger space-y-2.5">{r.menu.map((m) => (
          <li key={m.id} className="surface flex items-center gap-3 p-4" data-testid={`row-menu-${m.id}`}>
            <div className="min-w-0 flex-1"><p className="font-medium">{m.name}</p><p className="text-sm text-muted-foreground">{m.desc}</p><p className="font-num mt-1 text-sm text-primary">{kwd(m.price)}</p></div>
            {items[m.id] ? <Qty value={items[m.id]} onChange={(n) => setFoodQty(r.id, m.id, n)} id={m.id} /> : <button className="btn btn-ghost h-10" onClick={() => setFoodQty(r.id, m.id, 1)} data-testid={`button-add-${m.id}`}>Add</button>}
          </li>))}</ul>
        <aside className="surface h-fit p-5 lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold">Your basket</h2>
          {count === 0 ? <Empty icon={UtensilsCrossed} title="Empty basket" text="Add a dish to get started." /> : (<>
            <ul className="mt-3 space-y-1.5 text-sm">{r.menu.filter((m) => items[m.id]).map((m) => <li key={m.id} className="flex justify-between gap-2"><span className="truncate">{items[m.id]} x {m.name}</span><span className="font-num shrink-0">{kwd(items[m.id] * m.price)}</span></li>)}
              <li className="flex justify-between text-muted-foreground"><span>Delivery</span><span className="font-num">{kwd(r.fee)}</span></li></ul>
            <div className="mt-3 flex justify-between border-t border-border pt-3"><span>Total</span><span className="font-num text-primary" data-testid="text-food-total">{kwd(sub + r.fee)}</span></div>
            <div className="mt-4 space-y-3"><DemoNote>Demo only. No payment, no delivery.</DemoNote><KnetDemo key={r.id} total={sub + r.fee} onApproved={place} /></div></>)}
        </aside>
      </div>
    </div>);
}
