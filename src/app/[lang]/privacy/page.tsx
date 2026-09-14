import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { PrivacyContent } from "@/components/sections/PrivacyContent";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const base = buildMetadata(lang, "/privacy");
  return { ...base, robots: { index: false, follow: true } };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <PrivacyContent />;
}
