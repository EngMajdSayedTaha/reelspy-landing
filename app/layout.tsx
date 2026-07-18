import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LOCALE_COOKIE, dirForLocale, normalizeLocale } from "@/lib/i18n/config";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const description =
  "ReelSpy tracks the creators you admire, ranks which reels are over-performing right now, writes original AI scripts in your voice, and cross-posts to Instagram, TikTok, YouTube & Facebook.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ReelSpy — Spot viral reels early, script them in your voice, post everywhere",
    template: "%s · ReelSpy",
  },
  description,
  applicationName: SITE_NAME,
  keywords: [
    "short-form video",
    "Instagram reels",
    "TikTok",
    "viral reels",
    "AI script generator",
    "content intelligence",
    "reel analytics",
    "cross-posting",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "ReelSpy — Spot viral reels early, script them in your voice, post everywhere",
    description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ReelSpy — Spot viral reels early",
    description,
  },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#090a18" },
    { media: "(prefers-color-scheme: light)", color: "#f7f7f8" },
  ],
  colorScheme: "dark light",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const locale = normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);

  return (
    <html
      lang={locale}
      dir={dirForLocale(locale)}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        {/* Enable JS-gated reveal states before paint so JS-off users see all content. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
