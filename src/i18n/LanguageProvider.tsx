"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { dictionaries, type Dictionary } from "@/content/dictionary";
import { htmlLang, localePath, type Locale } from "./config";
import { track } from "@/lib/analytics";

interface Ctx {
  lang: Locale;
  t: Dictionary;
  setLang: (l: Locale) => void;
  switching: boolean;
}

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ initial, children }: { initial: Locale; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Locale>(initial);
  const [switching, setSwitching] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    document.documentElement.lang = htmlLang[lang];
    document.title = dictionaries[lang].meta.title;
  }, [lang]);

  const setLang = useCallback(
    (next: Locale) => {
      if (next === lang) return;
      setSwitching(true);
      // Keep the current sub-path (e.g. /privacy) while switching the language prefix.
      const current = window.location.pathname.replace(/^\/uz(?=\/|$)/, "") || "/";
      const url = localePath(next, current) + window.location.hash;
      window.history.replaceState(window.history.state, "", url);
      setLangState(next);
      track("language_switch", { to: next });
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setSwitching(false), 600);
    },
    [lang],
  );

  const value = useMemo<Ctx>(() => ({ lang, t: dictionaries[lang], setLang, switching }), [lang, setLang, switching]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}

export function useT() {
  return useLang().t;
}

/** Pick a localized value from a { ru, uz } record. */
export function useL() {
  const { lang } = useLang();
  return useCallback(<T,>(v: Record<Locale, T>) => v[lang], [lang]);
}
