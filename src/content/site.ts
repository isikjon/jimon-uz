/**
 * Site-level configuration. Public values may be overridden with NEXT_PUBLIC_* env vars.
 * Items marked TODO(confirm) must be confirmed with the client before launch.
 */
export const site = {
  name: "JIMON GROUP Uzbekistan",
  brand: "JIMON GROUP",
  brandCn: "金木集团",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://jimongroup.uz",
  telegram: process.env.NEXT_PUBLIC_TELEGRAM || "https://t.me/Gulytok",
  telegramHandle: "@Gulytok",
  // WhatsApp is intentionally disabled (client decision): Telegram is the only messenger channel.
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "",
  phone: process.env.NEXT_PUBLIC_PHONE || "+998 99 992 11 55",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "https://www.instagram.com/jimon_group_uz",
  instagramHandle: "@jimon_group_uz",
  instagramFollowers: "1 700+",
  catalogPdf: "/catalog/jimon-catalog-2026.pdf",
  officialSite: "https://jimontorangy.com",
  foundedYear: 1993,
  representative: {
    ru: "Официальный представитель JIMON GROUP в Узбекистане",
    uz: "JIMON GROUP’ning O‘zbekistondagi rasmiy vakili",
  },
} as const;

export function whatsappLink(text?: string) {
  if (!site.whatsapp) return "";
  const digits = site.whatsapp.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** Telegram deep link; `text` is pre-filled in the chat input (supported by official Telegram apps). */
export function telegramLink(text?: string) {
  return text ? `${site.telegram}?text=${encodeURIComponent(text)}` : site.telegram;
}
