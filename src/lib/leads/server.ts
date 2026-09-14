import "server-only";
import type { Lead } from "./schema";

/**
 * Server-side delivery adapters. Each adapter is enabled by env vars; all enabled adapters run.
 * Extend with CRM / email adapters as needed.
 */
type Adapter = { name: string; enabled: () => boolean; send: (lead: Lead, meta: Meta) => Promise<void> };
type Meta = { ip?: string; ua?: string; receivedAt: string };

function formatLead(lead: Lead, meta: Meta) {
  const lines: string[] = [];
  lines.push(lead.type === "buyer" ? "🟢 Заявка на консультацию (JIMON UZ)" : "🤝 Заявка на партнёрство (JIMON UZ)");
  lines.push(`Имя: ${lead.name}`);
  lines.push(`Телефон: ${lead.phone}`);
  if (lead.type === "buyer") {
    if (lead.product) lines.push(`Интерес: ${lead.product}`);
    lines.push(`Ответить в: ${lead.channel}`);
  } else {
    lines.push(`Город: ${lead.city}`);
    lines.push(`Telegram: ${lead.telegram}`);
    if (lead.comment) lines.push(`Комментарий: ${lead.comment}`);
  }
  lines.push(`Язык: ${lead.lang} · Страница: ${lead.page || "/"}`);
  lines.push(`Время: ${meta.receivedAt}`);
  return lines.join("\n");
}

const telegramAdapter: Adapter = {
  name: "telegram",
  enabled: () => !!process.env.TELEGRAM_BOT_TOKEN && !!process.env.TELEGRAM_CHAT_ID,
  async send(lead, meta) {
    const res = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text: formatLead(lead, meta) }),
    });
    if (!res.ok) throw new Error(`telegram ${res.status}`);
  },
};

const webhookAdapter: Adapter = {
  name: "webhook",
  enabled: () => !!process.env.LEADS_WEBHOOK_URL,
  async send(lead, meta) {
    const res = await fetch(process.env.LEADS_WEBHOOK_URL as string, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lead, meta }),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
  },
};

const logAdapter: Adapter = {
  name: "log",
  enabled: () => true,
  async send(lead, meta) {
    console.info("[lead]", JSON.stringify({ lead, meta }));
  },
};

export async function deliverLead(lead: Lead, meta: Meta) {
  const adapters = [telegramAdapter, webhookAdapter, logAdapter].filter((a) => a.enabled());
  const results = await Promise.allSettled(adapters.map((a) => a.send(lead, meta)));
  const failed = results
    .map((r, i) => (r.status === "rejected" ? adapters[i].name : null))
    .filter(Boolean) as string[];
  return { delivered: adapters.length - failed.length, failed };
}
