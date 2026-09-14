import type { MetadataRoute } from "next";
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "JIMON GROUP Uzbekistan",
    short_name: "JIMON UZ",
    description: "JIMON GROUP — official representation in Uzbekistan",
    start_url: "/",
    display: "standalone",
    background_color: "#070907",
    theme_color: "#070907",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
