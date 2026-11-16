import { Link } from "wouter";
import { ArrowRight, BadgeCheck, Clapperboard, Play, ShieldCheck, Sparkles } from "lucide-react";

const services = [
  { name: "Netflix", mark: "N", tone: "service-netflix", detail: "Series, films and familiar favorites" },
  { name: "HBO Max", mark: "H", tone: "service-hbo", detail: "Prestige stories and new discoveries" },
  { name: "OSN", mark: "O", tone: "service-osn", detail: "A mix of international entertainment" },
  { name: "Shahid", mark: "S", tone: "service-shahid", detail: "Arabic originals and much more" },
  { name: "Hulu", mark: "h", tone: "service-hulu", detail: "A fresh range of shows and films" },
];

export default function Dashboard() {
  return (
    <div className="space-y-12 sm:space-y-16" data-testid="page-streaming-home">
      <section className="stream-hero rise relative overflow-hidden rounded-[2rem] border border-border p-6 sm:p-10 lg:p-14">
        <div className="hero-orbit orbit-one" aria-hidden="true" />
        <div className="hero-orbit orbit-two" aria-hidden="true" />
        <div className="relative z-10 max-w-2xl">
          <p className="font-num text-[11px] uppercase tracking-[.24em] text-primary">ALL IN ONE · Kuwait</p>
          <h1 className="font-display mt-5 text-5xl font-semibold leading-[.98] tracking-tight sm:text-7xl">
            Your next<br /><span className="text-primary">watchlist, together.</span>
          </h1>
          <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
            One simple streaming bundle to try. See what’s included, explore the three-month demo offer, and decide if it’s for you.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/subscriptions" className="btn btn-primary h-12 px-6" data-testid="link-explore-bundle">
              Explore the bundle <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="inline-flex items-center gap-2 px-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" /> Demo only · no real access or payment
            </span>
          </div>
        </div>
        <div className="relative z-10 mt-12 flex max-w-md items-center gap-3 rounded-2xl border border-border/80 bg-background/55 p-4 backdrop-blur sm:absolute sm:bottom-10 sm:right-10 sm:mt-0 sm:w-[270px]">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Play className="ml-0.5 h-5 w-5 fill-current" /></div>
          <div><p className="text-xs uppercase tracking-wider text-muted-foreground">One bundle</p><p className="font-display text-lg font-semibold">Three months to explore</p></div>
        </div>
      </section>

      <section aria-labelledby="included-title">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-num text-[10px] uppercase tracking-[.2em] text-primary">Included in the idea</p>
            <h2 id="included-title" className="font-display mt-2 text-2xl font-semibold sm:text-3xl">Five names. One place to start.</h2>
          </div>
          <Clapperboard className="mb-1 hidden h-6 w-6 text-muted-foreground sm:block" aria-hidden="true" />
        </div>
        <div className="service-grid stagger">
          {services.map((service, index) => (
            <article key={service.name} className={`service-tile ${service.tone}`} data-testid={`service-${index}`}>
              <div className="flex items-start justify-between">
                <span className="service-mark">{service.mark}</span>
                <span className="font-num text-[10px] text-foreground/45">0{index + 1}</span>
              </div>
              <div><h3 className="font-display text-xl font-semibold">{service.name}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{service.detail}</p></div>
            </article>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">Service names are shown for the proposed bundle only. ALL IN ONE does not activate or provide access to third-party accounts.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <div className="surface p-6 sm:p-8">
          <div className="flex items-center gap-2 text-primary"><Sparkles className="h-4 w-4" /><p className="font-num text-[10px] uppercase tracking-[.2em]">A clear offer</p></div>
          <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <div><h2 className="font-display text-3xl font-semibold sm:text-4xl">Three months.<br />One total price.</h2><p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">KWD 2 total for a new ALL IN ONE customer, or KWD 4 total for a returning customer.</p></div>
            <Link href="/subscriptions" className="btn btn-ghost h-11 w-full sm:w-auto" data-testid="link-view-pricing">See the details <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
        <div className="rounded-2xl border border-accent/20 bg-accent/[.06] p-6 sm:p-8">
          <BadgeCheck className="h-5 w-5 text-accent" />
          <h2 className="font-display mt-4 text-xl font-semibold">A safe, simple demo</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Checkout is a local KNET simulation. It never asks for card details, a PIN or an OTP, and does not activate streaming access.</p>
        </div>
      </section>
    </div>
  );
}
