import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useAuth } from "@clerk/react";
import { getGetMyDataQueryKey, useGetMyData, useSaveMyData } from "@workspace/api-client-react";
import { uid } from "./format";
import { demoPrice } from "./pricing";

export type Subscription = { id: string; name: string; cost: number; billing: "monthly" | "yearly"; renewal: string; paused: boolean; example?: boolean };
export type StreamingMembership = {
  id?: string;
  recordType: "demo";
  hasPurchasedBefore: boolean;
  startedAt?: string;
  endsAt?: string;
  paidAmount?: number;
  paymentReference?: string;
  status?: "scheduled" | "ended";
  endedAt?: string;
};
export type OrderLine = { label: string; detail?: string; qty: number; unit: number };
export type OrderKind = "shop" | "food" | "flight" | "taxi";
export type DemoPayment = { method: "KNET"; status: "simulated"; reference: string };
export type Order = { id: string; ref: string; kind: OrderKind; title: string; lines: OrderLine[]; total: number; createdAt: string; status: "placed" | "cancelled"; meta?: string; example?: boolean; payment?: DemoPayment; originalTotal?: number; discount?: number };
export type Ticket = { id: string; orderId: string; type: "complaint" | "refund"; description: string; status: "open" | "resolved"; createdAt: string };
export type CartItem = { productId: string; store: string; price: number; qty: number };
export type FoodCart = { restaurantId: string; items: Record<string, number> } | null;

export type Data = { subscriptions: Subscription[]; streamingMembership: StreamingMembership; streamingMembershipHistory: StreamingMembership[]; orders: Order[]; tickets: Ticket[]; favorites: string[]; cart: CartItem[]; foodCart: FoodCart; welcomeOffer: "unseen" | "available" | "dismissed" | "used" };
const KEY = "sahhelha.demo.v1";
export const LIVE_STREAMING_CHECKOUT_ENABLED = false;
const seed: Data = {
  subscriptions: [],
  streamingMembership: { recordType: "demo", hasPurchasedBefore: false },
  streamingMembershipHistory: [],
  orders: [],
  tickets: [], favorites: [], cart: [], foodCart: null, welcomeOffer: "dismissed",
};

function withMembershipIds(data: Data): Data {
  const ensureId = (membership: StreamingMembership) => ({
    ...membership,
    // Existing locally saved and account records were created by the demo flow.
    // Do not treat older records without an explicit type as live access.
    recordType: "demo" as const,
    ...(membership.startedAt || membership.endsAt
      ? { id: membership.id ?? `legacy-${membership.startedAt ?? "unknown"}-${membership.endsAt ?? "unknown"}` }
      : {}),
  });
  return {
    ...data,
    streamingMembership: ensureId(data.streamingMembership),
    streamingMembershipHistory: data.streamingMembershipHistory.map(ensureId),
  };
}

type Ctx = Data & {
  discountEligible: boolean; claimWelcomeOffer: () => void; dismissWelcomeOffer: () => void;
  storageError: string | null; retrySave: () => void; resetDemo: () => void;
  completeStreamingMembership: (membership: Omit<StreamingMembership, "hasPurchasedBefore" | "recordType">) => void;
  renewStreamingMembership: (membership: Omit<StreamingMembership, "hasPurchasedBefore" | "recordType" | "id">) => void;
  endStreamingMembership: (membershipId: string) => void;
  saveSub: (s: Omit<Subscription, "id"> & { id?: string }) => void; deleteSub: (id: string) => void; togglePause: (id: string) => void;
  createOrder: (o: Omit<Order, "id" | "ref" | "createdAt" | "status">) => Order; cancelOrder: (id: string) => void;
  addTicket: (t: Omit<Ticket, "id" | "createdAt" | "status">) => void; resolveTicket: (id: string) => void; deleteTicket: (id: string) => void;
  toggleFav: (id: string) => void; addToCart: (i: Omit<CartItem, "qty">) => void; setCartQty: (productId: string, qty: number) => void; clearCart: () => void;
  setFoodQty: (restaurantId: string, itemId: string, qty: number) => void; clearFood: () => void;
};
const StoreCtx = createContext<Ctx | null>(null);

