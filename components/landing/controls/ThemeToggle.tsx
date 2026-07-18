"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ label, className }: { label: string; className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Standard next-themes hydration guard: theme is unknown on the server, so we
  // render a neutral icon until mounted to avoid a hydration mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-current/15 text-current/80 transition hover:text-current hover:bg-current/10 " +
        (className ?? "")
      }
    >
      {/* Avoid hydration flicker: render a neutral icon until mounted. */}
      {mounted ? (
        isDark ? <Sun size={17} strokeWidth={1.6} /> : <Moon size={17} strokeWidth={1.6} />
      ) : (
        <Sun size={17} strokeWidth={1.6} className="opacity-0" />
      )}
    </button>
  );
}
