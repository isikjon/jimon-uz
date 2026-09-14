"use client";

import { useLang } from "@/i18n/LanguageProvider";
import { useUI } from "@/components/layout/UIProvider";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { telegramLink, whatsappLink } from "@/content/site";
import { track } from "@/lib/analytics";
import { TelegramIcon, WhatsAppIcon } from "@/components/ui/Icons";

export function FinalCta() {
  const { t } = useLang();
  const { openLead } = useUI();
  const wa = whatsappLink();
  return (
    <section id="final" className="relative min-h-[90svh] flex items-center py-28">
      <div className="container-x text-center">
        <Reveal kind="fade">
          <h2 className="h-display text-ivory">
            <span className="block">{t.final.title1}</span>
            <span className="block gold-text italic font-light text-[0.62em] mt-3">{t.final.title2}</span>
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="lead mx-auto mt-8 text-center">{t.final.lead}</p>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-12 flex flex-wrap gap-3 justify-center">
            <MagneticButton
              className="btn-gold sheen"
              onClick={() => {
                track("cta_click", { id: "final_consult" });
                openLead("buyer");
              }}
            >
              {t.common.consult}
            </MagneticButton>
            <MagneticButton
              className="btn-ghost"
              onClick={() => {
                track("cta_click", { id: "final_partner" });
                openLead("partner");
              }}
            >
              {t.common.partner}
            </MagneticButton>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
            <a href={telegramLink(t.tg.general)} target="_blank" rel="noopener" onClick={() => track("cta_click", { id: "final_telegram" })} className="inline-flex items-center gap-2 text-ivory/65 hover:text-ivory">
              <TelegramIcon className="w-4 h-4" /> {t.common.writeTelegram}
            </a>
            {wa && (
              <a href={wa} target="_blank" rel="noopener" className="inline-flex items-center gap-2 text-ivory/65 hover:text-ivory">
                <WhatsAppIcon className="w-4 h-4" /> {t.common.writeWhatsApp}
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