function loadGuest(): { data: Data; error: string | null } {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { data: seed, error: null };
    const saved = JSON.parse(raw) as Partial<Data>;
    return {
      data: withMembershipIds({
        ...seed,
        ...saved,
        streamingMembershipHistory: saved.streamingMembershipHistory ?? [],
      }),
      error: null,
    };
  } catch {
    return { data: seed, error: "Could not read saved demo data from this browser. Starting with fresh examples." };
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { isLoaded: authLoaded, isSignedIn, userId } = useAuth();
  const identity = authLoaded && isSignedIn && userId ? `user:${userId}` : "guest";
  const [data, setData] = useState<Data>(seed);
  const [storageError, setErr] = useState<string | null>(null);
  const [readyIdentity, setReadyIdentity] = useState<string | null>(null);
  const ownerRef = useRef<string | null>(null);
  const persistedRef = useRef<{ identity: string; json: string } | null>(null);
  const pendingAccountSaveRef = useRef<{ identity: string; data: Data } | null>(null);
  const accountSaveInFlightRef = useRef(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flushAccountSaveRef = useRef<() => void>(() => undefined);
  const accountQuery = useGetMyData({
    query: {
      enabled: authLoaded && !!isSignedIn && !!userId,
      queryKey: [...getGetMyDataQueryKey(), userId ?? "guest"],
      retry: false,
    },
  });
  const saveAccount = useSaveMyData();
  const flushAccountSave = useCallback(() => {
    if (accountSaveInFlightRef.current) return;
    const pending = pendingAccountSaveRef.current;
    if (!pending) return;
    pendingAccountSaveRef.current = null;
    if (pending.identity !== ownerRef.current) return;
    accountSaveInFlightRef.current = true;
    void saveAccount.mutateAsync({
      data: { data: pending.data as import("@workspace/api-client-react").UserAppData },
    }).then(
      () => {
        if (pending.identity === ownerRef.current) setErr(null);
      },
      () => {
        if (pending.identity === ownerRef.current) {
          setErr("Your account changes could not be saved. Check your connection and try again.");
        }
      },
    ).finally(() => {
      accountSaveInFlightRef.current = false;
      if (pendingAccountSaveRef.current) flushAccountSaveRef.current();
    });
  }, [saveAccount.mutateAsync]);
  flushAccountSaveRef.current = flushAccountSave;
  const queueAccountSave = useCallback((identity: string, snapshot: Data) => {
    pendingAccountSaveRef.current = { identity, data: snapshot };
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null;
      flushAccountSave();
    }, 250);
  }, [flushAccountSave]);
  const accountReady = identity === "guest" || accountQuery.isSuccess;

  useEffect(() => {
    if (!authLoaded) return;
    if (ownerRef.current === identity) return;
    ownerRef.current = identity;
    persistedRef.current = null;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = null;
    pendingAccountSaveRef.current = null;
    setErr(null);
    if (identity === "guest") {
      const guest = loadGuest();
      setData(guest.data);
      setErr(guest.error);
      setReadyIdentity(identity);
    } else {
      setData(seed);
      setReadyIdentity(null);
    }
  }, [authLoaded, identity]);

  useEffect(() => {
    if (identity === "guest" || !accountQuery.isSuccess || ownerRef.current !== identity) return;
    const accountData = accountQuery.data?.data;
    setData(accountData ? withMembershipIds({
      ...seed,
      ...accountData as Data,
      streamingMembershipHistory: (accountData as Partial<Data>).streamingMembershipHistory ?? [],
    }) : seed);
    setReadyIdentity(identity);
  }, [identity, accountQuery.data, accountQuery.isSuccess]);

  const persist = useCallback((d: Data) => {
    try { localStorage.setItem(KEY, JSON.stringify(d)); setErr(null); }
    catch { setErr("Changes could not be saved in this browser (storage full or blocked). They will be lost on reload."); }
  }, []);
  useEffect(() => {
    if (readyIdentity !== identity) return;
    const json = JSON.stringify(data);
    if (persistedRef.current?.identity === identity && persistedRef.current.json === json) return;
    persistedRef.current = { identity, json };
    if (identity === "guest") {
      persist(data);
    } else {
      queueAccountSave(identity, data);
    }
  }, [data, identity, readyIdentity, persist, queueAccountSave]);

  const retrySave = useCallback(() => {
    if (identity === "guest") persist(data);
    else if (readyIdentity === identity) queueAccountSave(identity, data);
  }, [data, identity, persist, readyIdentity, queueAccountSave]);
  const up = (fn: (d: Data) => Data) => setData(fn);
  const discountEligible = data.welcomeOffer === "available" && !data.orders.some((o) => !o.example) && !data.streamingMembership.hasPurchasedBefore;

  const value: Ctx = {
    ...data, storageError,
    discountEligible,
    claimWelcomeOffer: () => up((d) => ({ ...d, welcomeOffer: d.welcomeOffer === "unseen" && !d.orders.some((o) => !o.example) && !d.streamingMembership.hasPurchasedBefore ? "available" : d.welcomeOffer })),
    dismissWelcomeOffer: () => up((d) => ({ ...d, welcomeOffer: d.welcomeOffer === "unseen" ? "dismissed" : d.welcomeOffer })),
    retrySave,
    resetDemo: () => setData(seed),
    completeStreamingMembership: (membership) => up((d) => ({
      ...d,
      streamingMembershipHistory: d.streamingMembership.startedAt && d.streamingMembership.endsAt
        ? [{ ...d.streamingMembership, id: d.streamingMembership.id ?? uid("m") }, ...d.streamingMembershipHistory]
        : d.streamingMembershipHistory,
      streamingMembership: { ...membership, id: uid("m"), recordType: "demo", hasPurchasedBefore: true },
      welcomeOffer: d.welcomeOffer === "unseen" || d.welcomeOffer === "available" ? "used" : d.welcomeOffer,
    })),
    renewStreamingMembership: (membership) => up((d) => {
      const currentId = d.streamingMembership.id;
      const alreadyScheduled = [d.streamingMembership, ...d.streamingMembershipHistory].some((record) =>
        record.status === "scheduled" && Date.parse(record.startedAt ?? "") > Date.now(),
      );
      if (!currentId || alreadyScheduled) return d;
      const latest = d.streamingMembership;
      return {
        ...d,
        streamingMembershipHistory: latest.startedAt && latest.endsAt
          ? [{ ...latest, id: latest.id ?? currentId }, ...d.streamingMembershipHistory]
          : d.streamingMembershipHistory,
        streamingMembership: { ...membership, id: uid("m"), recordType: "demo", hasPurchasedBefore: true, status: "scheduled" },
      };
    }),
    endStreamingMembership: (membershipId) => up((d) => {
      const endedAt = new Date().toISOString();
      const markEnded = (record: StreamingMembership) => {
        const isTarget = record.id === membershipId;
        const isScheduledAfterTarget = record.status === "scheduled" && Date.parse(record.startedAt ?? "") > Date.now();
        return isTarget || isScheduledAfterTarget
          ? { ...record, status: "ended" as const, endedAt }
          : record;
      };
      return {
        ...d,
        streamingMembership: markEnded(d.streamingMembership),
        streamingMembershipHistory: d.streamingMembershipHistory.map(markEnded),
      };
    }),
    saveSub: (s) => up((d) => s.id ? { ...d, subscriptions: d.subscriptions.map((x) => x.id === s.id ? { ...x, ...s, id: x.id } : x) } : { ...d, subscriptions: [{ ...s, id: uid("s") }, ...d.subscriptions] }),
    deleteSub: (id) => up((d) => ({ ...d, subscriptions: d.subscriptions.filter((x) => x.id !== id) })),
    togglePause: (id) => up((d) => ({ ...d, subscriptions: d.subscriptions.map((x) => x.id === id ? { ...x, paused: !x.paused } : x) })),
    createOrder: (o) => {
      const price = demoPrice(o.total, discountEligible);
      const order: Order = { ...o, ...price, id: uid("o"), ref: `SH-DEMO-${Math.floor(1000 + Math.random() * 9000)}`, createdAt: new Date().toISOString(), status: "placed" };
      up((d) => ({ ...d, orders: [order, ...d.orders], welcomeOffer: discountEligible ? "used" : d.welcomeOffer }));
      return order;
    },
    cancelOrder: (id) => up((d) => ({ ...d, orders: d.orders.map((x) => x.id === id ? { ...x, status: "cancelled" } : x) })),
    addTicket: (t) => up((d) => ({ ...d, tickets: [{ ...t, id: uid("t"), createdAt: new Date().toISOString(), status: "open" }, ...d.tickets] })),
    resolveTicket: (id) => up((d) => ({ ...d, tickets: d.tickets.map((x) => x.id === id ? { ...x, status: x.status === "open" ? "resolved" : "open" } : x) })),
    deleteTicket: (id) => up((d) => ({ ...d, tickets: d.tickets.filter((x) => x.id !== id) })),
    toggleFav: (id) => up((d) => ({ ...d, favorites: d.favorites.includes(id) ? d.favorites.filter((f) => f !== id) : [...d.favorites, id] })),
    addToCart: (i) => up((d) => ({ ...d, cart: [...d.cart.filter((c) => c.productId !== i.productId), { ...i, qty: d.cart.find((c) => c.productId === i.productId)?.qty ?? 1 }] })),
    setCartQty: (pid, qty) => up((d) => ({ ...d, cart: qty <= 0 ? d.cart.filter((c) => c.productId !== pid) : d.cart.map((c) => c.productId === pid ? { ...c, qty } : c) })),
    clearCart: () => up((d) => ({ ...d, cart: [] })),
    setFoodQty: (rid, itemId, qty) => up((d) => {
      const items = d.foodCart && d.foodCart.restaurantId === rid ? { ...d.foodCart.items } : {};
      if (qty <= 0) delete items[itemId]; else items[itemId] = qty;
      return { ...d, foodCart: Object.keys(items).length ? { restaurantId: rid, items } : null };
    }),
    clearFood: () => up((d) => ({ ...d, foodCart: null })),
  };
  if (!authLoaded || ownerRef.current !== identity || (identity !== "guest" && !accountReady)) {
    return (
      <div className="min-h-[100dvh] bg-background p-6">
        <div className="mx-auto mt-20 max-w-xl animate-pulse space-y-4">
          <div className="h-5 w-36 rounded bg-muted" />
          <div className="h-32 rounded-2xl border border-border bg-card" />
          <div className="h-24 rounded-2xl border border-border bg-card" />
          {accountQuery.isError && identity !== "guest" && (
            <div role="alert" className="space-y-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-5 text-sm text-foreground">
              <p>We could not load this account’s saved data.</p>
              <button className="btn btn-ghost" onClick={() => accountQuery.refetch()}>Retry loading account</button>
            </div>
          )}
        </div>
      </div>
    );
  }
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() { const c = useContext(StoreCtx); if (!c) throw new Error("StoreProvider missing"); return c; }
