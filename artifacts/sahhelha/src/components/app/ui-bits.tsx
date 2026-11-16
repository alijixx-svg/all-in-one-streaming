import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function PageHeader({ eyebrow, title, sub, action }: { eyebrow: string; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="rise mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="font-num text-[11px] uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
        <h1 className="font-display mt-1.5 text-3xl font-bold sm:text-4xl">{title}</h1>
        {sub && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{sub}</p>}
      </div>
      {action && <div className="flex shrink-0 flex-wrap gap-2">{action}</div>}
    </div>
  );
}

export function Empty({ icon: Icon, title, text, action }: { icon: LucideIcon; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="surface rise flex flex-col items-center px-6 py-12 text-center" data-testid="empty-state">
      <div className="relative mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-primary/25 bg-primary/10">
        <Icon className="h-7 w-7 text-primary" />
        <span className="absolute -right-1.5 -top-1.5 h-3 w-3 rounded-full bg-accent" />
      </div>
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Modal({ open, onOpenChange, title, desc, children }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; desc?: string; children: ReactNode }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100vw-1.5rem)] max-w-lg overflow-y-auto rounded-2xl border-border bg-popover p-5 sm:p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="font-display text-2xl">{title}</DialogTitle>
          {desc && <DialogDescription>{desc}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{children}</label>;
}

export function DemoNote({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary/90">{children}</p>;
}

export function Art({ hue, label, className = "" }: { hue: number; label: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`} style={{ background: `linear-gradient(135deg, hsl(${hue} 30% 14%), hsl(${hue} 20% 7%))` }}>
      <svg viewBox="0 0 100 60" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <circle cx="78" cy="14" r="22" fill={`hsl(${hue} 60% 55% / .18)`} />
        <circle cx="20" cy="56" r="18" fill="hsl(36 95% 62% / .12)" />
        <path d="M0 44 Q 30 30 55 40 T 100 34" stroke={`hsl(${hue} 50% 65% / .35)`} strokeWidth=".6" fill="none" />
      </svg>
      <span className="font-display absolute bottom-2 left-3 text-3xl font-bold text-foreground/85">{label}</span>
    </div>
  );
}

export function Qty({ value, onChange, id }: { value: number; onChange: (n: number) => void; id: string }) {
  return (
    <div className="inline-flex items-center rounded-full border border-border bg-secondary">
      <button className="h-9 w-9 rounded-full text-lg hover:bg-muted" onClick={() => onChange(value - 1)} data-testid={`button-dec-${id}`} aria-label="Decrease">-</button>
      <span className="font-num w-6 text-center text-sm">{value}</span>
      <button className="h-9 w-9 rounded-full text-lg hover:bg-muted" onClick={() => onChange(value + 1)} data-testid={`button-inc-${id}`} aria-label="Increase">+</button>
    </div>
  );
}
