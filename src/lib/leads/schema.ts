import { z } from "zod";

const phone = z
  .string()
  .trim()
  .min(7)
  .max(24)
  .regex(/^[+\d][\d\s()\-]{6,}$/, "phone");

export const buyerLeadSchema = z.object({
  type: z.literal("buyer"),
  name: z.string().trim().min(2).max(80),
  phone,
  product: z.string().trim().max(160).optional().default(""),
  channel: z.enum(["telegram", "whatsapp"]).default("telegram"),
  lang: z.enum(["ru", "uz"]).default("ru"),
  page: z.string().max(200).optional(),
  website: z.string().max(0).optional(), // honeypot
});

export const partnerLeadSchema = z.object({
  type: z.literal("partner"),
  name: z.string().trim().min(2).max(80),
  city: z.string().trim().min(2).max(80),
  phone,
  telegram: z.string().trim().min(2).max(80),
  comment: z.string().trim().max(600).optional().default(""),
  lang: z.enum(["ru", "uz"]).default("ru"),
  page: z.string().max(200).optional(),
  website: z.string().max(0).optional(), // honeypot
});

export const leadSchema = z.discriminatedUnion("type", [buyerLeadSchema, partnerLeadSchema]);
export type Lead = z.infer<typeof leadSchema>;
export type BuyerLead = z.infer<typeof buyerLeadSchema>;
export type PartnerLead = z.infer<typeof partnerLeadSchema>;
