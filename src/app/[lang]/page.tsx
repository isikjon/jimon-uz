import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { buildJsonLd } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Elements } from "@/components/sections/Elements";
import { Products } from "@/components/sections/Products";
import { Production } from "@/components/sections/Production";
import { Trust } from "@/components/sections/Trust";
import { Social } from "@/components/sections/Social";
import { Journeys } from "@/components/sections/Journeys";
import { Partnership } from "@/components/sections/Partnership";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { FinalCta } from "@/components/sections/FinalCta";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const jsonLd = buildJsonLd(lang);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Story />
      <Elements />
      <Products />
      <Production />
      <Trust />
      <Social />
      <Journeys />
      <Partnership />
      <Faq />
      <Contact />
      <FinalCta />
    </>
  );
}
