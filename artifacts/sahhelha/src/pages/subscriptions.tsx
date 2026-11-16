import { useState } from "react";
import { ArrowRight, Check, CirclePlay, ShieldCheck } from "lucide-react";
import { LIVE_STREAMING_CHECKOUT_ENABLED, useStore, type DemoPayment } from "@/lib/store";
import { kwd, fmtDate } from "@/lib/format";
import { DemoNote, Modal } from "@/components/app/ui-bits";
import { KnetDemo } from "@/components/app/knet-demo";
import { useToast } from "@/hooks/use-toast";

const STREAMING_SERVICES = [
  { name: "Netflix", mark: "N", color: "service-netflix" },
  { name: "HBO Max", mark: "H", color: "service-hbo" },
  { name: "OSN", mark: "O", color: "service-osn" },
  { name: "Shahid", mark: "S", color: "service-shahid" },
  { name: "Hulu", mark: "h", color: "service-hulu" },
];

export default function Subscriptions() {
  const {
    streamingMembership,
    streamingMembershipHistory,
    completeStreamingMembership,
    renewStreamingMembership,
    endStreamingMembership,
  } = useStore();
  const { toast } = useToast();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const hasPurchasedBefore = streamingMembership.hasPurchasedBefore;
  const bundlePrice = hasPurchasedBefore ? 4 : 2;
  const memberships = [streamingMembership, ...streamingMembershipHistory]
    .filter((membership) => membership.startedAt || membership.endsAt)
    .sort((a, b) => Date.parse(b.startedAt ?? "") - Date.parse(a.startedAt ?? ""));
  const activeMembership = memberships.find((membership) => getMembershipStatus(membership) === "active");
  const renewalScheduled = memberships.some((membership) => getMembershipStatus(membership) === "scheduled");
  const membershipInProgress = Boolean(activeMembership || renewalScheduled);

  const completeDemoCheckout = (payment: DemoPayment) => {
    const startedAt = new Date();
    const endsAt = addCalendarMonths(startedAt, 3);
    completeStreamingMembership({
      startedAt: startedAt.toISOString(),
      endsAt: endsAt.toISOString(),
      paidAmount: bundlePrice,
      paymentReference: payment.reference,
    });
    setCheckoutOpen(false);
    toast({
      title: "Demo checkout recorded",
      description: `Your demo record runs until ${fmtDate(endsAt.toISOString())}. No payment or streaming access was activated.`,
    });
  };

  return (
    <div className="space-y-7" data-testid="page-streaming-subscriptions">
      <header className="rise max-w-2xl">
        <p className="font-num text-[11px] uppercase tracking-[.2em] text-primary">ALL IN ONE · Streaming</p>
        <h1 className="font-display mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">The bundle.</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">One straightforward three-month offer for customers in Kuwait. Review the services and try the demo checkout.</p>
      </header>

      <section className="surface rise overflow-hidden border-primary/25" aria-labelledby="bundle-title" data-testid="streaming-bundle">
        <div className="bundle-top relative overflow-hidden p-5 sm:p-8">
          <div className="bundle-shape" aria-hidden="true" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_260px] lg:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[.08] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.12em] text-primary">
                <CirclePlay className="h-3.5 w-3.5" /> Three-month bundle
              </span>
              <h2 id="bundle-title" className="font-display mt-5 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">Five streaming services.<br />One simple idea.</h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">A proposed bundle featuring Netflix, HBO Max, OSN, Shahid and Hulu.</p>
              <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5" aria-label="Streaming services in the proposed bundle">
                {STREAMING_SERVICES.map((service) => (
                  <li key={service.name} className={`mini-service ${service.color}`}><span className="mini-service-mark">{service.mark}</span><span>{service.name}</span></li>
                ))}
              </ul>
            </div>
            <div className="price-panel relative rounded-2xl border border-primary/20 bg-background/70 p-5 backdrop-blur">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Proposed demo price · {hasPurchasedBefore ? "Returning customer" : "New ALL IN ONE customer"}</p>
              <p className="font-num mt-3 text-4xl font-semibold tracking-tight text-primary">{kwd(bundlePrice)}</p>
              <p className="mt-1 text-xs text-muted-foreground">total for three months</p>
              <div className="my-4 h-px bg-border" />
              <p className="text-xs leading-5 text-muted-foreground">Illustrative {hasPurchasedBefore ? "returning-customer" : "new-customer"} price only. Final prices and real payments are not enabled.</p>
              {!membershipInProgress && <button className="btn btn-primary mt-5 h-11 w-full" onClick={() => setCheckoutOpen(true)} data-testid="button-subscribe-streaming-demo">
                Try the KNET demo <ArrowRight className="h-4 w-4" />
              </button>}
            </div>
          </div>
        </div>

        <div className="grid gap-5 border-t border-border/80 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent"><ShieldCheck className="h-4 w-4" /></span>
            <div><p className="text-sm font-semibold">Demo checkout, nothing more</p><p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">This local KNET simulation only saves a demo record. No money is charged, no payment credentials are collected, and no streaming access is activated.</p></div>
          </div>
          <p className="text-xs text-muted-foreground lg:max-w-48 lg:text-right">No card, PIN or OTP required.</p>
        </div>
      </section>

      <section className="surface rise space-y-4 p-5 sm:p-6" aria-labelledby="access-readiness-title" data-testid="streaming-access-readiness">
        <div>
          <p className="font-num text-[10px] uppercase tracking-[.16em] text-primary">Live access status</p>
          <h2 id="access-readiness-title" className="mt-1 text-lg font-semibold">
            {LIVE_STREAMING_CHECKOUT_ENABLED ? "Live access is enabled" : "Live access is not enabled"}
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
            Each service needs confirmed partner authorization, Kuwait availability, and a verified way to deliver access. Service-specific confirmation is not recorded here, so live subscriptions and real payments stay unavailable.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label="Service-by-service access requirements">
          {STREAMING_SERVICES.map((service) => (
            <li key={service.name} className="rounded-xl border border-border/80 bg-background/40 p-4" data-testid={`access-status-${service.name.toLowerCase().replaceAll(" ", "-")}`}>
              <p className="text-sm font-semibold">{service.name}</p>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Partner authorization</dt><dd className="text-right font-medium">Not confirmed here</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Kuwait availability</dt><dd className="text-right font-medium">Not confirmed here</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Access delivery</dt><dd className="text-right font-medium">Not connected</dd></div>
              </dl>
            </li>
          ))}
        </ul>
        {!LIVE_STREAMING_CHECKOUT_ENABLED && (
          <p role="status" className="rounded-xl border border-border bg-background/50 p-3 text-xs leading-5 text-muted-foreground">
            Live service and real payment processing are disabled. The button below only records a simulated checkout.
          </p>
        )}
      </section>

      {memberships.length > 0 && (
        <section className="surface rise space-y-4 p-5 sm:p-6" aria-labelledby="membership-history-title" data-testid="streaming-membership-record">
          <div>
            <p className="font-num text-[10px] uppercase tracking-[.16em] text-primary">Demo-only controls</p>
            <h2 id="membership-history-title" className="mt-1 text-lg font-semibold">Membership history</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">These records do not represent live streaming access. Renewals and ending a membership are demo actions only; nothing is charged.</p>
          </div>
          <div className="space-y-3">
            {memberships.map((membership, index) => {
              const status = getMembershipStatus(membership);
              const membershipId = membership.id;
              const canControl = status === "active" && !!membershipId;
              return (
                <article key={membership.id ?? `${membership.startedAt ?? "start"}-${membership.endsAt ?? index}`} className="rounded-xl border border-border/80 bg-background/40 p-4" data-testid="streaming-membership-entry">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold">Three-month bundle · demo record</p>
                        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{statusLabel(status)}</span>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-muted-foreground">
                        {membership.startedAt ? `Starts ${fmtDate(membership.startedAt)}` : "Start date unavailable"}
                        {" · "}
                        {membership.endsAt ? `Ends ${fmtDate(membership.endsAt)}` : "End date unavailable"}
                        {membership.endedAt ? ` · Ended ${fmtDate(membership.endedAt)}` : ""}
                      </p>
                      {membership.paidAmount !== undefined && (
                        <p className="mt-1 font-num text-xs text-primary">{kwd(membership.paidAmount)} <span className="text-muted-foreground">demo total</span></p>
                      )}
                      {status === "scheduled" && <p className="mt-1 text-xs text-muted-foreground">This demo renewal starts after the current period. It is not a payment or a live subscription.</p>}
                    </div>
                    {canControl && (
                      <div className="flex flex-col gap-2 sm:min-w-48">
                        {!renewalScheduled && (
                          <button
                            className="btn btn-secondary min-h-10"
                            onClick={() => {
                              const nextStart = new Date(membership.endsAt!);
                              const nextEnd = addCalendarMonths(nextStart, 3);
                              renewStreamingMembership({
                                startedAt: nextStart.toISOString(),
                                endsAt: nextEnd.toISOString(),
                              });
                              toast({ title: "Demo renewal scheduled", description: `The next three-month demo period starts ${fmtDate(nextStart.toISOString())}. No payment or access was activated.` });
                            }}
                            data-testid="button-renew-streaming-demo"
                          >
                            Schedule demo renewal
                          </button>
                        )}
                        <button
                          className="btn btn-ghost min-h-10 text-destructive hover:text-destructive"
                          onClick={() => {
                            endStreamingMembership(membershipId);
                            toast({ title: "Demo membership ended", description: "The membership record and dates remain in your history. No live access was affected." });
                          }}
                          data-testid="button-end-streaming-demo"
                        >
                          End demo membership
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Bundle details">
        <Detail title="Proposed services" body="Netflix · HBO Max · OSN · Shahid · Hulu" />
        <Detail title="How long" body="Three months, one total demo price" />
        <Detail title="How checkout works" body="A local KNET simulation; no real payment" />
      </section>

      <Modal open={checkoutOpen} onOpenChange={setCheckoutOpen} title="Try the bundle demo" desc={`${kwd(bundlePrice)} total for three months`}>
        <div className="space-y-4">
          <p className="text-sm leading-6 text-muted-foreground">
            {hasPurchasedBefore
              ? "The proposed returning-customer demo price is KWD 4 total for three months. Final pricing is not confirmed."
              : "The proposed new-customer demo price is KWD 2 total for three months. Final pricing is not confirmed."}
          </p>
          <DemoNote>Local simulation only. No real payment is made, no live service is activated, and this creates a demo record only.</DemoNote>
          <KnetDemo total={bundlePrice} onApproved={completeDemoCheckout} />
        </div>
      </Modal>
    </div>
  );
}

function Detail({ title, body }: { title: string; body: string }) {
  return <div className="surface p-4"><p className="font-num text-[10px] uppercase tracking-[.16em] text-primary">{title}</p><p className="mt-2 text-sm leading-5 text-muted-foreground">{body}</p></div>;
}

function addCalendarMonths(date: Date, months: number) {
  const result = new Date(date);
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const finalDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(day, finalDay));
  return result;
}

function getMembershipStatus(membership: { status?: "scheduled" | "ended"; startedAt?: string; endsAt?: string }) {
  if (membership.status === "ended") return "ended" as const;
  const startsAt = membership.startedAt ? Date.parse(membership.startedAt) : Number.NaN;
  if (Number.isFinite(startsAt) && startsAt > Date.now()) return "scheduled" as const;
  const endsAt = membership.endsAt ? Date.parse(membership.endsAt) : Number.NaN;
  if (Number.isFinite(endsAt) && endsAt > Date.now()) return "active" as const;
  return "expired" as const;
}

function statusLabel(status: ReturnType<typeof getMembershipStatus>) {
  if (status === "active") return "Current demo period";
  if (status === "scheduled") return "Renewal scheduled";
  if (status === "ended") return "Ended";
  return "Expired";
}
