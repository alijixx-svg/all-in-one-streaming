import { useRef, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { kwd } from "@/lib/format";
import type { DemoPayment } from "@/lib/store";
import { DemoNote } from "./ui-bits";

/** Local simulation only. Never collects credentials or contacts KNET. */
export function KnetDemo({ total, onApproved }: { total: number; onApproved: (payment: DemoPayment) => void }) {
  const [step, setStep] = useState<"review" | "payment" | "declined">("review");
  const [busy, setBusy] = useState(false);
  const submitted = useRef(false);

  const approve = () => {
    if (submitted.current || !Number.isFinite(total) || total <= 0) return;
    submitted.current = true;
    setBusy(true);
    try {
      onApproved({ method: "KNET", status: "simulated", reference: `DEMO-KNET-${crypto.randomUUID()}` });
    } catch (error) {
      submitted.current = false;
      setBusy(false);
      throw error;
    }
  };

  return (
    <section className="space-y-3" aria-label="KNET demo checkout" data-testid="knet-demo-checkout">
      <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
        <ShieldCheck className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">KNET simulation <span className="text-xs font-normal text-primary">· Demo only</span></p>
          <p className="text-xs text-muted-foreground">Local simulation · Not connected to a bank</p>
        </div>
      </div>
      {step === "review" ? (
        <button className="btn btn-primary w-full" onClick={() => setStep("payment")} disabled={!Number.isFinite(total) || total <= 0} data-testid="button-continue-knet">
          Continue to simulation · {kwd(total)}
        </button>
      ) : (
        <div className="space-y-3 rounded-xl border border-border p-4" data-testid="panel-knet-payment">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span>ALL IN ONE · Demo checkout</span><span className="font-num text-primary">{kwd(total)}</span>
          </div>
          <DemoNote>This is not a bank payment page. It only records a demo result. No card number, PIN or OTP is required, and no money will be charged.</DemoNote>
          {step === "declined" ? (
            <div role="status" className="space-y-3">
              <p className="text-sm text-destructive">Demo payment declined. No membership was recorded. Your demo details are unchanged.</p>
              <button className="btn btn-primary w-full" onClick={() => setStep("payment")} data-testid="button-retry-knet">Try demo payment again</button>
            </div>
          ) : (
            <>
              <button className="btn btn-primary w-full" disabled={busy} onClick={approve} data-testid="button-approve-knet">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />{busy ? "Confirming demo…" : "Simulate successful payment"}
              </button>
              <button className="btn btn-ghost w-full" onClick={() => setStep("declined")} disabled={busy} data-testid="button-decline-knet">Simulate declined payment</button>
            </>
          )}
          <button className="btn btn-ghost w-full" onClick={() => setStep("review")} disabled={busy} data-testid="button-cancel-knet">Cancel demo payment</button>
        </div>
      )}
    </section>
  );
}
