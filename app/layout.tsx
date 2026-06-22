import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "TrackIt",
  description:
    "Track your daily calories, macros, and weight with a badminton-inspired design. Set activity-based presets, log meals, monitor weight trends, and stay on top of your fitness goals.",
  keywords: [
    "nutrition tracker",
    "calorie counter",
    "macro tracker",
    "fitness",
    "weight tracker",
    "diet",
  ],
};

import { cookies } from "next/headers";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { type Locale } from "@/lib/i18n";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value as Locale | undefined;
  const initialLocale: Locale = localeCookie === "en" ? "en" : "th";

  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider initialLocale={initialLocale}>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
