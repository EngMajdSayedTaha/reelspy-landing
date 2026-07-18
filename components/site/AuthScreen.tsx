import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { CTALink } from "@/components/ui/CTALink";

export function AuthScreen({
  mode,
}: {
  mode: "login" | "signup";
}) {
  const isSignup = mode === "signup";
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-lp-space p-4 text-lp-ink">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="lp-grid-bg absolute inset-0 opacity-40" />
        <div className="lp-nebula lp-drift" style={{ inset: "-20% auto auto -10%", width: "50%", height: "60%", background: "radial-gradient(circle,#6d5cff,transparent 60%)", opacity: 0.35 }} />
        <div className="lp-nebula lp-drift" style={{ inset: "auto -10% -20% auto", width: "50%", height: "60%", background: "radial-gradient(circle,#49e4ff,transparent 62%)", opacity: 0.25, animationDelay: "-6s" }} />
      </div>

      <div className="relative w-full max-w-[400px]">
        <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-lp-ink-dim transition hover:text-lp-ink">
          <ArrowLeft size={16} className="rtl:-scale-x-100" /> Back
        </Link>

        <div className="lp-card p-7">
          <Logo size={32} animated />
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-lp-ink">
            {isSignup ? "Start free — no card needed" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-lp-ink-dim">
            {isSignup ? "Create your account and spot what's rising in minutes." : "Log in to your ReelSpy dashboard."}
          </p>

          <form className="mt-6 flex flex-col gap-3">
            {isSignup && (
              <Field label="Name" type="text" placeholder="Your name" autoComplete="name" />
            )}
            <Field label="Email" type="email" placeholder="you@studio.com" autoComplete="email" />
            <Field label="Password" type="password" placeholder="••••••••" autoComplete={isSignup ? "new-password" : "current-password"} />
          </form>

          <div className="mt-5">
            <CTALink href="/" size="lg" magnetic={false} className="w-full">
              {isSignup ? "Create free account" : "Log in"}
            </CTALink>
          </div>

          <p className="mt-5 text-center text-sm text-lp-ink-dim">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-lp-cyan hover:underline">
                  Log in
                </Link>
              </>
            ) : (
              <>
                New to ReelSpy?{" "}
                <Link href="/signup" className="font-medium text-lp-cyan hover:underline">
                  Start free
                </Link>
              </>
            )}
          </p>
        </div>
        <p className="mt-4 text-center text-[0.72rem] text-lp-ink-dim/60">
          Preview screen — connect to your ReelSpy backend to enable authentication.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  placeholder,
  autoComplete,
}: {
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[0.78rem] font-medium text-lp-ink-dim">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="rounded-xl border border-[var(--lp-hairline)] bg-white/[0.03] px-3.5 py-2.5 text-sm text-lp-ink placeholder:text-lp-ink-dim/50 outline-none transition focus:border-lp-cyan/50 focus:ring-2 focus:ring-lp-cyan/25"
      />
    </label>
  );
}
