import { useState, type FormEvent } from "react";
import { Link } from "wouter";
import { useAskLoginHelp } from "@workspace/api-client-react";
import { ArrowLeft, ArrowUpRight, CircleHelp, LockKeyhole, MessageCircle, RotateCcw, ShieldCheck } from "lucide-react";

const suggestions = [
  "I cannot access my ALL IN ONE account",
  "I am not receiving my sign-in email",
  "My verification link has expired",
];

export default function LoginHelp() {
  const [message, setMessage] = useState("");
  const help = useAskLoginHelp();

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = message.trim();
    if (question.length < 3 || help.isPending) return;
    help.reset();
    help.mutate({ data: { message: question } });
  };

  const askAgain = () => {
    const question = message.trim();
    if (question.length >= 3) {
      help.reset();
      help.mutate({ data: { message: question } });
    }
  };

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-background px-4 py-8 text-foreground sm:px-8 sm:py-12" data-testid="page-login-help">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" data-testid="link-help-home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
              <span className="font-display text-lg font-bold">A</span>
            </span>
            <span className="text-sm font-semibold tracking-wide">ALL IN ONE</span>
          </Link>
          <Link href="/sign-in" className="btn btn-ghost h-10" data-testid="link-help-sign-in">
            <ArrowLeft className="h-4 w-4" /> Back to sign in
          </Link>
        </div>

        <div className="mt-12 grid gap-12 lg:mt-20 lg:grid-cols-[.8fr_1.2fr] lg:items-start lg:gap-20">
          <section className="rise max-w-lg">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
              <CircleHelp className="h-3.5 w-3.5" /> ALL IN ONE account support
            </div>
            <h1 className="font-display text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
              A little help<br /><span className="text-primary">getting back in.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Describe the sign-in issue you are facing. The assistant can guide you through common ALL IN ONE account access problems.
            </p>
            <div className="mt-9 border-l border-primary/35 pl-5">
              <div className="flex items-center gap-2 text-sm font-medium"><ShieldCheck className="h-4 w-4 text-primary" /> Keep your details private</div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Never enter passwords, verification codes, card details, or third-party streaming passwords.
              </p>
            </div>
          </section>

          <section className="surface rise overflow-hidden p-5 sm:p-8" aria-labelledby="help-form-title">
            <div className="flex items-start gap-4 border-b border-border/80 pb-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent"><MessageCircle className="h-5 w-5" /></span>
              <div>
                <h2 id="help-form-title" className="text-lg font-semibold">What’s going wrong?</h2>
                <p className="mt-1 text-sm text-muted-foreground">Share a short description. No account details needed.</p>
              </div>
            </div>

            {!help.data && !help.isPending && (
              <div className="mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">Common questions</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button key={suggestion} type="button" onClick={() => setMessage(suggestion)}
                      className="rounded-full border border-border bg-muted/40 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                      data-testid={`button-suggestion-${suggestions.indexOf(suggestion)}`}>{suggestion}</button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={submit} className="mt-6">
              <label htmlFor="login-help-message" className="mb-2 block text-sm font-medium">Your question</label>
              <textarea id="login-help-message" rows={5} maxLength={600} value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="For example: I can sign in on my phone, but not on my laptop."
                className="field min-h-32 resize-y leading-6" data-testid="input-login-help-message" />
              <div className="mt-2 flex items-start justify-between gap-4">
                <p className="text-xs leading-5 text-muted-foreground">3–600 characters. Sent securely for AI processing.</p>
                <span className="font-num shrink-0 text-xs text-muted-foreground">{message.length}/600</span>
              </div>
              <div className="mt-4 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-sm text-xs leading-5 text-muted-foreground">Your question is not stored in ALL IN ONE app history.</p>
                <button type="submit" disabled={message.trim().length < 3 || help.isPending}
                  className="btn btn-primary min-h-11 px-5" data-testid="button-ask-login-help">
                  {help.isPending ? <><span className="h-4 w-4 animate-pulse rounded-full bg-current/35" /> Finding guidance…</> : <>Get guidance <ArrowUpRight className="h-4 w-4" /></>}
                </button>
              </div>
            </form>

            {help.isPending && (
              <div className="mt-6 space-y-3 rounded-2xl border border-border bg-muted/30 p-5" aria-live="polite" data-testid="status-help-loading">
                <div className="h-3 w-28 animate-pulse rounded bg-muted-foreground/20" />
                <div className="h-3 w-full animate-pulse rounded bg-muted-foreground/15" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-muted-foreground/15" />
              </div>
            )}
            {help.isError && (
              <div role="alert" className="mt-6 flex flex-col gap-4 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 sm:flex-row sm:items-center" data-testid="alert-help-error">
                <div className="flex-1">
                  <p className="text-sm font-semibold">We couldn’t get an answer just now.</p>
                  <p className="mt-1 text-sm text-muted-foreground">AI guidance is temporarily unavailable. Use the sign-in page’s Forgot password option, or try again shortly.</p>
                </div>
                <button type="button" onClick={askAgain} disabled={help.isPending} className="btn btn-ghost shrink-0" data-testid="button-retry-login-help"><RotateCcw className="h-4 w-4" /> Try again</button>
              </div>
            )}
            {help.data && (
              <div className="mt-6 rounded-2xl border border-accent/25 bg-accent/5 p-5 sm:p-6" aria-live="polite" data-testid="answer-login-help">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-accent"><LockKeyhole className="h-4 w-4" /> Suggested next steps</div>
                <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">{help.data.answer}</p>
                <p className="mt-4 border-t border-accent/15 pt-3 text-xs leading-5 text-muted-foreground">
                  This is general guidance for ALL IN ONE sign-in only. If you still cannot access your account, use the sign-in page’s account recovery options.
                </p>
              </div>
            )}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" /> Never share a secret with a support assistant.
            </div>
          </section>
        </div>
        <footer className="mt-16 border-t border-border/60 pt-5 text-xs text-muted-foreground">
          Login guidance is only for your ALL IN ONE account — not subscriptions or streaming-provider accounts.
        </footer>
      </div>
    </main>
  );
}
