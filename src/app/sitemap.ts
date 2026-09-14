import type { MetadataRoute } from "next";
export const dynamic = "force-static";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const alt = (path: string) => ({
    languages: { ru: `${site.url}${path}`, "uz-Latn": `${site.url}/uz${path === "/" ? "" : path}` },
  });
  return [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1, alternates: alt("/") },
    { url: `${site.url}/uz`, lastModified: now, changeFrequency: "weekly", priority: 1, alternates: alt("/") },
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2, alternates: alt("/privacy") },
    { url: `${site.url}/uz/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2, alternates: alt("/privacy") },
  ];
}
