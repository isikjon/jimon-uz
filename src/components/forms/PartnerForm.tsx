"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { localePath } from "@/i18n/config";
import { partnerLeadSchema } from "@/lib/leads/schema";
import { submitLead } from "@/lib/leads/client";
import { TextArea, TextField } from "./Field";
import { telegramLink } from "@/content/site";
import { CheckIcon, TelegramIcon } from "@/components/ui/Icons";

type Status = "idle" | "sending" | "success" | "error";

export function PartnerForm({ compact = false }: { compact?: boolean }) {
  const { t, lang } = useLang();
  const f = t.forms;
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [v, setV] = useState({ name: "", city: "", phone: "", telegram: "", comment: "" });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = partnerLeadSchema.safeParse({ type: "partner", ...v, lang, website: String(fd.get("website") || "") });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const k = String(issue.path[0]) as keyof typeof f.errors;
        if (k in f.errors) errs[k] = f.errors[k];
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    const res = await submitLead(parsed.data);
    setStatus(res.ok ? "success" : "error");
  };

  if (status === "success") {
    return (
      <div className="text-center py-6">
        <div className="mx-auto w-16 h-16 rounded-full bg-jade/40 border border-jade-300/40 flex items-center justify-center text-jade-300 mb-6">
          <CheckIcon className="w-7 h-7" />
        </div>
        <h3 className="font-display text-3xl mb-3">{f.partner.title}</h3>
        <p className="muted max-w-md mx-auto">{f.partner.success}</p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a href={telegramLink(t.tg.partner)} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">
            <TelegramIcon className="w-4 h-4" /> {t.common.writeTelegram}
          </a>
          <button type="button" onClick={() => setStatus("idle")} className="btn btn-ghost btn-sm">
            {f.another}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5" data-form="partner">
      {compact && (
        <div>
          <p className="eyebrow mb-2">{t.partnership.eyebrow}</p>
          <h3 className="font-display text-3xl sm:text-4xl">{f.partner.title}</h3>
          <p className="muted mt-2 text-sm">{f.partner.lead}</p>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField id="p-name" label={f.partner.name} autoComplete="name" value={v.name} onChange={(e) => setV((s) => ({ ...s, name: e.target.value }))} error={errors.name} />
        <TextField id="p-city" label={f.partner.city} autoComplete="address-level2" value={v.city} onChange={(e) => setV((s) => ({ ...s, city: e.target.value }))} error={errors.city} />
        <TextField id="p-phone" label={f.partner.phone} type="tel" inputMode="tel" autoComplete="tel" placeholder="+998" value={v.phone} onChange={(e) => setV((s) => ({ ...s, phone: e.target.value }))} error={errors.phone} />
        <TextField id="p-tg" label={f.partner.telegram} placeholder="@username" value={v.telegram} onChange={(e) => setV((s) => ({ ...s, telegram: e.target.value }))} error={errors.telegram} />
      </div>
      <TextArea id="p-comment" label={f.partner.comment} value={v.comment} onChange={(e) => setV((s) => ({ ...s, comment: e.target.value }))} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {status === "error" && <p className="text-sm text-[#f07a5a]">{f.error}</p>}
      <button type="submit" className="btn btn-gold w-full sheen" disabled={status === "sending"} aria-busy={status === "sending"}>
        {status === "sending" ? f.sending : f.partner.submit}
      </button>
      <p className="text-xs text-ivory/45">
        {f.consent}{" "}
        <Link href={localePath(lang, "/privacy")} className="underline underline-offset-2 hover:text-ivory">
          {t.footer.privacy}
        </Link>
      </p>
    </form>
  );
}
