import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export function PageShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-[820px] items-center justify-between px-4 sm:px-6">
          <Link href="/" aria-label="ReelSpy — home">
            <Logo size={28} animated={false} />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft size={16} className="rtl:-scale-x-100" />
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[820px] flex-1 px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
        {intro && <p className="mt-4 text-muted-foreground">{intro}</p>}
        <div className="prose-invert mt-8 flex flex-col gap-6 text-[0.95rem] leading-relaxed text-muted-foreground">
          {children}
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-[820px] px-4 py-6 text-sm text-muted-foreground sm:px-6">
          © 2026 ReelSpy — All rights reserved.
        </div>
      </footer>
    </div>
  );
}
