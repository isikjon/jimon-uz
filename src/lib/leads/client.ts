import type { Lead } from "./schema";
import { track } from "@/lib/analytics";

export type SubmitResult = { ok: true } | { ok: false; error: string };

/** Endpoint: Next.js route by default, PHP script on static shared hosting (set at build time). */
const ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || "/api/lead";

/** Submission layer: swap the endpoint or add a CRM adapter here without touching forms. */
export async function submitLead(lead: Lead): Promise<SubmitResult> {
  track("lead_submit_attempt", { type: lead.type, lang: lead.lang });
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, page: typeof window !== "undefined" ? window.location.pathname : "" }),
    });
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      track("lead_submit_error", { type: lead.type, status: res.status });
      return { ok: false, error: data.error || `HTTP ${res.status}` };
    }
    track("lead_submit_success", { type: lead.type, lang: lead.lang });
    return { ok: true };
  } catch (e) {
    track("lead_submit_error", { type: lead.type, status: 0 });
    return { ok: false, error: e instanceof Error ? e.message : "network" };
  }
}
