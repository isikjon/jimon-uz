import type { Metadata } from "next";
import { site } from "@/content/site";
import { dictionaries } from "@/content/dictionary";
import { products } from "@/content/products";
import { localePath, type Locale } from "@/i18n/config";

export function buildMetadata(lang: Locale, path = "/"): Metadata {
  const t = dictionaries[lang];
  const url = `${site.url}${localePath(lang, path)}`;
  return {
    metadataBase: new URL(site.url),
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: url,
      languages: {
        ru: `${site.url}${localePath("ru", path)}`,
        "uz-Latn": `${site.url}${localePath("uz", path)}`,
        "x-default": `${site.url}${localePath("ru", path)}`,
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName: site.name,
      title: t.meta.ogTitle,
      description: t.meta.description,
      locale: lang === "ru" ? "ru_RU" : "uz_UZ",
      alternateLocale: lang === "ru" ? ["uz_UZ"] : ["ru_RU"],
      images: [{ url: `${site.url}/og.jpg`, width: 1200, height: 630, alt: t.meta.ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.ogTitle,
      description: t.meta.description,
      images: [`${site.url}/og.jpg`],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    icons: { icon: [{ url: "/icon.png", type: "image/png" }], apple: "/apple-icon.png" },
  };
}

export function buildJsonLd(lang: Locale) {
  const t = dictionaries[lang];
  const url = `${site.url}${localePath(lang)}`;
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    alternateName: ["JIMON GROUP", "金木集团", "Jinmu Group"],
    url,
    logo: `${site.url}/icon.png`,
    foundingDate: "1993",
    description: t.meta.description,
    sameAs: [site.instagram, site.officialSite, site.telegram].filter(Boolean),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        telephone: site.phone.replace(/\s+/g, "") || undefined,
        url: site.telegram,
        availableLanguage: ["ru", "uz"],
      },
    ],
    address: { "@type": "PostalAddress", addressCountry: "UZ" },
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: lang === "ru" ? "ru" : "uz-Latn",
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
  const list = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t.products.title,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: p.name[lang],
        description: p.short[lang],
        image: `${site.url}${p.image}`,
        brand: { "@type": "Brand", name: "JIMON GROUP" },
        category: p.category,
        url: `${url}#product-${p.id}`,
      },
    })),
  };
  return [org, website, faq, list];
}
