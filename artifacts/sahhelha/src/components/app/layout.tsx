import { type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth, useClerk, useUser } from "@clerk/react";
import { AlertTriangle, CircleHelp, Compass, Info, LogIn, LogOut, Repeat, UserPlus } from "lucide-react";
import { useStore } from "@/lib/store";

export const nav = [
  { href: "/", label: "Discover", short: "Home", icon: Compass },
  { href: "/subscriptions", label: "Streaming bundle", short: "Bundle", icon: Repeat },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" data-testid="link-home">
      <svg viewBox="0 0 180 180" className="h-9 w-9 shrink-0" aria-hidden="true">
        <rect width="180" height="180" rx="44" fill="hsl(30 8% 11%)" />
        <path d="M43 130 90 44l47 86M61 100h58" fill="none" stroke="hsl(36 95% 62%)" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="leading-none">
        <span className="font-display block whitespace-nowrap text-sm font-bold">ALL IN ONE</span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">streaming in Kuwait</span>
      </div>
    </Link>
  );
}

function AccountActions() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  if (!isLoaded) return <div className="hidden h-9 w-24 animate-pulse rounded-full bg-muted sm:block" aria-label="Loading account" />;
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Link href="/login-help" className="hidden h-9 items-center gap-2 rounded-full px-3 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:inline-flex" data-testid="link-login-help">
        <CircleHelp className="h-4 w-4" /> Login help
      </Link>
      {isSignedIn ? (
        <>
          <span className="hidden max-w-32 truncate text-xs text-muted-foreground md:block" title={user?.primaryEmailAddress?.emailAddress}>
            {user?.primaryEmailAddress?.emailAddress ?? "Your account"}
          </span>
          <button type="button" onClick={() => signOut({ redirectUrl: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" })}
            className="btn btn-ghost h-9 px-3 text-xs" data-testid="button-sign-out">
            <LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sign out</span>
          </button>
        </>
      ) : (
        <>
          <Link href="/sign-in" className="btn btn-ghost h-9 px-3 text-xs" data-testid="link-sign-in"><LogIn className="h-4 w-4" /> Sign in</Link>
          <Link href="/sign-up" className="btn btn-primary h-9 px-3 text-xs" data-testid="link-sign-up"><UserPlus className="h-4 w-4" /><span className="hidden sm:inline">Create account</span><span className="sm:hidden">Join</span></Link>
        </>
      )}
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const { isSignedIn } = useAuth();
  const { storageError, retrySave } = useStore();
  const active = (href: string) => href === "/" ? loc === "/" : loc.startsWith(href);
  return (
    <div className="flex min-h-[100dvh] w-full overflow-x-hidden">
      <aside className="sticky top-0 hidden h-[100dvh] w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar/80 p-5 backdrop-blur lg:flex">
        <Logo />
        <p className="mt-12 max-w-40 text-sm leading-6 text-muted-foreground">A simpler way to explore a streaming bundle in Kuwait.</p>
        <nav className="mt-8 flex flex-col gap-1" aria-label="Main navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} data-testid={`nav-${item.short.toLowerCase()}`}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition-colors ${active(item.href) ? "bg-sidebar-accent text-foreground" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground"}`}>
              {active(item.href) && <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />}
              <item.icon className={`h-[18px] w-[18px] ${active(item.href) ? "text-primary" : ""}`} />{item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-primary/25 bg-primary/5 p-4 text-xs leading-5 text-muted-foreground">
          <p className="mb-1 font-semibold text-primary">Demo mode</p>
          No payment or streaming access is provided. {isSignedIn ? "Your demo details are saved to your private account." : "Guest data stays in this browser only."}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-center gap-2 border-b border-primary/20 bg-primary/10 px-4 py-1.5 text-center text-[11px] text-primary sm:text-xs" data-testid="banner-demo">
          <Info className="h-3.5 w-3.5 shrink-0" /><span><b>DEMO</b> — no real payment and no streaming access.</span>
        </div>
        <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-10">
          <div className="lg:hidden"><Logo /></div>
          <div className="ml-auto"><AccountActions /></div>
        </header>
        {storageError && (
          <div className="mx-4 mt-4 flex flex-col gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm sm:mx-6 sm:flex-row sm:items-center lg:mx-10" role="alert" data-testid="alert-storage">
            <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" /><span className="flex-1">{storageError}</span>
            <button className="btn btn-ghost h-9" onClick={retrySave} data-testid="button-retry-save">Retry save</button>
          </div>
        )}
        <main key={loc} className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-6 sm:px-6 sm:pb-24 lg:px-10 lg:pb-12 lg:pt-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden" data-testid="nav-mobile" aria-label="Main navigation">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} data-testid={`navm-${item.short.toLowerCase()}`} className={`relative flex min-h-[58px] flex-col items-center justify-center gap-1 text-[10px] ${active(item.href) ? "text-primary" : "text-muted-foreground"}`}>
            {active(item.href) && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-primary" />}
            <item.icon className="h-5 w-5" />{item.short}
          </Link>
        ))}
      </nav>
    </div>
  );
}
