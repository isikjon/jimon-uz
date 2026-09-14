"use client";

import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { localePath } from "@/i18n/config";

export function PrivacyContent() {
  const { t, lang } = useLang();
  return (
    <section className="relative min-h-[80svh] pt-[calc(var(--header-h)+4rem)] pb-28">
      <div className="container-x max-w-3xl">
        <p className="eyebrow mb-4">{t.footer.legal}</p>
        <h1 className="h-section text-ivory">{t.privacy.title}</h1>
        <p className="muted mt-4 text-sm">{t.privacy.updated}</p>
        <div className="mt-12 space-y-10">
          {t.privacy.sections.map((s) => (
            <div key={s.h}>
              <h2 className="font-display text-2xl text-ivory mb-3">{s.h}</h2>
              <p className="text-ivory/75 leading-relaxed">{s.p}</p>
            </div>
          ))}
        </div>
        <Link href={localePath(lang)} className="btn btn-ghost mt-14">
          ← JIMON GROUP
        </Link>
      </div>
    </section>
  );
}
