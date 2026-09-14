import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { htmlLang, isLocale, locales, type Locale } from "@/i18n/config";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { buildMetadata } from "@/lib/seo";
import { AppShell } from "@/components/layout/AppShell";
import "../globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#070907",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return { title: "JIMON GROUP Uzbekistan" };
  return buildMetadata(lang);
}

/**
 * Root layout lives inside the [lang] segment so the SSR HTML carries the correct <html lang>.
 * Invalid segments fall back to RU chrome; pages call notFound() for them.
 */
export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ru";
  return (
    <html lang={htmlLang[locale]} className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body className="grain">
        <LanguageProvider initial={locale}>
          <AppShell>{children}</AppShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
