export const locales = ["ru", "uz"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";

export function isLocale(v: string | undefined): v is Locale {
  return !!v && (locales as readonly string[]).includes(v);
}

/** Public path for a locale (RU lives at the root). */
export function localePath(locale: Locale, path = "") {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (locale === "ru") return p === "/" ? "/" : p;
  return p === "/" ? "/uz" : `/uz${p}`;
}

export const localeLabels: Record<Locale, string> = { ru: "RU", uz: "O‘Z" };
export const htmlLang: Record<Locale, string> = { ru: "ru", uz: "uz-Latn" };
