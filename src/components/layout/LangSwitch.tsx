"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { localeLabels, locales } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LangSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useLang();
  const idx = locales.indexOf(lang);
  return (
    <div
      role="radiogroup"
      aria-label={t.a11y.langSwitch}
      className={cn(
        "relative inline-grid grid-cols-2 items-center h-9 rounded-full border border-ivory/15 bg-ivory/5 p-0.5 text-[0.72rem] font-semibold tracking-[0.14em]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute top-0.5 bottom-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-gold transition-transform duration-500 [transition-timing-function:var(--ease-out-expo)]"
        style={{ transform: `translateX(${idx * 100}%)` }}
      />
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          role="radio"
          aria-checked={l === lang}
          onClick={() => setLang(l)}
          className={cn(
            "relative z-[1] w-12 h-full rounded-full transition-colors duration-300",
            l === lang ? "text-ink" : "text-ivory/75 hover:text-ivory",
          )}
        >
          {localeLabels[l]}
        </button>
      ))}
    </div>
  );
}
