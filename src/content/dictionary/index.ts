import type { Locale } from "@/i18n/config";
import { ru, type Dictionary } from "./ru";
import { uz } from "./uz";

export const dictionaries: Record<Locale, Dictionary> = { ru, uz };
export type { Dictionary };
