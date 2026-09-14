"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useLang } from "@/i18n/LanguageProvider";
import { localePath } from "@/i18n/config";
import { buyerLeadSchema } from "@/lib/leads/schema";
import { submitLead } from "@/lib/leads/client";
import { TextField } from "./Field";
import { telegramLink, whatsappLink } from "@/content/site";
import { cn } from "@/lib/utils";
import { CheckIcon, TelegramIcon, WhatsAppIcon } from "@/components/ui/Icons";

type Status = "idle" | "sending" | "success" | "error";

export function BuyerForm({ compact = false, prefill }: { compact?: boolean; prefill?: { product?: string } }) {
  const { t, lang } = useLang();
  const f = t.forms;
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [channel, setChannel] = useState<"telegram" | "whatsapp">("telegram");
  const [values, setValues] = useState({ name: "", phone: "", product: prefill?.product || "" });
  const wa = whatsappLink();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = buyerLeadSchema.safeParse({
      type: "buyer",
      name: values.name,
      phone: values.phone,
      product: values.product,
      channel,
      lang,
      website: String(fd.get("website") || ""),
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const k = String(issue.path[0]);
        if (k === "name") errs.name = f.errors.name;
        if (k === "phone") errs.phone = f.errors.phone;
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
        <h3 className="font-display text-3xl mb-3">{f.buyer.title}</h3>
        <p className="muted max-w-md mx-auto">{f.buyer.success}</p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <a href={telegramLink(t.tg.general)} target="_blank" rel="noopener" className="btn btn-ghost btn-sm">
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
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5" data-form="buyer">
      {compact && (
        <div>
          <p className="eyebrow mb-2">{t.contacts.eyebrow}</p>
          <h3 className="font-display text-3xl sm:text-4xl">{f.buyer.title}</h3>
          <p className="muted mt-2 text-sm">{f.buyer.lead}</p>
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <TextField
          id="b-name"
          name="name"
          label={f.buyer.name}
          autoComplete="name"
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          error={errors.name}
        />
        <TextField
          id="b-phone"
          name="phone"
          label={f.buyer.phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+998"
          value={values.phone}
          onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
          error={errors.phone}
        />
      </div>
      <TextField
        id="b-product"
        name="product"
        label={f.buyer.product}
        placeholder={f.buyer.productPlaceholder}
        value={values.product}
        onChange={(e) => setValues((v) => ({ ...v, product: e.target.value }))}
      />
      {wa && (
      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm text-ivory/75 mb-2">{f.buyer.channel}</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["telegram", "whatsapp"] as const)
            .filter((c) => c === "telegram" || wa)
            .map((c) => (
              <label
                key={c}
                className={cn(
                  "cursor-pointer flex items-center justify-center gap-2 h-12 rounded-[14px] border text-sm transition-colors",
                  channel === c ? "border-gold/70 bg-gold/10 text-ivory" : "border-ivory/14 text-ivory/70 hover:border-ivory/30",
                )}
              >
                <input type="radio" name="channel" value={c} className="sr-only" checked={channel === c} onChange={() => setChannel(c)} />
                {c === "telegram" ? <TelegramIcon className="w-4 h-4" /> : <WhatsAppIcon className="w-4 h-4" />}
                {f.channels[c]}
              </label>
            ))}
        </div>
      </fieldset>
      )}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {status === "error" && <p className="text-sm text-[#f07a5a]">{f.error}</p>}
      <button type="submit" className="btn btn-gold w-full sheen" disabled={status === "sending"} aria-busy={status === "sending"}>
        {status === "sending" ? f.sending : f.buyer.submit}
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
