import { type ReactNode, useEffect, useRef } from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { ClerkProvider, SignIn, SignUp, useClerk } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { ErrorBoundary } from "@/components/error-boundary";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Link, Route, Switch, useLocation, Router as WouterRouter } from "wouter";
import { StoreProvider } from "@/lib/store";
import { Layout } from "@/components/app/layout";
import Dashboard from "@/pages/dashboard";
import Subscriptions from "@/pages/subscriptions";
import LoginHelp from "@/pages/login-help";
import PlatformPage from "@/pages/platform-page";

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
const clerkPubKey = publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
}

if (!clerkPubKey) throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in the app environment.");

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement: "inside" as const,
    logoLinkUrl: basePath || "/",
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "hsl(36 95% 62%)",
    colorForeground: "hsl(40 20% 92%)",
    colorMutedForeground: "hsl(35 8% 66%)",
    colorDanger: "hsl(4 72% 65%)",
    colorBackground: "hsl(30 7% 8%)",
    colorInput: "hsl(30 7% 6%)",
    colorInputForeground: "hsl(40 20% 92%)",
    colorNeutral: "hsl(40 20% 92%)",
    fontFamily: "DM Sans, system-ui, sans-serif",
    borderRadius: "1rem",
  },
  elements: {
    rootBox: "w-full flex justify-center",
    cardBox: "w-[calc(100vw-2rem)] max-w-[440px] overflow-hidden rounded-3xl border border-[#35332e] bg-[#151513]",
    card: "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer: "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle: "text-[#f1ede3] font-semibold tracking-tight",
    headerSubtitle: "text-[#a8a398]",
    socialButtonsBlockButtonText: "text-[#eee9de] font-medium",
    formFieldLabel: "text-[#ddd8ce] font-medium",
    footerActionLink: "text-[#f4c46b] font-medium hover:text-[#ffda92]",
    footerActionText: "text-[#aaa69c]",
    dividerText: "text-[#aaa69c]",
    identityPreviewEditButton: "text-[#f4c46b]",
    formFieldSuccessText: "text-[#a8d5c0]",
    alertText: "text-[#f1ede3]",
    logoBox: "h-10 w-10",
    logoImage: "h-10 w-10 rounded-xl",
    socialButtonsBlockButton: "border border-[#38362f] bg-[#1b1a17] hover:bg-[#23221e]",
    formButtonPrimary: "bg-[#f4c46b] text-[#231b0d] font-semibold hover:bg-[#ffda92]",
    formFieldInput: "border-[#39372f] bg-[#100f0d] text-[#f1ede3] placeholder:text-[#79766f]",
    footerAction: "border-t border-[#302f2a]",
    dividerLine: "bg-[#38362f]",
    alert: "border-[#71403b] bg-[#291816]",
    otpCodeFieldInput: "border-[#39372f] bg-[#100f0d] text-[#f1ede3]",
    formFieldRow: "gap-2",
    main: "text-[#f1ede3]",
  },
};

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const client = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) client.clear();
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, client]);

  return null;
}

function SignInPage() {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-8">
      <div className="pointer-events-none absolute -right-28 top-[-8rem] h-[26rem] w-[26rem] rounded-full border border-primary/10 sm:right-[-5rem]" />
      <div className="pointer-events-none absolute -right-16 top-[-4rem] h-[19rem] w-[19rem] rounded-full border border-primary/10" />
      <div className="relative z-10 grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_460px] lg:gap-20">
        <section className="hidden max-w-xl lg:block">
          <Link href="/" className="mb-14 inline-flex items-center gap-3">
            <img src={`${basePath}/logo.svg`} alt="" className="h-11 w-11 rounded-xl" />
            <span className="text-sm font-semibold tracking-[.08em]">ALL IN ONE</span>
          </Link>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[.22em] text-primary">Streaming, made simple in Kuwait</p>
          <h1 className="font-display text-6xl font-semibold leading-[1.02] tracking-tight">
            One bundle.<br /><span className="text-primary">A little more to watch.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
            Sign in to keep your ALL IN ONE streaming bundle demo details in your own account. Guest browser data stays separate and is not imported automatically.
          </p>
          <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="h-px w-10 bg-primary/60" /> Private account data, synced when you sign in
          </div>
        </section>
        <section className="rise w-full">
          <Link href="/" className="mb-6 inline-flex items-center gap-3 lg:hidden">
            <img src={`${basePath}/logo.svg`} alt="" className="h-10 w-10 rounded-xl" />
            <span className="text-sm font-semibold tracking-[.08em]">ALL IN ONE</span>
          </Link>
          <div className="mb-5 text-center lg:hidden">
            <h1 className="font-display text-3xl font-semibold">Your own space.</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to your ALL IN ONE account.</p>
          </div>
          <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
          <div className="mt-5 text-center text-xs text-muted-foreground">
            Need a hand? <Link href="/login-help" className="font-medium text-primary hover:underline">Get sign-in help</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function SignUpPage() {
  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-4 py-10 sm:px-8">
      <div className="pointer-events-none absolute -left-40 bottom-[-14rem] h-[32rem] w-[32rem] rounded-full border border-accent/10" />
      <div className="relative z-10 grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_460px] lg:gap-20">
        <section className="hidden max-w-xl lg:block">
          <Link href="/" className="mb-14 inline-flex items-center gap-3">
            <img src={`${basePath}/logo.svg`} alt="" className="h-11 w-11 rounded-xl" />
            <span className="text-sm font-semibold tracking-[.08em]">ALL IN ONE</span>
          </Link>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[.22em] text-accent">Made for your next watch</p>
          <h1 className="font-display text-6xl font-semibold leading-[1.02] tracking-tight">
            Settle in.<br /><span className="text-accent">Press play.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
            Create an account to keep your ALL IN ONE streaming bundle demo details.
          </p>
          <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
            <span className="h-px w-10 bg-accent/60" /> Guest browser data stays separate
          </div>
        </section>
        <section className="rise w-full">
          <Link href="/" className="mb-6 inline-flex items-center gap-3 lg:hidden">
            <img src={`${basePath}/logo.svg`} alt="" className="h-10 w-10 rounded-xl" />
            <span className="text-sm font-semibold tracking-[.08em]">ALL IN ONE</span>
          </Link>
          <div className="mb-5 text-center lg:hidden">
            <h1 className="font-display text-3xl font-semibold">Start your own space.</h1>
            <p className="mt-2 text-sm text-muted-foreground">Create an ALL IN ONE account.</p>
          </div>
          <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
        </section>
      </div>
    </main>
  );
}

function PublicPages() {
  return (
    <StoreProvider>
      <Layout>
        <RoutedErrorBoundary>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/subscriptions" component={Subscriptions} />
            <Route path="/platform/:slug" component={PlatformPage} />
            <Route component={NotFound} />
          </Switch>
        </RoutedErrorBoundary>
      </Layout>
    </StoreProvider>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/sign-in/*?" component={SignInPage} />
        <Route path="/sign-up/*?" component={SignUpPage} />
        <Route path="/login-help" component={LoginHelp} />
        <Route component={PublicPages} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: "Welcome back", subtitle: "Sign in to your ALL IN ONE account" } },
        signUp: { start: { title: "Make it yours", subtitle: "Create your ALL IN ONE account" } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <ClerkQueryClientCacheInvalidator />
      <Router />
    </ClerkProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={basePath}>
          <ClerkProviderWithRoutes />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
