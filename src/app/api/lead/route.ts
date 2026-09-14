import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/leads/schema";
import { deliverLead } from "@/lib/leads/server";

export const runtime = "nodejs";

// Very small in-memory rate limit (per instance). Replace with a shared store if needed.
const hits = new Map<string, { n: number; t: number }>();
function limited(ip: string) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.t > 10 * 60 * 1000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  rec.n += 1;
  return rec.n > 12;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 422 });
  if (parsed.data.website) return NextResponse.json({ ok: true }); // honeypot: pretend success

  const result = await deliverLead(parsed.data, {
    ip,
    ua: req.headers.get("user-agent") || undefined,
    receivedAt: new Date().toISOString(),
  });
  if (result.delivered === 0) return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  return NextResponse.json({ ok: true });
}
